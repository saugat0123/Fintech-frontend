import {Injectable} from '@angular/core';
import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpResponse
} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {catchError, switchMap, tap} from 'rxjs/operators';
import {UserService} from '../user.service';
import {ObjectUtil} from '../../utils/ObjectUtil';

@Injectable({
    providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {

    constructor(
        private userService: UserService
    ) {
    }
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private isTokenRefreshing = false;

    static attachTokenToRequest(request: HttpRequest<any>) {

        return request.clone({
            setHeaders: {
                'Authorization': 'Bearer ' + localStorage.getItem('at'),
                'Content-Type': 'application/json'
            }
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        console.log(localStorage.getItem('at'));
        if (ObjectUtil.isEmpty(localStorage.getItem('at'))) {
          return next.handle(req);
        } else {
          return next.handle(req).pipe(
              tap((event: HttpEvent<any>) => {
                if (event instanceof HttpResponse) {
                  console.log('token not expired no need to perform any action' + event);
                }
              }), catchError((err): Observable<any> => {
                if (err instanceof HttpErrorResponse) {
                  switch (err) {

                  }
                  console.log(err.message);
                  console.log('token expired .. attempting refresh');
                  this.handleHttpResponseError(req, next);
                } else {
                  return throwError(err);
                }
              })
          );
        }
    }

    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
        console.log(this.isTokenRefreshing);
        if (!this.isTokenRefreshing) {
            console.log('token refresh is about to be true');
            this.isTokenRefreshing = true;
            // call the api to refresh the token
            return this.userService.getNewRefreshToken().subscribe(
                (tokenResponse: any) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        this.tokenSubject = tokenResponse;
                        localStorage.setItem('at', tokenResponse.access_token);
                        localStorage.setItem('rt', tokenResponse.refresh_token);
                        localStorage.setItem('ty', tokenResponse.token_type);
                        localStorage.setItem('et', tokenResponse.expires_in);
                        this.isTokenRefreshing = false;
                        console.log('token renewed');
                        console.log(localStorage.getItem('at'));
                        return next.handle(RequestInterceptor.attachTokenToRequest(request));
                    }
                }
            );
        } else {
            throwError('token is refreshing');
        }

    }

}

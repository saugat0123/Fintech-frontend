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

@Injectable({
    providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private isTokenRefreshing = false;

    constructor(
        private userService: UserService
    ) {
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log(req);
        console.log(localStorage.getItem('at'));
        if (localStorage.getItem('at') !== null || localStorage.getItem('at') !== undefined) {
            return next.handle(req).pipe(
                tap((event: HttpEvent<any>) => {
                    if (event instanceof HttpResponse) {
                        console.log('token not expired no need to perform any action' + event);
                    }
                }), catchError((err): Observable<any> => {
                    if (err instanceof HttpErrorResponse) {
                        switch (err) {

                        }
                        console.log('token expired .. attepmting refresh');
                        console.log(err.message);
                        this.handleHttpResponseError(req, next);
                    } else {
                        return throwError(err);
                    }
                })
            );
        } else {
            return next.handle(req);
        }
    }

    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
        console.log(this.isTokenRefreshing);
        if (this.isTokenRefreshing === false) {
            console.log('token refresh is about to true');
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
                        return next.handle(this.attachTokenToRequest(request));
                    }
                }
            );
        } else {
            throwError('token is refreshing');
        }

    }

    private attachTokenToRequest(request: HttpRequest<any>) {

        return request.clone({
            setHeaders: {
                'Authorization': 'Bearer ' + localStorage.getItem('at'),
                'Content-Type': 'application/json'
            }
        });
    }

}

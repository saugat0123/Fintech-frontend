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
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {ObjectUtil} from '../../utils/ObjectUtil';
import {TokenService} from './token.service';

@Injectable({
    providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private isTokenRefreshing = false;

    constructor(
        private tokenService: TokenService
    ) {
    }

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
                        // no change in response
                    }
                }), catchError((err): Observable<any> => {
                    if (err instanceof HttpErrorResponse && err.status === 401) {
                        console.log(err.message);
                        console.log('token expired .. attempting refresh');
                        return this.handleHttpResponseError(req, next);
                    } else {
                        return throwError(err);
                    }
                })
            );
        }
    }

    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);

            return this.tokenService.getNewRefreshToken().pipe(
                switchMap((tokenResponse: any) => {
                    console.log(tokenResponse);
                    this.isTokenRefreshing = false;
                    this.tokenSubject.next(tokenResponse);
                    this.isTokenRefreshing = false;
                    console.log('token renewed');
                    console.log(localStorage.getItem('at'));
                    return next.handle(RequestInterceptor.attachTokenToRequest(request));
                }));

        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(jwt => {
                    return next.handle(RequestInterceptor.attachTokenToRequest(request));
                }));
        }
    }

}

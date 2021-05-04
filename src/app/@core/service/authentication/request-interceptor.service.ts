import {Injectable} from '@angular/core';
import {
    HttpBackend,
    HttpClient,
    HttpErrorResponse,
    HttpEvent,
    HttpHandler,
    HttpHeaders,
    HttpInterceptor,
    HttpRequest
} from '@angular/common/http';
import {BehaviorSubject, Observable, of, throwError} from 'rxjs';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {ObjectUtil} from '../../utils/ObjectUtil';
import {ApiConfig} from '../../utils/api/ApiConfig';
import {LocalStorageUtil} from '../../utils/local-storage-util';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TimeOutPopUpComponent} from '../../time-out-pop-up/time-out-pop-up.component';

@Injectable({
    providedIn: 'root'
})
export class RequestInterceptor implements HttpInterceptor {

    tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>(null);
    private isTokenRefreshing = false;

    constructor(
        private httpClient: HttpClient,
        private httpBackend: HttpBackend,
        private modalService: NgbModal
    ) {
        this.httpClient = new HttpClient(httpBackend);
    }

    static attachTokenToRequest(request: HttpRequest<any>) {
        let header;
        if (!ObjectUtil.isEmpty(request.headers.get('content-type'))) {
            header = {
                'Authorization': 'Bearer ' + LocalStorageUtil.getStorage().at,
                'Content-Type': 'application/json'
            };
        } else if (!ObjectUtil.isEmpty(request.headers.get('enctype'))) {
            header = {
                'Authorization': 'Bearer ' + LocalStorageUtil.getStorage().at,
                'enctype': 'multipart/form-data'
            };
        }
        return request.clone({
            setHeaders: header
        });
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (ObjectUtil.isEmpty(LocalStorageUtil.getStorage().at)) {
            return next.handle(req);
        } else {
            return next.handle(req).pipe(
                catchError((err): Observable<any> => {
                    if (err instanceof HttpErrorResponse && err.status === 401) {
                        console.log('token expired ... attempting refresh');
                        return this.handleHttpResponseError(req, next);
                    } else {
                        return throwError(err);
                    }
                })
            );
        }
    }

    getNewRefreshToken() {
        const data = `grant_type=refresh_token&refresh_token=${LocalStorageUtil.getStorage().rt}`;
        return this.httpClient.post(`${ApiConfig.TOKEN}`, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
            })
        }).pipe(tap((tokenResponse: any) => {
            const storage = LocalStorageUtil.getStorage();
            storage.at = tokenResponse.access_token;
            storage.rt = tokenResponse.refresh_token;
            storage.ty = tokenResponse.token_type;
            storage.et = tokenResponse.expires_in;
            LocalStorageUtil.setStorage(storage);
        }), catchError(err => {
            this.modalService.open(TimeOutPopUpComponent);
            return of([]);
        }));
    }

    private handleHttpResponseError(request: HttpRequest<any>, next: HttpHandler) {
        if (!this.isTokenRefreshing) {
            this.isTokenRefreshing = true;
            this.tokenSubject.next(null);

            return this.getNewRefreshToken().pipe(
                switchMap((tokenResponse: any) => {
                    this.isTokenRefreshing = false;
                    this.tokenSubject.next(tokenResponse);
                    this.isTokenRefreshing = false;
                    console.log('token renewed');
                    return next.handle(RequestInterceptor.attachTokenToRequest(request));
                }));

        } else {
            return this.tokenSubject.pipe(
                filter(token => token != null),
                take(1),
                switchMap(() => {
                    return next.handle(RequestInterceptor.attachTokenToRequest(request));
                }));
        }
    }

}

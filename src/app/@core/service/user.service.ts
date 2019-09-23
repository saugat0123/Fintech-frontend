import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUtils} from '../utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ApiConfig} from '../utils/api/ApiConfig';
import {tap} from "rxjs/operators";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    static API = 'v1/user/authenticated';

    constructor(private http: HttpClient) {
    }

    public getLoggedInUser(): Observable<Object> {
        const req = ApiUtils.getRequest(UserService.API);
        return this.http.get(req.url, {headers: req.header});
    }

  /*  getNewRefreshToken(): Observable<any> {
        console.log('new refresh token method');
        console.log(localStorage.getItem('rt'));
        const data = `grant_type=refresh_token&refresh_token=${localStorage.getItem('rt')}`;
        console.log(`${ApiConfig.TOKEN}${data}`);
        return this.http.post(`${ApiConfig.TOKEN}`, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
            })
        });
    }*/

    getNewRefreshToken() {
        const data = `grant_type=refresh_token&refresh_token=${localStorage.getItem('rt')}`;
        return this.http.post(`${ApiConfig.TOKEN}`, data, {
            headers: new HttpHeaders({
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
            })
        }).pipe(tap((tokenResponse: any) => {
            localStorage.setItem('at', tokenResponse.access_token);
            localStorage.setItem('rt', tokenResponse.refresh_token);
            localStorage.setItem('ty', tokenResponse.token_type);
            localStorage.setItem('et', tokenResponse.expires_in);
            console.log('token renewed');
            console.log(localStorage.getItem('at'));
        }));
}
}

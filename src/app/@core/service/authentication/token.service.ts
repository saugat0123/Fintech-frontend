import { Injectable } from '@angular/core';
import {ApiConfig} from '../../utils/api/ApiConfig';
import {HttpBackend, HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(
      private http: HttpClient,
      private httpBackend: HttpBackend
  ) {
    this.http = new HttpClient(httpBackend);
  }

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

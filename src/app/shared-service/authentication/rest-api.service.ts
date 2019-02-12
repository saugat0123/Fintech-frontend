import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { baseApi } from './api-list.service';

@Injectable()
export class RestApiService {


    public restUrl: string = baseApi.restUrl;
    public requestHeader = new HttpHeaders();

    constructor(private http: HttpClient) {
    }

    modifyRestUrl(url) {
        let appendUrl: string = this.restUrl + '/' + url;
        const at = localStorage.getItem('at');
      
        let reqObj = {
            url: appendUrl,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at,
                'Content-Type': 'application/json'
            })
        };
        return reqObj;
    }

    modifyFileUrl(url) {
        let appendUrl: string = this.restUrl + '/' + url;
        const at = localStorage.getItem('at');
        let reqObj = {
            url: appendUrl,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at,
               
            })
        };
        return reqObj;
    }

    
  
}

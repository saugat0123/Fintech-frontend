import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {baseApi} from './api-list.service';

@Injectable()
export class RestApiService {


    public restUrl: string = baseApi.restUrl;
    public requestHeader = new HttpHeaders();

    constructor(private http: HttpClient) {
    }

    modifyRestUrl(url) {
        const appendUrl: string = this.restUrl + '/' + url;
        const at = localStorage.getItem('at');

        return {
            url: appendUrl,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at,
                'Content-Type': 'application/json'
            })
        };
    }

    modifyFileUrl(url) {
        const appendUrl: string = this.restUrl + '/' + url;
        const at = localStorage.getItem('at');
        return {
            url: appendUrl,
            header: new HttpHeaders({
                'Authorization': 'Bearer ' + at
            })
        };
    }
}

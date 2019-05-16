import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RestApiService} from '../authentication/rest-api.service';
import {Pageable} from './common-pageable';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    modelList: any;
    pageable: Pageable = new Pageable();

    constructor(private http: HttpClient,
                private restApiService: RestApiService) {
    }

    saveOrEdit(model: Object, reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }


    getById(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByAll(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByPostAllPageable(reqUrl, model, page, size) {
        const url: string = reqUrl + '?page=' + page + '&size=' + size;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByPost(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    getByFilePost(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyFileUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }


    getByPostDocument(reqUrl, model, loanCycleId) {
        const url: string = reqUrl + '?loanCycleId=' + loanCycleId;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByPath(reqUrl, path) {
        const url: string = reqUrl + '?path=' + path;
        const getUrl = this.restApiService.modifyRestUrl(url);
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: getUrl.header
        };
        return this.http.get(getUrl.url, httpOptions);
    }
}

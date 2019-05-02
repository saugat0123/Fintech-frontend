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
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }


    getById(reqUrl): Observable<Object> {
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByAll(reqUrl): Observable<Object> {
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByPostAllPageable(reqUrl, model, page, size) {
        let url: string = reqUrl + '?page=' + page + '&size=' + size;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByPost(reqUrl, model) {
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    getByFilePost(reqUrl, model) {
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyFileUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }



    getByPostDocument(reqUrl, model, loanCycleId) {
        let url: string = reqUrl + '?loanCycleId=' + loanCycleId;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByGetAllPageable(reqUrl, page, size) {
        let url: string = reqUrl + '?page=' + page + '&size=' + size;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});

    }

}







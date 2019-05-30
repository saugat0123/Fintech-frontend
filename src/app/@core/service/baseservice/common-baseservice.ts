import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pageable} from './common-pageable';
import {ApiUtils} from '../../utils/api/ApiUtils';
import {any} from 'codelyzer/util/function';

@Injectable({
    providedIn: 'root'
})
export class CommonService {
    pageable: Pageable = new Pageable();

    constructor(private http: HttpClient) {
    }

    saveOrEdit(model: Object, reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }


    getById(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByAll(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);

        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getByPostAllPageable(reqUrl, model, page, size) {
        const url: string = reqUrl + '?page=' + page + '&size=' + size;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByPostOpeningAccount(reqUrl, model, page, size, accountStatus) {
        const url: string = reqUrl + '?accountStatus=' + accountStatus + '&page=' + page + '&size=' + size;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model);

    }


    getByPost(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    getByFilePost(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequestWithFileSupport(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }


    getByPostDocument(reqUrl, model, loanCycleId) {
        const url: string = reqUrl + '?loanCycleId=' + loanCycleId;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});

    }

    getByPath(reqUrl, path) {
        const url: string = reqUrl + '?path=' + path;
        const getUrl = ApiUtils.getRequest(url);
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: getUrl.header
        };
        return this.http.get(getUrl.url, httpOptions);
    }

    getByGetAllPageable(reqUrl, page, size) {
        const url: string = reqUrl + '?page=' + page + '&size=' + size;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});

    }

    saveQuestion(model: Array<Object>, reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    updateQuestion(model: Object, reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }
    updateStatus(id, status, reqUrl): Observable<Object> {
        const url: string = reqUrl + '?id=' + id + '&status=' + status;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, new Object());
    }

}

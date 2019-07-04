import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Pageable} from './common-pageable';
import {ApiUtils} from '../../utils/api/ApiUtils';

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

}

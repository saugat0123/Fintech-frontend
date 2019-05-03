import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {RestApiService} from '../../../shared-service/authentication/rest-api.service';

@Injectable({
    providedIn: 'root'
})
export class MemoService {

    constructor(
        private http: HttpClient,
        private restApiService: RestApiService
    ) {
    }

    getAll(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url);
    }

    getPageable(reqUrl, page: number, size: number, searchParams): Observable<Object> {
        let url: string;
        if (searchParams == null) {
            url = `${reqUrl}?page=${page}&size=${size}`;
        } else {
            url = `${reqUrl}?page=${page}&searchParams=${searchParams}&size=${size}`;
        }

        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    save(reqUrl, model: Object): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    edit(reqUrl, model: Object, id: number): Observable<Object> {
        const url: string = reqUrl + '/' + id;
        const getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }

    deleteById(reqUrl, id: number) {
        const url: string = reqUrl + '/' + id;
        const getUrl = this.restApiService.modifyRestUrl(url);

        return this.http.delete(getUrl.url, {headers: getUrl.header});
    }

    getById(reqUrl, id: number) {
        const url: string = reqUrl + '/' + id;
        const getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }
}

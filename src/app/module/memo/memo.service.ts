import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {RestApiService} from "../../shared-service/authentication/rest-api.service";

@Injectable({
    providedIn: 'root'
})
export class MemoService {

    constructor(
        private http: HttpClient,
        private restApiService: RestApiService
    ) {
    }

    getAll(reqUrl, page: number, size: number, searchParams): Observable<Object> {
        let url: string;
        if (searchParams == null) {
            url = reqUrl + "?page=" + page + "&size=" + size;
        } else {
            url = reqUrl + "?page=" + page + "&searchParams=" + searchParams + "&size=" + size;
        }
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.get(getUrl.url);
    }

    save(reqUrl, model: Object): Observable<Object> {
        let url: string = reqUrl;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.post(getUrl.url, model);
    }

    edit(reqUrl, model: Object, id: number): Observable<Object> {
        let url: string = reqUrl + "/" + id;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.put(getUrl.url, model);
    }

    deleteById(reqUrl, id: number) {
        let url: string = reqUrl + "/" + id;
        let getUrl = this.restApiService.modifyRestUrl(url);
        return this.http.delete(getUrl.url);
    }
}

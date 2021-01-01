import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class CreditAdministrationService extends BaseService<any> {

    static API = 'v1/credit';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return CreditAdministrationService.API;
    }

    public assignLoanToUser(obj: any): Observable<any> {
        const api = `${this.getApi()}/assign`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public getRoleInCad(): Observable<any> {
        const api = `${this.getApi()}/cad-role-list`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getCadListPaginationWithSearchObject(searchObj: any, page: number = 1, size: number = 20): Observable<any> {
        const api = `${this.getApi()}/cad-list?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class RemitCustomerService extends BaseService<Object> {


    static API = 'v2/public/remit';

    constructor(protected http: HttpClient) {
        super(http);
    }

    public getRemitCustomerList(): Observable<any> {
        const api = `${this.getApi()}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getCustomerList(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
        const api = `${this.getApi()}/all?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public saveRemitCustomer(remitCustomer): Observable<any> {
        console.log('inside service', remitCustomer);
        const api = `${this.getApi()}/save`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, remitCustomer, {headers: req.header});
    }

    protected getApi(): string {
        return RemitCustomerService.API;
    }
}

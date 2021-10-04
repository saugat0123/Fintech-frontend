import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CustomerRelative} from '../../admin/modal/customer-relative';

@Injectable({
    providedIn: 'root'
})
export class CustomerService extends BaseService<Object> {


    static API = 'v1/customer';

    constructor(protected http: HttpClient) {
        super(http);
    }

    public getCustomerList(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
        const api = `${this.getApi()}/list?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public uploadFile(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-photo`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getCustomerIdOfRelative(customerRelative: CustomerRelative): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/check`);
        return this.http.post(req.url, customerRelative, {headers: req.header});
    }
    protected getApi(): string {
        return CustomerService.API;
    }
    public getJointInfoDetails(id) {
        const api = `${this.getApi()}/${id}`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }
}

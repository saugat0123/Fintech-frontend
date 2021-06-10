import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class CustomerInfoService extends BaseService<Object> {
    static API = 'v1/customer-info';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return CustomerInfoService.API;
    }

    public saveLoanInfo(obj, customerInfoId, template): Observable<any> {
        const api = `${this.getApi()}/${customerInfoId}/${template}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public getCustomerByTypeIdNumberIdTypeRegDate(obj): Observable<any> {
        const api = `${this.getApi()}/customer`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, obj, {headers: req.header});
    }

    public uploadFile(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-photo`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public upload(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public updateCbsGroup(customerInfo: any): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/update-cbs`);
        return this.http.post(req.url, customerInfo, {headers: req.header});
    }

    public updateNepaliConfigData(data: string , id): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/update-nep-data/${id}`);
        return this.http.patch(req.url, data , {headers: req.header});
    }
    /*public updateCustomerBranch(customerInfoId, toBranchId) {
        const req = ApiUtils.getRequest(`${this.getApi()}/update-customer-branch/${customerInfoId}`);
        return this.http.post(req.url, toBranchId, {headers: req.header});
    }*/
    public transferCustomerWithLoansToOtherBranch(object) {
        const req = ApiUtils.getRequest(`${this.getApi()}/transfer-customer-other-branch`);
        return this.http.post(req.url, object, {headers: req.header});
    }

    public getAllAdditionalSecurityByCustomerInfoId(id: number) {
        const req = ApiUtils.getRequest(`${this.getApi()}/additional-security/${id}`);
        return this.http.get(req.url, {headers: req.header});
    }
}

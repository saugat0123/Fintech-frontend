import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {ExistingExposure} from '../../loan/model/existingExposure';

@Injectable({
    providedIn: 'root'
})
export class CustomerInfoSearch {
    name: string;
    customerType: string;
    idRegPlace: string;
    contactNo: string;
    idRegDate: string;
    createdAt: string;
    associateId: string;
    id: string;
    email: string;
    idNumber: string;
    provinceId: string;
    groupId: string;
    clientType: string;
    subsectorDetail: string;
    customerCode: string;
    bankingRelationship: string;
    gender: string;
    maritalStatus: string;
    customerLegalDocumentAddress: string;
    branch: string;
    branchIds: string;

}

@Injectable({
    providedIn: 'root'
})
export class CustomerInfoService extends BaseService<Object> {
    static API = 'v1/customer-info';
    search: CustomerInfoSearch = new CustomerInfoSearch();
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

    public saveCcbl(formData: FormData) {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/crgCcbl`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public saveExistingExposure(existingExposure: ExistingExposure [], customerInfoId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/saveExistingExposure?customerInfoId=${customerInfoId}`);
        return this.http.post(req.url, existingExposure, {headers: req.header});
    }


}

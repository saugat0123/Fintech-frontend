import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CustomerApprovedLoanCadDocumentation} from '../model/customerApprovedLoanCadDocumentation';
import {CustomerCadInfo} from '../../loan/model/CustomerCadInfo';

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

    public saveCadDocumentBulk(obj: CustomerApprovedLoanCadDocumentation): Observable<any> {
        const api = `${this.getApi()}/cad/save`;
        const req = ApiUtils.getRequest(api);

        return this.http.patch(req.url, obj, {headers: req.header});
    }

    public saveDisbursementHistory(obj: CustomerApprovedLoanCadDocumentation , roleId): Observable<any> {
        const api = `${this.getApi()}/additional-disbursement/${roleId}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public saveAction(obj: any): Observable<any> {
        const api = `${this.getApi()}/action`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public uploadOfferFile(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public uploadCreditCheckList(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/cadCheckListDocUpload`);
        return this.http.post(req.url, formData, {headers: req.header});
    }
    public getCreditOfferLetterCount(): Observable<object> {
        const req = ApiUtils.getRequest(`${this.getApi()}/offer-letter-count`);
        return this.http.get(req.url, {headers: req.header});
    }

    public uploadAdditionalDocument(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-additional-file`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public assignCADToUser(obj: any): Observable<any> {
        const api = `${this.getApi()}/cad-assign`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

    public getSccDocPath(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-scc`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getMakerUserByBranchID(branchId: any): Observable<any> {
        const api = `${this.getApi()}/users/${branchId}`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getReport(searchObj: any): Observable<any> {
        const api = `${this.getApi()}/report`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public saveCadData(customerCadInfo: CustomerCadInfo): Observable<any> {
        const request = ApiUtils.getRequest(`${this.getApi()}/cad/save-cad-data`);
        return this.http.post(request.url, customerCadInfo,  {headers: request.header});
    }
}

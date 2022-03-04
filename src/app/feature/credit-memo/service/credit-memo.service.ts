import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CreditMemo} from '../model/credit-memo';
import {Observable} from 'rxjs';



export class CreditMemoSearch {
    CreditMemoTypeId: string;
    referenceNumber: string;
    customerInfoId: string;
    facilityType: string;
    currentStageDate: string;

}

@Injectable({
    providedIn: 'root'
})
export class CreditMemoService extends BaseService<CreditMemo> {
    static API = 'v1/credit-memo';

    search: CreditMemoSearch = new CreditMemoSearch();

    constructor(protected http: HttpClient) {
        super(http);
    }

    performMemoAction(actionObj) {
        const api = `${this.getApi()}/action`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, actionObj, {headers: req.header});
    }

    public uploadCreditMemoDocument(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    protected getApi(): string {
        return CreditMemoService.API;
    }
}

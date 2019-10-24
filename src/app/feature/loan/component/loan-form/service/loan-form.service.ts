import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class LoanFormService extends BaseService<LoanDataHolder> {

    static API = 'v1/Loan-customer';


    constructor(protected http: HttpClient) {
        super(http);
    }

    public getCustomerLoanCount() {
        const api = `${this.getApi()}/count`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getLoanByStatus(status: any): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/status`);
        return this.http.post(req.url, status, {headers: req.header});
    }

    public getProposedAmount(startDate: string, endDate: string) {
        const api = `${this.getApi()}/proposed-amount`;
        const param = new HttpParams().set('startDate', startDate).set('endDate', endDate);
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {params: param, headers: req.header});
    }

    public getLoanAmountByBranch(id: number, startDate: string, endDate: string) {
        const api = `${this.getApi()}/loan-amount/${id}`;
        const req = ApiUtils.getRequest(api);
        const httpOptions = {
            headers: req.header,
            params: new HttpParams().set('startDate', startDate).set('endDate', endDate)
        };
        return this.http.get(req.url, httpOptions);
    }

    public getLoansByCitizenship(citizenshipNumber: string) {
        const api = `${this.getApi()}/searchByCitizenship/${citizenshipNumber}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getCatalogues(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
        const api = `${this.getApi()}/catalogue?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getCommitteePull(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
        const api = `${this.getApi()}/committee-pull?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getIssuedOfferLetter(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
        const api = `${this.getApi()}/issue-offer-letter?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public uploadOfferFile(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`v1/customer-offer-letter/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public postOfferLetterAction(object): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`v1/customer-offer-letter/action`);
        return this.http.post(req.url, object, {headers: req.header});
    }

    public renewLoan(searchObj: any) {
        const api = `${this.getApi()}/close-renew-customer-loan`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});

    }

    public getLoanStatusApi(loanNo: string): Observable<any> {
        const api = `${this.getApi()}/check-user-customer-loan/${loanNo}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public postLoanAction(object): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${LoanFormService.API}/action`);
        return this.http.post(req.url, object, {headers: req.header});
    }

    public deleteLoanCustomer(id): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${LoanFormService.API}/${id}/delete`);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return LoanFormService.API;
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

    public getProposedAmount() {
        const api = `${this.getApi()}/proposed-amount`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getLoanAmountByBranch(id: number) {
        const api = `${this.getApi()}/loan-amount/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
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

    public getLoanStatusApi(loanNo: string): Observable<any> {
        const api = `${this.getApi()}/check-user-customer-loan/${loanNo}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return LoanFormService.API;
    }
}

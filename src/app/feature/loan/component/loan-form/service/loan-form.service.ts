import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Guarantor} from '../../../model/guarantor';
import {CustomerGroup} from '../../../../admin/modal/customer-group';



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

    public getLoansByRegistrationNumber(registrationNumber: string) {
        const api = `${this.getApi()}/searchByRegistrationNumber/${registrationNumber}`;
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

    public postCombinedLoanAction(object: any[], stageSingle: boolean): Observable<any> {
        const req = ApiUtils.getRequest(`${LoanFormService.API}/action/combined?stageSingle=${stageSingle}`);
        return this.http.post(req.url, object, {headers: req.header});
    }

    public deleteLoanCustomer(id): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${LoanFormService.API}/${id}/delete`);
        return this.http.get(req.url, {headers: req.header});
    }

    public uploadFile(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getLoansByCustomerIdCustomerProfileLoan(id: number) {
        const api = `${this.getApi()}/customer/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getLoanByCustomerKyc(customerRelative: CustomerRelative) {
        const api = `${this.getApi()}/customer-kyc`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, customerRelative, {headers: req.header});
    }

    public getLoanOfCustomerAsGuarantor(guaranter: Guarantor): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/customer-guaranter`);
        return this.http.post(req.url, guaranter, {headers: req.header});
    }

    public getLoanOfCustomerByGroup(customerGroup: CustomerGroup): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/customer-group`);
        return this.http.post(req.url, customerGroup, {headers: req.header});
    }
    public getCustomerFromCustomerLoan(searchObj: any, page: number = 1, size: number = 10) {
        const api = `${this.getApi()}/customer-list?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getLoansByLoanHolderId(id: number) {
        const api = `${this.getApi()}/loan-holder/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getInitialLoansByLoanHolderId(id: number) {
        const api = `${this.getApi()}/loan-holder/${id}/for-combine`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return LoanFormService.API;
    }
}

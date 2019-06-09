import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {BaseService} from '../../../@core/BaseService';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {LoanDataHolder} from '../../../feature/loan/model/loanData';


@Injectable({
    providedIn: 'root'
})
export class DashboardService extends BaseService<LoanDataHolder> {

    static API = 'v1/loan-configs';
    static LOANAPI = 'v1/loan-customer';


    constructor(protected http: HttpClient) {
        super(http);
    }

    public getLoanByStatus(object): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getLoanApi()}/status`);
        return this.http.post(req.url, object, {headers: req.header});
    }

    public getCustomerLoanCount() {
        const api = `${this.getLoanApi()}/count`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return DashboardService.API;
    }

    protected getLoanApi(): string {
        return DashboardService.LOANAPI;
    }

}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

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

    public assignLoanToUser(loanList: any): Observable<any> {
        const api = `${this.getApi()}/assign`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, loanList, {headers: req.header});
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {LoanConfig} from '../../../admin/modal/loan-config';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {BaseService} from '../../../../@core/BaseService';

@Injectable({
    providedIn: 'root'
})
export class LoanActionService extends BaseService<LoanConfig> {

    static API = 'v1/role-hierarchy';


    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return LoanActionService.API;
    }

    public getSendForwardList(): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/getForward`);
        return this.http.get(req.url, {headers: req.header});
    }

    public getSendBackwardList(): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/getBackward`);
        return this.http.get(req.url, {headers: req.header});
    }

        public postLoanAction(object): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`v1/loan-action`);
        return this.http.post(req.url, object, {headers: req.header});
    }
}

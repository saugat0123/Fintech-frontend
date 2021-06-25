import {BaseService} from '../../../../@core/BaseService';
import {LoanConfig} from '../../modal/loan-config';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class LoanConfigService extends BaseService<LoanConfig> {
    static API = 'v1/loan-configs';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getAllByLoanCategory(loanCategory): Observable<any> {

        const api = `${this.getApi()}/${loanCategory}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getPaginationWithSearchObjectD(searchObj: any, page: number = 1, size: number = 20): Observable<any> {
        const api = `${this.getApi()}/listD?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, searchObj, {headers: req.header});
    }

    public getApi(): string {
        return LoanConfigService.API;
    }

    public getAllWithNoFilter(): Observable<any> {

        const api = `${this.getApi()}/allNoFilter`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

}

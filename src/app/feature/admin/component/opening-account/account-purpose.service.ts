import {Injectable} from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountPurpose} from '../../modal/accountPurpose';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountPurposeService extends BaseService<AccountPurpose> {
    static API = 'v1/accountPurpose';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return AccountPurposeService.API;
    }

    getByAccountPurposeWithoutToken(): Observable<Object> {
        const api = `${this.getApi()}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url);
    }

}

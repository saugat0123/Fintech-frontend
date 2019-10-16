import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountPurpose} from '../../../modal/accountPurpose';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

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

    getAccountPurposeByAccountType(accountTypeId: number) {
        const url = `${this.getApi()}/accountType/${accountTypeId}`;
        const req = ApiUtils.getRequest(url);
        return this.http.get(req.url);
    }

}

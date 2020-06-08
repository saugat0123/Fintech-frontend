import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountCategory} from '../../../modal/accountCategory';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class AccountCategoryService extends BaseService<AccountCategory> {
    static API = 'v1/accountCategory';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return AccountCategoryService.API;
    }

    getAccountPurposeByAccountType(accountTypeId: number) {
        const url = `${this.getApi()}/accountType/${accountTypeId}`;
        const req = ApiUtils.getRequest(url);
        return this.http.get(req.url);
    }

}

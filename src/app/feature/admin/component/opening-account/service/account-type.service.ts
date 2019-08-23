import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountType} from '../../../modal/accountType';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AccountTypeService extends BaseService<AccountType> {
    static API = 'v1/accountType';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return AccountTypeService.API;
    }

    getAllByAccountTypeWithoutToken(accountPurposeId: number): Observable<Object> {
        const url = `${this.getApi()}/accountPurpose/${accountPurposeId}`;
        const req = ApiUtils.getRequest(url);
        return this.http.get(req.url);
    }
}

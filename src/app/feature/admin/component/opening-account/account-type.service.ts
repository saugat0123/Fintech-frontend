import {Injectable} from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountType} from '../../modal/accountType';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
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

    getAllByAccountTypeWithoutToken(model): Observable<Object> {
        const api = `${this.getApi()}/byAccountPurpose`;
        const req = ApiUtils.getRequest(api);
        return this.http.post(req.url, model);
    }
}

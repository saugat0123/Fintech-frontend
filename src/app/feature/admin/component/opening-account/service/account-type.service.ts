import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {AccountType} from '../../../modal/accountType';

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
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';

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
}

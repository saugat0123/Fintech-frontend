import {BaseService} from '../../../../@core/BaseService';
import {LoanConfig} from '../../modal/loan-config';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class LoanConfigService extends BaseService<LoanConfig> {
    static API = 'v1/loan-configs';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getApi(): string {
        return LoanConfigService.API;
    }

}

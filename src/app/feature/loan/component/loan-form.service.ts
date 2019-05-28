import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {LoanDataHolder} from '../model/loanData';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class LoanFormService extends BaseService<LoanDataHolder> {
    static API = 'v1/loan-configs';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return LoanFormService.API;
    }
}

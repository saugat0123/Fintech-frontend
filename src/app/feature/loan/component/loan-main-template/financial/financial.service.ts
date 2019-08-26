import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class FinancialService extends BaseService<any> {
    static api = 'v1/Loan-financial';


    constructor(readonly http: HttpClient) {
        super(http);
    }


    protected getApi(): string {
        return FinancialService.api;
    }
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {FiscalYear} from '../modal/FiscalYear';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class FiscalYearService extends BaseService<FiscalYear> {

    static API = 'v1/fiscal-year';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return FiscalYearService.API;
    }
}

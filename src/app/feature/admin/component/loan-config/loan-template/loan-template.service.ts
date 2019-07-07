import {BaseService} from '../../../../../@core/BaseService';
import {LoanTemplate} from '../../../modal/loan-template';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class LoanTemplateService extends BaseService<LoanTemplate> {
    static API = 'v1/loan-template';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return LoanTemplateService.API;
    }
}

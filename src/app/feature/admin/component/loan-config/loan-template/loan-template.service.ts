import {BaseService} from '../../../../../@core/BaseService';
import {LoanTemplate} from '../../../modal/loan-template';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class LoanTemplateService extends BaseService<LoanTemplate> {
    static API = 'v1/loan-template';

    protected getApi(): string {
        return LoanTemplateService.API;
    }
}

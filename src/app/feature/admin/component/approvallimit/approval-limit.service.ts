import {BaseService} from '../../../../@core/BaseService';
import {ApprovalLimit} from '../../modal/approval-limit';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ApprovalLimitService extends BaseService<ApprovalLimit> {
    static API = 'v1/approval-limit';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ApprovalLimitService.API;
    }

}

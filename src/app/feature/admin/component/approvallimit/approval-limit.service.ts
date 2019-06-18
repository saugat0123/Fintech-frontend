import {BaseService} from '../../../../@core/BaseService';
import {ApprovalLimit} from '../../modal/approval-limit';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class ApprovalLimitService extends BaseService<ApprovalLimit> {
    static API = 'v1/approval-limit';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getLimitByRoleAndLoan(id: number): Observable<any> {
        const api = `${this.getApi()}/${id}/role`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return ApprovalLimitService.API;
    }


}

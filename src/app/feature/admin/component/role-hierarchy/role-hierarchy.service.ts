import {BaseService} from '../../../../@core/BaseService';
import {RoleOrders} from '../../modal/roleOrders';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({providedIn: 'root'})
export class RoleHierarchyService extends BaseService<RoleOrders> {
    static API = 'v1/role-hierarchy';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return RoleHierarchyService.API;
    }

    public getAllActive(): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/get-all-active`);
        return this.http.get(req.url, {headers: req.header});
    }
}

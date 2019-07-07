import {BaseService} from '../../../../@core/BaseService';
import {RoleOrders} from '../../modal/roleOrders';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class RoleHierarchyService extends BaseService<RoleOrders> {
    static API = 'v1/role-hierarchy';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return RoleHierarchyService.API;
    }
}

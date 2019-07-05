import {BaseService} from '../../../../@core/BaseService';
import {RolePermissionRight} from '../../modal/role-permission-right';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class RolePermissionService extends BaseService<RolePermissionRight> {
    static API = 'v1/roleRightPermission';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return RolePermissionService.API;
    }

    public getRights(): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/rights`);

        return this.http.get(req.url, {headers: req.header});
    }

}

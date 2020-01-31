import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {ApprovalRoleHierarchy} from './ApprovalRoleHierarchy';

@Injectable({providedIn: 'root'})
export class ApprovalRoleHierarchyService extends BaseService<ApprovalRoleHierarchy> {
    static API = 'v1/approval/role-hierarchies';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ApprovalRoleHierarchyService.API;
    }

    public findAll(type: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/${type}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getDefault(type: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/default/${type}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getForwardRolesForRole(roleId: number, type: string, typeId: number, ref: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/forward-roles/${roleId}/${type}/${typeId}/${ref}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getForwardRolesForRoleWithType(roleId: number, type: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/forward-roles/${roleId}/${type}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getBackwardRolesForRole(roleId: number, type: string, typeId: number, ref: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/backward-roles/${roleId}/${type}/${typeId}/${ref}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getBackwardRolesForRoleWithType(roleId: number, type: string, refId: number): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/backward-roles/${roleId}/${type}/${refId}`);

        return this.http.get(req.url, {headers: req.header});
    }
}

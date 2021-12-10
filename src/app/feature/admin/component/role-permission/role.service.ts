import {BaseService} from '../../../../@core/BaseService';
import {Role} from '../../modal/role';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class RoleService extends BaseService<Role> {
    static API = 'v1/role';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return RoleService.API;
    }

    public getActiveRoles(): Observable<any> {
        const api = `${RoleService.API}/active`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public checkRoleContainMaker(): Observable<any> {
        const api = `${RoleService.API}/maker`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }


    public getApprovalRoles(): Observable<any> {
        const api = `${RoleService.API}/getApproval`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getHSOVRoles(): Observable<any> {
        const api = `${RoleService.API}/role-hsov`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public update(obj: Object): Observable<any> {
        const api = `${RoleService.API}/edit`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }

}

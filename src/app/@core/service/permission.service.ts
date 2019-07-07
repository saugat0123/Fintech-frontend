import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../utils/api/ApiUtils';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {BaseService} from '../BaseService';
import {Permission} from '../../feature/admin/modal/permission';

@Injectable({
    providedIn: 'root'
})
export class PermissionService extends BaseService<Permission> {
    static API = 'v1/permission';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    getPermissionOf(model: string): Observable<any> {
        const req = ApiUtils.getRequest(`${PermissionService.API}/chkPerm`);

        return this.http.post(req.url, model, {headers: req.header});
    }

    protected getApi(): string {
        return PermissionService.API;
    }
}

import {BaseService} from '../../../../@core/BaseService';
import {User} from '../../modal/user';
import {Injectable} from '@angular/core';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UserService extends BaseService<User> {
    static API = 'v1/user';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return UserService.API;
    }

    public getUserListByRoleId(id): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${UserService.API}/${id}/users`);
        return this.http.get(req.url, {headers: req.header});
    }

    public getUserListByRoleCad(): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${UserService.API}/user-cad`);
        return this.http.get(req.url, {headers: req.header});
    }

    public getUsersByRole(roles: any): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/listByRole`);

        return this.http.post(req.url, roles, {headers: req.header});
    }

    public getRoles(): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/listRole`);

        return this.http.get(req.url, {headers: req.header});
    }

    public uploadFile(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        console.log(formData.get('file'));
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getLoggedInUser(): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/authenticated`);

        return this.http.get(req.url, {headers: req.header});
    }

    public postDismiss(user: any): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/dismiss`);

        return this.http.post(req.url, user, {headers: req.header});
    }

    public getUserListForTransfer(id, branchId): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/get-all-doc-transfer/${id}/branch/${branchId}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public updateUserPassword(obj: Object): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/changePassword`);
        return this.http.post(req.url, obj, {headers: req.header});
    }

    public getAuthenticatedUserBranches(): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/branch/all`);
        return this.http.get(req.url, {headers: req.header});
    }

    public getUserListByRoleIdAndBranchIdForDocumentAction(id, bId): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${UserService.API}/${id}/users/branch/${bId}`);
        return this.http.get(req.url, {headers: req.header});
    }

    public getUserListByRoleIdListAndBranchId(idList, id): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${UserService.API}/role-list/branch/${id}`);
        return this.http.post(req.url, idList, {headers: req.header});
    }

    public updateUserRoles(obj: Object, id: number): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/update-roles/${id}`);
        return this.http.post(req.url, obj, {headers: req.header});
    }
}

import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {User} from '../../feature/admin/modal/user';
import {BaseService} from '../BaseService';

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

    public getAllUserByCurrentRoleBranchAccess() {
        const req = ApiUtils.getRequest(`${this.getApi()}/allUser`);
        return this.http.get(req.url, {headers: req.header});
    }


    public switchUserRole(role: any) {
        const req = ApiUtils.getRequest(`${this.getApi()}/switch-user`);
        return this.http.post(req.url, role, {headers: req.header});
    }

    public getUserListByBranchIdAndMakerActive(bId): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/users/branch/${bId}/maker-active`);
        return this.http.get(req.url, {headers: req.header});
    }
}

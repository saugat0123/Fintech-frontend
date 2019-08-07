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

    public getUserListForTransfer(id): Observable<any> {
        const req = ApiUtils.getRequest(`${UserService.API}/get-all-doc-transfer/${id}`);

        return this.http.get(req.url, {headers: req.header});
    }
}

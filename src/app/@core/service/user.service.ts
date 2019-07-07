import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../utils/api/ApiUtils';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    static API = 'v1/user/authenticated';

    constructor(private http: HttpClient) {
    }

    public getLoggedInUser(): Observable<Object> {
        const req = ApiUtils.getRequest(UserService.API);
        return this.http.get(req.url, {headers: req.header});
    }
}

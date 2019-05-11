import {HttpClient} from '@angular/common/http';
import {RestApiService} from '../../shared-service/authentication/rest-api.service';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    static API = 'v1/user/authenticated';

    constructor(private http: HttpClient, private restService: RestApiService) {
    }

    public getLoggedInUser(): Observable<Object> {
        const req = this.restService.modifyRestUrl(UserService.API);
        return this.http.get(req.url, {headers: req.header});
    }
}

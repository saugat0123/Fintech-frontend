import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../utils/api/ApiUtils';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    static API = 'v1/configuration';

    constructor(private http: HttpClient) {
    }

    public getRoleType(): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${AppConfigService.API}/role-type`);
        return this.http.get(req.url, {headers: req.header});
    }
}

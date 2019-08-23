import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../@core/utils/api/ApiUtils';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class FeatureMenuService {
    static API = 'v1/menu';

    constructor(private http: HttpClient) {
    }

    public getMenus(): Observable<any> {
        const req = ApiUtils.getRequest(FeatureMenuService.API);
        return this.http.get(req.url, {headers: req.header});
    }
}

import {HttpClient} from '@angular/common/http';
import {RestApiService} from '../@core/service/authentication/rest-api.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

@Injectable(
    {
        providedIn: 'root'
    }
)
export class FeatureMenuService {
    static API = 'v1/menu';

    private menus: Observable<any>;

    constructor(private http: HttpClient, private apiService: RestApiService) {
        const req = this.apiService.modifyRestUrl(FeatureMenuService.API);


    }

    public getMenus(): Observable<any> {
        const req = this.apiService.modifyRestUrl(FeatureMenuService.API);
        return this.http.get(req.url, {headers: req.header});
    }
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../@core/BaseService';
import {LoanConfig} from '../../feature/admin/modal/loan-config';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class DashboardService extends BaseService<LoanConfig> {
    static API = 'v1/loan-configs';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return DashboardService.API;
    }

    getByPost(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }
}

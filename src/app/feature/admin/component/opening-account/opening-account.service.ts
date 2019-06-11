import {Injectable} from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {OpeningForm} from '../../modal/openingForm';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OpeningAccountService extends BaseService<OpeningForm> {
    static API = 'v1/accountOpening';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return OpeningAccountService.API;
    }

    public getStatusByBranch(branchId: number): Observable<any> {
        const api = `${this.getApi()}/statusCount?branchId=${branchId}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url);
    }

    public saveWithoutToken(obj): Observable<any> {
        const req = ApiUtils.getRequest(this.getApi());

        return this.http.post(req.url, obj);

    }

    getByPostOpeningAccount(model, page, size, accountStatus) {
        const url: string = this.getApi() + '/list' + '?accountStatus=' + accountStatus + '&page=' + page + '&size=' + size;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model);
    }

    getByAllWithoutToken(reqUrl): Observable<Object> {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url);
    }

    getByPostWithoutToken(reqUrl, model) {
        const url: string = reqUrl;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model);
    }


}

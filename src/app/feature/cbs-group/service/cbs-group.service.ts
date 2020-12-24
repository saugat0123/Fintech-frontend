import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class CbsGroupService extends BaseService<any> {

    static API = 'v1/cbs';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return CbsGroupService.API;
    }

    public getAllCbs() {
        const api = `${this.getApi()}/all`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }

    public getAllByOblId(id: string) {
        const api = `${this.getApi()}/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }


    public executeRemote() {
        const api = `${this.getApi()}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }
}

import {BaseService} from '../../../../@core/BaseService';
import {Branch} from '../../modal/branch';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class BranchService extends BaseService<Branch> {
    static API = 'v1/branch';

    constructor(protected http: HttpClient) {
        super(http);
    }

    public getBranchAccessByCurrentUser() {
        const api = `${this.getApi()}/branch-current-user`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getBranchNoTAssignUser(id: number) {
        const api = `${this.getApi()}/${id}/unique`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }
    public getBranchByProvinceList(id: any) {
        const req = ApiUtils.getRequest(`${BranchService.API}/provinceList`);

        return this.http.post(req.url, id, {headers: req.header});
    }

    protected getApi(): string {
        return BranchService.API;
    }
}

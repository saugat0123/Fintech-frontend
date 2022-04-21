import {BaseService} from '../../../../@core/BaseService';
import {Valuator} from '../../modal/valuator';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({providedIn: 'root'})
export class ValuatorService extends BaseService<Valuator> {
    static API = 'v1/valuator';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ValuatorService.API;
    }

    public getListWithBranchId(branchId: number): Observable<any> {
        const api = `${this.getApi()}/${branchId}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }
}

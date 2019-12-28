import {BaseService} from '../../../../@core/BaseService';
import {Valuator} from '../../modal/valuator';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Branch} from '../../modal/branch';

@Injectable({providedIn: 'root'})
export class ValuatorService extends BaseService<Valuator> {
    static API = 'v1/valuator';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ValuatorService.API;
    }

    public getValuatorList(branches: Branch[]): Observable<any> {
        const req = ApiUtils.getRequest(`${ValuatorService.API}/valuatorList`);
        return this.http.post(req.url, branches, {headers: req.header});
    }
}

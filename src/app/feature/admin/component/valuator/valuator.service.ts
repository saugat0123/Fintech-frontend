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

    public getAllValuatorsFields(name: string): Observable<any> {
        let api: string;
            api = `${this.getApi()}/getAllValuatorsByFields/?name=${name}`;
        const req = ApiUtils.getRequest(api);
        return this.http.get(req.url, {headers: req.header});
    }
}

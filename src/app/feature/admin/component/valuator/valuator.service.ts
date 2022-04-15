import {BaseService} from '../../../../@core/BaseService';
import {Valuator} from '../../modal/valuator';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
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

    getAllValuator() {
        const getUrl = ApiUtils.getRequest(`${ValuatorService.API}/get-all`);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }
}

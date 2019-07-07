import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../@core/BaseService';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';


@Injectable({
    providedIn: 'root'
})
export class EmailConfigurationService extends BaseService<any> {

    static API = 'v1/email-config';


    constructor(protected http: HttpClient) {
        super(http);
    }

    public refreshConfiguration() {
        const req = ApiUtils.getRequest('actuator/refresh');
        return this.http.post(req.url, null, {headers: req.header});
    }

    public checkConfiguration(email: any) {
        const api = `${EmailConfigurationService.API}/test`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, email, {headers: req.header});
    }

    protected getApi(): string {
        return EmailConfigurationService.API;
    }


}

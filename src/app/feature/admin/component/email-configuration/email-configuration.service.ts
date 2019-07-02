import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../@core/BaseService';


@Injectable({
    providedIn: 'root'
})
export class EmailConfigurationService extends BaseService<any> {

    static API = 'v1/email-config';


    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return EmailConfigurationService.API;
    }


}

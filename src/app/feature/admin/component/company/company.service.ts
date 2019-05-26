import {BaseService} from '../../../../@core/BaseService';
import {Company} from '../../modal/company';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class CompanyService extends BaseService<Company> {
    static API = 'v1/company';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return CompanyService.API;
    }
}

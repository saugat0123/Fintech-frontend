import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {CompanyInfo} from '../modal/company-info';

@Injectable({
    providedIn: 'root'
})
export class CompanyInfoService extends BaseService<CompanyInfo> {

    static API = 'v1/companyInfo';

    constructor(protected http: HttpClient) {
        super(http);
    }

  protected getApi(): string {
    return CompanyInfoService.API;
  }
}

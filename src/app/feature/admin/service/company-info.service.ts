import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {CompanyInfo} from '../modal/company-info';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

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

  public getCompanyInfoWithRegistrationNumber(id: String): Observable<any> {
    const api = `${this.getApi()}/registrationNumber/${id}`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }


}

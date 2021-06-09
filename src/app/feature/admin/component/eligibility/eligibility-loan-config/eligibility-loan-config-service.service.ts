import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {BaseService} from "../../../../../@core/BaseService";
import {EligibilityLoanConfiguration} from "./EligibilityLoanConfiguration";
@Injectable({
  providedIn: 'root'
})
export class EligibilityLoanConfigServiceService extends BaseService<EligibilityLoanConfiguration>{

  eligibilityloanconfig = 'v1/eligibility-loanConfiguration';
  constructor(protected http:HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return this.eligibilityloanconfig;
  }
  saveEligibilityLoanConfig(model: Object): Observable<Object>
  {
    const Url=this.eligibilityloanconfig;
    const getUrl=ApiUtils.getRequest(Url);
    return this.http.post(getUrl.url,model,{headers: getUrl.header});
  }

  getAllEligibilityLoanConfig(): Observable<any>
  {
    const Url=this.eligibilityloanconfig+'/getAll';
    const getUrl=ApiUtils.getRequest(Url);
    return this.http.get(getUrl.url,{headers: getUrl.header});
  }

  public getPaginationWithSearchObject(searchObj: any, page: number = 1, size: number = 20): Observable<any> {
    const api = `${this.getApi()}/list?page=${page}&size=${size}`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, searchObj, {headers: req.header});
  }


}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
@Injectable({
  providedIn: 'root'
})
export class EligibilityLoanConfigServiceService {
  eligibilityloanconfig = 'v1/eligibility-loanConfiguration';
  constructor(private http:HttpClient) { }

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
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';
import {BaseService} from '../../@core/BaseService';
import {SecurityLoanReference} from '../modal/security-loan-reference';

@Injectable({
  providedIn: 'root'
})
export class SecurityLoanReferenceService extends BaseService<SecurityLoanReference> {
  static API = 'v1/security-loan-reference';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return SecurityLoanReferenceService.API;
  }

  public getAllSecurityLoanReferences(securityId: number): Observable<any> {
    const url = `${this.getApi()}/${securityId}`;
    const req = ApiUtils.getRequest(url);
    return this.http.get(req.url, {headers: req.header});
  }

  public getAllSecurityLoanReferencesByLoanId(loanId: number): Observable<any> {
    const url = `${this.getApi()}/loan/${loanId}`;
    const req = ApiUtils.getRequest(url);
    return this.http.get(req.url, {headers: req.header});
  }
}

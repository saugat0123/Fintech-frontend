import { Injectable } from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {Insurance} from '../../admin/modal/insurance';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class InsuranceService extends BaseService<Insurance> {
  static API = 'v1/insurance';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  public updateInsurance(loanId: number, obj: Insurance): Observable<any> {
    const api = `${this.getApi()}/history?loanId=${loanId}`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  protected getApi(): string {
    return InsuranceService.API;
  }
}

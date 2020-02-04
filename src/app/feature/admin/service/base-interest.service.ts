import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseInterest} from '../component/base-interest/BaseInterest';
import {BaseService} from '../../../@core/BaseService';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})

export class BaseInterestService extends BaseService<BaseInterest> {
  static API = 'v1/base-interest';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return BaseInterestService.API;
  }

 public getActiveBaseRate(): Observable<any> {
   const req = ApiUtils.getRequest(`${this.getApi()}/active`);

   return this.http.get(req.url , {headers : req.header});
 }
}

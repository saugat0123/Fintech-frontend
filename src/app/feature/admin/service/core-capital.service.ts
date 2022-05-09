import { Injectable } from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {BaseInterest} from '../component/base-interest/BaseInterest';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CoreCapital} from '../component/capital-configuration/coreCapital';

@Injectable({
  providedIn: 'root'
})
export class CoreCapitalService extends BaseService<CoreCapital>{

  static API = 'v1/core-capital';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CoreCapitalService.API;
  }

  public getActiveBaseRate(): Observable<any> {
    const req = ApiUtils.getRequest(`${this.getApi()}/active`);
    return this.http.get(req.url , {headers : req.header});
  }
}

import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CoDoc} from '../model/co-doc';

@Injectable({
  providedIn: 'root'
})
export class CoDocService extends BaseService<any> {
  static API = 'v1/co-doc';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CoDocService.API;
  }

  public create(coDoc: CoDoc): Observable<any> {
    const url = `${this.getApi()}/create`;
    const req = ApiUtils.getRequestWithFileSupport(url);
    return this.http.post(req.url, coDoc, {headers: req.header});
  }
}

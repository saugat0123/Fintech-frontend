import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LandBuilding} from '../loan/model/LandBuilding';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';
import {BaseService} from '../../@core/BaseService';
import {Auto} from '../loan/model/Auto';

@Injectable({
  providedIn: 'root'
})
export class AutoSecurityService extends BaseService<Auto> {

  static API = 'v1/security-auto';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return AutoSecurityService.API;
  }

  public save(auto: Auto): Observable<any> {
    const url = `${this.getApi()}/save`;
    const req = ApiUtils.getRequest(url);
    return this.http.post(req.url, auto, {headers: req.header});
  }
}

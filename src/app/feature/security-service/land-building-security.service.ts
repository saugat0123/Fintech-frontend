import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../@core/BaseService';
import {LandBuilding} from '../loan/model/LandBuilding';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class LandBuildingSecurityService extends BaseService<LandBuilding> {

  static API = 'v1/security-land-building';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return LandBuildingSecurityService.API;
  }

  public save(landBuilding: LandBuilding): Observable<any> {
    const url = `${this.getApi()}/save`;
    const req = ApiUtils.getRequest(url);
    return this.http.post(req.url, landBuilding, {headers: req.header});
  }
}

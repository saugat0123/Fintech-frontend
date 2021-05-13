import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {CollateralSiteVisit} from './CollateralSiteVisit';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class CollateralSiteVisitService extends BaseService<CollateralSiteVisit> {
  static API = 'v1/collateral-site-visit';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CollateralSiteVisitService.API;
  }

  public saveCollateralSiteVisit(securityId: number, collateral: CollateralSiteVisit): Observable<any> {
    const api = `${this.getApi()}/${securityId}`;
    const req = ApiUtils.getRequest(api);
    return this.http.post(req.url, collateral, {headers: req.header});
  }

  public getCollateralBySecurityName(securityName: string): Observable<any> {
    const api = `${this.getApi()}/${securityName}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

  public getCollateralBySiteVisitDate(siteVisitDate: string): Observable<any> {
    const api = `${this.getApi()}/site-visit/${siteVisitDate}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }
}

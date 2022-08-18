import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {CollateralSiteVisit} from './CollateralSiteVisit';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {SiteVisitDocument} from './site-visit-document';

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

  public saveCollateralSiteVisit(securityId: number, collateral: FormData): Observable<any> {
    const api = `${this.getApi()}/${securityId}`;
    const req = ApiUtils.getRequestWithFileSupport(api);
    return this.http.post(req.url, collateral, {headers: req.header});
  }

  public getCollateralBySecurityNameAndSecurityAndId(securityName: string, id: number): Observable<any> {
    const api = `${this.getApi()}/${securityName}/${id}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

  public getCollateralBySiteVisitDateAndId(siteVisitDate: string, id: number): Observable<any> {
    const api = `${this.getApi()}/site-visit/${siteVisitDate}/${id}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

  public getCollateralSiteVisitBySecurityId(securityId: number): Observable<any> {
    const api = `${this.getApi()}/site-visit/${securityId}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

  public deleteSiteVisit(id: number, siteVisitDate: Date): Observable<any> {
    const api = `${this.getApi()}/delete-site-visit/${id}/${siteVisitDate}`;
    const req = ApiUtils.getRequest(api);
    return this.http.delete(req.url, {headers: req.header});
  }

  public deleteAllSiteVisit(securityId: number, securityName: string): Observable<any> {
    const api = `${this.getApi()}/delete-all-site-visit/${securityId}/${securityName}`;
    const req = ApiUtils.getRequest(api);
    return this.http.delete(req.url, {headers: req.header});
  }

  public deleteCollateralUpload(id: number, siteVisitDate: Date, docId: number): Observable<any> {
    const api = `${this.getApi()}/delete-site-visit-document/${id}/${siteVisitDate}/${docId}`;
    const req = ApiUtils.getRequest(api);
    return this.http.delete(req.url, {headers: req.header});
  }
}

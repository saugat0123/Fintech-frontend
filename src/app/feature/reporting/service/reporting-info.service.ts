import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {ReportingInfo} from '../model/reporting-info';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class ReportingInfoService extends BaseService<ReportingInfo> {

  static API = 'v1/reporting-info';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return ReportingInfoService.API;
  }

  public initialSave(obj: ReportingInfo): Observable<any> {
    const api = `${this.getApi()}/initial`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  public getWithType(type: any): Observable<any> {

    const api = `${this.getApi()}/get-by-type?type=${type}`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

}

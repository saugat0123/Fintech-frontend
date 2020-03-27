import {Injectable} from '@angular/core';
import {BaseService} from '../BaseService';
import {ReportingInfo} from '../model/reporting-info';
import {HttpClient} from '@angular/common/http';

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
}

import { Injectable } from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {Nepse} from '../../modal/nepse';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class NepsePriceInfoService extends BaseService<Nepse> {
  static API = 'v1/nepse-price-info';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return NepsePriceInfoService.API;
  }

  public getActiveNepsePriceInfoData(): Observable<any> {
    const req = ApiUtils.getRequest(`${this.getApi()}/active-data`);
    return this.http.get(req.url, {headers: req.header});
  }
}

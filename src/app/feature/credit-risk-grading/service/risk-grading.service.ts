import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';

@Injectable({
  providedIn: 'root'
})
export class RiskGradingService extends BaseService<any> {
  static API = 'v1/crg/types';

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return RiskGradingService.API;
  }
}

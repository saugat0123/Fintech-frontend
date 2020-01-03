import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseInterest} from '../component/base-interest/BaseInterest';
import {BaseService} from '../../../@core/BaseService';

@Injectable({
  providedIn: 'root'
})

export class BaseInterestService extends BaseService<BaseInterest> {
  static API = 'v1/base-interest';

  // headers = {
  //   headers: new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   })
  // };

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return BaseInterestService.API;
  }


}

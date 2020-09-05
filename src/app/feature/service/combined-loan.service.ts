import { Injectable } from '@angular/core';
import {BaseService} from '../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {CombinedLoan} from '../loan/model/combined-loan';

@Injectable({
  providedIn: 'root'
})
export class CombinedLoanService extends BaseService<CombinedLoan> {

  static API = 'v1/combined-loan';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CombinedLoanService.API;
  }
}

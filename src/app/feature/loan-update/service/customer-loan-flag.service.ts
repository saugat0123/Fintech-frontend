import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {CustomerLoanFlag} from '../../../@core/model/customer-loan-flag';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerLoanFlagService extends BaseService<CustomerLoanFlag> {
  static API = 'v1/customer-loan-flag';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerLoanFlagService.API;
  }
}

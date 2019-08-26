import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {Customer} from '../modal/customer';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerService extends BaseService<Customer> {

  static API = 'v1/customer';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerService.API;
  }
}

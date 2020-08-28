import { Injectable } from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {CustomerGroup} from '../../../modal/customer-group';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerGroupService extends BaseService<CustomerGroup> {
  static API = 'v1/customer-group';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerGroupService.API;
  }
}

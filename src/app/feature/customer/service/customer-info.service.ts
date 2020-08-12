import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomerInfoService extends BaseService<Object> {
  static API = 'v1/customer-info';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerInfoService.API;
  }
}

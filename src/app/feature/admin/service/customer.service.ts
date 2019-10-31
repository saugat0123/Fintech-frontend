import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {Customer} from '../modal/customer';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from "../../../@core/utils/api/ApiUtils";

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

  public getByCustomerId(customerId: String) {
    const api = `${this.getApi()}/search`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, customerId, {headers: req.header});
  }
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {Customer} from '../modal/customer';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

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

  public getByCustomerByCitizenshipNo(citizenshipNumber: String) {
    const api = `${this.getApi()}/citizenship-no?citizenshipNumber=${citizenshipNumber}`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }

  public subSector() {
    const api = `${this.getApi()}/subsectors`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }
  public clientType() {
    const api = `${this.getApi()}/client-type`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }
}

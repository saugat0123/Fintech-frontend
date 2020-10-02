import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

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

  public saveLoanInfo(obj, customerInfoId, template): Observable<any> {
    const api = `${this.getApi()}/${customerInfoId}/${template}`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  public getCustomerByTypeIdNumberIdTypeRegDate(obj): Observable<any> {
    const api = `${this.getApi()}/customer`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  public uploadFile(formData: FormData): Observable<any> {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-photo`);
    return this.http.post(req.url, formData, {headers: req.header});
  }

  public upload(formData: FormData): Observable<any> {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload`);
    return this.http.post(req.url, formData, {headers: req.header});
  }
}

import {Injectable} from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {CustomerOfferLetter} from '../model/customer-offer-letter';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class CustomerOfferLetterService extends BaseService<CustomerOfferLetter> {
  static API = 'v1/customer-offer-letter';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerOfferLetterService.API;
  }

  public getIssuedOfferLetter(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
    const api = `${this.getApi()}/issue-offer-letter?page=${page}&size=${size}`;
    const req = ApiUtils.getRequest(api);
    return this.http.post(req.url, searchObj, {headers: req.header});
  }

  public uploadOfferFile(formData: FormData): Observable<object> {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
    return this.http.post(req.url, formData, {headers: req.header});
  }

  public postOfferLetterAction(object): Observable<any> {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/action`);
    return this.http.post(req.url, object, {headers: req.header});
  }

  public getByCustomerLoanId(id: number): Observable<any> {
    const api = `${this.getApi()}/customer-loan/${id}`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }

  public assignOfferLetter(object): Observable<any> {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/assign`);
    return this.http.post(req.url, object, {headers: req.header});
  }

  public getRolesPresentInCADHEIRARCHY(): Observable<any> {
    const api = `${this.getApi()}/cad-role-list`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }

  public getAssignedOfferLetter(searchObj: any, page: number = 1, size: number = 10): Observable<any> {
    const api = `${this.getApi()}/assigned-offer-letter?page=${page}&size=${size}`;
    const req = ApiUtils.getRequest(api);
    return this.http.post(req.url, searchObj, {headers: req.header});
  }

  public getPostApprovedDocStat(): Observable<any> {
    const api = `${this.getApi()}/stat`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }
  public getPostApprovedForm(): Observable<any> {
    const api = `${this.getApi()}/stat`;
    const req = ApiUtils.getRequest(api);
    return this.http.get(req.url, {headers: req.header});
  }

}

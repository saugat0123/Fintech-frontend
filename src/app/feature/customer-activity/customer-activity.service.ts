import {Injectable} from '@angular/core';
import {BaseService} from '../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class CustomerActivityService extends BaseService<any> {
  static API = 'v1/customer-activity';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerActivityService.API;
  }

  public getActivity(): Observable<any> {
    const api = `${this.getApi()}`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }
}

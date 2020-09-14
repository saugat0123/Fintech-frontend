import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {CrgGroup} from '../model/CrgGroup';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class CrgGroupService extends BaseService<CrgGroup> {
  static API = 'v1/crg-group';

  public constructor(protected http: HttpClient) {
    super(http);
  }

  public updateStatus(obj: CrgGroup): Observable<any> {
    const api = `${this.getApi()}/status`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  protected getApi(): string {
    return CrgGroupService.API;
  }
}

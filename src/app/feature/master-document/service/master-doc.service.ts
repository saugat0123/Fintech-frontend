import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class MasterDocService extends BaseService<any> {

  static API = 'v1/master-doc';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return MasterDocService.API;
  }

  public upload(formData: FormData): Observable<any> {
    const url = `${this.getApi()}/upload`;
    const req = ApiUtils.getRequestWithFileSupport(url);
    return this.http.post(req.url, formData, {headers: req.header});
  }

  public getAllBookmarks(formData: FormData): Observable<any> {
    const url = `${this.getApi()}/all-bookmarks`;
    const req = ApiUtils.getRequestWithFileSupport(url);
    return this.http.post(req.url, formData, {headers: req.header});
  }

}

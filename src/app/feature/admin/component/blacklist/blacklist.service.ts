import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {BaseService} from '../../../../@core/BaseService';
import {BlackList} from '../../modal/BlackList';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlacklistService extends BaseService<BlackList> {

  static API = 'v1/blacklist';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return BlacklistService.API;
  }

  public getAllBlackList(page: number = 1, size: number = 10) {
    const req = ApiUtils.getRequest(`${this.getApi()}/all?page=${page}&size=${size}`);

    return this.http.get(req.url, {headers: req.header});
  }

  public uploadBlackListFile(excelData: FormData) {
    const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadBlackList`);

    return this.http.post(req.url, excelData, {headers: req.header});
  }

  public removeById(id: number) {
    const req = ApiUtils.getRequest(`${this.getApi()}/remove?id=${id}`);

    return this.http.get(req.url, {headers: req.header});
  }

  public saveBlacklist(obj): Observable<any> {
    const req = ApiUtils.getRequest(`${this.getApi()}/saveBlacklist`);

    return this.http.post(req.url, obj, {headers: req.header});
  }

  public checkBlacklistByRef(refNumber: string) {
    const req = ApiUtils.getRequest(`${this.getApi()}/checkBlacklistByRef?ref=${refNumber}`);

    return this.http.get(req.url, {headers: req.header});
  }
}

import { Injectable } from '@angular/core';
import { BaseService } from '../../../../../@core/BaseService';
import { Applicant } from '../../../modal/applicant';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class NewRequestService extends BaseService<Applicant> {
  static API = 'v1/applicants';

  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return NewRequestService.API;
  }

  getAllApplicants(page, size): Observable<Object> {
    const url: string = NewRequestService.API + '/list' + '?page=' + page + '&size=' + size;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.get(getUrl.url, {headers: getUrl.header});
  }
}

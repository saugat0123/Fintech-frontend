import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {Applicant} from '../../../modal/applicant';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class NewRequestService extends BaseService<Applicant> {

  constructor(protected http: HttpClient) {
    super(http);
  }
  static API = 'v1/applicants';

  protected getApi(): string {
    return NewRequestService.API;
  }

    getAllWithSearchObject(page, size, search: Object): Observable<Object> {
        const url = `${NewRequestService.API}?page=${page}&size=${size}`;
    const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, search, {headers: getUrl.header});
  }
}

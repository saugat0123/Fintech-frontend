import {Injectable} from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {Applicant} from '../../../modal/applicant';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {Status} from '../../../modal/eligibility';

@Injectable({
  providedIn: 'root'
})
export class NewRequestService extends BaseService<Applicant> {

  constructor(protected http: HttpClient) {
    super(http);
  }
  static API = 'v1/applicants';

  static resolveSearchString(eligibilityStatus: Status, branchId: number, loanConfigId: number): string {
    let search = '';
    if (eligibilityStatus != null) {
      search += search === '' ? '' : ',';
      search += `eligibilityStatus:${eligibilityStatus}`;
    }
    if (branchId != null) {
      search += search === '' ? '' : ',';
      search += `branchId:${branchId}`;
    }
    if (loanConfigId != null) {
      search += search === '' ? '' : ',';
      search += `loanConfigId:${loanConfigId}`;
    }
    return search;
  }

  protected getApi(): string {
    return NewRequestService.API;
  }

  getAllWithSearchObject(page, size, search: string = ''): Observable<Object> {
    const url = `${NewRequestService.API}?page=${page}&size=${size}&search=${search}`;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.get(getUrl.url, {headers: getUrl.header});
  }
}

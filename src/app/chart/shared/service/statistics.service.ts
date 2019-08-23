import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiUtils } from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {
  private API = 'v1/statistics';

  constructor(private http: HttpClient) { }

  getStatisticsForUsersPerBranch(): Observable<any> {
    const api = `${this.API}/branch-vs-users`;
    const request = ApiUtils.getRequest(api);
    const httpOptions = {
      headers: request.header
    };
    return this.http.get(request.url, httpOptions);
  }

  getStatisticsForUsersPerRole(): Observable<any> {
    const api = `${this.API}/role-vs-users`;
    const request = ApiUtils.getRequest(api);
    const httpOptions = {
      headers: request.header
    };
    return this.http.get(request.url, httpOptions);
  }
}

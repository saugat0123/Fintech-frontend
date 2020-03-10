import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class NotificationMasterService {

  static API = 'v1/notification-master';

  constructor(
      private http: HttpClient
  ) { }

  getApi(): string {
    return NotificationMasterService.API;
  }

  public saveExpiryDate(numberOfDays: number) {
    const req = ApiUtils.getRequest(`${this.getApi()}/upload?numOfDays=${numberOfDays}`);

    return this.http.get(req.url, {headers: req.header});
  }
}

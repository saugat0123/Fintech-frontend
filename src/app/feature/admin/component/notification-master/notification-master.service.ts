import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../@core/BaseService';
import {NotificationMaster} from '../../../../@core/model/notification-master';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class NotificationMasterService extends BaseService<NotificationMaster> {

  static API = 'v1/notification-master';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  getApi(): string {
    return NotificationMasterService.API;
  }

  public updateStatus(obj: NotificationMaster): Observable<any> {
    const api = `${this.getApi()}/status`;
    const req = ApiUtils.getRequest(api);

    return this.http.post(req.url, obj, {headers: req.header});
  }


}

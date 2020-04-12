import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../@core/BaseService';
import {NotificationMaster} from '../../../../@core/model/notification-master';

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


}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../@core/BaseService';
import {Message} from '../model/message';
import {BehaviorSubject, Observable} from 'rxjs';
import {Status} from '../../../../@core/Status';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends BaseService<Message> {

    constructor(protected http: HttpClient) {
        super(http);
    }

    static API = 'v1/notification';
    private notificationCountSource = new BehaviorSubject<any>(0);
    notificationCount = this.notificationCountSource.asObservable();

    private notificationMessageSource = new BehaviorSubject<any>(null);
    notificationMessage = this.notificationMessageSource.asObservable();

    protected getApi(): string {
        return NotificationService.API;
    }


    setNotificationCount(count: any) {
        this.notificationCountSource.next(count);
    }

    setNotificationMessage(message: Array<Message>) {
        this.notificationMessageSource.next(message);
    }

    fetchNotifications(): void {
        const notificationSearchObject = {
            toId: LocalStorageUtil.getStorage().userId,
            toRole: LocalStorageUtil.getStorage().roleId,
            status: Status.ACTIVE
        };
        this.getPaginationWithSearchObject(notificationSearchObject, 1, 5).subscribe((response: any) => {
            const mes: Array<Message> = response.detail.content;
            this.setNotificationCount(response.detail.totalElements);
            this.setNotificationMessage(mes);
        }, error => {
            console.error(error);
        });
    }

    public deleteMessageById(id: number): Observable<void> {
        const api = `${this.getApi()}/mark-deleted/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.put<void>(req.url , id,{headers: req.header})
    }

    public deleteAllMessage(id: number): Observable<void> {
        const api = `${this.getApi()}/mark-delete/all/${id}`;
        const req = ApiUtils.getRequest(api);
        return this.http.put<void>(req.url ,id, {headers: req.header})
    }

}

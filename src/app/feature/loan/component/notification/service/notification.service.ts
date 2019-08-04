import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../../../@core/BaseService';
import {Message} from '../model/message';

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends BaseService<Message> {

    static API = 'v1/notification';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return NotificationService.API;
    }

}

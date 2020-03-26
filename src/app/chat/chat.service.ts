import {Injectable} from '@angular/core';
import {BaseService} from '../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Chat} from './model/chat';
import {Observable} from 'rxjs';
import {ApiUtils} from '../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class ChatService extends BaseService<Chat> {
    static API = 'v1/chat';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    public getUserForChat(): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/user-list`);
        return this.http.get(req.url, {headers: req.header});
    }

    public updateSeenChat(fromId: any): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/update-seen`);
        return this.http.post(req.url, fromId, {headers: req.header});
    }


    protected getApi(): string {
        return ChatService.API;
    }

}

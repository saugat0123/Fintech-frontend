import {Injectable} from '@angular/core';
import {BaseService} from '../../../../@core/BaseService';
import {UserActivity} from '../../modal/userActivity';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class UserActivityService extends BaseService<UserActivity> {
    static API = 'v1/user-activity';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return UserActivityService.API;
    }
}

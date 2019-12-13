import {User} from '../../modal/user';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseRevisionService} from '../../../../@core/service/base-revision-service';

@Injectable({providedIn: 'root'})
export class UserRevisionService extends BaseRevisionService<User> {
    static API = 'v1/user';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return UserRevisionService.API;
    }
}

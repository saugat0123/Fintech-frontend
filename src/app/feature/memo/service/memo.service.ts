import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {Memo} from '../model/memo';

@Injectable({
    providedIn: 'root'
})
export class MemoService extends BaseService<Memo> {

    static API = 'v1/memos';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return MemoService.API;
    }
}

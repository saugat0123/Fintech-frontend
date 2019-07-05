import {BaseService} from '../../../@core/BaseService';
import {MemoType} from '../model/memoType';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class MemoTypeService extends BaseService<MemoType> {
    static API = 'v1/memos/types';

    public constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return MemoTypeService.API;
    }
}

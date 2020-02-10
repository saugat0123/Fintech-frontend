import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class BasicInfoService extends BaseService<any> {
    static API = 'v1/basicInfo';


    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return BasicInfoService.API;
    }

}

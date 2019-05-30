import {Nepse} from '../../modal/nepse';
import {BaseService} from '../../../../@core/BaseService';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class NepseService extends BaseService<Nepse> {
    static API = 'v1/nepse-company';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return NepseService.API;
    }
}

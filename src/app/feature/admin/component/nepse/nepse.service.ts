import {Nepse} from '../../modal/nepse';
import {BaseService} from '../../../../@core/BaseService';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class NepseService extends BaseService<Nepse> {
    static API = 'v1/nepse-company';

    protected getApi(): string {
        return NepseService.API;
    }
}

import {BaseService} from '../../../../@core/BaseService';
import {Valuator} from '../../modal/valuator';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class ValuatorService extends BaseService<Valuator> {
    static API = 'v1/valuator';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return ValuatorService.API;
    }
}

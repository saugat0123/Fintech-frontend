import {BaseService} from '../../../../../@core/BaseService';
import {Sector} from '../../../modal/sector';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SectorService extends BaseService<Sector> {
    static API = 'v1/sector';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return SectorService.API;
    }

}

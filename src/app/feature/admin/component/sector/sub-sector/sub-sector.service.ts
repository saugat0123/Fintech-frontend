import {BaseService} from '../../../../../@core/BaseService';
import {SubSector} from '../../../modal/sub-sector';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class SubSectorService extends BaseService<SubSector> {
    static API = 'v1/sub-sector';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return SubSectorService.API;
    }

}

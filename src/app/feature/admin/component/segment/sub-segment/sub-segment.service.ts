import {BaseService} from '../../../../../@core/BaseService';
import {SubSegment} from '../../../modal/subSegment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SubSegmentService extends BaseService<SubSegment> {
    static API = 'v1/sub-segment';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return SubSegmentService.API;
    }

}

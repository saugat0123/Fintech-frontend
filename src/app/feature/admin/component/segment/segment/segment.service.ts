import {BaseService} from '../../../../../@core/BaseService';
import {Segment} from '../../../modal/segment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SegmentService extends BaseService<Segment> {
    static API = 'v1/segment';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return SegmentService.API;
    }

}

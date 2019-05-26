import {BaseService} from '../../../../@core/BaseService';
import {Branch} from '../../modal/branch';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class BranchService extends BaseService<Branch> {
    static API = 'v1/branch';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return BranchService.API;
    }
}

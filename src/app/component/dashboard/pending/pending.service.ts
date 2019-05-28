import { Injectable } from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';

@Injectable({
  providedIn: 'root'
})
export class PendingService extends BaseService<DmsLoanFile>{
    static API = 'v1/dmsLoanFile';
    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return  PendingService.API;
    }
    public getDocumentByStatus(status: string): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/getLoan`+'?status=' + status);
        return this.http.get(req.url, {headers: req.header});
    }

}

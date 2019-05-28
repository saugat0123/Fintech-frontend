import { Injectable } from '@angular/core';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';

@Injectable({
  providedIn: 'root'
})
export class DmsSummaryService extends BaseService<DmsLoanFile>{

    static API = 'v1/dmsLoanFile';
    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return  DmsSummaryService.API;
    }
    downloadDocument(path:string) {
        const url: string = this.getApi() + '/downloadDocument?path=' + path;
        const getUrl = ApiUtils.getRequest(url);
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: getUrl.header
        };
        return this.http.get(getUrl.url, httpOptions);
    }
}

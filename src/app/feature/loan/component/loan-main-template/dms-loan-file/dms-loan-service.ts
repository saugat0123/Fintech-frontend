import {Injectable} from '@angular/core';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class DmsLoanService extends BaseService<DmsLoanFile> {
    static API = 'v1/dms-loan-file';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    downloadDocument(path: string) {
        const url: string = this.getApi() + '/download?path=' + path;
        const getUrl = ApiUtils.getRequest(url);
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: getUrl.header
        };
        return this.http.get(getUrl.url, httpOptions);
    }

    public uploadFile(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getDocumentByStatus(status: string): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/getLoanByStatus` + '?status=' + status);
        return this.http.get(req.url, {headers: req.header});
    }

    protected getApi(): string {
        return DmsLoanService.API;
    }
}

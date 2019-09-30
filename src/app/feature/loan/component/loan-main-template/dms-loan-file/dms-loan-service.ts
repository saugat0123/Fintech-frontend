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
        const url: string = this.getApi() + '/download';
        const getUrl = ApiUtils.getRequest(url);
        const httpOptions = {
            responseType: 'blob' as 'json',
            headers: getUrl.header
        };
        return this.http.post(getUrl.url, path, httpOptions);
    }

    public uploadFile(formData: FormData): Observable<object> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadFile`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public getDocumentByStatus(status: any): Observable<any> {
        const req = ApiUtils.getRequest(`v1/Loan-customer/status`);
        return this.http.post(req.url, status, {headers: req.header});
    }

    protected getApi(): string {
        return DmsLoanService.API;
    }
}

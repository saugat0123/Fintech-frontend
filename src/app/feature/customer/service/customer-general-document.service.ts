import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class CustomerGeneralDocumentService extends BaseService<Object> {
    static API = 'v1/customer-general-document';

    constructor(protected http: HttpClient) {
        super(http);

    }

    public uploadDoc(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-document`);
        return this.http.post(req.url, formData, {headers: req.header});
    }

    public deleteDocument(id: number, customerId, path, doc_index): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/delete-document/${id}/${customerId}/${doc_index}`);
        return this.http.post(req.url, path, {headers: req.header});
    }

    protected getApi(): string {
        return CustomerGeneralDocumentService.API;
    }

    public uploadMultipleDoc(formData: FormData): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/upload-multiple-document`);
        console.log(formData.getAll('file'));
        return this.http.post(req.url, formData, {headers: req.header});
    }

}

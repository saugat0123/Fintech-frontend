import {BaseService} from '../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {Document} from '../../modal/document';

@Injectable({providedIn: 'root'})
export class DocumentService extends BaseService<Document> {
    static API = 'v1/document';

    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return DocumentService.API;
    }

    public getAllLoanCycle(): Observable<any> {
        const req = ApiUtils.getRequest(`${DocumentService.API}/lifeCycle`);

        return this.http.get(req.url, {headers: req.header});
    }

    public getByLoanCycleAndStatus(loanCycleId: number, status: string): Observable<any> {
        const req = ApiUtils.getRequest(`${DocumentService.API}/byCycle/${loanCycleId}/status/${status}`);

        return this.http.get(req.url, {headers: req.header});
    }

    public updateDocumentByLoanCycle(id: number, model: any): Observable<any> {
        const req = ApiUtils.getRequest(`${DocumentService.API}/saveList?loanCycleId=${id}`);

        return this.http.post(req.url, model, {headers: req.header});
    }

    public getAllByStatus(status: String): Observable<any> {
        const req = ApiUtils.getRequest(`${DocumentService.API}/status/${status}`);

        return this.http.get(req.url, {headers: req.header});
    }
}

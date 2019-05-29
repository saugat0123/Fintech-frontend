import {Injectable} from '@angular/core';
import {DmsLoanFile} from '../../../../admin/modal/dms-loan-file';
import {BaseService} from '../../../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {Document} from '../../../../admin/modal/document';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class DmsLoanService extends BaseService<DmsLoanFile> {
    static API = 'v1/dms-loan-file';
    renew: Document[] = [];
    initial: Document[] = [];
    data: any;
    loanType: string;
    loanConfig: LoanConfig = new LoanConfig();
    dmsLoanfile: Array<DmsLoanFile> = new Array<DmsLoanFile>();

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

    setLoanName(name: string) {
        this.loanType = name;
    }

    getLoanName() {
        return this.loanType;
    }

    setInitialDocument(documents: Document[]) {
        this.initial = documents;
    }

    setRenewDocument(docuemnts: Document[]) {
        this.renew = docuemnts;
    }

    getInitialDocument() {
        return this.initial;
    }

    getRenewDocument() {
        return this.renew;
    }

    setLoan(loanConfig: LoanConfig) {
        this.loanConfig = loanConfig;
    }

    getLoan() {
        return this.loanConfig;
    }

    setDmsLoanFile(dmsLoanFile: DmsLoanFile) {
        this.dmsLoanfile.push(dmsLoanFile);
    }

    getDmsLoanFile() {
        return this.dmsLoanfile;
    }

    public getDocumentByStatus(status: string): Observable<any> {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/getLoanByStatus` + '?status=' + status);
        return this.http.get(req.url, {headers: req.header});
    }

    setDataList(datalist: Object) {
        this.data = datalist;
    }

    getDataList() {
        return this.data;
    }

    protected getApi(): string {
        return DmsLoanService.API;
    }


}

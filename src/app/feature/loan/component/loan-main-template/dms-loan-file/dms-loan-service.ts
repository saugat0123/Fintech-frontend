import { Injectable } from '@angular/core';
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
export class DmsLoanService extends BaseService<DmsLoanFile>{
    renew: Document[] = [];
    initial: Document[] = [];
    loanType: string;
    loanConfig: LoanConfig = new LoanConfig();
    dmsLoanfile: Array<DmsLoanFile> = new Array<DmsLoanFile>();
    static API = 'v1/dmsLoanFile';
    constructor(readonly http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return  DmsLoanService.API;
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

}

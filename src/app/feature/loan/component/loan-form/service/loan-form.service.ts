import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';


import {Observable} from 'rxjs';
import {BaseService} from '../../../../../@core/BaseService';
import {LoanDataHolder} from '../../../model/loanData';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';


@Injectable({
    providedIn: 'root'
})
export class LoanFormService extends BaseService<LoanDataHolder> {

    static API = 'v1/loan-customer';
    static TEMPLATEAPI = 'v1/loan-configs';
    static DATEAPI = 'v1/date';


    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return LoanFormService.API;
    }

    getTemplateApi(): string {
        return LoanFormService.TEMPLATEAPI;
    }

    getDateeApi(): string {
        return LoanFormService.DATEAPI;
    }

    public getTemplates(id: number): Observable<any> {
        const api = `${this.getTemplateApi()}/${id}`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }

    public getCurrentNepaliDate(): Observable<any> {
        const api = `${this.getDateeApi()}/nepDate`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }



}

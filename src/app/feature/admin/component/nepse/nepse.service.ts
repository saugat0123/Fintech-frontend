import {Nepse} from '../../modal/nepse';
import {BaseService} from '../../../../@core/BaseService';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../../@core/utils/api/ApiUtils';
import {ShareForm} from '../../modal/shareForm';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NepseService extends BaseService<Nepse> {
    static API = 'v1/nepse-company';

    constructor(protected http: HttpClient) {
        super(http);
    }

    protected getApi(): string {
        return NepseService.API;
    }

    public uploadNepseFile(excelData: FormData) {
        const req = ApiUtils.getRequestWithFileSupport(`${this.getApi()}/uploadNepseFile`);

        return this.http.post(req.url, excelData, {headers: req.header});
    }

    public addShare(shareValue: ShareForm): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/share`);
        console.log(shareValue);
        return this.http.post(req.url, shareValue, {headers: req.header});
    }
    public getActiveShare(): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/share`);
        return this.http.get(req.url, {headers: req.header});
    }
    public findAllNepseCompanyData(searchDto): Observable<any> {
        const req = ApiUtils.getRequest(`${this.getApi()}/nepse-list`);
        return this.http.post(req.url, searchDto , {headers: req.header});
    }


    public getPaginationOrdered(searchObj: any, page: number = 1, size: number = 20): Observable<any> {
        const api = `${this.getApi()}/share/list?page=${page}&size=${size}`;
        const req = ApiUtils.getRequest(api);

        return this.http.get(req.url, {headers: req.header});
    }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ApiUtils } from '../../@core/utils/api/ApiUtils';

@Injectable({
    providedIn: 'root'
})
export class BarChartService {

    private API = 'v1/Loan-customer';

    constructor(private http: HttpClient) { }

    public getBarData(id: number, startDate: string, endDate: string) {
        const api = `${this.API}/stats`;
        const request = ApiUtils.getRequest(api);
        const httpOptions = {
            headers: request.header,
            params: new HttpParams().set('branchId', `${id}`).set('startDate', startDate).set('endDate', endDate)
        };
        return this.http.get(request.url, httpOptions);
    }
}

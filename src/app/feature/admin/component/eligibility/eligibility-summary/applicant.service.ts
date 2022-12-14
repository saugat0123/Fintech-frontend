import {Injectable} from '@angular/core';
import {Applicant} from '../../../modal/applicant';
import {HttpClient} from '@angular/common/http';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApplicantService {

    static API = 'v1/loan-configs';

    constructor(private http: HttpClient) {
    }

    update(model: Applicant): Observable<any> {
        const url = `${ApplicantService.API}/${model.loanConfig.id}/applicants/update`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }
}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../@core/utils/api/ApiUtils';
import {EligibilityLoanConfigService} from "../admin/component/eligibility/eligibility-loan-config/eligibility-loan-config-service";

@Injectable({
    providedIn: 'root'
})
export class QuestionService {
    loanConfigApi = 'v1/loan-configs/';
    questionApi = '/questions'
    loanType:boolean=false;
    constructor(private http: HttpClient,
                private loanConfigService: EligibilityLoanConfigService) {

    }

    saveQuestionList(model: Object, loanConfigId): Observable<Object> {
        const url = `${this.loanConfigApi}${loanConfigId}${this.questionApi}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    editQuestion(model: Object, loanConfigId, questionId): Observable<Object> {
        const url = `${this.loanConfigApi}${loanConfigId}${this.questionApi}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }

    getAllQuestions(loanConfigId): Observable<Object> {
        const url = `${this.loanConfigApi}${loanConfigId}${this.questionApi}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    deleteQuestion(loanConfigId, questionId): Observable<Object> {
        const url = `${this.loanConfigApi}${loanConfigId}${this.questionApi}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.delete(getUrl.url, {headers: getUrl.header});
    }
}

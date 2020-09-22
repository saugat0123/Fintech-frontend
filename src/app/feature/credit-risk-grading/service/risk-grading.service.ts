import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {CrgQuestion} from '../model/CrgQuestion';

@Injectable({
    providedIn: 'root'
})
export class RiskGradingService {
    constructor(private http: HttpClient) {
    }

    API = (loanApprovalType: number): string => {
        return `v1/${loanApprovalType}/crg-questions`;
    }

    saveQuestionList(model: Object, loanApprovalType): Observable<Object> {
        const url = this.API(loanApprovalType);
        console.log(url);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    editQuestion(model: CrgQuestion, loanApprovalType, questionId): Observable<Object> {
        const url = `${this.API(loanApprovalType)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }

    getAllQuestions(loanApprovalType): Observable<Object> {
        const url = this.API(loanApprovalType);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    deleteQuestion(loanApprovalType, questionId): Observable<Object> {
        const url = `${this.API(loanApprovalType)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.delete(getUrl.url, {headers: getUrl.header});
    }
}

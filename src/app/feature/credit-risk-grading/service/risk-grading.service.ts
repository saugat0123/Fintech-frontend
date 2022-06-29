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

    API = (loanConfigId: number): string => {
        return `v1/${loanConfigId}/crg-questions`;
    }

    saveQuestionList(model: Object, loanConfigId: number): Observable<Object> {
        const url = this.API(loanConfigId);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    editQuestion(model: CrgQuestion, loanConfigId: number, questionId): Observable<Object> {
        const url = `${this.API(loanConfigId)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }

    getAllQuestions(loanConfigId: number): Observable<any> {
        const url = this.API(loanConfigId);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    getAllQuestionsByBusinessType(businessType): Observable<any> {
        const url = this.API(0) + '/businessType';
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, businessType, {headers: getUrl.header});
    }
    deleteQuestion(loanConfigId: number, questionId): Observable<Object> {
        const url = `${this.API(loanConfigId)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.delete(getUrl.url, {headers: getUrl.header});
    }
    saveQuestionListBusinessTYpe(model: Object): Observable<Object> {
        const url = this.API(0) + '/save/businessType';
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }
}

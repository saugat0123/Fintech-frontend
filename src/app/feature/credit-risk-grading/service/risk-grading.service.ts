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

    API = (customerType: number): string => {
        return `v1/${customerType}/crg-questions`;
    }

    saveQuestionList(model: Object, customerType): Observable<Object> {
        const url = this.API(customerType);
        console.log(url);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.post(getUrl.url, model, {headers: getUrl.header});
    }

    editQuestion(model: CrgQuestion, customerType, questionId): Observable<Object> {
        const url = `${this.API(customerType)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.put(getUrl.url, model, {headers: getUrl.header});
    }

    getAllQuestions(customerType): Observable<Object> {
        const url = this.API(customerType);
        const getUrl = ApiUtils.getRequest(url);
        return this.http.get(getUrl.url, {headers: getUrl.header});
    }

    deleteQuestion(customerType, questionId): Observable<Object> {
        const url = `${this.API(customerType)}/${questionId}`;
        const getUrl = ApiUtils.getRequest(url);
        return this.http.delete(getUrl.url, {headers: getUrl.header});
    }
}

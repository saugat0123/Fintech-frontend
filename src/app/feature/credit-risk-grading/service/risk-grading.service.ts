import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class RiskGradingService {
  loanConfigApi = 'v1/loan-configs/';
  questionApi = '/crg-questions';

  constructor(private http: HttpClient) {
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

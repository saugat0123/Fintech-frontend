import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../../../../../@core/utils/api/ApiUtils';

@Injectable({
  providedIn: 'root'
})
export class GeneralQuestionService {
  eligibilityCriteriaApi = 'v1/eligibility-criterias';

  constructor(private http: HttpClient) { }

  saveEligibilityCriteria(model: Object): Observable<Object> {
    const url: string = this.eligibilityCriteriaApi;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.post(getUrl.url, model, {headers: getUrl.header});
  }

  getAllEligibilityCriteria(page, size): Observable<Object> {
    const url = `${this.eligibilityCriteriaApi}?page=${page}&size=${size}`;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.get(getUrl.url, {headers: getUrl.header});
  }

  getEligibilityCriteria(eligibilityCriteriaId): Observable<Object> {
    const url = `${this.eligibilityCriteriaApi}/${eligibilityCriteriaId}`;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.get(getUrl.url, {headers: getUrl.header});
  }

  updateEligibilityCriteria(model: Object, eligibilityCriteriaId): Observable<Object> {
    const url = `${this.eligibilityCriteriaApi}/${eligibilityCriteriaId}`;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.put(getUrl.url, model, {headers: getUrl.header});
  }

  deleteEligibilityCriteria(eligibilityCriteriaId): Observable<Object> {
    const url = `${this.eligibilityCriteriaApi}/${eligibilityCriteriaId}`;
    const getUrl = ApiUtils.getRequest(url);
    return this.http.delete(getUrl.url, {headers: getUrl.header});
  }
}

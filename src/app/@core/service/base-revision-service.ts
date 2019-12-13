import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ApiUtils} from '../utils/api/ApiUtils';

export abstract class BaseRevisionService<T> {

  protected constructor(protected http: HttpClient) {
  }

  protected abstract getApi(): string;

  public getList(id: number): Observable<any> {
    const api = `${this.getApi()}/${id}/revisions`;
    const req = ApiUtils.getRequest(api);

    return this.http.get(req.url, {headers: req.header});
  }
}

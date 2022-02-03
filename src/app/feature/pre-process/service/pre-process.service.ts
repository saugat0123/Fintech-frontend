import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {ApiUtils} from '../../../@core/utils/api/ApiUtils';
import {PreProcessModel} from '../model/preProcess.model';
import {Observable} from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PreProcessService extends BaseService<Object> {

    static API = 'v1/pre-process';

    constructor(protected http: HttpClient) {
      super(http);
    }

  protected getApi(): string {
    return PreProcessService.API;
  }

    public getPreProcessList(customerInfoId: number) {
      const req = ApiUtils.getRequest(`${this.getApi()}/details/${customerInfoId}`);
      return this.http.get(req.url, {headers: req.header});
    }

    public saveDetails(obj: PreProcessModel, loanConfigId: number, customerInfoId: number): Observable<any> {
        const api = `${this.getApi()}/save/?loanConfigId=${loanConfigId}&customerinfoId=${customerInfoId}`;
        const req = ApiUtils.getRequest(api);

        return this.http.post(req.url, obj, {headers: req.header});
    }
}

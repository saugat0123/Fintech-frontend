import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {Customer} from '../modal/customer';
import {EntityInfo} from '../modal/entity-info';

@Injectable({
    providedIn: 'root'
})
export class EntityInfoService extends BaseService<EntityInfo>{

    static API = 'v1/companyInfo';

    constructor(protected http: HttpClient) {
        super(http);
    }

  protected getApi(): string {
    return EntityInfoService.API;
  }
}

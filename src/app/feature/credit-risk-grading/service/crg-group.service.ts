import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BaseService} from '../../../@core/BaseService';
import {CrgGroup} from '../model/CrgGroup';

@Injectable({
  providedIn: 'root'
})
export class CrgGroupService extends BaseService<CrgGroup> {
  static API = 'v1/crg-group';

  public constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CrgGroupService.API;
  }
}

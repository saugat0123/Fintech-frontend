import { Injectable } from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {MGroup} from '../model/mGroup';

@Injectable({
  providedIn: 'root'
})
export class MGroupService extends BaseService<MGroup> {
  static API = 'v1/m-group';

  constructor(private httpClient: HttpClient) {
    super(httpClient);
  }

  protected getApi(): string {
    return MGroupService.API;
  }
}

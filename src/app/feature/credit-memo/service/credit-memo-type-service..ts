import { Injectable } from '@angular/core';
import {BaseService} from "../../../@core/BaseService";
import {CreditMemoType} from "../model/credit-memo-type";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class CreditMemoTypeService extends BaseService<CreditMemoType> {

  static API = 'v1/credit-memo-type';
  constructor(protected http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CreditMemoTypeService.API;
  }
}

import { Injectable } from '@angular/core';
import {BaseService} from '../../../@core/BaseService';
import {HttpClient} from '@angular/common/http';
import {CustomerOfferLetter} from '../model/customer-offer-letter';

@Injectable({
  providedIn: 'root'
})
export class CustomerOfferLetterService extends BaseService<CustomerOfferLetter> {
  static API = 'v1/customer-offer-letter';

  constructor(readonly http: HttpClient) {
    super(http);
  }

  protected getApi(): string {
    return CustomerOfferLetterService.API;
  }
}

import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {CustomerType} from '../../feature/customer/model/customerType';
import {Location} from '@angular/common';
import {NgxSpinnerService} from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class CommonRoutingUtilsService {

  constructor(private router: Router,
              private _location: Location,
              private spinner: NgxSpinnerService,
  ) { }

   loadCustomerProfile(associateId, id, customerType) {
      this.spinner.hide();
    if (CustomerType[customerType] === CustomerType.INDIVIDUAL) {
      this.router.navigate(['/home/customer/profile/' + associateId], {
        queryParams: {
          customerType: customerType,
          customerInfoId: id
        }
      });
    } else if (CustomerType[customerType] === CustomerType.INSTITUTION) {
      this.router.navigate(['/home/customer/company-profile/' + associateId],
          {
            queryParams: {
              id: id,
              customerType: customerType,
              companyInfoId: associateId,
              customerInfoId: id
            }
          });
    }
  }

    goBack() {
        this._location.back();
    }
}

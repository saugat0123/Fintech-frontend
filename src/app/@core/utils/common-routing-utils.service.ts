import { Injectable } from '@angular/core';
import {Router} from '@angular/router';
import {CustomerType} from '../../feature/customer/model/customerType';

@Injectable({
  providedIn: 'root'
})
export class CommonRoutingUtilsService {

  constructor(private router: Router) { }

   loadCustomerProfile(associateId, id, customerType) {
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
}

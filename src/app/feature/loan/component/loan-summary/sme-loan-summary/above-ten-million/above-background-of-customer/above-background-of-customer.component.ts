import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CompanyContactDetail} from '../../../../../../admin/modal/crg/companyContactDetail';
import {CustomerInfoData} from '../../../../../model/customerInfoData';

@Component({
  selector: 'app-above-background-of-customer',
  templateUrl: './above-background-of-customer.component.html',
  styleUrls: ['./above-background-of-customer.component.scss']
})
export class AboveBackgroundOfCustomerComponent implements OnInit {
  @Input() companyInfo: CompanyInfo;
  @Input() loanHolder: CustomerInfoData;
  @Input() customerCategory;
  jsonData: any;
  registeredAddress: any;
  currentAddress: any;
  contactedPerson: any;
  contactDetails: CompanyContactDetail;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.jsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.registeredAddress = JSON.parse(this.companyInfo.companyLocations.address);
      this.currentAddress = JSON.parse(this.companyInfo.companyLocations.correspondenceAddress);
      this.contactedPerson = JSON.parse(this.companyInfo.contactPersons);
      this.contactDetails = JSON.parse(this.companyInfo.companyContactDetails);
    }
  }

}

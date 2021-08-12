import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {CustomerType} from '../../../../customer/model/customerType';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {BusinessAndIndustry} from '../../../../admin/modal/businessAndIndustry';
import {RegisteredOfficeList} from '../../../../admin/modal/registeredOfficeList';
import {BusinessGiven} from '../../../../admin/modal/businessGiven';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {environment} from '../../../../../../environments/environment';

@Component({
  selector: 'app-micro-company-info-view',
  templateUrl: './micro-company-info-view.component.html',
  styleUrls: ['./micro-company-info-view.component.scss']
})
export class MicroCompanyInfoViewComponent implements OnInit {
  @Input() formValue: CompanyInfo;
  customerType = CustomerType;

  @Input() calendarType: CalendarType;
  @Input() customerInfo: CustomerInfoData;
  @Input() loanId: any;
  companyJsonData: CompanyJsonData;
  additionalInfoJsonData;
  contactPersonJsonData;
  bankingRelation;
  businessAndIndustry: BusinessAndIndustry;
  registeredOffice: typeof RegisteredOfficeList = RegisteredOfficeList;
  businessGiven: BusinessGiven;
  companyLocationData;
  disableCrgAlpha = environment.disableCrgAlpha;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.companyJsonData = JSON.parse(this.formValue.companyJsonData);
      this.additionalInfoJsonData = JSON.parse(this.formValue.additionalCompanyInfo);
      this.contactPersonJsonData = JSON.parse(this.formValue.contactPersons);
      this.businessAndIndustry = JSON.parse(this.formValue.businessAndIndustry);
      this.businessGiven = JSON.parse(this.formValue.businessGiven);
      this.companyLocationData = JSON.parse(this.formValue.companyLocations.address);
    }
    this.bankingRelation = JSON.parse(this.customerInfo.bankingRelationship);
  }


}

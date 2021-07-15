import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CalendarType} from '../../../@core/model/calendar-type';
import {CustomerType} from '../../customer/model/customerType';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {CompanyJsonData} from '../../admin/modal/CompanyJsonData';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {BusinessAndIndustry} from '../../admin/modal/businessAndIndustry';
import {RegisteredOfficeList} from '../../admin/modal/registeredOfficeList';
import {BusinessGiven} from '../../admin/modal/businessGiven';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-company-info-view',
  templateUrl: './company-info-view.component.html',
  styleUrls: ['./company-info-view.component.scss']
})
export class CompanyInfoViewComponent implements OnInit {
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
  srdbAffiliatedId = false;
  disableCrgAlpha = environment.disableCrgAlpha;
  client = environment.client;
  clientName = Clients;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  constructor() {
  }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
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

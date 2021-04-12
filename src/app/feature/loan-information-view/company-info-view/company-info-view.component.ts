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
import {environment as envSrdb} from '../../../../environments/environment.srdb';
import {environment} from '../../../../environments/environment';
import {Clients} from '../../../../environments/Clients';

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
  disableCrgAlpha = envSrdb.disableCrgAlpha;
  client = environment.client;
  clientName = Clients;

  constructor() {
  }

  ngOnInit() {
    if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
      this.srdbAffiliatedId = true;
    }
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.companyJsonData = JSON.parse(this.formValue.companyJsonData);


      if(this.chekValidity(JSON.parse(this.formValue.additionalCompanyInfo))){
        this.additionalInfoJsonData = JSON.parse(this.formValue.additionalCompanyInfo);
      }else{
        this.additionalInfoJsonData==null;
      }

      this.contactPersonJsonData = JSON.parse(this.formValue.contactPersons);
      this.businessAndIndustry = JSON.parse(this.formValue.businessAndIndustry);
      this.businessGiven = JSON.parse(this.formValue.businessGiven);
      this.companyLocationData = JSON.parse(this.formValue.companyLocations.address);
    }
    this.bankingRelation = JSON.parse(this.customerInfo.bankingRelationship);
  }


  public chekValidity(obj):boolean{
    if(obj.licenseHolderName==null){
     return false;
    }
    else if (obj.licenseHolderName==null){
      return false;
    }
    else if(obj.registrationType==null){
      return false;
    }
    else if(obj.licenseIssuedDate==null){
      return  false
    }
    else if (obj.licenseIssuePlace==null){
      return false;
    }
    else {
      return  true;
    }
  }
}

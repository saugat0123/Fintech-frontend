import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../../admin/modal/company-info';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CompanyContactDetail} from '../../../../../../admin/modal/crg/companyContactDetail';
import {CustomerInfoData} from '../../../../../model/customerInfoData';
import {CompanyJsonData} from '../../../../../../admin/modal/CompanyJsonData';
import {Proprietors} from '../../../../../../admin/modal/proprietors';

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
  shareCapitalDetails;
  totalCurrent = 0;
  totalPrevious = 0;
  propList: Array<Proprietors>;
  BODList: Array<Proprietors>;
  ManagementTeamList: Array<Proprietors>;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.companyInfo)) {
      this.jsonData = JSON.parse(this.companyInfo.companyJsonData);
      this.registeredAddress = JSON.parse(this.companyInfo.companyLocations.address);
      this.currentAddress = JSON.parse(this.companyInfo.companyLocations.correspondenceAddress);
      this.contactedPerson = JSON.parse(this.companyInfo.contactPersons);
      this.contactDetails = JSON.parse(this.companyInfo.companyContactDetails);
      this.shareCapitalDetails = JSON.parse(this.companyInfo.shareCapital);
      this.propList = this.jsonData.proprietorList;
      this.BODList = this.propList.filter(value => value.type === 'BOD');
      this.ManagementTeamList = this.propList.filter(value => value.type === 'Management Team');
    }
    if (!ObjectUtil.isEmpty(this.shareCapitalDetails)) {
      this.shareCapitalDetails.forEach((data: any) => {
        this.totalCurrent = this.totalCurrent + data.capitalFirstYear;
        this.totalPrevious = this.totalPrevious + data.capitalSecondYear;
      });
    }
  }

}

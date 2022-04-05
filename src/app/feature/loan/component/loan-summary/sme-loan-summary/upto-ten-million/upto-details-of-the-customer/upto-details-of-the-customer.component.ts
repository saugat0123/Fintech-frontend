import {Component, Input, OnInit} from '@angular/core';
import {CompanyInfo} from '../../../../../../admin/modal/company-info';
import {CompanyJsonData} from '../../../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../model/loanData';
import {CustomerInfoData} from '../../../../../model/customerInfoData';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-upto-details-of-the-customer',
  templateUrl: './upto-details-of-the-customer.component.html',
  styleUrls: ['./upto-details-of-the-customer.component.scss']
})
export class UptoDetailsOfTheCustomerComponent implements OnInit {
  @Input() companyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfoData: CustomerInfoData;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  tempCompanyInfo;
  relationGroup;
  relationCustomer;
  registrationDate;
  constructor(
      public datepipe: DatePipe
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.companyJsonData = JSON.parse(this.loanDataHolder.companyInfo.companyJsonData);
    }
    this.relationshipSinceDate();
   }

  relationshipSinceDate() {
    let relationG;
    relationG = this.companyJsonData.relationshipSince;
    this.relationGroup = this.datepipe.transform(relationG, 'yyyy-MM-dd');
    let relationC;
    relationC = this.companyJsonData.relationshipSinceWithCustomer;
    this.relationCustomer = this.datepipe.transform(relationC, 'yyyy-MM-dd');
    let regDate;
    regDate = this.companyInfo.establishmentDate;
    this.registrationDate = this.datepipe.transform(regDate, 'yyyy-MM-dd');
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {CompanyJsonData} from '../../../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../model/loanData';
import {DatePipe} from '@angular/common';
import {Proprietors} from '../../../../../../admin/modal/proprietors';

@Component({
  selector: 'app-upto-details-of-the-customer',
  templateUrl: './upto-details-of-the-customer.component.html',
  styleUrls: ['./upto-details-of-the-customer.component.scss']
})
export class UptoDetailsOfTheCustomerComponent implements OnInit {
  @Input() companyInfo;
  @Input() loanDataHolder: LoanDataHolder;
  companyJsonData: CompanyJsonData = new CompanyJsonData();
  relationGroup;
  relationCustomer;
  registrationDate;
  companyLocation;
  businessLocation;
  propList: Array<Proprietors>;
  totalCrgPoint;
  mGroup;
  sum = 0;
  checkedData;
  multiBankingData;
  constructor(
      public datepipe: DatePipe
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.companyJsonData = JSON.parse(this.loanDataHolder.companyInfo.companyJsonData);
      console.log('companyJsonData', this.companyJsonData);
      this.propList = this.companyJsonData.proprietorList;
      this.companyLocation = JSON.parse(this.loanDataHolder.companyInfo.companyLocations.address);
      this.businessLocation = JSON.parse(this.loanDataHolder.companyInfo.companyLocations.projectAddress);
      this.mGroup = this.loanDataHolder.loanHolder.mgroupInfo;
      if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
        const gamma = JSON.parse(this.loanDataHolder.crgGamma.data);
        this.totalCrgPoint = gamma.totalPoint;
      }
      this.totalsum();
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.multiBanking)) {
        this.multiBankingData = JSON.parse(this.loanDataHolder.loanHolder.multiBanking.data);
        console.log('consortium', this.multiBankingData.consortium);
        this.checkedData = JSON.parse(this.loanDataHolder.loanHolder.multiBanking.checkedData);
      }
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
  totalsum() {
    this.propList.forEach((value) => {
     const sum1 = value.share;
     this.sum = this.sum + sum1;
    });
  }
}

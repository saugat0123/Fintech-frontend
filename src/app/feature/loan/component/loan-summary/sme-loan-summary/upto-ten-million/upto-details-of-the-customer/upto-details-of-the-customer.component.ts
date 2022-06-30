import {Component, Input, OnInit} from '@angular/core';
import {CompanyJsonData} from '../../../../../../admin/modal/CompanyJsonData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../model/loanData';
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
  registrationDate;
  propList: Array<Proprietors>;
  totalCrgPoint;
  sum = 0;
  checkedData;
  multiBankingData;
  commentData;
  ciclData = [];
  reviewDate;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
        const data = JSON.parse(this.loanDataHolder.loanHolder.data);
        this.reviewDate = data.reviewDate;
      }
      this.propList = this.companyJsonData.proprietorList;
      if (!ObjectUtil.isEmpty(this.loanDataHolder.crgGamma)) {
        const gamma = JSON.parse(this.loanDataHolder.crgGamma.data);
        this.totalCrgPoint = gamma.totalPoint;
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.multiBanking)) {
        this.multiBankingData = JSON.parse(this.loanDataHolder.loanHolder.multiBanking.data);
        this.checkedData = JSON.parse(this.loanDataHolder.loanHolder.multiBanking.checkedData);
      }
      if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.data)) {
        const oldData = JSON.parse(this.loanDataHolder.loanHolder.data);
        if (!ObjectUtil.isEmpty(oldData)) {
          if (!ObjectUtil.isEmpty(oldData.data)) {
            this.commentData = JSON.parse(oldData.data);
          }
        }
      }
      if (this.loanDataHolder.loanHolder.cicl) {
        this.ciclData = JSON.parse(this.loanDataHolder.loanHolder.cicl.data);
      }
    }
   }
}

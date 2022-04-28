import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-review-of-credit-facilities',
  templateUrl: './above-review-of-credit-facilities.component.html',
  styleUrls: ['./above-review-of-credit-facilities.component.scss']
})
export class AboveReviewOfCreditFacilitiesComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  tempData;
  tempData1;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      this.tempData = this.loanDataHolder.companyInfo;
      if (!ObjectUtil.isEmpty(this.tempData.companyJsonData)) {
        this.tempData1 = JSON.parse(this.tempData.companyJsonData);
      }
    }
  }

}

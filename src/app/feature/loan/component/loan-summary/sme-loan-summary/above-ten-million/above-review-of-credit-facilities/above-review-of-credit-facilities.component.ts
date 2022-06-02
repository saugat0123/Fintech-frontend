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
  reviewDate;
  isReviewDate = false;

  constructor() { }

  ngOnInit() {
    const reviewDateData = JSON.parse(this.loanDataHolder.loanHolder.data);
    if (!ObjectUtil.isEmpty(reviewDateData)) {
      this.reviewDate = reviewDateData.reviewDate;
    }
  }

}

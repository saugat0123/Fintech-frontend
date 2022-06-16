import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-above-review-of-credit-facilities',
  templateUrl: './above-review-of-credit-facilities.component.html',
  styleUrls: ['./above-review-of-credit-facilities.component.scss']
})
export class AboveReviewOfCreditFacilitiesComponent implements OnInit, OnChanges {
  @Input() loanDataHolder: LoanDataHolder;
  reviewDate;
  isReviewDate = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder)) {
      const reviewDateData = JSON.parse(this.loanDataHolder.loanHolder.data);
      if (!ObjectUtil.isEmpty(reviewDateData)) {
        this.reviewDate = reviewDateData.reviewDate;
      }
    }
  }

}

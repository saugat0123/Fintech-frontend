import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../../../../model/customerInfoData';

@Component({
  selector: 'app-above-review-of-credit-facilities',
  templateUrl: './above-review-of-credit-facilities.component.html',
  styleUrls: ['./above-review-of-credit-facilities.component.scss']
})
export class AboveReviewOfCreditFacilitiesComponent implements OnInit, OnChanges {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfo: CustomerInfoData;
  reviewDate;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      const reviewDateData = JSON.parse(this.loanDataHolder.loanHolder.data);
      if (!ObjectUtil.isEmpty(reviewDateData)) {
        this.reviewDate = reviewDateData.reviewDate;
      }
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-borrower-risk-rating',
  templateUrl: './borrower-risk-rating.component.html',
  styleUrls: ['./borrower-risk-rating.component.scss']
})
export class BorrowerRiskRatingComponent implements OnInit {
  borrowerRiskRating: FormGroup;
  riskRating = ['Very High', 'High', 'Average', 'Moderate', 'Low', 'Very Low'];
  ratingData: Map<string, number> = new Map<string, number>();
  riskAverage = '';

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.borrowerRiskRating = this.formBuilder.group({
      management: [undefined, Validators.required],
      financialStatementQuality: [undefined, Validators.required],
      financialStatementSource: [undefined, Validators.required],
      industryTrend: [undefined, Validators.required],
      timeInBusiness: [undefined, Validators.required],
      collateral: [undefined, Validators.required],
      balanceSheetRatios: [undefined, Validators.required],
      pAndLHistory: [undefined, Validators.required],
      debtServiceCapacity: [undefined, Validators.required],
      salesTrade: [undefined, Validators.required],
      repaymentSource: [undefined, Validators.required],
      totalBrr: [undefined]
    });
  }

  checkRating(field, rating) {
    this.ratingData.set(field, rating);
    if (this.ratingData.size === 11) {
      let sum = 0;
      this.ratingData.forEach( value => {
        sum = sum + value;
      });
      const avg = sum / 11;
      this.riskAverage = avg.toFixed(2);
      this.borrowerRiskRating.get('totalBrr').setValue(this.riskAverage);
    }
  }

}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-borrower-risk-rating',
  templateUrl: './borrower-risk-rating.component.html',
  styleUrls: ['./borrower-risk-rating.component.scss']
})
export class BorrowerRiskRatingComponent implements OnInit {
  borrowerRiskRating: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
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
      repaymentSource: [undefined, Validators.required]
    });
  }

}

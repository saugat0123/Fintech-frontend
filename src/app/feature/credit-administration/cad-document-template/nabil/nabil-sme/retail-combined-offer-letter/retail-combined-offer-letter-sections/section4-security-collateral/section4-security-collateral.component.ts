import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section4-security-collateral',
  templateUrl: './section4-security-collateral.component.html',
  styleUrls: ['./section4-security-collateral.component.scss']
})
export class Section4SecurityCollateralComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfClient: [undefined],
      tenureOfFixedDeposit: [undefined],
      fixedDepositHolderName: [undefined],
      amountOfDeposit: [undefined],
      amountOfDepositInWords: [undefined],
      expiryDate: [undefined],
      receiptNum: [undefined],
      nameOfGuarantor: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined]
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-section3-security-and-collateral',
  templateUrl: './section3-security-and-collateral.component.html',
  styleUrls: ['./section3-security-and-collateral.component.scss']
})
export class Section3SecurityAndCollateralComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      otherBorrowingClientName: [undefined],
      nameOfMemberBank: [undefined],
      freeBankName: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      crossGuarantorName: [undefined],
      corporateGuarantorName: [undefined],
      guarantorName: [undefined],
      otherBankName: [undefined],
      nameOfAccoutHolder: [undefined],
      freeAccountHolderName: [undefined],
      accountNumber: [undefined],
      customerName: [undefined],
      freeCustomerName: [undefined],
      freeText1: [undefined],
      freeText2: [undefined],
      freeText3: [undefined],
      freeText4: [undefined],
      freeText5: [undefined],
    })
  }

}

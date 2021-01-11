import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {FormArray} from '@angular/forms';

@Component({
  selector: 'app-fees-commissions-view',
  templateUrl: './fees-commissions-view.component.html',
  styleUrls: ['./fees-commissions-view.component.scss']
})
export class FeesCommissionsViewComponent implements OnInit {
  @Input()
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  feeCommission;

  constructor() {
  }

  ngOnInit() {
    console.log(this.cadOfferLetterApprovedDoc.feesAndCommission);
    this.feeCommission = JSON.parse(this.cadOfferLetterApprovedDoc.feesAndCommission);
    console.log(this.feeCommission);
  }

  get totalFeeAmount() {
    let t = 0;
    this.feeCommission.feeAmountDetails.forEach(f => {
      (f.loanFeeDetails.forEach(l =>  t += Number(l.feeAmount))); });
    return t;
  }

}

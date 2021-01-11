import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-fees-commissions-view',
  templateUrl: './fees-commissions-view.component.html',
  styleUrls: ['./fees-commissions-view.component.scss']
})
export class FeesCommissionsViewComponent implements OnInit {
  @Input()
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

  feeCommission = [];

  constructor() {
  }

  ngOnInit() {
    this.feeCommission = JSON.parse(this.cadOfferLetterApprovedDoc.feesAndCommission);
  }

}

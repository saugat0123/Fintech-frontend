import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-udyamsil-karja-subsidy-print',
  templateUrl: './udyamsil-karja-subsidy-print.component.html',
  styleUrls: ['./udyamsil-karja-subsidy-print.component.scss']
})
export class UdyamsilKarjaSubsidyPrintComponent implements OnInit {
  @Input() offerData;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter;
  loanHolderInfo;
  offerLetterConst = NabilOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

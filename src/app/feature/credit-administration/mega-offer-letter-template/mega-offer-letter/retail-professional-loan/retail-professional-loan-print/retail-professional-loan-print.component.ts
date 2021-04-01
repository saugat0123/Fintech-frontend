import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-retail-professional-loan-print',
  templateUrl: './retail-professional-loan-print.component.html',
  styleUrls: ['./retail-professional-loan-print.component.scss']
})
export class RetailProfessionalLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  loanHolderInfo;
  offerLetterConst = MegaOfferLetterConst;
  loanTypeArray = ['Professional Term Loan', 'Professional Overdraft Loan'];
  proTermLoanSelected = false;
  proOverdraftLoanSelected = false;
  housingFinanceSelected = false;
  mortgageFinance = false;
  mortgageOverdraft = false;
  land;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }

}}




import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-sme-print',
  templateUrl: './sme-print.component.html',
  styleUrls: ['./sme-print.component.scss']
})
export class SmePrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  loanHolderInfo;
  offerLetterConst =  MegaOfferLetterConst;
  overdraft = false;
  demandLoan = false;
  fixedTermLoan = false;
  hirePurchase = false;
  letterOfCredit = false;
  trustReceipt = false;
  cashCredit = false;
  shortTermLoan = false;
  bankGuarantee = false;

  constructor() { }

  ngOnInit() {
    this.letter.loanTypeSelectedArray.forEach(loanType => {
      switch (loanType) {
        case 'Overdraft': this.overdraft = true;
        break;
        case 'DemandLoan': this.demandLoan = true;
        break;
        case 'FixedTermLoan': this.fixedTermLoan = true;
        break;
        case 'HirePurchase': this.hirePurchase = true;
          break;
        case 'LetterOfCredit': this.letterOfCredit = true;
          break;
        case 'TrustReceipt': this.trustReceipt = true;
          break;
        case 'CashCredit': this.cashCredit = true;
          break;
        case 'ShortTermLoan': this.shortTermLoan = true;
          break;
        case 'BankGuarantee': this.bankGuarantee = true;
          break;
      }
    });
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }

}

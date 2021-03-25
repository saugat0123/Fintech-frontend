import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-retail-housing-loan-print',
  templateUrl: './retail-housing-loan-print.component.html',
  styleUrls: ['./retail-housing-loan-print.component.scss']
})
export class RetailHousingLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  loanHolderInfo;
  offerLetterConst = MegaOfferLetterConst;
  housingFinanceSelected = false;
  mortgageFinance = false;
  mortgageOverdraft = false;
  constructor() { }

  ngOnInit() {
    console.log('this is cadOfferLetterApprovedDoc', this.cadOfferLetterApprovedDoc);
    this.letter.selectedArray.forEach(value => {
      switch (value) {
        case 'Housing Finance': this.housingFinanceSelected = true;
          break;
        case 'Mortgage Finance': this.mortgageFinance = true;
        break;
        case 'Mortgage Overdraft': this.mortgageOverdraft = true;
        break;

      }
    });
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
    console.log('this is caddoc all value', this.cadOfferLetterApprovedDoc.nepData);
  }

}

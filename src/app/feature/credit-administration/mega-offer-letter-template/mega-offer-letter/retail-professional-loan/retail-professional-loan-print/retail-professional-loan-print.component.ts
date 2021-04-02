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
  loanTypeArray = ['Professional Term Loan', 'Professional Overdraft Loan' ];
  proTermLoanSelected = false;
  proOverdraftLoanSelected = false;
  mortgageFinance = false;
  mortgageOverdraft = false;
  land;

  constructor() {
  }

  ngOnInit() {
        this.availableLoanType(this.letter['loanTypeSelectedArray']);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
    console.log(this.loanHolderInfo , 'Loan Data');
  }
  availableLoanType($event) {
    this.loanTypeArray.forEach( () => {
      $event.includes('Professional Term Loan') ? this.proTermLoanSelected = true : this.proTermLoanSelected = false;
      $event.includes('Professional Overdraft Loan') ? this.proOverdraftLoanSelected = true : this.proOverdraftLoanSelected = false;
    });
  }

}

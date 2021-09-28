import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-retail-professional-loan-print',
  templateUrl: './retail-professional-loan-print.component.html',
  styleUrls: ['./retail-professional-loan-print.component.scss']
})
export class RetailProfessionalLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() country;
  @Input() security;
  @Input() embassy;
  @Input() offerData;
  loanHolderInfo;
  offerLetterConst = NabilOfferLetterConst;
  proTermLoanSelected = false;
  mortgageOverdraft = false;
  land;
  selectedSecurity: string;
  selectedCountry: string;
  nameOfEmbassy: any;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;

  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe) {
  }

  ngOnInit() {
        this.selectedCountry = this.country;
        this.selectedSecurity = this.security;
        this.nameOfEmbassy = this.embassy;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.customerAddress =  this.loanHolderInfo.permanentMunicipality.np + '-' +
          this.loanHolderInfo.permanentWard.np + ', ' + this.loanHolderInfo.permanentDistrict.np + ' ,' +
          this.loanHolderInfo.permanentProvince.np + ' प्रदेश ';
      const guarantorDetails = this.cadOfferLetterApprovedDoc.loanHolder.guarantors;
      this.guarantorName = this.loanHolderInfo.guarantorDetails[0].guarantorName.np;
      this.branchName = this.cadOfferLetterApprovedDoc.loanHolder.branch.name;
    }
  }

}

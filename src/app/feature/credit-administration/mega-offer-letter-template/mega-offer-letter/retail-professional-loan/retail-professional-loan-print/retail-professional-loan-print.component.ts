import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

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
  @Input() preview = false;
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
  guarantorData;
  offerDocumentDetails;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  guarantorAmountNepali;
  finalName;
  dateOfApproval;
  dateOfApplication;
  dateofExpiry;
  autoRefNumber;
  fixedDepositVal;
  constructor( public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
               public engToNepNumberPipe: EngToNepaliNumberPipe,
               public currencyFormatPipe: CurrencyFormatterPipe,
               private datePipe: DatePipe,
               private engNepDatePipe: EngNepDatePipe) {
  }

  ngOnInit() {
    this.selectedCountry = !ObjectUtil.isEmpty(this.country) ? this.country :
        this.letter.selectedCountry ? this.letter.selectedCountry.en : '';
    this.selectedSecurity = !ObjectUtil.isEmpty(this.security) ?
        this.security : this.letter.selectedSecurity ? this.letter.selectedSecurity.en : '';
    this.nameOfEmbassy = !ObjectUtil.isEmpty(this.embassy) ? this.embassy :
        !ObjectUtil.isEmpty(this.letter.embassyName) ? this.letter.embassyName.ct : '';
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      if (!ObjectUtil.isEmpty(this.loanHolderInfo)) {
        this.customerAddress =  ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentMunicipality.ct)) ?
                this.loanHolderInfo.permanentMunicipality.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentWard.ct)) ?
                '-' + this.loanHolderInfo.permanentWard.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentDistrict.ct)) ?
                ', ' + this.loanHolderInfo.permanentDistrict.ct : '') +
            ((!ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince) &&
                !ObjectUtil.isEmpty(this.loanHolderInfo.permanentProvince.ct)) ?
                ' ,' + this.loanHolderInfo.permanentProvince.ct + ' प्रदेश ' : '');
      }
      if (!ObjectUtil.isEmpty(this.guarantorData)) {
        this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
      }
      this.branchName = this.loanHolderInfo.branch.ct;
      const dateOfApprovalType = this.letter.dateOfApprovalType ? this.letter.dateOfApprovalType.en : '';
      if (dateOfApprovalType === 'AD') {
        this.dateOfApproval = this.dateConversion(this.letter.dateOfApproval);
      } else {
        this.dateOfApproval = this.letter.dateOfApprovalNepali ? this.letter.dateOfApprovalNepali.en.nDate : '';
      }
      const dateOfApplicationType = this.letter.dateOfApplicationType ? this.letter.dateOfApplicationType.en : '';
      if (dateOfApplicationType === 'AD') {
        this.dateOfApplication = this.dateConversion(this.letter.dateOfApplication);
      } else {
        this.dateOfApplication = this.letter.dateOfApplicationNepali.en.nDate;
      }
      // if (!ObjectUtil.isEmpty(this.letter.dateofExpiry)) {
      //   this.dateofExpiry = this.dateConversion(this.letter.dateofExpiry);
      // }
      if (this.selectedSecurity === 'FIXED_DEPOSIT') {
        const dateOfExpiryType = this.letter.dateOfExpiryType ? this.letter.dateOfExpiryType.en : '';
        if (dateOfExpiryType === 'AD') {
          this.dateofExpiry = this.dateConversion(this.letter.dateofExpiry);
        } else {
          this.dateofExpiry = this.letter.dateofExpiryNepali ? this.letter.dateofExpiryNepali.en.nDate : '';
        }
        this.fixedDepositVal = this.letter.fixedDepositAmountFigure ?
            this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.letter.fixedDepositAmountFigure.en)) : '';
      }
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    this.guarantorDetails();
  }

  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
    }
    console.log('Guarantor Name:', this.finalName);
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      if (key === 'gurantedAmount') {
        const convertData = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(data[key].en));
        return convertData;
      } else {
        return data[key].ct;
      }
    } else {
      return data[key].en;
    }
  }

  dateConversion(controlVal) {
    let dateTemp;
    if (!ObjectUtil.isEmpty(controlVal.en)) {
      if (!ObjectUtil.isEmpty(controlVal.en.nDate)) {
        dateTemp = controlVal.en.nDate;
      } else {
        const date = this.datePipe.transform(controlVal.en);
        dateTemp = this.engNepDatePipe.transform(date, true);
      }
    }
    return dateTemp;
  }

}

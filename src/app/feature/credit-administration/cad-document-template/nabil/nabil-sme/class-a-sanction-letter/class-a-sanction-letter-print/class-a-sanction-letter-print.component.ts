import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-class-a-sanction-letter-print',
  templateUrl: './class-a-sanction-letter-print.component.html',
  styleUrls: ['./class-a-sanction-letter-print.component.scss']
})
export class ClassASanctionLetterPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() security: any;
  @Input() renewal: any;
  @Input() offerData;
  @Input() loanLimit;
  @Input() preview = false;
  loanHolderInfo;
  offerLetterConst = NabilOfferLetterConst;
  selectedSecurity;
  renewalVal = false;
  customerAddress;
  proposedAmount;
  guarantorName;
  branchName;
  guarantorData;
  offerDocumentDetails;
  autoRefNumber;
  guarantorNames: Array<String> = [];
  allguarantorNames;
  guarantorAmount: number = 0;
  guarantorAmountNepali;
  finalName;
  finalDateOfApproval;
  finalDateOfApplication;
  finalDateOfSanctionDate;
  finalDateOfSanction;
  finalDateOfExpiry;
  previousSanctionDate;
  autoRefNum;
  tempData;
  loanOptions;
  New;
  Existing;
  CoupenRateFinancing;
  BaseRateFinancing;
  isNatural;
  loanType;
  dateofExpiryPrint: any;
  freeTextVal;
  allHolderNames;
  holderFinalName;
  holderNames: any = [];
  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    // this.selectedSecurity = this.security;
    // this.renewalVal = this.letter.renewalChecked.en;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.customerAddress = this.loanHolderInfo.registeredMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.registeredDistrict.ct + ' ,' +
          this.loanHolderInfo.registeredProvince.ct;
      this.branchName = this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '';
      this.loanType = this.letter.loanType.ct;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ?
          JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.isNatural = this.tempData.naturalPersonCheck.en;
      if (!ObjectUtil.isEmpty(this.tempData)) {
        this.CoupenRateFinancing = this.tempData.CoupenRateFinancing ? this.tempData.CoupenRateFinancing.ct : '';
        this.BaseRateFinancing =  this.tempData.BaseRateFinancing ? this.tempData.BaseRateFinancing.ct : '';
      }}
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNum = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation)) {
      this.freeTextVal = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    }
    // for date of approval
    const sanctionLetterDate = this.letter.sanctionLetterDateType ? this.letter.sanctionLetterDateType.en : '';
    if (sanctionLetterDate === 'AD') {
      const templateDateSanctionDate = this.letter.sanctionLetterDate ? this.letter.sanctionLetterDate.en : '';
      this.finalDateOfSanctionDate = this.engToNepaliDate.transform(this.datePipe.transform(templateDateSanctionDate), true);
    } else {
      const templateDateSanctionDate = this.letter.sanctionLetterDateNepali ? this.letter.sanctionLetterDateNepali.en : '';
      this.finalDateOfSanctionDate = templateDateSanctionDate ? templateDateSanctionDate.nDate : '';
    }
    // For Date of Application:
    const dateOfApplication = this.letter.dateOfApplicationType ? this.letter.dateOfApplicationType.en : '';
    if (dateOfApplication === 'AD') {
      const templateDateApplication = this.letter.dateOfApplication ? this.letter.dateOfApplication.ct : '';
      this.finalDateOfApplication = templateDateApplication ? templateDateApplication : '';
    } else {
      const templateDateApplication = this.letter.dateOfApplicationNepali ? this.letter.dateOfApplicationNepali.en : '';
      this.finalDateOfApplication = templateDateApplication ? templateDateApplication.nDate : '';
    }
    // For Date of Expiry:
    const dateOfExpiry = this.letter.dateOfExpiryType ? this.letter.dateOfExpiryType.en : '';
    if (dateOfExpiry === 'AD') {
      const templateDateExpiry = this.letter.dateOfExpiry ? this.letter.dateOfExpiry.ct : '';
      this.finalDateOfExpiry = templateDateExpiry ? templateDateExpiry : '';
    } else {
      const templateDateExpiry = this.letter.dateOfExpiryNepali ? this.letter.dateOfExpiryNepali.en : '';
      this.finalDateOfExpiry = templateDateExpiry ? templateDateExpiry.nDate : '';
    }
    // For Previous Sanction:
    const previousSanctionDate = this.letter.previousSanctionType ? this.letter.previousSanctionType.en : '';
    if (previousSanctionDate === 'AD') {
      const templateDateSanction = this.letter.previousSanctionDate ? this.letter.previousSanctionDate.ct : '';
      this.finalDateOfSanction = templateDateSanction ? templateDateSanction : '';
    } else {
      const templateDateSanction = this.letter.previousSanctionDateNepali ? this.letter.previousSanctionDateNepali.en : '';
      this.finalDateOfSanction = templateDateSanction ? templateDateSanction.nDate : '';
    }
    this.getHolderDetails();
    // this.guarantorDetails();
  }

  getHolderDetails() {
    if (!ObjectUtil.isEmpty(this.tempData)) {
      if (!ObjectUtil.isEmpty(this.tempData.tdHolderNames)) {
        const len = this.tempData.tdHolderNames[0].tdholderNames;
        if (len.length > 0) {
          if (len.length === 1) {
            const temp = len[0].TdHolderCT;
            this.holderFinalName = temp;
          } else if (len.length === 2) {
            for (let i = 0; i < len.length; i++) {
              const temp = len[i].TdHolderCT;
              this.holderNames.push(temp);
            }
            this.allHolderNames = this.holderNames.join(' र ');
            this.holderFinalName = this.allHolderNames;
          } else {
            for (let i = 0; i < len.length - 1; i++) {
              const temp = len[i].TdHolderCT;
              this.holderNames.push(temp);
            }
            this.allHolderNames = this.holderNames.join(' , ');
            const temp1 = len[len.length - 1].TdHolderCT;
            this.holderFinalName = this.allHolderNames + ' र ' + temp1;
          }
          /*finalName.push(this.holderFinalName);
          this.holderFinalName = '';
          this.allHolderNames = '';
          this.holderNames = [];*/
        }
      }
    }
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      const tempGuarantorNep = JSON.parse(this.guarantorData[0].nepData);
      if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.guarantorName.ct;
      } else {
        // const temp = JSON.parse(this.guarantorData[0].nepData);
        this.finalName = tempGuarantorNep.authorizedPersonName.ct;
      }
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.guarantorName.ct);
        } else {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.authorizedPersonName.ct);
        }
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1; i++) {
        const tempGuarantorNep = JSON.parse(this.guarantorData[i].nepData);
        if (tempGuarantorNep.guarantorType.en === 'Personal Guarantor') {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.guarantorName.ct);
          // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
        } else {
          const temp = JSON.parse(this.guarantorData[i].nepData);
          this.guarantorNames.push(temp.authorizedPersonName.ct);
        }

      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      const temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName = this.allguarantorNames + ' र ' + temp1.authorizedPersonName.ct;
    }
  }
}


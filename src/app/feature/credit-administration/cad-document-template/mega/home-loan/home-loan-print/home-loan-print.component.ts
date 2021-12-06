import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";
import {HomeLoanType} from '../../../../cad-view/cad-constant/home-loan-type';

@Component({
  selector: 'app-home-loan-print',
  templateUrl: './home-loan-print.component.html',
  styleUrls: ['./home-loan-print.component.scss']
})
export class HomeLoanPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  @Input() offerData;
  @Input() loanLimit;
  @Input() preview = false;
  loanHolderInfo;
  guarantorName;
  guarantorData;
  branchName;
  proposedAmount;
  customerAddress;
  landbuilding;
  tempData;
  offerLetterConst = NabilOfferLetterConst;
  offerDocumentDetails;
  allguarantorNames;
  guarantorNames: Array<String> = [];
  finalName;
  autoRefNumber;
  dateOfApproval;
  dateOfApplication;
  homeLoanType = HomeLoanType;
  nepaliBranchNAme;
  selectedSecurity;
  insuranceAmount;

  constructor(public engToNepNumberPipe: EngToNepaliNumberPipe,
              public currencyFormatPipe: CurrencyFormatterPipe,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private datePipe: DatePipe,
              private engNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    console.log(this.letter);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.nepaliBranchNAme = this.cadOfferLetterApprovedDoc.loanHolder.branch.nepaliName + 'मा';
      let totalLoanAmount = 0;
      this.cadOfferLetterApprovedDoc.assignedLoan.forEach(value => {
        const val = value.proposal.proposedLimit;
        totalLoanAmount = totalLoanAmount + val;
      });
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
        this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
      }
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.proposedAmount = totalLoanAmount;
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      console.log('loan type', this.tempData.loanType);
      this.customerAddress =  this.loanHolderInfo.permanentMunicipality.ct + '-' +
          this.loanHolderInfo.permanentWard.ct + ', ' + this.loanHolderInfo.permanentDistrict.ct +
          ' ,' + this.loanHolderInfo.permanentProvince.ct;
      if (!ObjectUtil.isEmpty(this.guarantorData)) {
        this.guarantorName = this.guarantorParse(this.guarantorData[0].nepData, 'guarantorName');
      }
      this.branchName = this.loanHolderInfo.branch.ct;
      if (!ObjectUtil.isEmpty(this.letter.loan.dateOfApproval)) {
        this.dateOfApproval = this.engNepDatePipe.transform(this.datePipe.transform(this.tempData.loan.dateOfApproval), true);
      } else {
        this.dateOfApproval = this.letter.loan.dateOfApprovalCT;
      }
      if (!ObjectUtil.isEmpty(this.letter.loan.dateOfApplication)) {
        this.dateOfApplication = this.engNepDatePipe.transform(this.datePipe.transform(this.tempData.loan.dateOfApplication), true);
      } else {
        this.dateOfApplication = this.letter.loan.dateOfApplicationCT;
      }
      this.selectedSecurity = this.letter.loan ? this.letter.loan.landBuildingType : '';
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      // tslint:disable-next-line:max-line-length
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc.offerDocumentList[0] ? JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation) : '';
    }
    if (this.tempData.loanType === this.homeLoanType.PURCHASE || this.tempData.loanType === this.homeLoanType.TAKE_OVER) {
      this.landbuilding = this.tempData.loan.landBuildingType;
    }
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    this.guarantorDetails();
    const tempInsuranceAmount = this.letter.loan ? this.letter.loan.insuranceAmountInFigure : '';
    if (!ObjectUtil.isEmpty(tempInsuranceAmount)) {
      this.insuranceAmount = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(tempInsuranceAmount.toString()));
    }
  }
  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      return data[key].ct;
    } else {
      return data[key].en;
    }
  }
  guarantorDetails() {
    if (this.guarantorData.length === 1) {
      let temp = JSON.parse(this.guarantorData[0].nepData);
      this.finalName =  temp.guarantorName.ct;
    } else if (this.guarantorData.length === 2) {
      for (let i = 0; i < this.guarantorData.length; i++) {
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' र ');
      this.finalName = this.allguarantorNames;
    } else {
      for (let i = 0; i < this.guarantorData.length - 1 ; i++) {
        let temp = JSON.parse(this.guarantorData[i].nepData);
        this.guarantorNames.push(temp.guarantorName.ct);
        // this.guarantorAmount = this.guarantorAmount + parseFloat(temp.gurantedAmount.en) ;
      }
      // this.guarantorAmountNepali = this.engToNepNumberPipe.transform(this.currencyFormatPipe.transform(this.guarantorAmount));
      this.allguarantorNames = this.guarantorNames.join(' , ');
      let temp1 = JSON.parse(this.guarantorData[this.guarantorData.length - 1].nepData);
      this.finalName =  this.allguarantorNames + ' र ' + temp1.guarantorName.ct;
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


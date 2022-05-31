import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-common-section-bottom-print',
  templateUrl: './common-section-bottom-print.component.html',
  styleUrls: ['./common-section-bottom-print.component.scss']
})
export class CommonSectionBottomPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  @Input() customerApprovedDoc;
  @Input() freeText;
  @Input() letter;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  loanHolderInfo;
  branchName;
  tempData;
  freeInformation;
  isNaturalPerson;
  isSubsidyOrAgricultureLoan = false;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.branchName = this.loanHolderInfo.branch.ct;
    }
    this.isNaturalPerson = this.tempData.smeGlobalForm.borrowerNaturalPerson;
    // isSubsidyOrAgriculture
    const tempD = this.tempData;
    if (!ObjectUtil.isEmpty(tempD)) {
      this.isSubsidyOrAgricultureLoan = this.checkSubsidyOrAgriculture(tempD);
    }
  }
  checkSubsidyOrAgriculture(tempD) {
    if ((!ObjectUtil.isEmpty(tempD.importLoanTrust) && tempD.importLoanTrust.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.revolvingShortTermLoan) && tempD.revolvingShortTermLoan.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.demandLoanForm) && tempD.demandLoanForm.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.overdraftLoanForm) && tempD.overdraftLoanForm.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.equityMortgaged) && tempD.equityMortgaged.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.overdraftFixedForm) && tempD.overdraftFixedForm.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.overDraftFacilityForm) && tempD.overDraftFacilityForm.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.termLoanForm) && tempD.termLoanForm.subsidyOrAgricultureLoan === 'Yes') ||
        (!ObjectUtil.isEmpty(tempD.mortgageEquityTermForm) && tempD.mortgageEquityTermForm.subsidyOrAgricultureLoan === 'Yes')) {
      return true;
    } else {
      return false;
    }
  }
}

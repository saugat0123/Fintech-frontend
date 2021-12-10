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
  constructor() { }

  ngOnInit() {
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.branchName = this.loanHolderInfo.branch.ct;
    }
  }
}

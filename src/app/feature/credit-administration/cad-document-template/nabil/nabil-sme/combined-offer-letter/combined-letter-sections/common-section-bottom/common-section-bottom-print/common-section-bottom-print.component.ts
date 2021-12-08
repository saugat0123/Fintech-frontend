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
  @Input() letter;
  form: FormGroup;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;
  position = 'सम्पर्क अधिकृत';
  position1 = 'सम्पर्क प्रबन्धक';
  loanHolderInfo;
  branchName;
  tempData;
  freeInformation: any;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {NabilOfferLetterConst} from '../../../../../../../nabil-offer-letter-const';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-common-section-bottom-print',
  templateUrl: './common-section-bottom-print.component.html',
  styleUrls: ['./common-section-bottom-print.component.scss']
})
export class CommonSectionBottomPrintComponent implements OnInit {
  @Input() customerApprovedDoc;
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
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
    }
    this.freeInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
  }
}

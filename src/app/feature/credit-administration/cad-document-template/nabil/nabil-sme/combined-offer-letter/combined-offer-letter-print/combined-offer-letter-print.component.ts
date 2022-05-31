import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";
import {ObjectUtil} from "../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-combined-offer-letter-print',
  templateUrl: './combined-offer-letter-print.component.html',
  styleUrls: ['./combined-offer-letter-print.component.scss']
})
export class CombinedOfferLetterPrintComponent implements OnInit {
  @Input() customerApprovedDoc;
  offerLetterConst = NabilOfferLetterConst;
  letterData: any;
  freeText: any;
  @Input() preview;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.letterData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.freeText = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
    }
  }

}

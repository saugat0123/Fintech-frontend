import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-kisan-karja-subsidy-print',
  templateUrl: './kisan-karja-subsidy-print.component.html',
  styleUrls: ['./kisan-karja-subsidy-print.component.scss']
})
export class KisanKarjaSubsidyPrintComponent implements OnInit {
  offerLetterConst = NabilOfferLetterConst;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letterData;
  @Input() offerData;
  autoRefNumber;

  constructor() { }

  ngOnInit() {
    console.log('This is offer data:', this.offerData);

    console.log('This is letter data:', this.letterData);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      this.autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
  }

}

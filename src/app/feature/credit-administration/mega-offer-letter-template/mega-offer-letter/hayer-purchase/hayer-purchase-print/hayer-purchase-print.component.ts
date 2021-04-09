import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-hayer-purchase-print',
  templateUrl: './hayer-purchase-print.component.html',
  styleUrls: ['./hayer-purchase-print.component.scss']
})
export class HayerPurchasePrintComponent implements OnInit {
  offerLetterConst = MegaOfferLetterConst;
  @Input() loan;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  loanHolderInfo;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }

}

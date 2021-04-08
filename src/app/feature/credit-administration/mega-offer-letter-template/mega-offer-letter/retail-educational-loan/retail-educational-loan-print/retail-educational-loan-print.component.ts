import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-retail-educational-loan-print',
  templateUrl: './retail-educational-loan-print.component.html',
  styleUrls: ['./retail-educational-loan-print.component.scss']
})
export class RetailEducationalLoanPrintComponent implements OnInit {
@Input() letter;
@Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
loanHolderInfo;

offerLetterConst = MegaOfferLetterConst;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }

}

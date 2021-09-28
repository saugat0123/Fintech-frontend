import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-personal-loan-and-personal-overdraft-print',
  templateUrl: './personal-loan-and-personal-overdraft-print.component.html',
  styleUrls: ['./personal-loan-and-personal-overdraft-print.component.scss']
})
export class PersonalLoanAndPersonalOverdraftPrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() letter: any;
  loanHolderInfo;
  offerLetterConst = MegaOfferLetterConst;

  constructor() {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {CustomerType} from '../../../../../customer/model/customerType';

@Component({
  selector: 'app-letter-of-set-off-print',
  templateUrl: './letter-of-set-off-print.component.html',
  styleUrls: ['./letter-of-set-off-print.component.scss']
})
export class LetterOfSetOffPrintComponent implements OnInit {
  @Input() letterData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = NabilDocumentChecklist;
  customerType = CustomerType;
  constructor() { }

  ngOnInit() {
    console.log(this.letterData);
  }

}

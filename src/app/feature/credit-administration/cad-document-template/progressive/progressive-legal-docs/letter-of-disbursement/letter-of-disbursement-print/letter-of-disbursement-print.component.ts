import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-disbursement-print',
  templateUrl: './letter-of-disbursement-print.component.html',
  styleUrls: ['./letter-of-disbursement-print.component.scss']
})
export class LetterOfDisbursementPrintComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  loanData;

  constructor() {
  }

  ngOnInit() {
    this.loanData = this.cadData.loanHolder;
  }
}

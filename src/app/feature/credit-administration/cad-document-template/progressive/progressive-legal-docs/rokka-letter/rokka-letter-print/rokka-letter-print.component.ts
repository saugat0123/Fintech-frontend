import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-rokka-letter-print',
  templateUrl: './rokka-letter-print.component.html',
  styleUrls: ['./rokka-letter-print.component.scss']
})
export class RokkaLetterPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = ProgressiveLegalDocConst;
  loanData;

  constructor() { }

  ngOnInit() {
    this.loanData = this.cadData.loanHolder;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-indemnity-deed-print',
  templateUrl: './indemnity-deed-print.component.html',
  styleUrls: ['./indemnity-deed-print.component.scss']
})
export class IndemnityDeedPrintComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() printDocForm;
  @Input() loanCat;
  offerLetterConst = ProgressiveLegalDocConst;
  loanData;
  constructor() {
  }

  ngOnInit() {
    this.loanData = this.cadData.loanHolder;
  }

}

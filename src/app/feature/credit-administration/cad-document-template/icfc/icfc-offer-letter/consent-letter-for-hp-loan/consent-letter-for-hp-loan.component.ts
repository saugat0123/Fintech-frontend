import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-consent-letter-for-hp-loan',
  templateUrl: './consent-letter-for-hp-loan.component.html',
  styleUrls: ['./consent-letter-for-hp-loan.component.scss']
})
export class ConsentLetterForHpLoanComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

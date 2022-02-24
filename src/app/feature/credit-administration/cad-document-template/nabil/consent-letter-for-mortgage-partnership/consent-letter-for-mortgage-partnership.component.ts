import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-consent-letter-for-mortgage-partnership',
  templateUrl: './consent-letter-for-mortgage-partnership.component.html',
  styleUrls: ['./consent-letter-for-mortgage-partnership.component.scss']
})
export class ConsentLetterForMortgagePartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

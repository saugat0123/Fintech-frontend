import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-consent-letter-for-mortgage-proprietorship',
  templateUrl: './consent-letter-for-mortgage-proprietorship.component.html',
  styleUrls: ['./consent-letter-for-mortgage-proprietorship.component.scss']
})
export class ConsentLetterForMortgageProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;
  constructor() { }

  ngOnInit() {
  }

}

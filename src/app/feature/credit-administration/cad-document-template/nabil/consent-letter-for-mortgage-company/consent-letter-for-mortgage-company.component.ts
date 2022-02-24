import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-consent-letter-for-mortgage-company',
  templateUrl: './consent-letter-for-mortgage-company.component.html',
  styleUrls: ['./consent-letter-for-mortgage-company.component.scss']
})
export class ConsentLetterForMortgageCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

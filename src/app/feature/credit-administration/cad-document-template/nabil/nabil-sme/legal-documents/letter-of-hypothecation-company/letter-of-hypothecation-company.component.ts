import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-letter-of-hypothecation-company',
  templateUrl: './letter-of-hypothecation-company.component.html',
  styleUrls: ['./letter-of-hypothecation-company.component.scss']
})
export class LetterOfHypothecationCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

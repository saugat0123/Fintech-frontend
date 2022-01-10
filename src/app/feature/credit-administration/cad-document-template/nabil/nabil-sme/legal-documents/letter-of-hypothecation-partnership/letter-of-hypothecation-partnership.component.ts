import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: 'app-letter-of-hypothecation-partnership',
  templateUrl: './letter-of-hypothecation-partnership.component.html',
  styleUrls: ['./letter-of-hypothecation-partnership.component.scss']
})
export class LetterOfHypothecationPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

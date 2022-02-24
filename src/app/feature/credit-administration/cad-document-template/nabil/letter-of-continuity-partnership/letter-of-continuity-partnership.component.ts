import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-continuity-partnership',
  templateUrl: './letter-of-continuity-partnership.component.html',
  styleUrls: ['./letter-of-continuity-partnership.component.scss']
})
export class LetterOfContinuityPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

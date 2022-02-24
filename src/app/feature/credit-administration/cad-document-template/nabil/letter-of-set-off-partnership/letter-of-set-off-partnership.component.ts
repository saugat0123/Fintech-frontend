import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-set-off-partnership',
  templateUrl: './letter-of-set-off-partnership.component.html',
  styleUrls: ['./letter-of-set-off-partnership.component.scss']
})
export class LetterOfSetOffPartnershipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

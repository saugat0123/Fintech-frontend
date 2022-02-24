import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-set-off-company',
  templateUrl: './letter-of-set-off-company.component.html',
  styleUrls: ['./letter-of-set-off-company.component.scss']
})
export class LetterOfSetOffCompanyComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

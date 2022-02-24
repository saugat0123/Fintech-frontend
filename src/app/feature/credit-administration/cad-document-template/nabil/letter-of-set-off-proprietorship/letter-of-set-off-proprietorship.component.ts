import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-set-off-proprietorship',
  templateUrl: './letter-of-set-off-proprietorship.component.html',
  styleUrls: ['./letter-of-set-off-proprietorship.component.scss']
})
export class LetterOfSetOffProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

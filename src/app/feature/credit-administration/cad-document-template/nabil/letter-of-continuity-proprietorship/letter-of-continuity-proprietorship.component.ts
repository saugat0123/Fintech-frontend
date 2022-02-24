import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-of-continuity-proprietorship',
  templateUrl: './letter-of-continuity-proprietorship.component.html',
  styleUrls: ['./letter-of-continuity-proprietorship.component.scss']
})
export class LetterOfContinuityProprietorshipComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() documentId: number;
  @Input() customerLoanId: number;

  constructor() { }

  ngOnInit() {
  }

}

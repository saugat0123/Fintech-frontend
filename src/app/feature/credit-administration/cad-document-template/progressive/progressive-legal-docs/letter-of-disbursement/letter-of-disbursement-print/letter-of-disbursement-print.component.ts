import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-disbursement-print',
  templateUrl: './letter-of-disbursement-print.component.html',
  styleUrls: ['./letter-of-disbursement-print.component.scss']
})
export class LetterOfDisbursementPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

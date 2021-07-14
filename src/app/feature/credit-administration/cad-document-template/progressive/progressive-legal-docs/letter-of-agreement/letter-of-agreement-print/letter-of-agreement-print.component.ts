import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-agreement-print',
  templateUrl: './letter-of-agreement-print.component.html',
  styleUrls: ['./letter-of-agreement-print.component.scss']
})
export class LetterOfAgreementPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

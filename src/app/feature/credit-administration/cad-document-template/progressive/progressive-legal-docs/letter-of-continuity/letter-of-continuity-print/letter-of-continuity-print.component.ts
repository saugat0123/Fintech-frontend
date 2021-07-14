import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-continuity-print',
  templateUrl: './letter-of-continuity-print.component.html',
  styleUrls: ['./letter-of-continuity-print.component.scss']
})
export class LetterOfContinuityPrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

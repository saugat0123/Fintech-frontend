import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-continuity-institutional-print',
  templateUrl: './letter-of-continuity-institutional-print.component.html',
  styleUrls: ['./letter-of-continuity-institutional-print.component.scss']
})
export class LetterOfContinuityInstitutionalPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-lein-print',
  templateUrl: './letter-of-lein-print.component.html',
  styleUrls: ['./letter-of-lein-print.component.scss']
})
export class LetterOfLeinPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

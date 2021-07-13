import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-arrangements-print',
  templateUrl: './letter-of-arrangements-print.component.html',
  styleUrls: ['./letter-of-arrangements-print.component.scss']
})
export class LetterOfArrangementsPrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-letter-of-confession-print',
  templateUrl: './letter-of-confession-print.component.html',
  styleUrls: ['./letter-of-confession-print.component.scss']
})
export class LetterOfConfessionPrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() { }

  ngOnInit() {
  }

}

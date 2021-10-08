import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from "../../progressive-legal-doc-const";

@Component({
  selector: 'app-rokka-letter-print',
  templateUrl: './rokka-letter-print.component.html',
  styleUrls: ['./rokka-letter-print.component.scss']
})
export class RokkaLetterPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from "../../progressive-legal-doc-const";

@Component({
  selector: 'app-consent-letter-individual-print',
  templateUrl: './consent-letter-individual-print.component.html',
  styleUrls: ['./consent-letter-individual-print.component.scss']
})
export class ConsentLetterIndividualPrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() { }

  ngOnInit() {
  }

}

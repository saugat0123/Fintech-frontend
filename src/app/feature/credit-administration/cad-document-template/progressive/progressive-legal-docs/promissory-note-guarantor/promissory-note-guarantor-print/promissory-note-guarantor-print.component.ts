import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from '../../progressive-legal-doc-const';

@Component({
  selector: 'app-promissory-note-guarantor-print',
  templateUrl: './promissory-note-guarantor-print.component.html',
  styleUrls: ['./promissory-note-guarantor-print.component.scss']
})
export class PromissoryNoteGuarantorPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor() {
  }

  ngOnInit() {
  }

}

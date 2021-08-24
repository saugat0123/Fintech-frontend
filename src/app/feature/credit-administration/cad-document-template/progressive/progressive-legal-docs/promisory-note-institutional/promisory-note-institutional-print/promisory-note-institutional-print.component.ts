import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveLegalDocConst} from "../../progressive-legal-doc-const";

@Component({
  selector: 'app-promisory-note-institutional-print',
  templateUrl: './promisory-note-institutional-print.component.html',
  styleUrls: ['./promisory-note-institutional-print.component.scss']
})
export class PromisoryNoteInstitutionalPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveLegalDocConst;
  constructor() { }

  ngOnInit() {
  }

}

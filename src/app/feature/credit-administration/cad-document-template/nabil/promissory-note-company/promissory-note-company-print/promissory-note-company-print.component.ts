import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-promissory-note-company-print',
  templateUrl: './promissory-note-company-print.component.html',
  styleUrls: ['./promissory-note-company-print.component.scss']
})
export class PromissoryNoteCompanyPrintComponent implements OnInit {
  @Input() letterData;
  promissoryConst = NabilDocumentChecklist;
  constructor() { }

  ngOnInit() {
  }

}

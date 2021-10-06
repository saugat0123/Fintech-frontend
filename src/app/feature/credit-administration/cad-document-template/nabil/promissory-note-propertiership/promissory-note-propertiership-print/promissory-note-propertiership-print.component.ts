import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-promissory-note-propertiership-print',
  templateUrl: './promissory-note-propertiership-print.component.html',
  styleUrls: ['./promissory-note-propertiership-print.component.scss']
})
export class PromissoryNotePropertiershipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

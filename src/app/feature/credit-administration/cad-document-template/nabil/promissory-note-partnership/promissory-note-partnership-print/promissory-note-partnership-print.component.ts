import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-promissory-note-partnership-print',
  templateUrl: './promissory-note-partnership-print.component.html',
  styleUrls: ['./promissory-note-partnership-print.component.scss']
})
export class PromissoryNotePartnershipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;
  constructor() { }

  ngOnInit() {
  }

}

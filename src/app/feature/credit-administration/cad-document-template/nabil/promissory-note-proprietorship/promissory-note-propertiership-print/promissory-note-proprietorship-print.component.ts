import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-promissory-note-proprietorship-print',
  templateUrl: './promissory-note-proprietorship-print.component.html',
  styleUrls: ['./promissory-note-proprietorship-print.component.scss']
})
export class PromissoryNoteProprietorshipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

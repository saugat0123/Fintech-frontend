import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-promissory-note-individual-print',
  templateUrl: './promissory-note-individual-print.component.html',
  styleUrls: ['./promissory-note-individual-print.component.scss']
})
export class PromissoryNoteIndividualPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

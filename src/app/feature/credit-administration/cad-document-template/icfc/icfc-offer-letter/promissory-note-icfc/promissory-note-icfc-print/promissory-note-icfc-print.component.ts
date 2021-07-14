import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-promissory-note-icfc-print',
  templateUrl: './promissory-note-icfc-print.component.html',
  styleUrls: ['./promissory-note-icfc-print.component.scss']
})
export class PromissoryNoteIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

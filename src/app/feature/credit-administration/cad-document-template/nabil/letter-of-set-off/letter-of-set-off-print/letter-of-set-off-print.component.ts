import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-letter-of-set-off-print',
  templateUrl: './letter-of-set-off-print.component.html',
  styleUrls: ['./letter-of-set-off-print.component.scss']
})
export class LetterOfSetOffPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

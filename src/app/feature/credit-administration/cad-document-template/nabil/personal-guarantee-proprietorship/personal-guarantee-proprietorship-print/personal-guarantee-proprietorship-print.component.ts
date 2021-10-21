import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-personal-guarantee-proprietorship-print',
  templateUrl: './personal-guarantee-proprietorship-print.component.html',
  styleUrls: ['./personal-guarantee-proprietorship-print.component.scss']
})
export class PersonalGuaranteeProprietorshipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

import { Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-loan-deed-partnership-print',
  templateUrl: './loan-deed-partnership-print.component.html',
  styleUrls: ['./loan-deed-partnership-print.component.scss']
})
export class LoanDeedPartnershipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

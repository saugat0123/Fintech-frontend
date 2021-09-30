import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-loan-deed-company-print',
  templateUrl: './loan-deed-company-print.component.html',
  styleUrls: ['./loan-deed-company-print.component.scss']
})
export class LoanDeedCompanyPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';

@Component({
  selector: 'app-loan-deed-individual-print',
  templateUrl: './loan-deed-individual-print.component.html',
  styleUrls: ['./loan-deed-individual-print.component.scss']
})
export class LoanDeedIndividualPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

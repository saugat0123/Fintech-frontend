import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-consent-letter-for-hp-loan-print',
  templateUrl: './consent-letter-for-hp-loan-print.component.html',
  styleUrls: ['./consent-letter-for-hp-loan-print.component.scss']
})
export class ConsentLetterForHpLoanPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() {
  }

  ngOnInit() {
  }

}

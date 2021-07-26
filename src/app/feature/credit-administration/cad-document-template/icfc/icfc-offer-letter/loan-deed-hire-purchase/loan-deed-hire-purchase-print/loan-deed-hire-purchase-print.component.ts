import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-hire-purchase-print',
  templateUrl: './loan-deed-hire-purchase-print.component.html',
  styleUrls: ['./loan-deed-hire-purchase-print.component.scss']
})
export class LoanDeedHirePurchasePrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;
  constructor() { }

  ngOnInit() {
  }

}

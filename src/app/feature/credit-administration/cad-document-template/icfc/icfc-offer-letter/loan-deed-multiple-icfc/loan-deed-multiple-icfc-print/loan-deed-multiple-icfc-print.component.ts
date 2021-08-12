import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-multiple-icfc-print',
  templateUrl: './loan-deed-multiple-icfc-print.component.html',
  styleUrls: ['./loan-deed-multiple-icfc-print.component.scss']
})
export class LoanDeedMultipleIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

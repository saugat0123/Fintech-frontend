import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-company-icfc-print',
  templateUrl: './loan-deed-company-icfc-print.component.html',
  styleUrls: ['./loan-deed-company-icfc-print.component.scss']
})
export class LoanDeedCompanyIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

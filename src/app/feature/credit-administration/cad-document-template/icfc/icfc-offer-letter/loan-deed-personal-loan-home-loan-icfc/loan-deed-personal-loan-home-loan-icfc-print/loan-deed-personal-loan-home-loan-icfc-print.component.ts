import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-loan-deed-personal-loan-home-loan-icfc-print',
  templateUrl: './loan-deed-personal-loan-home-loan-icfc-print.component.html',
  styleUrls: ['./loan-deed-personal-loan-home-loan-icfc-print.component.scss']
})
export class LoanDeedPersonalLoanHomeLoanIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-margin-call-deed-share-loan-print',
  templateUrl: './margin-call-deed-share-loan-print.component.html',
  styleUrls: ['./margin-call-deed-share-loan-print.component.scss']
})
export class MarginCallDeedShareLoanPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;


  constructor() { }

  ngOnInit() {
    console.log('This is doc file', this.letter.shareLoan);
  }

}
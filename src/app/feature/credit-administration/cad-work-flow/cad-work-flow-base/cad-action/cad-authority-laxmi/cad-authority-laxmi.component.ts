import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../loan/model/loanData';

@Component({
  selector: 'app-cad-authority-laxmi',
  templateUrl: './cad-authority-laxmi.component.html',
  styleUrls: ['./cad-authority-laxmi.component.scss']
})
export class CadAuthorityLaxmiComponent implements OnInit {

  @Input() cadOfferLetterApprovedDoc;
  loanData;
  constructor() { }
  ngOnInit() {
    console.log('this is cad', this.cadOfferLetterApprovedDoc);
    this.loanData = this.cadOfferLetterApprovedDoc.assignedLoan[0].customerInfo;
    console.log('this is cloan data', this.loanData);
  }

}

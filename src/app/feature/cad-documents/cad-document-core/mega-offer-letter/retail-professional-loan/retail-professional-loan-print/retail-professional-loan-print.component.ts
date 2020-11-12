import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';

@Component({
  selector: 'app-retail-professional-loan-print',
  templateUrl: './retail-professional-loan-print.component.html',
  styleUrls: ['./retail-professional-loan-print.component.scss']
})
export class RetailProfessionalLoanPrintComponent implements OnInit {
  @Input()
  letter: any;
  offerLetterConst = MegaOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

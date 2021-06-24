import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-personal-term-loan-print',
  templateUrl: './personal-term-loan-print.component.html',
  styleUrls: ['./personal-term-loan-print.component.scss']
})
export class PersonalTermLoanPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-bank-guarantee-print',
  templateUrl: './bank-guarantee-print.component.html',
  styleUrls: ['./bank-guarantee-print.component.scss']
})
export class BankGuaranteePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

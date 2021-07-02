import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-loan-deed-single-icfc-print',
  templateUrl: './loan-deed-single-icfc-print.component.html',
  styleUrls: ['./loan-deed-single-icfc-print.component.scss']
})
export class LoanDeedSingleIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

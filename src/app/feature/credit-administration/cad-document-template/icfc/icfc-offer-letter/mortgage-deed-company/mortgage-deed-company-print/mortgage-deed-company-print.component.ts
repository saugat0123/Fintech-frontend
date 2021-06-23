import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-mortgage-deed-company-print',
  templateUrl: './mortgage-deed-company-print.component.html',
  styleUrls: ['./mortgage-deed-company-print.component.scss']
})
export class MortgageDeedCompanyPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

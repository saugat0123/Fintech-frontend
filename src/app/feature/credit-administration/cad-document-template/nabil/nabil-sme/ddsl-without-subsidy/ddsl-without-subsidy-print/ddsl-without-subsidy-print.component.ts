import {Component, Input, OnInit} from '@angular/core';
import {NabilOfferLetterConst} from '../../../../../nabil-offer-letter-const';

@Component({
  selector: 'app-ddsl-without-subsidy-print',
  templateUrl: './ddsl-without-subsidy-print.component.html',
  styleUrls: ['./ddsl-without-subsidy-print.component.scss']
})
export class DdslWithoutSubsidyPrintComponent implements OnInit {
  @Input() ddslData;
  offerLetterConst = NabilOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}

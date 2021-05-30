import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter-const';
@Component({
  selector: 'app-letter-of-installments-print',
  templateUrl: './letter-of-installments-print.component.html',
  styleUrls: ['./letter-of-installments-print.component.scss']
})
export class LetterOfInstallmentsPrintComponent implements OnInit {

  @Input()
  printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}

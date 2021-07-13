import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../progressive-offer-letter/progressive-offer-letter-const';

@Component({
  selector: 'app-guarantee-bond-personal-print',
  templateUrl: './guarantee-bond-personal-print.component.html',
  styleUrls: ['./guarantee-bond-personal-print.component.scss']
})
export class GuaranteeBondPersonalPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}

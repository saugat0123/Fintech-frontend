import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-guarantee-bond-corporate-print',
  templateUrl: './guarantee-bond-corporate-print.component.html',
  styleUrls: ['./guarantee-bond-corporate-print.component.scss']
})
export class GuaranteeBondCorporatePrintComponent implements OnInit {

  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}

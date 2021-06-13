import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from "../../../progressive-offer-letter-const";

@Component({
  selector: 'app-cross-guarantee-bond-print',
  templateUrl: './cross-guarantee-bond-print.component.html',
  styleUrls: ['./cross-guarantee-bond-print.component.scss']
})
export class CrossGuaranteeBondPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = ProgressiveOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

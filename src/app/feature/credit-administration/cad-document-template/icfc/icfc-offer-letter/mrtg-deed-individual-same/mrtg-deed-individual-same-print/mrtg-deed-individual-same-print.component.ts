import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-mrtg-deed-individual-same-print',
  templateUrl: './mrtg-deed-individual-same-print.component.html',
  styleUrls: ['./mrtg-deed-individual-same-print.component.scss']
})
export class MrtgDeedIndividualSamePrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

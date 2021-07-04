import {Component, Input, OnInit} from '@angular/core';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';

@Component({
  selector: 'app-mrtg-deed-individual-different-print',
  templateUrl: './mrtg-deed-individual-different-print.component.html',
  styleUrls: ['./mrtg-deed-individual-different-print.component.scss']
})
export class MrtgDeedIndividualDifferentPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = IcfcOfferLetterConst;

  constructor() { }

  ngOnInit() {
  }

}

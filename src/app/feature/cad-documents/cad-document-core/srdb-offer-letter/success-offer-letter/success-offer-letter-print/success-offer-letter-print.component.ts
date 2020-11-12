import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-success-offer-letter-print',
  templateUrl: './success-offer-letter-print.component.html',
  styleUrls: ['./success-offer-letter-print.component.scss']
})
export class SuccessOfferLetterPrintComponent implements OnInit {
  @Input()
  letter: any;

  constructor() {
  }

  ngOnInit() {
  }

}

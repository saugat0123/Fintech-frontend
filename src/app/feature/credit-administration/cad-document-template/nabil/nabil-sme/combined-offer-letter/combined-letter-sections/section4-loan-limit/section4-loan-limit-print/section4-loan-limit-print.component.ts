import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section4-loan-limit-print',
  templateUrl: './section4-loan-limit-print.component.html',
  styleUrls: ['./section4-loan-limit-print.component.scss']
})
export class Section4LoanLimitPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}

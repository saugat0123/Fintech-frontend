import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section5-interest-penal-charge-print',
  templateUrl: './section5-interest-penal-charge-print.component.html',
  styleUrls: ['./section5-interest-penal-charge-print.component.scss']
})
export class Section5InterestPenalChargePrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}

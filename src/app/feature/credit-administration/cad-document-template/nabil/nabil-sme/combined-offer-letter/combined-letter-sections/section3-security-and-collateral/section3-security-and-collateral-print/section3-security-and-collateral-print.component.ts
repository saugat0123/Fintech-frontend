import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section3-security-and-collateral-print',
  templateUrl: './section3-security-and-collateral-print.component.html',
  styleUrls: ['./section3-security-and-collateral-print.component.scss']
})
export class Section3SecurityAndCollateralPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-guarantor-summary',
  templateUrl: './guarantor-summary.component.html',
  styleUrls: ['./guarantor-summary.component.scss']
})
export class GuarantorSummaryComponent implements OnInit {
  @Input() guarantorData;
  constructor() { }

  ngOnInit() {
  }

}

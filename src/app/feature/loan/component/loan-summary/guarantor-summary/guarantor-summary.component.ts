import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {SummaryType} from '../../SummaryType';

@Component({
  selector: 'app-guarantor-summary',
  templateUrl: './guarantor-summary.component.html',
  styleUrls: ['./guarantor-summary.component.scss']
})
export class GuarantorSummaryComponent implements OnInit {
  @Input() guarantorData;
  @Input() loanCategory;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;
  constructor() { }

  ngOnInit() {
    console.log('LoanCategory:::', this.loanCategory);
  }

}

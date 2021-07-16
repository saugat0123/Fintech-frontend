import {Component, Input, OnInit} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {SummaryType} from '../../loan/component/SummaryType';

@Component({
  selector: 'app-insurance-view',
  templateUrl: './insurance-view.component.html',
  styleUrls: ['./insurance-view.component.scss']
})
export class InsuranceViewComponent implements OnInit {
  @Input() insurance;
  @Input() loanCategory;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  constructor() {
  }

  ngOnInit() {
  }

}

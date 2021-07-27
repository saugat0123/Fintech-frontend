import {Component, Input, OnInit} from '@angular/core';
import {Insurance} from '../../../../admin/modal/insurance';
import {environment} from '../../../../../../environments/environment';
import {SummaryType} from '../../SummaryType';

@Component({
  selector: 'app-insurance-summary',
  templateUrl: './insurance-summary.component.html',
  styleUrls: ['./insurance-summary.component.scss']
})
export class InsuranceSummaryComponent implements OnInit {
  @Input() insurance: Array<Insurance>;
  @Input() loanCategory;
  @Input() loanSummary;
  summaryType = environment.summaryType;
  summaryTypeName = SummaryType;

  constructor() { }

  ngOnInit() {
  }

}

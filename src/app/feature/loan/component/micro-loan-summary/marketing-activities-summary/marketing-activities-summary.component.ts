import {Component, Input, OnInit} from '@angular/core';
import {MarketingActivities} from '../../../model/marketing-activities';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-marketing-activities-summary',
  templateUrl: './marketing-activities-summary.component.html',
  styleUrls: ['./marketing-activities-summary.component.scss']
})
export class MarketingActivitiesSummaryComponent implements OnInit {
  @Input() marketingActivity: MarketingActivities;
  marketingActivityDetail;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.marketingActivity)) {
      this.marketingActivityDetail = JSON.parse(this.marketingActivity.data);
    }
  }

}

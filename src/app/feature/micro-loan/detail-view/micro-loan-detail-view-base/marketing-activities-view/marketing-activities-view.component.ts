import {Component, Input, OnInit} from '@angular/core';
import {MarketingActivities} from '../../../../loan/model/marketing-activities';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-marketing-activities-view',
  templateUrl: './marketing-activities-view.component.html',
  styleUrls: ['./marketing-activities-view.component.scss']
})
export class MarketingActivitiesViewComponent implements OnInit {
  @Input() marketingActivityData: MarketingActivities;
  marketingActivityDetail;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.marketingActivityData)) {
      this.marketingActivityDetail = JSON.parse(this.marketingActivityData.data);
    }
  }

}

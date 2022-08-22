import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-group-summary-sheet-view',
  templateUrl: './group-summary-sheet-view.component.html',
  styleUrls: ['./group-summary-sheet-view.component.scss']
})
export class GroupSummarySheetViewComponent implements OnInit {
  @Input() loanDataHolder;
  gssData;
  isVisible = false;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder) && !ObjectUtil.isEmpty(this.loanDataHolder.mgroupInfo)
        && !ObjectUtil.isEmpty(this.loanDataHolder.mgroupInfo.detailInformation)) {
      this.gssData = JSON.parse(this.loanDataHolder.mgroupInfo.detailInformation);
    }
    if (!ObjectUtil.isEmpty(this.loanDataHolder)) {
      if (this.loanDataHolder.clientType === 'SMALL_BUSINESS_FINANCIAL_SERVICES' || this.loanDataHolder.clientType === 'DEPRIVED_SECTOR'
          || this.loanDataHolder.clientType === 'CONSUMER_FINANCE' || this.loanDataHolder.clientType === 'MICRO_FINANCIAL_SERVICES') {
        this.isVisible = true;
      }
    }
  }

}

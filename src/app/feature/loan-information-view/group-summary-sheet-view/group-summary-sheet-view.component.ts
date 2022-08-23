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
  containsHtml = false;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.loanDataHolder) && !ObjectUtil.isEmpty(this.loanDataHolder.mgroupInfo)
        && !ObjectUtil.isEmpty(this.loanDataHolder.mgroupInfo.detailInformation)) {
      if (this.loanDataHolder.mgroupInfo.detailInformation.includes('<p>')) {
        this.containsHtml = true;
      } else {
        this.gssData = JSON.parse(this.loanDataHolder.mgroupInfo.detailInformation);
      }
    }
  }

}

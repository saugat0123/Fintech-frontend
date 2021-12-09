import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from "../../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: 'app-section7-security-clause-print',
  templateUrl: './section7-security-clause-print.component.html',
  styleUrls: ['./section7-security-clause-print.component.scss']
})
export class Section7SecurityClausePrintComponent implements OnInit {
  @Input() customerApprovedDoc;
  loanHolderInfo;
  branchName;

  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.branchName = this.loanHolderInfo.branch.ct;
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Proposal} from '../../../../../admin/modal/proposal';
import {LoanConfig} from '../../../../../admin/modal/loan-config';

@Component({
  selector: 'app-approval-sheet-document-list',
  templateUrl: './approval-sheet-document-list.component.html',
  styleUrls: ['./approval-sheet-document-list.component.scss']
})
export class ApprovalSheetDocumentListComponent implements OnInit {
  @Input() loanConfig: LoanConfig;
  @Input() postApprovalDocIdList;
  @Input() proposal: Proposal;

  list = [];
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.postApprovalDocIdList)){
      this.postApprovalDocIdList = JSON.parse(this.postApprovalDocIdList);
    }
  }

  suspendedId(id) {
    if (!ObjectUtil.isEmpty(this.postApprovalDocIdList)) {
      return !(this.postApprovalDocIdList.includes(id));
    }
  }

}

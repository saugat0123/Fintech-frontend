import {Component, Input, OnInit} from '@angular/core';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../../admin/modal/roleType';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-approval-sheet-info',
  templateUrl: './approval-sheet-info.component.html',
  styleUrls: ['./approval-sheet-info.component.scss']
})
export class ApprovalSheetInfoComponent implements OnInit {
  @Input()
  loanConfig: LoanConfig = new LoanConfig();

  @Input() loanDataHolder: LoanDataHolder;

  ckeConfig;

  postApprovalDocIdList;
  authorityReviewComments;

  isCommittee = LocalStorageUtil.getStorage().roleType === RoleType.COMMITTEE;
  spinner = false;

  constructor(
      private loanFormService: LoanFormService,
      private toastService: ToastService,
      private ngbModal: NgbModal
  ) {
  }

  ngOnInit() {
    console.log(LocalStorageUtil.getStorage().roleType , RoleType.COMMITTEE , this.isCommittee);
    console.log(this.loanConfig);
  }

  submit() {
    console.log(this.postApprovalDocIdList , this.authorityReviewComments);
  }

  onSubmit() {
    this.spinner = true;
    this.loanDataHolder.postApprovalDocIdList = JSON.stringify(this.postApprovalDocIdList);
    this.loanDataHolder.authorityReviewComments = JSON.stringify(this.authorityReviewComments);
    this.loanFormService.save(this.loanDataHolder).subscribe((response: any) => {
      this.loanDataHolder = response.detail;
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, `Successfully Saved Approval Info`));
      this.close();
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, `Error Saving Approval Info: ${error.error.message}`));
      this.close();
    });
  }

  close() {
    this.ngbModal.dismissAll();
  }
}

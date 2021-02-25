import {Component, Input, OnInit} from '@angular/core';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../../admin/modal/roleType';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../model/loanData';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

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
      private modalRef: NgbActiveModal,
      private toastService: ToastService,
      private ngbModal: NgbModal
  ) {
  }

  ngOnInit() {
    this.spinner = true;
    this.ckeConfig = Editor.CK_CONFIG;
    console.log(this.loanDataHolder.postApprovalDocIdList);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.postApprovalDocIdList)) {
      console.log('nonempty');
      this.postApprovalDocIdList = JSON.parse(this.loanDataHolder.postApprovalDocIdList);
    } else {
      if (this.loanConfig.approvedDocument.length > 0) {
        console.log('emoty');
        this.postApprovalDocIdList = this.loanConfig.approvedDocument.map(value => value.id);
      }
    }
    console.log(LocalStorageUtil.getStorage().roleType, RoleType.COMMITTEE, this.isCommittee);
    console.log(this.loanConfig);
    this.spinner = false;
  }

  submit() {
    console.log(this.postApprovalDocIdList , this.authorityReviewComments);
  }

  onSubmit() {
    console.log(this.postApprovalDocIdList);
    this.spinner = true;
    this.loanDataHolder.postApprovalDocIdList = JSON.stringify(this.postApprovalDocIdList);
    this.loanDataHolder.authorityReviewComments = this.authorityReviewComments;
    this.loanFormService.save(this.loanDataHolder).subscribe((response: any) => {
      this.modalRef.close(response.detail);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, `Successfully Saved Approval Info`));
    }, error => {
      console.error(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, `Error Saving Approval Info: ${error.error.message}`));
      this.modalRef.close({});
    });
  }

  close() {
    this.ngbModal.dismissAll();
  }
}

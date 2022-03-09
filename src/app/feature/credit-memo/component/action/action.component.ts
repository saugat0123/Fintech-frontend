import {Component, Input, OnInit} from '@angular/core';
import {CreditMemo} from '../../model/credit-memo';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Role} from '../../../admin/modal/role';
import {User} from '../../../admin/modal/user';
import {CreditMemoService} from '../../service/credit-memo.service';
import {LoanActionService} from '../../../loan/loan-action/service/loan-action.service';
import {UserService} from '../../../admin/component/user/user.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DocAction} from '../../../loan/model/docAction';
import {DocStatus} from '../../../loan/model/docStatus';
import {UserVerificationModalComponent} from '../user-verification-modal/user-verification-modal.component';

@Component({
  selector: 'app-action',
  templateUrl: './action.component.html'
})
export class ActionComponent implements OnInit {
  @Input()
  actionTitle = '';

  @Input()
  creditMemo: CreditMemo;

  actionForm: FormGroup;
  roleList: Role[] = [];
  userList: User[] = [];
  spinner = false;

  constructor(
      private formBuilder: FormBuilder,
      private creditMemoService: CreditMemoService,
      private loanActionService: LoanActionService,
      private userService: UserService,
      private modalService: NgbModal,
      private activeModalService: NgbActiveModal
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.getForwardRoleList();
  }

  buildForm() {
    this.actionForm = this.formBuilder.group({
      creditMemoId: [undefined, Validators.required],
      docAction: [undefined, Validators.required],
      toUser: [undefined, DocAction.value(DocAction.FORWARD) === this.actionTitle ? Validators.required : undefined],
      toRole: [undefined, DocAction.value(DocAction.FORWARD) === this.actionTitle ? Validators.required : undefined],
      documentStatus: [undefined, Validators.required],
      comment: [undefined, Validators.required]
    });
  }

  getForwardRoleList() {
    this.loanActionService.getSendForwardList().subscribe(
        (response: any) => {
          this.roleList = response.detail;
        });
  }

  getUsersByRoleId(role) {
    this.userService.getUserListByRoleId(role.id).subscribe((response: any) => {
      this.userList = response.detail;
      if (this.userList.length === 1) {
        this.actionForm.patchValue({
              toUser: this.userList[0]
            }
        );
      }
    });
  }

  verifyUser() {
    this.spinner = true;
    this.actionForm.get('creditMemoId').patchValue(this.creditMemo.id);
    if (this.actionTitle === DocAction.value(DocAction.APPROVED)) {
      this.actionForm.get('documentStatus').patchValue(DocStatus.APPROVED);
    } else if (this.actionTitle === DocAction.value(DocAction.REJECT)) {
      this.actionForm.get('documentStatus').patchValue(DocStatus.REJECTED);
    } else {
      this.actionForm.get('documentStatus').patchValue(this.creditMemo.documentStatus);
    }
    this.actionForm.get('docAction').patchValue(this.actionTitle);
    if (this.actionForm.invalid) {
      this.spinner = false;
      return;
    }
    const actionObj = this.actionForm.value;
    this.activeModalService.close();
    const modalRef = this.modalService.open(UserVerificationModalComponent, {backdrop: 'static'});
    modalRef.componentInstance.actionData = actionObj;
    modalRef.componentInstance.creditMemoService = this.creditMemoService;
  }

  onClose() {
    this.activeModalService.dismiss();
  }
}

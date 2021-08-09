import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {DocStatus} from '../../../loan/model/docStatus';
import {Role} from '../../../admin/modal/role';
import {User} from '../../../admin/modal/user';
import {Editor} from '../../../../@core/utils/constants/editor';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {UserService} from '../../../admin/component/user/user.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';
import {SocketService} from '../../../../@core/service/socket.service';
import {Router} from '@angular/router';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {RoleType} from '../../../admin/modal/roleType';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {DocAction} from '../../../loan/model/docAction';
import {LoanStage} from '../../../loan/model/loanStage';
import {VerificationActionModelComponent} from '../verification-action-model/verification-action-model.component';

@Component({
  selector: 'app-single-loan-transfer-model',
  templateUrl: './single-loan-transfer-model.component.html',
  styleUrls: ['./single-loan-transfer-model.component.scss']
})
export class SingleLoanTransferModelComponent implements OnInit  {

  form: FormGroup;
  submitted = false;
  @Input() isMaker: string;
  @Input() approvalType: string;
  @Input() refId: number;
  @Input() currentRole: string;
  @Input() loanConfigId: number;
  @Input() customerLoanId: number;
  @Input() branchId: number;
  @Input() customerLoanHolder: LoanDataHolder;
  @Input() popUpTitle: string;
  @Input() currentRoleOrder: number;
  @Input() docAction: string;
  @Input() documentStatus: DocStatus;
  @Input() isTransfer: boolean;
  @Input() toRole: Role;
  @Input() isFileUnderCurrentToUser;
  length = false;
  roleId: number;
  transferRoleList = [];
  userList: Array<User> = new Array<User>();
  roleOrder: number;
  isEmptyUser = false;
  showUserList = true;
  selectedRole: Role;
  ckeConfig = Editor.CK_CONFIG;
  selectedUsername: string;
  username: string;
  solUserList: Array<User> = new Array<User>();
  showHideSolUser = false;
  solNoUserMessage = 'No User Present in this Role';
  solNoUserSelectedMessage = 'Please Select User For Sol';
  isNoUserSol = false;
  isNoUserSelectedSol = false;
  sendForwardBackwardList = [];
  isSolUserPresent = false;
  isSolUserSelected = false;

  constructor(
      public nbDialogRef: NbDialogRef<SingleLoanTransferModelComponent>,
      private formBuilder: FormBuilder,
      private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
      private userService: UserService,
      private loanFormService: LoanFormService,
      private nbDialogService: NbDialogService,
      private toastService: ToastService,
      private socketService: SocketService,
      private router: Router,
      private roleService: RoleService) {
  }

  ngOnInit() {
    this.checkLoanUnderSol();
    this.form = this.buildForm();
    // get and fetch roleId from local storage
    this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
    // method call
    this.conditionalDataLoad();
    // method called
    this.getRoleData();
  }

  // method to build form control names
  public buildForm(): FormGroup {
    return this.formBuilder.group({
      toRole: [this.selectedRole, this.isTransfer ? [Validators.required] : []],
      toUser: [undefined],
      comment: [undefined, Validators.required],
      loanConfigId: [this.loanConfigId],
      customerLoanId: [this.customerLoanId],
      docAction: [this.docAction],
      documentStatus: [this.documentStatus],
      isSol: [false],
      solUser: [undefined],
      selectedRoleForSol: [undefined]
    });
  }

  // get all roll based on set hierarchy
  private getRoleData(): void {
    this.approvalRoleHierarchyService.getDefault(this.approvalType, this.refId).subscribe((response: any) => {
      this.transferRoleList = [];
      this.transferRoleList = response.detail;
    });
  }
  // get all approval role list
  private conditionalDataLoad(): void {
    switch (this.popUpTitle) {
      case 'Transfer':
        const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
        const refId = approvalType === 'DEFAULT' ? 0 : approvalType === 'LOAN_TYPE' ? this.loanConfigId : this.customerLoanId;

        this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId)
            .subscribe((response: any) => {
              this.sendForwardBackwardList = [];
              this.sendForwardBackwardList = response.detail.sort(function(a, b) {
                return parseFloat(b.roleOrder) - parseFloat(a.roleOrder);
              });
              if (this.sendForwardBackwardList.length > 0) {
                this.form.patchValue({
                  toRole: this.sendForwardBackwardList[0].role
                });
              }
            });
        break;
      default:
        if (!ObjectUtil.isEmpty(this.toRole)) {
          this.getUserList(this.toRole);
        }// send backward to committee

    }
  }

  // get user list based on role
  public getUserList(role) {
    this.selectedRole = role;
    this.isEmptyUser = false;
    this.showUserList = true;
    this.roleService.detail(role.id).subscribe((res: any) => {
      role = res.detail;
      this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
        this.userList = response.detail;
        // check for empty user
        if (this.userList.length === 0) {
          this.isEmptyUser = true;
        } else {
          // fetch user internally
          this.form.patchValue({
            toUser: this.userList[0]
          });
        }
      });
    });
  }

  // get selected user username
  getSelectedUser(toUser) {
    //   set selected user
    this.selectedUsername = toUser.username;
  }

  public onSubmit() {
    this.submitted = true;
    // stop form submit if invalid
    if (this.form.invalid) {
      return;
    }
    // restricting loan transfer for same user
    const selectedToUser = this.form.get('toUser').value;
    if (this.selectedRole.roleType === RoleType.MAKER &&
        selectedToUser.username === LocalStorageUtil.getStorage().username) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Please select different user to transfer file'));
      return;
    }
    const selectedUser = this.form.get('toUser').value;
    if (selectedUser.username === this.isFileUnderCurrentToUser.username) {
      this.toastService.show(new Alert(AlertType.ERROR, 'Cannot transfer file to same user'));
      return;
    }
    const isSolSelected = this.form.get('isSol').value;
    if (isSolSelected) {
      const selectedSolUser = this.form.get('solUser').value;
      if (ObjectUtil.isEmpty(selectedSolUser)) {
        this.isNoUserSelectedSol = true;
        return;
      }
    }
    const dialogRef = this.nbDialogService.open(VerificationActionModelComponent, {
      context: {
        // send context to Loan Action Verification Component for authentication
        toUser: this.form.get('toUser').value,
        toRole: this.form.get('toRole').value,
        action: this.docAction,
        isSolUserPresent: this.customerLoanHolder.isSol
      }
    });
    dialogRef.onClose.subscribe((verified: boolean) => {
      if (verified === true) {
        this.postAction();
        this.nbDialogRef.close();
      }
    });

  }

  // method for sending notification and redirecting to dashboard
  private postAction() {
    this.loanFormService.postLoanAction(this.form.value).subscribe((response: any) => {
      const msg = `Document Has been Successfully ${this.form.get('docAction').value}`;
      this.toastService.show(new Alert(AlertType.SUCCESS, msg));
      this.sendLoanNotification(response.detail.customerLoanId);
      this.router.navigate(['/home/pending']);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  // method to set and send notification
  private sendLoanNotification(customerLoanId: number): void {
    this.loanFormService.detail(customerLoanId).subscribe((loanResponse: any) => {
      const customerLoan: LoanDataHolder = loanResponse.detail;
      // set loan stage information
      this.socketService.message.loanConfigId = customerLoan.loan.id;
      this.socketService.message.customerId = customerLoan.id;
      this.socketService.message.toUserId = customerLoan.currentStage.toUser.id;
      this.socketService.message.toRoleId = customerLoan.currentStage.toRole.id;
      this.socketService.message.fromId = customerLoan.currentStage.fromUser.id;
      this.socketService.message.fromRole = customerLoan.currentStage.fromRole.id;
      this.socketService.message.date = new Date();
      this.socketService.message.docAction = customerLoan.currentStage.docAction;

      const docAction = customerLoan.currentStage.docAction.toString();
      if (docAction === DocAction.value(DocAction.TRANSFER) ||
          docAction === DocAction.value(DocAction.FORWARD) ||
          docAction === DocAction.value(DocAction.BACKWARD)) {
        // send notification to current stage user
        this.socketService.message.toId = customerLoan.currentStage.toUser.id;
        this.socketService.message.toRole = customerLoan.currentStage.toRole.id;
        this.socketService.sendMessageUsingSocket();
      }
      // send notifications to unique previous stage users
      for (const distinct of customerLoan.distinctPreviousList) {
        const distinctStage: LoanStage = distinct;

        if (customerLoan.currentStage.toUser.id !== distinctStage.toUser.id
            && customerLoan.currentStage.fromUser.id !== distinctStage.toUser.id) {
          this.socketService.message.toId = distinctStage.toUser.id;
          this.socketService.message.toRole = distinctStage.toRole.id;
          this.socketService.sendMessageUsingSocket();
        }
      }
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  getSOlUSerList(role) {
    this.form.patchValue({
      solUser: [undefined]
    });
    this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
      this.solUserList = response.detail;
      this.isNoUserSol = false;
      this.isSolUserSelected = true;
      if (this.solUserList.length === 1) {
        this.form.patchValue({
          solUser: this.solUserList[0]
        });
      } else if (this.solUserList.length > 1) {
        this.form.patchValue({
          solUser: this.solUserList[0]
        });

      } else if (this.solUserList.length === 0) {
        this.isNoUserSol = true;
      }
    });

  }

  isSolChecked(event) {
    if (event) {
      this.showHideSolUser = true;
      this.form.patchValue({
        solUser: null,
        isSol: true
      });
      if (this.customerLoanHolder.isSol) {
        this.form.get('solUser').patchValue(ObjectUtil.isEmpty(this.customerLoanHolder.solUser) ?
            null : this.customerLoanHolder.solUser);
        this.form.get('selectedRoleForSol').patchValue(ObjectUtil.isEmpty(this.customerLoanHolder.solUser) ?
            null : this.customerLoanHolder.solUser.role);
      }
      this.form.get('solUser').setValidators(Validators.required);
      this.form.get('solUser').updateValueAndValidity();
    } else {
      this.showHideSolUser = false;
      this.form.patchValue({
        solUser: null,
        isSol: false
      });
      this.form.get('solUser').setValidators([]);
      this.form.get('solUser').clearValidators();
      this.form.get('solUser').updateValueAndValidity();
    }
  }
  checkLoanUnderSol() {
    if (this.customerLoanHolder.isSol) {
      if (this.customerLoanHolder.solUser.role.id === this.customerLoanHolder.currentStage.toRole.id &&
          this.customerLoanHolder.solUser.id === this.customerLoanHolder.currentStage.toUser.id) {
        this.isSolUserPresent = true;
      }
      this.conditionalDataLoad();
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {DocStatus} from '../../../loan/model/docStatus';
import {Role} from '../../../admin/modal/role';
import {Editor} from '../../../../@core/utils/constants/editor';
import {CombinedLoan} from '../../../loan/model/combined-loan';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {User} from '../../../admin/modal/user';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {ToastService} from '../../../../@core/utils';
import {UserService} from '../../../admin/component/user/user.service';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {Router} from '@angular/router';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {RoleType} from '../../../admin/modal/roleType';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import { LoanType } from 'src/app/feature/loan/model/loanType';
import {VerificationActionModelComponent} from '../verification-action-model/verification-action-model.component';

@Component({
  selector: 'app-combined-loan-transfer-model',
  templateUrl: './combined-loan-transfer-model.component.html',
  styleUrls: ['./combined-loan-transfer-model.component.scss']
})
export class CombinedLoanTransferModelComponent implements OnInit {

  @Input() popUpTitle: string;
  @Input() combinedLoanId: number;
  @Input() docAction: string;
  @Input() documentStatus: DocStatus;
  @Input() isTransfer: boolean;
  @Input() isMaker: boolean;
  @Input() branchId: number;
  @Input() approvalType: string;
  @Input() refId: number;
  @Input() toRole: Role;
  @Input() isFileUnderCurrentToUser;
  ckeConfig = Editor.CK_CONFIG;
  public combinedLoan: CombinedLoan;
  public LoanType = LoanType;
  public stageType: 'individually' | 'combined';
  public sendForwardBackwardList: [];
  public sendForwardBackwardApprovalList: [];
  public combinedType: {
    form?: FormGroup,
    userList?: User[],
    submitted?: boolean,
    solUserList?: User[],
  } = {};
  public individualType: {
    form?: FormGroup,
    users?: Map<number, User[]>,
    submitted?: boolean,
    solUsers?: Map<number, User[]>,
  } = {};
  private roleId: number;
  isUserPresent = [];
  isSolUserPresent = [];
  preSelectedSolUser = [];
  showSolUser = [];
  showHideCombineSolUser = false;
  submitted = false;
  isSolUserPresentForCombine = true;
  isUserNotPresentForCombine = false;
  selectedRole: Role;
  selectedUsername: string;
  isSolPresent = false;
  showHideSoleForm = false;
  singleSelectedToUser = [];
  spinner = false;

  constructor(
      public nbDialogRef: NbDialogRef<CombinedLoanTransferModelComponent>,
      private combinedLoanService: CombinedLoanService,
      private toastService: ToastService,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
      private nbDialogService: NbDialogService,
      private loanFormService: LoanFormService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
    this.spinner = true;
    this.combinedLoanService.detail(this.combinedLoanId).subscribe((response) => {
      this.spinner = false;
      this.combinedLoan = response.detail;
      this.combinedLoan.loans.forEach((l, i) => {
        this.isUserPresent[i] = true;
        this.isSolUserPresent[i] = true;
        if (l.isSol) {
          if (l.solUser.role.id === l.currentStage.toRole.id &&
              l.solUser.id === l.currentStage.toUser.id) {
            this.isSolPresent = l.isSol;
          }
        }
        this.preSelectedSolUser[i] = {isSol: l.isSol, solUser: l.solUser};
      });
    }, error => {
      this.spinner = false;
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load combined loan'));
    });
    this.conditionalCombinedDataLoad();
    this.getConditionalCombinedDataLoad();
  }

  public changeStageType(value: 'individually' | 'combined'): void {
    if (value === 'individually') {
      this.individualType.form = this.buildIndividualForm();
      this.individualType.users = new Map<number, User[]>();
      this.individualType.solUsers = new Map<number, User[]>();
      this.combinedLoan.loans.forEach((l, i) => this.individualType.users.set(i, []));
      this.combinedLoan.loans.forEach((l, i) => this.individualType.solUsers.set(i, []));
    } else if (value === 'combined') {
      this.combinedType.form = this.buildCombinedForm();
    }
  }

  public getLoanById(id: number | string): LoanDataHolder {
    return this.combinedLoan.loans.find((l) => l.id === Number(id));
  }

  public getCombinedUserList(role) {
    this.isUserNotPresentForCombine = false;
    this.selectedRole = role;
    if (this.isSolPresent === false) {
      this.showHideSoleForm = true;
    }
    this.spinner = true;
    this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
      this.spinner = false;
      this.combinedType.userList = response.detail;
      if (this.combinedType.userList.length === 0) {
        this.isUserNotPresentForCombine = true;
      } else {
        this.combinedType.form.patchValue({
          toUser: this.combinedType.userList[0]
        });
        this.combinedType.form.get('toUser').setValidators(Validators.required);
        this.combinedType.form.updateValueAndValidity();
      }
    });
  }

  public getIndividualUserList(role, i: number) {
    if (this.isSolPresent === false) {
      this.showHideSoleForm = true;
    } else {
      this.showHideSoleForm = true;
    }
    this.spinner = true;
    this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
      this.spinner = false;
      this.individualType.users.set(i, response.detail);
      const users: User[] = response.detail;
      this.isUserPresent[i] = true;
      if (users.length === 0) {
        this.isUserPresent[i] = false;

      } else {
        this.individualType.form.get(['actions', i]).patchValue({
          toUser: undefined
        });
        this.individualType.form.get(['actions', i, 'toUser']).setValidators(Validators.required);
        this.individualType.form.updateValueAndValidity();
      }
    });
  }

  getSelectedUser(toUser) {
    this.selectedUsername = toUser.username;
  }

  public getSingleSelectedUser(toUser, index): void {
    const selectedToUser = toUser.username;
    if (toUser.roleType === RoleType.MAKER && selectedToUser === LocalStorageUtil.getStorage().username) {
      this.individualType.form.get(['actions', index]).patchValue({
        toUser: undefined
      });
      this.toastService.show(new Alert(AlertType.ERROR, 'Please select different user to transfer file'));
      return;
    }
    if (selectedToUser === this.isFileUnderCurrentToUser.username) {
      this.individualType.form.get(['actions', index]).patchValue({
        toUser: undefined
      });
      this.toastService.show(new Alert(AlertType.ERROR, 'Cannot transfer file to same user'));
      return;
    }
  }

  getSingleSelectedSolUser(toUser, index) {
    const selectedToUser = toUser.username;
    if (selectedToUser === this.isFileUnderCurrentToUser.username) {
      this.individualType.form.get(['actions', index]).patchValue({
        solUser: undefined
      });
      this.toastService.show(new Alert(AlertType.ERROR, 'Cannot transfer file to same user'));
      return;
    }
  }

  public onSubmit(): void {
    if (this.stageType === 'individually') {
      this.individualType.submitted = true;
      if (this.individualType.form.invalid) {
        return;
      }
      const dialogRef = this.nbDialogService.open(VerificationActionModelComponent,
          {
            context: {
              individualCombine: this.individualType.form.value,
              action: this.docAction,
              isSolUserPresent: this.isSolPresent
            }
          });
      dialogRef.onClose.subscribe((verified: boolean) => {
        if (verified === true) {
          this.postCombinedAction(false);
          this.nbDialogRef.close();
        }
      });
    } else if (this.stageType === 'combined') {
      this.combinedType.submitted = true;
      if (this.combinedType.form.invalid) {
        return;
      }
      if (this.selectedRole.roleType === RoleType.MAKER &&
          this.selectedUsername === LocalStorageUtil.getStorage().username) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Please select different user to transfer file'));
        return;
      }
      const selectedCombinedUser = this.combinedType.form.get('toUser').value;
      if (selectedCombinedUser.username === this.isFileUnderCurrentToUser.username) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Cannot transfer file to same user'));
        return;
      }
      const dialogRef = this.nbDialogService.open(VerificationActionModelComponent, {
        context: {
          toUser: this.combinedType.form.get('toUser').value,
          toRole: this.combinedType.form.get('toRole').value, action: this.docAction,
          isSolUserPresent: this.isSolPresent
        }
      });
      dialogRef.onClose.subscribe((verified: boolean) => {
        if (verified === true) {
          this.postCombinedAction(true);
          this.nbDialogRef.close();
        }
      });
    }
  }

  private buildCombinedForm(): FormGroup {
    const l = this.combinedLoan.loans[0];
    return this.formBuilder.group({
      loanConfigId: [undefined],
      customerLoanId: [undefined],
      toUser: [undefined],
      toRole: [this.selectedRole, this.isTransfer ? [Validators.required] : []],
      docAction: [this.docAction],
      comment: [undefined, Validators.required],
      documentStatus: [this.documentStatus],
      isSol: [ObjectUtil.isEmpty(l.isSol) ? undefined : l.isSol],
      solUser: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser],
      selectedRoleForSol: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser.role]
    });
  }

  private buildIndividualForm(): FormGroup {
    const form = this.formBuilder.group({
      actions: this.formBuilder.array([]),
    });
    this.combinedLoan.loans.forEach((l) => {
      (form.get('actions') as FormArray).push(this.formBuilder.group({
        loanConfigId: [l.loan.id],
        customerLoanId: [l.id],
        toUser: [undefined],
        toRole: [this.selectedRole, this.isTransfer ? [Validators.required] : []],
        docAction: [this.docAction],
        comment: [undefined, Validators.required],
        documentStatus: [this.documentStatus],
        loanName: undefined,
        isSol: [ObjectUtil.isEmpty(l.isSol) ? undefined : l.isSol],
        solUser: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser],
        selectedRoleForSol: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser.role]
      }));
    });
    return form;
  }

  private conditionalCombinedDataLoad(): void {
    this.spinner = true;
    switch (this.popUpTitle) {
      case 'Transfer':
        this.approvalRoleHierarchyService.getDefault(this.approvalType, this.refId)
            .subscribe((response: any) => {
              this.spinner = false;
              this.sendForwardBackwardList = [];
              this.sendForwardBackwardList = response.detail;
            });
        break;
    }
  }

  // get all approval role list
  private getConditionalCombinedDataLoad(): void {
    this.spinner = true;
    switch (this.popUpTitle) {
      case 'Transfer':
        const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
        this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, 0)
            .subscribe((response: any) => {
              this.spinner = false;
              this.sendForwardBackwardApprovalList = [];
              this.sendForwardBackwardApprovalList = response.detail;
            });
        break;
    }
  }

  private postCombinedAction(isCombined: boolean) {
    let actions;
    if (isCombined) {
      actions = this.combinedLoan.loans.map((l) => {
        return {
          loanConfigId: l.loan.id,
          customerLoanId: l.id,
          toUser: this.combinedType.form.get('toUser').value,
          toRole: this.combinedType.form.get('toRole').value,
          docAction: this.combinedType.form.get('docAction').value,
          comment: this.combinedType.form.get('comment').value,
          documentStatus: this.combinedType.form.get('documentStatus').value,
          isSol: this.combinedType.form.get('isSol').value,
          solUser: this.combinedType.form.get('solUser').value,
        };
      });
    } else {
      actions = this.individualType.form.get('actions').value;
    }
    this. spinner = true;
    this.loanFormService.postCombinedLoanAction(actions, !isCombined).subscribe(() => {
      this.spinner = false;
      const msg = `Document Has been Successfully ${this.docAction}`;
      this.toastService.show(new Alert(AlertType.SUCCESS, msg));
      this.router.navigate(['/home/pending']);
    }, error => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  // sol logic starts here
  // individual
  public getIndividualUserSolList(role, i: number) {
    if (!ObjectUtil.isEmpty(role)) {
      this.spinner = true;
      this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
        this.spinner = false;
        this.individualType.solUsers.set(i, response.detail);
        const users: User[] = response.detail;
        this.isSolUserPresent[i] = true;
        if (users.length === 1) {
          this.individualType.form.get(['actions', i]).patchValue({
            solUser: users[0]
          });
        } else if (users.length > 1) {
          this.individualType.form.get(['actions', i]).patchValue({
            solUser: users[0]
          });

        } else if (users.length === 0) {
          this.isSolUserPresent[i] = false;
        }
      });
    }
  }

  showHideSol(event: boolean, i: number) {
    const val = {index: i, value: event};
    const checkIndexPresent = this.showSolUser.filter(s => s.index === i);
    if (checkIndexPresent.length === 0) {
      this.showSolUser.push(val);
    } else {
      checkIndexPresent[0].value = event;
    }
    if (!event) {
      this.individualType.form.get(['actions', i]).patchValue({
        solUser: null
      });
      this.individualType.form.get(['actions', i, 'solUser']).clearValidators();
      this.individualType.form.get(['actions', i, 'solUser']).updateValueAndValidity();
    } else {
      this.individualType.form.get(['actions', i, 'selectedRoleForSol']).setValue(undefined);
      this.individualType.form.get(['actions', i, 'solUser']).setValue(undefined);
      this.individualType.form.get(['actions', i, 'solUser']).setValidators(Validators.required);
      this.individualType.form.get(['actions', i, 'solUser']).updateValueAndValidity();
    }
  }

  // combineSol
  public getCombinedSolUserList(role) {
    this.isSolUserPresentForCombine = true;
    this.combinedType.form.patchValue({
      solUser: null
    });
    this.spinner = true;
    this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
      this.spinner = false;
      this.combinedType.solUserList = response.detail;
      if (this.combinedType.solUserList.length === 1) {
        this.combinedType.form.patchValue({
          solUser: this.combinedType.solUserList[0]
        });
      } else if (this.combinedType.solUserList.length > 1) {
        this.combinedType.form.patchValue({
          solUser: this.combinedType.solUserList[0]
        });
      } else if (this.combinedType.solUserList.length === 0) {
        this.isSolUserPresentForCombine = false;
      }
    });
  }

  showHideSolCombine(event: boolean) {
    if (event) {
      this.showHideCombineSolUser = true;
      this.showHideSoleForm = true;
      this.combinedType.form.get('selectedRoleForSol').patchValue(undefined);
      this.combinedType.form.get('solUser').patchValue(undefined);
      this.combinedType.form.get('solUser').setValidators(Validators.required);
      this.combinedType.form.get('solUser').updateValueAndValidity();
    } else {
      this.combinedType.form.patchValue({
        solUser: null,
        selectedRoleForSol: null,
        isSol: false
      });
      this.showHideCombineSolUser = false;
      this.showHideSoleForm = false;
      this.combinedType.form.get('solUser').clearValidators();
      this.combinedType.form.get('solUser').updateValueAndValidity();
    }
  }
}

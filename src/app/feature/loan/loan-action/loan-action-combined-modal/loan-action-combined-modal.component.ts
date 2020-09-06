import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {CombinedLoan} from '../../model/combined-loan';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanType} from '../../model/loanType';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DocStatus} from '../../model/docStatus';
import {UserService} from '../../../admin/component/user/user.service';
import {User} from '../../../admin/modal/user';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ApprovalRoleHierarchyService} from '../../approval/approval-role-hierarchy.service';
import {LoanActionVerificationComponent} from '../loan-action-verification/loan-action-verification.component';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../model/loanData';

@Component({
  selector: 'app-loan-action-combined-modal',
  templateUrl: './loan-action-combined-modal.component.html',
  styleUrls: ['./loan-action-combined-modal.component.scss']
})
export class LoanActionCombinedModalComponent implements OnInit {
  @Input() popUpTitle: 'Send Forward' | 'Approve' | 'Send Backward' | 'Reject' | 'Close' | string;
  @Input() combinedLoanId: number;
  @Input() docAction: string;
  @Input() documentStatus: DocStatus;
  @Input() isForward: boolean;

  public combinedLoan: CombinedLoan;
  public LoanType = LoanType;
  public stageType: 'individually' | 'combined';
  public sendForwardBackwardList: [];
  public combinedType: {
    form?: FormGroup,
    userList?: User[],
    submitted?: boolean
  } = {};
  public individualType: {
    form?: FormGroup,
    users?: Map<number, User[]>,
    submitted?: boolean
  } = {};
  private roleId: number;

  constructor(
      public nbDialogRef: NbDialogRef<LoanActionCombinedModalComponent>,
      private combinedLoanService: CombinedLoanService,
      private toastService: ToastService,
      private formBuilder: FormBuilder,
      private userService: UserService,
      private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
      private nbDialogService: NbDialogService,
      private loanFormService: LoanFormService,
      private router: Router
  ) { }

  ngOnInit() {
    this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
    this.combinedLoanService.detail(this.combinedLoanId).subscribe((response) => {
      this.combinedLoan = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load combined loan'));
    });
    this.conditionalCombinedDataLoad();
  }

  public changeStageType(value: 'individually' | 'combined'): void {
    if (value === 'individually') {
      this.individualType.form = this.buildIndividualForm();
      this.individualType.users = new Map<number, User[]>();
      this.combinedLoan.loans.forEach((l, i) => this.individualType.users.set(i, []));
    } else if (value === 'combined') {
      this.combinedType.form = this.buildCombinedForm();
    }
  }

  public getLoanById(id: number | string): LoanDataHolder {
    return this.combinedLoan.loans.find((l) => l.id === Number(id));
  }

  public getCombinedUserList(role) {
    this.userService.getUserListByRoleId(role.id).subscribe((response: any) => {
      this.combinedType.userList = response.detail;
      if (this.combinedType.userList.length === 1) {
        this.combinedType.form.patchValue({
          toUser: this.combinedType.userList[0]
        });
      } else if (this.combinedType.userList.length > 1) {
        this.combinedType.form.get('toUser').setValidators(Validators.required);
        this.combinedType.form.updateValueAndValidity();
      }
    });
  }

  public getIndividualUserList(role, i: number) {
    this.userService.getUserListByRoleId(role.id).subscribe((response: any) => {
      this.individualType.users.set(i, response.detail);
      const users: User[] = response.detail;
      if (users.length === 1) {
        this.individualType.form.get(['actions', i]).patchValue({
          toUser: users[0]
        });
      } else if (users.length > 1) {
        this.individualType.form.get(['actions', i, 'toUser']).setValue(undefined);
        this.individualType.form.get(['actions', i, 'toUser']).setValidators(Validators.required);
        this.individualType.form.updateValueAndValidity();
      }
    });
  }

  public onSubmit(): void {
    if (this.stageType === 'individually') {
      this.individualType.submitted = true;
      if (this.individualType.form.invalid) {
        return;
      }
      const dialogRef = this.nbDialogService.open(LoanActionVerificationComponent);
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
      const dialogRef = this.nbDialogService.open(LoanActionVerificationComponent);
      dialogRef.onClose.subscribe((verified: boolean) => {
        if (verified === true) {
          this.postCombinedAction(true);
          this.nbDialogRef.close();
        }
      });
    }
  }

  private buildCombinedForm(): FormGroup {
    return this.formBuilder.group({
      loanConfigId: [undefined],
      customerLoanId: [undefined],
      toUser: [undefined],
      toRole: [undefined, this.isForward ? [Validators.required] : []],
      docAction: [this.docAction],
      comment: [undefined, Validators.required],
      documentStatus: [this.documentStatus]
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
        toRole: [undefined, this.isForward ? [Validators.required] : []],
        docAction: [this.docAction],
        comment: [undefined, Validators.required],
        documentStatus: [this.documentStatus]
      }));
    });
    return form;
  }

  private conditionalCombinedDataLoad(): void {
    switch (this.popUpTitle) {
      case 'Send Forward':
        const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;

        this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, 0)
        .subscribe((response: any) => {
          this.sendForwardBackwardList = [];
          this.sendForwardBackwardList = response.detail;
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
        };
      });
    } else {
      actions = this.individualType.form.get('actions').value;
    }
    this.loanFormService.postCombinedLoanAction(actions, !isCombined).subscribe(() => {
      const msg = `Document Has been Successfully ${this.docAction}`;
      this.toastService.show(new Alert(AlertType.SUCCESS, msg));
      this.router.navigate(['/home/pending']);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

}

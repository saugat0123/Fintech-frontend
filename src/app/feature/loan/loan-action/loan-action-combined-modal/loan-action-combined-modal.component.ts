import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Editor} from '../../../../@core/utils/constants/editor';
import {RoleType} from '../../../admin/modal/roleType';
import {Role} from '../../../admin/modal/role';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {DocAction} from '../../model/docAction';

@Component({
    selector: 'app-loan-action-combined-modal',
    templateUrl: './loan-action-combined-modal.component.html',
    styleUrls: ['./loan-action-combined-modal.component.scss']
})
export class LoanActionCombinedModalComponent implements OnInit {
    @Input() popUpTitle: 'Send Forward' | 'Approve' | 'Send Backward' | 'Reject' | 'Close' | string;
    @Input() combinedLoanId: number;
    @Input() docAction: string;
    @Input() docActionMsg: string;
    @Input() documentStatus;
    @Input() isForward: boolean;
    @Input() additionalDetails: any;
    @Input() isMaker: boolean;
    @Input() branchId: number;
    @Input() toRole: Role;
    @Input() toUser: User;
    @Input() comment: string;
    ckeConfig = Editor.CK_CONFIG;
    public combinedLoan: CombinedLoan;
    public LoanType = LoanType;
    public stageType: 'individually' | 'combined';
    public sendForwardBackwardList: [];
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
    showUserList = true;
    spinner = false;
    isDual;
    isHsov;
    combinedDual = false;
    combinedHSOV = false;
    docStatus =  DocStatus;
    @Output() emitter = new EventEmitter();

    constructor(
        public nbDialogRef: NbDialogRef<LoanActionCombinedModalComponent>,
        private combinedLoanService: CombinedLoanService,
        private toastService: ToastService,
        private formBuilder: FormBuilder,
        private userService: UserService,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
        private nbDialogService: NbDialogService,
        private loanFormService: LoanFormService,
        private router: Router,
        private roleService: RoleService
    ) {
    }

    ngOnInit() {
        this.spinner = true;
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        this.combinedLoanService.detail(this.combinedLoanId).subscribe((response) => {
            this.spinner = false;
            this.combinedLoan = response.detail;
            this.combinedLoan.loans.forEach((l, i) => {
                this.isUserPresent[i] = true;
                this.isSolUserPresent[i] = true;
                this.preSelectedSolUser[i] = {isSol: l.isSol, solUser: l.solUser};
            });
            this.changeStageType('combined');
        }, error => {
            this.spinner = true;
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load combined loan'));
        });
        this.conditionalCombinedDataLoad();
    }

    public changeStageType(value: 'individually' | 'combined'): void {
        if (value === 'individually') {
            this.individualType.form = this.buildIndividualForm();
            this.individualType.users = new Map<number, User[]>();
            this.individualType.solUsers = new Map<number, User[]>();
            this.combinedLoan.loans.forEach((l, i) => this.individualType.users.set(i, []));
            this.combinedLoan.loans.forEach((l, i) => this.individualType.solUsers.set(i, []));
            if (!ObjectUtil.isEmpty(this.comment)) {
                this.combinedLoan.loans.forEach((com, ind) => {
                    this.individualType.form.get(['actions', ind, 'comment']).patchValue(this.comment)
                });
            }
        } else if (value === 'combined') {
            this.combinedType.form = this.buildCombinedForm();
            if (this.docAction === DocAction[DocAction.BACKWARD_TO_COMMITTEE]) {
                this.spinner = true;
                this.roleService.detail(this.toRole.id).subscribe((res: any) => {
                    this.spinner = false;
                    this.toRole = res.detail;
                    this.combinedType.form.patchValue({
                        toRole: this.toRole
                    });
                });
                this.getCombinedUserList(this.toRole);
                this.showUserList = false;
            }
            if (!ObjectUtil.isEmpty(this.comment)) {
                this.combinedType.form.get('comment').patchValue(this.comment);
            }
        }
    }

    public getLoanById(id: number | string): LoanDataHolder {
        return this.combinedLoan.loans.find((l) => l.id === Number(id));
    }

    public getCombinedUserList(role) {
        this.isUserNotPresentForCombine = false;
        this.showUserList = true;
        this.spinner = true;
        this.roleService.detail(role.id).subscribe((res: any) => {
            role = res.detail;
        });
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
            this.combinedType.userList = response.detail;
            if (this.combinedType.userList.length === 1) {
                this.combinedType.form.patchValue({
                    toUser: this.combinedType.userList[0]
                });
            } else if ((role.roleType === RoleType.COMMITTEE) && this.combinedType.userList.length > 1) {
                const committeeDefaultUser = this.combinedType.userList.filter(f => f.name.toLowerCase().includes('default'));
                this.showUserList = false;
                if (committeeDefaultUser.length === 0) {
                    this.combinedType.form.patchValue({
                        toUser: this.combinedType.userList[0]
                    });

                } else {
                    this.combinedType.form.patchValue({
                        toUser: committeeDefaultUser[0]
                    });
                }

            } else if (this.combinedType.userList.length > 1) {
                this.combinedType.form.patchValue({
                    toUser: this.combinedType.userList[0]
                });
                this.combinedType.form.get('toUser').setValidators(Validators.required);
                this.combinedType.form.updateValueAndValidity();
            } else if (this.combinedType.userList.length === 0) {
                this.isUserNotPresentForCombine = true;
            }
            this.spinner = false;
        });
    }

    public getIndividualUserList(role, i: number) {
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
            this.individualType.users.set(i, response.detail);
            const users: User[] = response.detail;
            this.isUserPresent[i] = true;
            if (users.length === 0) {
                this.isUserPresent[i] = false;
            } else {
                this.individualType.form.get(['actions', i, 'toUser']).patchValue(users[0]);
                this.individualType.form.get(['actions', i, 'toUser']).setValidators(Validators.required);
                this.individualType.form.updateValueAndValidity();
            }
        });
    }

    public onSubmit(): void {
        // if (this.stageType === 'individually') {
        //     this.individualType.submitted = true;
        //     if (this.individualType.form.invalid) {
        //         return;
        //     }
        //     let dialogRef;
        //     if (this.docAction === DocAction[DocAction.REVERT_APPROVED]) {
        //         const action = this.individualType.form.get('actions') as FormArray;
        //         action.value.forEach((ac) => {
        //            ac.toUser = this.toUser;
        //            ac.toRole = this.toUser.role;
        //         });
        //         dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
        //             context: {
        //                 individualCombine: this.individualType.form.value,
        //                 action: this.docAction
        //             }
        //         });
        //     } else {
        //         dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
        //             context: {
        //                 individualCombine: this.individualType.form.value,
        //                 action: this.docAction
        //             }
        //         });
        //     }
        //     dialogRef.onClose.subscribe((verified: boolean) => {
        //         if (verified === true) {
        //             this.postCombinedAction(false);
        //             this.nbDialogRef.close();
        //             this.emitter.emit(true);
        //         }
        //     });
        // } else if (this.stageType === 'combined') {
            this.combinedType.submitted = true;
            if (this.combinedType.form.invalid) {
                return;
            }
            let dialogRef;
            if (this.docAction === DocAction[DocAction.REVERT_APPROVED]) {
                this.combinedType.form.get('toUser').patchValue(this.toUser);
                this.combinedType.form.get('toRole').patchValue(this.toUser.role);
                dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
                    context: {
                        toUser: this.toUser,
                        toRole: this.toUser.role,
                        action: this.docAction
                    }
                });
            } else {
                dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
                    context: {
                        toUser: this.combinedType.form.get('toUser').value,
                        toRole: this.combinedType.form.get('toRole').value,
                        action: this.docAction
                    }
                });
            }
            dialogRef.onClose.subscribe((verified: boolean) => {
                if (verified === true) {
                    this.postCombinedAction(true);
                    this.nbDialogRef.close();
                    this.emitter.emit(true);
                } else {
                    this.emitter.emit();
                }
            });
        // }
    }

    private buildCombinedForm(): FormGroup {
        const l = this.combinedLoan.loans[0];
        return this.formBuilder.group({
            loanConfigId: [undefined],
            customerLoanId: [undefined],
            toUser: [undefined],
            toRole: [undefined, this.isForward ? [Validators.required] : []],
            docAction: [this.docAction],
            docActionMsg: [this.docActionMsg],
            comment: [undefined, Validators.required],
            documentStatus: [this.documentStatus],
            isSol: [ObjectUtil.isEmpty(l.isSol) ? undefined : l.isSol],
            solUser: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser],
            selectedRoleForSol: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser.role],
            isHsov: [ObjectUtil.isEmpty(l.isHsov) ? undefined : l.isHsov],
            dualApproval: [ObjectUtil.isEmpty(l.dualApproval) ? undefined : l.dualApproval],
            dualApproved: [ObjectUtil.isEmpty(l.dualApproved) ? undefined : l.dualApproved],
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
                docActionMsg: [this.docActionMsg],
                comment: [undefined, Validators.required],
                documentStatus: [this.documentStatus],
                loanName: undefined,
                isSol: [ObjectUtil.isEmpty(l.isSol) ? undefined : l.isSol],
                solUser: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser],
                selectedRoleForSol: [ObjectUtil.isEmpty(l.solUser) ? undefined : l.solUser.role],
                isHsov: [ObjectUtil.isEmpty(l.isHsov) ? undefined : l.isHsov],
                dualApproval: [ObjectUtil.isEmpty(l.dualApproval) ? undefined : l.dualApproval],
                dualApproved: [ObjectUtil.isEmpty(l.dualApproved) ? this.docAction === 'DUAL_APPROVAL_PENDING' : l.dualApproved]

            }));
        });
        return form;
    }

    private conditionalCombinedDataLoad(): void {
        switch (this.popUpTitle) {
            case 'Send Forward':
            case 'Approve':
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
        this.nbDialogRef.close(true);
        if (isCombined) {
            actions = this.combinedLoan.loans.map((l) => {
                let dualApproved = false;
                if (this.docAction === 'DUAL_APPROVAL_PENDING') {
                    dualApproved = true;
                } else {
                    dualApproved = l.dualApproved;
                }
                    return {
                    loanConfigId: l.loan.id,
                    customerLoanId: l.id,
                    toUser: this.combinedType.form.get('toUser').value,
                    toRole: this.combinedType.form.get('toRole').value,
                    docAction: this.combinedType.form.get('docAction').value,
                    docActionMsg: this.combinedType.form.get('docActionMsg').value,
                    comment: this.combinedType.form.get('comment').value,
                    documentStatus: this.combinedType.form.get('documentStatus').value,
                    isSol: this.combinedType.form.get('isSol').value,
                    solUser: this.combinedType.form.get('solUser').value,
                    isHsov: this.combinedType.form.get('isHsov').value,
                    dualApproval: this.combinedType.form.get('dualApproval').value,
                    dualApproved: dualApproved
                };
            });

        } else {
            actions = this.individualType.form.get('actions').value;
        }
        this.loanFormService.postCombinedLoanAction(actions, !isCombined).subscribe(() => {
            const msg = `Successfully ${this.docActionMsg}`;
            this.toastService.show(new Alert(AlertType.SUCCESS, msg));
            this.router.navigate(['/home/pending']);
        }, error => {
            this.nbDialogRef.close(false);
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }


    // sol logic starts here
    // individual
    public getIndividualUserSolList(role, i: number) {
        if (!ObjectUtil.isEmpty(role)) {
            this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
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
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
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
            this.combinedType.form.get('solUser').clearValidators();
            this.combinedType.form.get('solUser').updateValueAndValidity();
        }
    }

    dualApproval(event, individual) {
        if (event && !individual) {
            this.combinedDual = true;
        } else {
            this.combinedDual = false;
        }
    }

    dualApprovalIndividual(event, index) {
        if (!event) {
            this.individualType.form.get(['actions', index]).patchValue({
                dualApproval: false
            });
        } else {
            this.individualType.form.get(['actions', index]).patchValue({
                dualApproval: true
            });
        }

    }

    hsovIndividual(event, index) {
        if (!event) {
            this.individualType.form.get(['actions', index]).patchValue({
                isHsov: false
            });
        } else {
            this.individualType.form.get(['actions', index]).patchValue({
                isHsov: true
            });
        }

    }

    hsov(event, individual) {
        if (event && !individual) {
            this.combinedHSOV = true;
        } else {
            this.combinedHSOV = false;
        }
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }


}

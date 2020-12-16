import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../admin/component/user/user.service';
import {User} from '../../../admin/modal/user';
import {LoanActionVerificationComponent} from '../loan-action-verification/loan-action-verification.component';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';
import {Router} from '@angular/router';
import {LoanDataHolder} from '../../model/loanData';
import {DocAction} from '../../model/docAction';
import {LoanStage} from '../../model/loanStage';
import {SocketService} from '../../../../@core/service/socket.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {DocStatus} from '../../model/docStatus';
import {ApprovalRoleHierarchyService} from '../../approval/approval-role-hierarchy.service';
import {Role} from '../../../admin/modal/role';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-loan-action-modal',
    templateUrl: './loan-action-.+987modal.component.html',
    styleUrls: ['./loan-action-modal.component.scss']
})
export class LoanActionModalComponent implements OnInit {

    @Input() loanConfigId: number;
    @Input() customerLoanId: number;
    @Input() docAction: string;
    @Input() documentStatus: DocStatus;
    @Input() popUpTitle: 'Send Forward' | 'Approve' | 'Send Backward' | 'Reject' | 'Close' | string;
    @Input() isForward: boolean;
    @Input() toRole: Role;
    @Input() additionalDetails: any;
    @Input() branchId: number;
    @Input() isMaker: boolean;
    @Input() customerLoanHolder: LoanDataHolder;
    submitted = false;
    formAction: FormGroup;
    userList: Array<User> = new Array<User>();
    sendForwardBackwardList = [];
    roleId: number;
    solUserList: Array<User> = new Array<User>();
    showHideSolUser = false;
    solNoUserMessage = 'No User Present in this Role';
    solNoUserSelectedMessage = 'Please Select User For Sol';
    isNoUserSol = false;
    isNoUserSelectedSol = false;
    isEmptyUser = false;

    // selectedRoleForSol:Role = undefined;

    constructor(
        public nbDialogRef: NbDialogRef<LoanActionModalComponent>,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private nbDialogService: NbDialogService,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private router: Router,
        private socketService: SocketService,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
    ) {
    }

    ngOnInit() {
        this.formAction = this.buildForm();
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        this.conditionalDataLoad();
        if (!ObjectUtil.isEmpty(this.customerLoanHolder)) {
            this.isSolChecked(this.customerLoanHolder.isSol);
        }
    }

    public getUserList(role) {
        this.isEmptyUser = false;
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.formAction.patchValue({
                    toUser: this.userList[0]
                });
            } else if (this.userList.length > 1) {
                this.formAction.get('toUser').setValidators(Validators.required);
                this.formAction.updateValueAndValidity();
            } else if (this.userList.length === 0) {
                this.isEmptyUser = true;
            }
        });
    }

    public onSubmit() {
        console.log(this.formAction.value);
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }
        if (!this.isMaker) {
            this.formAction.patchValue({
                solUser: this.customerLoanHolder.solUser,
                isSol: this.customerLoanHolder.isSol,
            });
        } else {
            const isSolSelected = this.formAction.get('isSol').value;
            if (isSolSelected) {
                const selectedSolUser = this.formAction.get('solUser').value;
                if (ObjectUtil.isEmpty(selectedSolUser)) {
                    this.isNoUserSelectedSol = true;
                    return;
                }
            }
        }

        const dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
            context: {
                toUser: this.formAction.get('toUser').value, toRole: this.formAction.get('toRole').value, action: this.docAction
            }
        });
        dialogRef.onClose.subscribe((verified: boolean) => {
            if (verified === true) {
                this.postAction();
                this.nbDialogRef.close();
            }
        });
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            loanConfigId: [this.loanConfigId],
            customerLoanId: [this.customerLoanId],
            toUser: [undefined],
            toRole: [this.toRole, this.isForward ? [Validators.required] : []],
            docAction: [this.docAction],
            comment: [undefined, Validators.required],
            documentStatus: [this.documentStatus],
            isSol: [undefined],
            solUser: [undefined],
            selectedRoleForSol: [undefined]
        });
    }

    private conditionalDataLoad(): void {
        switch (this.popUpTitle) {
            case 'Send Forward':
                const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
                const refId = approvalType === 'DEFAULT' ? 0 : approvalType === 'LOAN_TYPE' ? this.loanConfigId : this.customerLoanId;

                this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId)
                    .subscribe((response: any) => {
                        this.sendForwardBackwardList = [];
                        this.sendForwardBackwardList = response.detail;
                    });
                break;
            default:
                if (!ObjectUtil.isEmpty(this.toRole)) {
                    this.getUserList(this.toRole);
                }// send backward to committee

        }
    }

    private postAction() {

        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            const msg = `Document Has been Successfully ${this.formAction.get('docAction').value}`;
            this.toastService.show(new Alert(AlertType.SUCCESS, msg));
            this.sendLoanNotification(response.detail.customerLoanId);
            this.router.navigate(['/home/pending']);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
        });
    }

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
            if (docAction === DocAction.value(DocAction.FORWARD) ||
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
        this.formAction.patchValue({
            solUser: [undefined]
        });
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
            this.solUserList = response.detail;
            this.isNoUserSol = false;
            if (this.solUserList.length === 1) {
                this.formAction.patchValue({
                    solUser: this.solUserList[0]
                });
            } else if (this.solUserList.length > 1) {
                this.formAction.patchValue({
                    solUser: this.solUserList[0]
                });
                this.formAction.get('solUser').setValidators(Validators.required);
                this.formAction.updateValueAndValidity();
            } else if (this.solUserList.length === 0) {
                this.isNoUserSol = true;
            }
        });

    }

    isSolChecked(event) {
        if (event) {
            this.showHideSolUser = true;
            this.formAction.patchValue({
                solUser: null,
                isSol: true
            });
            if (this.customerLoanHolder.isSol) {
                this.formAction.get('solUser').patchValue(this.customerLoanHolder.solUser);
                this.formAction.get('selectedRoleForSol').patchValue(this.customerLoanHolder.solUser.role);
            }
            this.formAction.get('solUser').setValidators(Validators.required);
            this.formAction.updateValueAndValidity();
        } else {
            this.showHideSolUser = false;
            this.formAction.patchValue({
                solUser: null,
                isSol: false
            });
            this.formAction.get('solUser').clearValidators();
        }
    }

}

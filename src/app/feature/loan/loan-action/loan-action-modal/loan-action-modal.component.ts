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
import {RoleType} from '../../../admin/modal/roleType';
import {RoleService} from '../../../admin/component/role-permission/role.service';
import {Editor} from '../../../../@core/utils/constants/editor';
import {Clients} from '../../../../../environments/Clients';
import {LoanTag} from '../../model/loanTag';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-loan-action-modal',
    templateUrl: './loan-action-modal.component.html',
    styleUrls: ['./loan-action-modal.component.scss']
})
export class LoanActionModalComponent implements OnInit {

    @Input() beneficiaryId: any;
    @Input() legalDoc: any;
    @Input() isRemitLoan: any;
    @Input() loanConfigId: number;
    @Input() customerLoanId: number;
    @Input() docAction: string;
    @Input() docActionMsg: string;
    @Input() documentStatus: DocStatus;
    @Input() popUpTitle: 'Send Forward' | 'Approve' | 'Send Backward' | 'Reject' | 'Close' | string;
    @Input() isForward: boolean;
    @Input() toRole: Role;
    @Input() additionalDetails: any;
    @Input() branchId: number;
    @Input() isMaker: boolean;
    @Input() customerLoanHolder: LoanDataHolder;
    @Input() toUser: User;
    @Input() comment: string;
    submitted = false;
    formAction: FormGroup;
    userList: Array<User> = new Array<User>();
    hsovUserList: Array<User> = new Array<User>();
    sendForwardBackwardList = [];
    roleId: number;
    isEmptyUser = false;
    showUserList = true;
    ckeConfig = Editor.CK_CONFIG;
    spinner = false;
    hsovRole: any;
    dual: any;
    hsov: any;
    loanTag = false;

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
        private roleService: RoleService,
        private spinnerService: NgxSpinnerService
    ) {
    }

    ngOnInit() {
        this.formAction = this.buildForm();
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        this.conditionalDataLoad();
        if (!ObjectUtil.isEmpty(this.customerLoanHolder)) {
            if (this.customerLoanHolder.loan.loanTag === LoanTag.getKeyByValue(LoanTag.REMIT_LOAN)) {
                this.loanTag = true;
            }
            this.formAction.patchValue({
                isHsov: this.customerLoanHolder.isHsov
            });
            this.hsov = this.customerLoanHolder.isHsov;
            this.formAction.patchValue({
                dualApproval: this.customerLoanHolder.dualApproval
            });
            this.dual = this.customerLoanHolder.dualApproval;
        }
        // this.getHsovUserList();
        // this.getHsovRole();
        if (!ObjectUtil.isEmpty(this.toUser)) {
            this.formAction.patchValue({
                toUser: this.toUser,
                toRole: this.toUser.role
            });
        }
        if (!ObjectUtil.isEmpty(this.comment)) {
            this.formAction.patchValue({
                comment: this.comment
            });
        }
    }

    public getHsovRole() {
        this.roleService.getHSOVRoles().subscribe((res: any) => {
            this.hsovRole = res.detail;
        });
    }

    public getHsovUserList() {
        this.userService.getUserListByRoleHSOV().subscribe((res: any) => {
            this.hsovUserList = res.detail;
        });
    }

    public getUserList(role) {
        this.spinner = true;
        this.isEmptyUser = false;
        this.showUserList = true;
        this.roleService.detail(role.id).subscribe((res: any) => {
            role = res.detail;
            this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.branchId).subscribe((response: any) => {
                this.userList = response.detail;
                if (this.userList.length === 0) {
                    this.isEmptyUser = true;
                } else if (this.userList.length === 1) {
                    this.formAction.patchValue({
                        toUser: this.userList[0]
                    });
                } else if ((role.roleType === RoleType.COMMITTEE) && this.userList.length > 1) {
                    const committeeDefaultUser = this.userList.filter(f => f.name.toLowerCase().includes('default'));
                    this.showUserList = false;

                    if (committeeDefaultUser.length === 0) {
                        this.formAction.patchValue({
                            toUser: this.userList[0]
                        });
                    } else {
                        this.formAction.patchValue({
                            toUser: committeeDefaultUser[0]
                        });
                    }

                } else if (this.userList.length > 1) {
                    this.formAction.patchValue({
                        toUser: this.userList[0]
                    });
                    this.formAction.get('toUser').setValidators(Validators.required);
                    this.formAction.updateValueAndValidity();
                }
                this.spinner = false;
            }, err => {
                this.spinner = false;
            });
        });
    }

    public onSubmit() {
        const comment = this.formAction.value.comment;
        const docAction = this.formAction.value.docAction;
        const docActionMSG = this.formAction.value.docActionMsg;
        const link = window.location.href;
        if (this.docAction === 'DUAL_APPROVAL_PENDING') {
            this.formAction.patchValue({
                dualApproved: true
            });
        }
        if (docActionMSG === 'Send Legal Doc') {
            const sendDocToRemit = {
                beneficiaryId: this.beneficiaryId,
                legalDoc: JSON.stringify(this.legalDoc),
                remarks: comment,
                status: this.docAction,
                institution: Clients.Bank
            };
            this.loanFormService.sendLegalDocumentBackToSenderOrAgent(sendDocToRemit).subscribe((res) => {
                this.nbDialogRef.close();
                this.spinnerService.hide();

            }, error => {
                this.nbDialogRef.close();
                this.spinnerService.hide();

                console.log(error);
            });
        } else {
            this.formAction.get('link').patchValue(link);
            this.submitted = true;
            if (this.formAction.invalid) {
                return;
            }
            const dialogRef = this.nbDialogService.open(LoanActionVerificationComponent, {
                context: {
                    toUser: this.formAction.get('toUser').value,
                    toRole: this.formAction.get('toRole').value,
                    action: this.docAction
                }
            });
            dialogRef.onClose.subscribe((verified: boolean) => {
                if (docAction === 'SEND_BACK_TO_SENDER' || docAction === 'SEND_BACK_TO_AGENT') {
                    const beneficiaryObj = {
                        'beneficiaryId': this.beneficiaryId,
                        'status': docAction,
                        'remarks': this.formAction.value.comment
                    };
                    this.loanFormService.postLoanBackToSenderOrAgent(beneficiaryObj).subscribe(res => {
                        this.spinnerService.hide();
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
                        this.spinnerService.hide();
                        console.log(error);
                    });
                } else if (this.isRemitLoan && docAction === 'APPROVED') {
                    const beneficiaryObj = {
                        'beneficiaryId': this.beneficiaryId,
                        'status': docAction,
                        'remarks': this.formAction.value.comment
                    };
                    this.loanFormService.postLoanBackToSenderOrAgent(beneficiaryObj).subscribe(res => {
                        this.spinnerService.hide();
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
                        this.spinnerService.hide();
                        console.log(error);
                    });

                } else if (this.isRemitLoan && docAction === 'REJECT') {
                    const beneficiaryObj = {
                        'beneficiaryId': this.beneficiaryId,
                        'status': 'REJECTED',
                        'remarks': this.formAction.value.comment
                    };
                    this.loanFormService.postLoanBackToSenderOrAgent(beneficiaryObj).subscribe(res => {
                        this.spinnerService.hide();
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
                        this.spinnerService.hide();
                        console.log(error);
                    });

                } else {
                    if (verified === true) {
                        this.postAction();
                        this.nbDialogRef.close();
                    }
                }
            });
        }
    }

    private buildForm(): FormGroup {
        return this.formBuilder.group({
            loanConfigId: [this.loanConfigId],
            customerLoanId: [this.customerLoanId],
            toUser: [undefined],
            toRole: [this.toRole, this.isForward ? [Validators.required] : []],
            docAction: [this.docAction],
            docActionMsg: [this.docActionMsg],
            comment: [undefined, Validators.required],
            documentStatus: [this.documentStatus],
            isHsov: [undefined],
            dualApproval: [undefined],
            dualApproved: [undefined],
            link: [undefined],
        });
    }

    private conditionalDataLoad(): void {
        switch (this.popUpTitle) {
            case 'Send Forward':
            case 'Approve':
                const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
                const refId = approvalType === 'DEFAULT' ? 0 : approvalType === 'LOAN_TYPE' ? this.loanConfigId : this.customerLoanId;

                this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId)
                    .subscribe((response: any) => {
                        this.sendForwardBackwardList = [];
                        // this.sendForwardBackwardList = response.detail;
                        this.sendForwardBackwardList = response.detail.sort(function (a, b) {
                            return parseFloat(b.roleOrder) - parseFloat(a.roleOrder);
                        });
                        if (this.customerLoanHolder.isHsov) {
                            this.sendForwardBackwardList = this.sendForwardBackwardList.filter(l => l.role.roleType === RoleType.APPROVAL);
                        }
                        if (this.sendForwardBackwardList.length > 0) {
                            this.formAction.patchValue({
                                toRole: this.sendForwardBackwardList[0].role
                            });
                            this.getUserList(this.sendForwardBackwardList[0].role);
                        }
                    });
                break;

            default:
                if (!ObjectUtil.isEmpty(this.toRole)) {
                    this.getUserList(this.toRole);
                }
        }
    }

    private postAction() {
        this.nbDialogRef.close(true);
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            const msg = `Successfully ${this.formAction.get('docActionMsg').value}`;
            this.toastService.show(new Alert(AlertType.SUCCESS, msg));
            this.sendLoanNotification(response.detail.customerLoanId);
            this.router.navigate(['/home/pending']);
        }, e => {
            this.nbDialogRef.close(false);
            this.toastService.show(new Alert(AlertType.ERROR, e.error.message));
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

    isHSOVChecked(event) {
            this.formAction.patchValue({
                isHsov: event
            });
            this.hsov = event;
        this.docAction = this.isMaker ? this.docAction : (this.hsov ? 'HSOV_PENDING' : 'APPROVED');
        this.documentStatus = this.isMaker ? this.documentStatus : event ? DocStatus.HSOV_PENDING : DocStatus.APPROVED;
        this.formAction.patchValue({
            docAction: this.docAction,
            documentStatus: this.documentStatus
        });
    }
    dualApproval(event) {
            this.formAction.patchValue({
                dualApproval: event
            });
            this.dual = event;
        this.docAction = this.isMaker ? this.docAction : event ? 'DUAL_APPROVAL_PENDING' : 'APPROVED';
        this.documentStatus = this.isMaker ? this.documentStatus : event ? DocStatus.DUAL_APPROVAL_PENDING : DocStatus.APPROVED;
        this.formAction.patchValue({
            docAction: this.docAction,
            documentStatus: this.documentStatus
        });
    }

}

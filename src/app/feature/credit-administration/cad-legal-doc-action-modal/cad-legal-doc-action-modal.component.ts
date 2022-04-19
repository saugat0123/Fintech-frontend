import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../@core/service/user.service';
import {User} from '../../admin/modal/user';
import {LoanActionVerificationComponent} from '../../loan/loan-action/loan-action-verification/loan-action-verification.component';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../@core/utils';
import {Router} from '@angular/router';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanDataHolder} from '../../loan/model/loanData';
import {DocAction} from '../../loan/model/docAction';
import {LoanStage} from '../../loan/model/loanStage';
import {SocketService} from '../../../@core/service/socket.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ApprovalRoleHierarchyService} from '../../loan/approval/approval-role-hierarchy.service';
import {Role} from '../../admin/modal/role';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {RoleType} from '../../admin/modal/roleType';
import {RoleService} from '../../admin/component/role-permission/role.service';

import {Editor} from '../../../@core/utils/constants/editor';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LaxmiOfferLetterConst} from '../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter-const';
import {Clients} from '../../../../environments/Clients';
import {CreditAdministrationService} from '../service/credit-administration.service';

@Component({
    selector: 'app-cad-legal-doc-action-modal',
    templateUrl: './cad-legal-doc-action-modal.component.html',
    styleUrls: ['./cad-legal-doc-action-modal.component.scss']
})
export class CadLegalDocActionModalComponent implements OnInit {

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
    @Input() formData: FormData;
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
    showUserList = true;
    ckeConfig = Editor.CK_CONFIG;
    spinner = false;
    falseCredential = false;
    falseCredentialMessage;
    private securityUrl = ApiConfig.TOKEN;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });

    // selectedRoleForSol:Role = undefined;

    constructor(
        public nbDialogRef: NbDialogRef<CadLegalDocActionModalComponent>,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private nbDialogService: NbDialogService,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private router: Router,
        private socketService: SocketService,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
        private roleService: RoleService,
        private http: HttpClient,
        private modalService: NgbModal,
    ) {
    }

    ngOnInit() {
        this.formAction = this.buildForm();
        this.formData.append('beneficiaryId', this.beneficiaryId);
        this.formData.append('status', DocStatus.value(this.documentStatus));
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        this.conditionalDataLoad();
        if (!ObjectUtil.isEmpty(this.customerLoanHolder)) {
            this.isSolChecked(this.customerLoanHolder.isSol);
        }
    }

    public getUserList(role) {
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
            });
        });
    }

    public onSubmit() {
        this.spinner = true;
        const comment = this.formAction.value.comment;
        this.formData.append('remarks', comment);
        this.formData.append('institution', 'BANK');
        this.legalDoc = this.legalDoc.filter(d => d.docName !== LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.OFFER_LETTER));
        const docAction = this.formAction.value.docAction;
        const docActionMSG = this.formAction.value.docActionMsg;
        if (docActionMSG === 'Send Legal Doc') {
            const sendDocToRemit = {
                beneficiaryId: this.beneficiaryId,
                legalDoc: JSON.stringify(this.legalDoc),
                remarks: comment,
                status: this.docAction,
                institution: Clients.Bank
            };
            this.loanFormService.sendLegalDocumentBackToSenderOrAgent(this.formData).subscribe((res) => {
                this.spinner = false;
                this.nbDialogRef.close();
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Sucessfully Forwarded Document To Agent/Sender'));
                console.log('response', res);
            }, error => {
                this.spinner = false;
                this.nbDialogRef.close();
                console.log(error);
            });
        } else {

            this.submitted = true;
            if (this.formAction.invalid) {
                return;
            }
            if (this.isMaker) {
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
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
                        console.log(error);
                    });
                } else if (this.isRemitLoan && docAction === 'APPROVED') {
                    const beneficiaryObj = {
                        'beneficiaryId': this.beneficiaryId,
                        'status': docAction,
                        'remarks': this.formAction.value.comment
                    };
                    this.loanFormService.postLoanBackToSenderOrAgent(beneficiaryObj).subscribe(res => {
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
                        console.log(error);
                    });

                } else if (docAction === 'REJECT') {
                    const beneficiaryObj = {
                        'beneficiaryId': this.beneficiaryId,
                        'status': 'REJECTED',
                        'remarks': this.formAction.value.comment
                    };
                    this.loanFormService.postLoanBackToSenderOrAgent(beneficiaryObj).subscribe(res => {
                        if (verified === true) {
                            this.postAction();
                            this.nbDialogRef.close();
                        }
                    }, error => {
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
                        // this.sendForwardBackwardList = response.detail;
                        this.sendForwardBackwardList = response.detail.sort(function (a, b) {
                            return parseFloat(b.roleOrder) - parseFloat(a.roleOrder);
                        });
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
                }// send backward to committee

        }
    }

    private sendBackToSenderOrAgent() {

    }

    private postAction() {
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            const msg = `Successfully ${this.formAction.get('docActionMsg').value}`;
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

            } else if (this.solUserList.length === 0) {
                this.isNoUserSol = true;
            }
        });

    }

    openLogin(temp) {
        this.modalService.open(temp);
    }

    isSolChecked(event) {
        if (event) {
            this.showHideSolUser = true;
            this.formAction.patchValue({
                solUser: null,
                isSol: true
            });
            if (this.customerLoanHolder.isSol) {
                this.formAction.get('solUser').patchValue(ObjectUtil.isEmpty(this.customerLoanHolder.solUser) ? null : this.customerLoanHolder.solUser);
                this.formAction.get('selectedRoleForSol').patchValue(ObjectUtil.isEmpty(this.customerLoanHolder.solUser) ? null : this.customerLoanHolder.solUser.role);
            }
            this.formAction.get('solUser').setValidators(Validators.required);
            this.formAction.get('solUser').updateValueAndValidity();
        } else {
            this.showHideSolUser = false;
            this.formAction.patchValue({
                solUser: null,
                isSol: false
            });
            this.formAction.get('solUser').setValidators([]);
            this.formAction.get('solUser').clearValidators();
            this.formAction.get('solUser').updateValueAndValidity();
        }
    }

    onLogin(dataValue) {

        const data: { email: string, password: string } = dataValue.value;
        data.email = LocalStorageUtil.getStorage().username;
        const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, requestBody, {headers: this.headers})
            .subscribe(
                () => {
                    this.modalService.dismissAll();
                    this.onSubmit();
                },
                error => {
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


    }
}
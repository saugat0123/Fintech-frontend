import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {User} from '../../admin/modal/user';
import {UserService} from '../../admin/component/user/user.service';
import {ActionModel} from '../model/action';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {DocStatus} from '../model/docStatus';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {LoanConfig} from '../../admin/modal/loan-config';
import {RoleType} from '../../admin/modal/roleType';
import {SocketService} from '../../../@core/service/socket.service';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../model/loanData';
import {LoanStage} from '../model/loanStage';
import {DocAction} from '../model/docAction';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {ApprovalRoleHierarchyService} from '../approval/approval-role-hierarchy.service';


@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit {


    @Input() loanConfigId: number;
    @Input() id: number;
    @Input() loanCategory: string;
    @Input() catalogueStatus = false;
    @Input() limitExceed: number;
    @Input() loanRemarks: string;

    @Input() actionsList: ActionModel;
    popUpTitle: string;
    currentUserRoleType = false;
    sendForwardBackwardList = [];
    formAction: FormGroup;
    committeeRole = false;
    userList: Array<User> = new Array<User>();
    submitted = false;
    loanConfig: LoanConfig = new LoanConfig();
    private securityUrl = ApiConfig.TOKEN;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });
    falseCredential = false;
    falseCredentialMessage = '';
    roleId: number;

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private toastService: ToastService,
        private userService: UserService,
        private loanConfigService: LoanConfigService,
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private http: HttpClient,
        private socketService: SocketService,
        private loanFormService: LoanFormService
    ) {
    }

    ngOnInit() {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );

        this.loanConfigService.detail(this.loanConfigId).subscribe((response: any) => {
            this.loanConfig = response.detail;
        });

        const roleName: string = LocalStorageUtil.getStorage().roleName;
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        const roleType: string = LocalStorageUtil.getStorage().roleType;
        if (roleName !== 'admin') {
            this.currentUserRoleType = roleType === RoleType.MAKER;
        }

        if (roleType === RoleType.MAKER) {
            this.currentUserRoleType = true;
        }

        if (roleType === RoleType.COMMITTEE) {
            this.committeeRole = true;
        } else {
            this.committeeRole = false;
        }

    }

    sendBackwardList(template, val) {
        this.popUpTitle = 'Send Backward';

        this.formAction.patchValue({
                docAction: DocAction.value(DocAction.BACKWARD),
                documentStatus: DocStatus.PENDING,
                comment: null
            }
        );

        if (this.committeeRole && val === 1) {
            this.popUpTitle = 'Send Backward To ' + LocalStorageUtil.getStorage().roleName;
            const role = {
                id: LocalStorageUtil.getStorage().roleId
            };
            this.formAction.patchValue({
                    docAction: DocAction[DocAction.BACKWARD_TO_COMMITTEE],
                    toRole: role
                }
            );

            this.getUserList(role);
        }
        this.modalService.open(template);
    }

    sendForwardList(template) {
        this.popUpTitle = 'Send Forward';

        const approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
        const refId = approvalType === 'DEFAULT' ? 0 : approvalType === 'LOAN_TYPE' ? this.loanConfigId : this.id;

        this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId).subscribe(
            (response: any) => {
                this.sendForwardBackwardList = [];

                this.sendForwardBackwardList = response.detail;
            });

        this.formAction.patchValue({
                docAction: DocAction.value(DocAction.FORWARD),
                documentStatus: DocStatus.PENDING,
                comment: null
            }
        );
        if (this.limitExceed !== 0) {
            const parsedRemark = JSON.parse(this.loanRemarks);
            this.toastService.show(new Alert(AlertType.INFO, parsedRemark.limitExceed));
        } else {
            this.modalService.open(template);
        }

    }

    onSubmit(templateLogin) {
        this.falseCredential = false;
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }
        this.modalService.open(templateLogin);
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id
            }
        );
        this.onClose();
        this.modalService.open(templateLogin);

    }

    getUserList(roleId) {
        this.userService.getUserListByRoleId(roleId.id).subscribe((response: any) => {
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.formAction.patchValue({
                        toUser: this.userList[0]
                    }
                );
            }
        });
    }

    onClose() {
        this.modalService.dismissAll(this.formAction.value);
    }

    onEdit() {
        this.route.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.loanConfigId,
                customerId: this.id,
                loanCategory: this.loanCategory
            }
        });
    }

    onLogin(dataValue) {
        const data: { email: string, password: string } = dataValue.value;
        data.email = LocalStorageUtil.getStorage().username;
        const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        this.http.post(this.securityUrl, requestBody, {headers: this.headers})
            .subscribe(
                () => {
                    this.onClose();
                    this.postAction();
                },
                error => {
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


    }

    postAction() {
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.sendLoanNotification(response.detail.customerLoanId);
            this.route.navigate(['/home/pending']);
        }, error => {


            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    approved(template) {
        this.popUpTitle = 'APPROVED';
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id,
                docAction: 'APPROVED',
                documentStatus: DocStatus.APPROVED,
                comment: null
            }
        );
        this.modalService.open(template);


    }

    closeReject(commentTemplate, value) {
        this.popUpTitle = value;
        this.modalService.open(commentTemplate);
        let docAction = value;
        let documentStatus = null;
        if (value === 'REJECTED') {
            docAction = 'REJECT';
            documentStatus = DocStatus.REJECTED;
        } else {
            docAction = 'CLOSED';
            documentStatus = DocStatus.CLOSED;
        }
        this.formAction.patchValue({
                loanConfigId: this.loanConfigId,
                customerLoanId: this.id,
                docAction: docAction,
                documentStatus: documentStatus
            }
        );


    }

    /*print() {
        window.print();
    }*/

    generateOfferLetter(templateUrl) {
        this.route.navigate([templateUrl], {queryParams: {customerId: this.id}});
    }

    deleteCustomerLoan() {
        this.loanFormService.deleteLoanCustomer(this.id).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully Deleted'));
                this.route.navigate(['/home/pending']);
            },
            error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            });
    }

    sendLoanNotification(customerLoanId: number): void {
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

    detailedPrintAction() {
        this.route.navigate(['/home/loan/detailed-summary'], {
            queryParams: {
                loanConfigId: this.loanConfigId,
                customerId: this.id
            }
        });
    }
}

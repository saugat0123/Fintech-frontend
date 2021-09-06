import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CustomerOfferLetter} from '../../loan/model/customer-offer-letter';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanActionService} from '../../loan/loan-action/service/loan-action.service';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../@core/utils';
import {UserService} from '../../admin/component/user/user.service';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ApprovalRoleHierarchyService} from '../../loan/approval/approval-role-hierarchy.service';
import {CustomerOfferLetterService} from '../../loan/service/customer-offer-letter.service';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {SocketService} from '../../../@core/service/socket.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {DocStatus} from '../../loan/model/docStatus';
import {RoleType} from '../../admin/modal/roleType';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {PostApprovalDocApproveComponent} from '../post-approval-doc-approve/post-approval-doc-approve.component';


@Component({
    selector: 'app-offer-letter-action',
    templateUrl: './offer-letter-action.component.html',
    styleUrls: ['./offer-letter-action.component.scss']
})
export class OfferLetterActionComponent implements OnInit {


    @Input()
    selectedBranchId;

    id;
    allId;
    popUpTitle: string;
    currentUserRoleType = false;

    formAction: FormGroup;

    submitted = false;
    userList = [];
    errorMsg;
    errorMsgStatus = false;
    currentUserId;
    isBackwardDisabled = false;
    isForwardDisabled = false;
    isApprovedDisabled = false;

    private securityUrl = ApiConfig.TOKEN;
    private headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic Y3Atc29sdXRpb246Y3Bzb2x1dGlvbjEyMyoj',
    });
    falseCredential = false;
    falseCredentialMessage = '';
    customerOfferLetter: CustomerOfferLetter;
    sendForwardBackwardList = [];
    roleId;

    constructor(
        private router: ActivatedRoute,
        private route: Router,
        private loanActionService: LoanActionService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private toastService: ToastService,
        private userService: UserService,
        private loanConfigService: LoanConfigService,
        private modalService: NgbModal,
        private http: HttpClient,
        private socketService: SocketService,
        private loanFormService: LoanFormService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
    ) {
    }

    ngOnInit() {
        this.currentUserId = LocalStorageUtil.getStorage().userId;
        this.roleId = LocalStorageUtil.getStorage().roleId;
        this.router.queryParams.subscribe(
            (paramsValue: Params) => {
                this.allId = {

                    customerId: null,
                    existing: null

                };
                this.allId = paramsValue;
                this.id = this.allId.customerId;
                this.customerOfferLetterService.getByCustomerLoanId(this.id).subscribe(response => {
                    this.customerOfferLetter = response.detail;
                    if (this.customerOfferLetter !== undefined) {
                        if (this.currentUserId.toString() === this.customerOfferLetter.createdBy.toString()) {
                            this.isBackwardDisabled = true;
                            this.selectedBranchId = this.customerOfferLetter.customerLoan.branch.id;
                        }
                        if (this.customerOfferLetter.docStatus.toString() === DocStatus.value(DocStatus.APPROVED)) {
                            this.isForwardDisabled = true;
                        }
                    } else {
                        this.isBackwardDisabled = true;
                        this.isApprovedDisabled = true;
                    }
                }, error => {

                });

                const roleName: string = LocalStorageUtil.getStorage().roleName;
                const roleType: string = LocalStorageUtil.getStorage().roleType;
                if (roleName !== 'admin') {
                    this.currentUserRoleType = roleType === RoleType.MAKER;
                }

                if (roleType === RoleType.MAKER) {
                    this.currentUserRoleType = true;
                    this.isForwardDisabled = false;
                    this.isApprovedDisabled = true;
                    this.isBackwardDisabled = true;
                } else {
                    this.isForwardDisabled = false;
                    this.isApprovedDisabled = false;
                }

                if (roleName === 'CAD') {
                    this.isForwardDisabled = true;
                    this.isApprovedDisabled = false;
                }
                if (this.allId.existing === 'false' || this.allId.existing === false) {
                    this.isApprovedDisabled = true;
                    this.isForwardDisabled = true;
                    this.isBackwardDisabled = true;
                }
            });
        console.log(this.selectedBranchId);
    }


    onSubmit(templateLogin) {
        this.errorMsgStatus = false;
        this.falseCredential = false;
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }

        this.onClose();
        this.modalService.open(templateLogin);


    }


    onClose() {
        this.modalService.dismissAll(this.formAction.value);
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
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? 'Hi Kabita' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


    }

    cadDocApprovedPartial() {
        if (this.customerOfferLetter.customerOfferLetterPath.length < 1) {
            // tslint:disable-next-line:max-line-length
            this.toastService.show(new Alert(AlertType.ERROR, 'NO Any Document Has Been Uploaded yet!Please Upload sign document to Proceed'));
        } else {
            const modelRef = this.modalService.open(PostApprovalDocApproveComponent, {
                size: 'lg',
                backdrop: 'static',
                keyboard: false
            });
            modelRef.componentInstance.customerOfferLetter = this.customerOfferLetter;
        }
    }

    postAction() {
        this.customerOfferLetterService.postOfferLetterAction(this.formAction.value).subscribe((response: any) => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.route.navigate(['home/loan/loan-offer-letter']);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    approvedForwardBackward(template, val) {
        this.popUpTitle = val;
        this.userList = [];
        if (this.popUpTitle === 'FORWARD') {
            this.formAction = this.formBuilder.group(
                {
                    toRole: [undefined, Validators.required],
                    toUser: [undefined, Validators.required],
                    customerLoanId: [this.id],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [val === 'APPROVED' ? DocStatus.APPROVED : DocStatus.PENDING]
                }
            );
            const approvalType = 'CAD';
            const refId = 0;

            this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId)
                .subscribe((response: any) => {
                    this.sendForwardBackwardList = [];
                    this.sendForwardBackwardList = response.detail;
                    if (this.sendForwardBackwardList.length !== 0) {
                        this.getUserList(this.sendForwardBackwardList[0].role);
                    }
                });

        } else {
            this.formAction = this.formBuilder.group(
                {
                    customerLoanId: [this.id],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [val === 'APPROVED' ? DocStatus.APPROVED : DocStatus.PENDING]
                }
            );

        }
        this.modalService.open(template);


    }

    public getUserList(role) {
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.formAction.patchValue({
                    toUser: this.userList[0],
                    toRole: role
                });
            } else if (this.userList.length > 1) {
                this.formAction.patchValue({
                    toUser: this.userList[0],
                    toRole: role
                });
                this.formAction.get('toUser').setValidators(Validators.required);
                this.formAction.updateValueAndValidity();
            } else {
                this.toastService.show(new Alert(AlertType.ERROR, 'NO User Present in this Role'));
            }
        });
    }


}

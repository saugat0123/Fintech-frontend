import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {AlertService} from '../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../@core/utils';
import {UserService} from '../../../admin/component/user/user.service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from '../../../../@core/service/socket.service';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {RoleType} from '../../../admin/modal/roleType';
import {DocStatus} from '../../model/docStatus';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CustomerOfferLetterService} from '../../service/customer-offer-letter.service';
import {CustomerOfferLetter} from '../../model/customer-offer-letter';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ApprovalRoleHierarchyService} from '../../approval/approval-role-hierarchy.service';

@Component({
    selector: 'app-offer-letter-action',
    templateUrl: './offer-letter-action.component.html',
    styleUrls: ['./offer-letter-action.component.scss']
})
export class OfferLetterActionComponent implements OnInit {


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
        private activeModal: NgbActiveModal,
        private modalService: NgbModal,
        private http: HttpClient,
        private socketService: SocketService,
        private loanFormService: LoanFormService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
    ) {
    }

    ngOnInit() {

        console.log(this.currentUserRoleType , this.isApprovedDisabled , 'kjhuj');
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
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


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
        this.userService.getUserListByRoleId(role.id).subscribe((response: any) => {
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

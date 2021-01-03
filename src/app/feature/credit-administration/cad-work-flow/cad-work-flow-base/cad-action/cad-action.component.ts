import {Component, Input, OnInit} from '@angular/core';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ActivatedRoute, Router} from '@angular/router';
import {LoanActionService} from '../../../../loan/loan-action/service/loan-action.service';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {ToastService} from '../../../../../@core/utils';
import {UserService} from '../../../../admin/component/user/user.service';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SocketService} from '../../../../../@core/service/socket.service';
import {CustomerOfferLetter} from '../../../../loan/model/customer-offer-letter';
import {DocStatus} from '../../../../loan/model/docStatus';
import {ApprovalRoleHierarchyService} from '../../../../loan/approval/approval-role-hierarchy.service';

@Component({
    selector: 'app-cad-action',
    templateUrl: './cad-action.component.html',
    styleUrls: ['./cad-action.component.scss']
})
export class CadActionComponent implements OnInit {

    @Input()
    selectedBranchId;
    @Input()
    cadId: number;

    @Input()
    currentStatus: any;

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
    approvedType;

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

    constructor(private router: ActivatedRoute,
                private route: Router,
                private loanActionService: LoanActionService,
                private formBuilder: FormBuilder,
                private alertService: AlertService,
                private toastService: ToastService,
                private userService: UserService,
                private loanConfigService: LoanConfigService,
                private modalService: NgbModal,
                private http: HttpClient,
                private approvalRoleHierarchyService: ApprovalRoleHierarchyService,
                private socketService: SocketService,) {
    }

    ngOnInit() {
        this.currentUserId = LocalStorageUtil.getStorage().userId;
        this.roleId = LocalStorageUtil.getStorage().roleId;
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

    approvedForwardBackward(template, val) {
        this.popUpTitle = val;
        this.userList = [];
        if (this.popUpTitle === 'FORWARD') {
            this.formAction = this.formBuilder.group(
                {
                    toRole: [undefined, Validators.required],
                    toUser: [undefined, Validators.required],
                    cadId: [this.cadId],
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
                    cadId: [this.cadId],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [val === 'APPROVED' ? DocStatus.APPROVED : DocStatus.PENDING]
                }
            );

        }
        this.modalService.open(template);


    }

    public statusByCurrentStatus() {
        if (this.currentStatus === 'OFFER_PENDING') {
            this.approvedType = 'OFFER APPROVED';
        }
    }


}

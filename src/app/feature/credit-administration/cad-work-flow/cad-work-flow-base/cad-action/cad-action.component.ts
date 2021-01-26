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
import {ApprovalRoleHierarchyService} from '../../../../loan/approval/approval-role-hierarchy.service';
import {CreditAdministrationService} from '../../../service/credit-administration.service';
import {RouterUtilsService} from '../../../utils/router-utils.service';
import {CadStage} from '../../../model/cadStage';
import {RoleType} from '../../../../admin/modal/roleType';
import {NbDialogService} from '@nebular/theme';
import {SecurityComplianceCertificateComponent} from '../legal-and-disbursement/security-compliance-certificate/security-compliance-certificate.component';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';

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

    @Input()
    currentCADStage: CadStage;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

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
    approvedLabel = 'APPROVED';
    backwardToolTip = 'return to previous user';
    roleType = RoleType;
    client = environment.client;
    clientList = Clients;

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
    isMaker = false;
    showHideReturnToRm = true;

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
                private cadService: CreditAdministrationService,
                private socketService: SocketService,
                private routerUtilsService: RouterUtilsService,
                private nbDialogService: NbDialogService,
    ) {
    }

    ngOnInit() {
        this.currentUserId = LocalStorageUtil.getStorage().userId;
        this.roleId = LocalStorageUtil.getStorage().roleId;
        if (LocalStorageUtil.getStorage().roleType === 'MAKER') {
            this.isMaker = true;
        } else {
            this.getNewDocStatusOnApprove();
        }
        this.backwardTooltipMessageAndShowHideBackward();

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
        this.cadService.saveAction(this.formAction.value).subscribe((response: any) => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.routerUtilsService.routeSummaryAndEncryptPathID(this.cadId);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });

    }

    public getUserList(role) {
        this.userList = [];
        if (role.roleType === RoleType.CAD_LEGAL) {
            this.formAction.patchValue({
                toRole: role
            });
        } else {
            this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
                this.userList = response.detail;
                console.log('user list', this.userList);
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

    approvedForwardBackward(template, val, returnToMaker) {
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
                    documentStatus: [this.forwardBackwardDocStatusChange()],
                    isBackwardForMaker: returnToMaker
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

        } else if (this.popUpTitle === 'APPROVED') {
            const newDocStatus = this.getNewDocStatusOnApprove();
            this.popUpTitle = this.approvedLabel;
            if (newDocStatus === '0') {
                this.toastService.show(new Alert(AlertType.ERROR, 'This Document is Already Approved'));
                return;
            }
            this.formAction = this.formBuilder.group(
                {
                    cadId: [this.cadId],
                    docAction: [newDocStatus],
                    comment: [undefined, Validators.required],
                    documentStatus: [newDocStatus],
                    isBackwardForMaker: returnToMaker
                }
            );
        } else {
            this.formAction = this.formBuilder.group(
                {
                    cadId: [this.cadId],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [this.forwardBackwardDocStatusChange()],
                    isBackwardForMaker: returnToMaker
                }
            );

        }
        this.modalService.open(template);


    }

    public getNewDocStatusOnApprove() {
        if (this.currentStatus === 'OFFER_PENDING') {
            this.approvedLabel = 'APPROVE OFFER LETTER AND FORWARD';
            return 'OFFER_APPROVED';
        } else if (this.currentStatus === 'LEGAL_PENDING') {
            this.approvedLabel = 'APPROVE LEGAL AND FORWARD';
            return 'LEGAL_APPROVED';
        } else if (this.currentStatus === 'OFFER_APPROVED') {
            return '0';
        } else if (this.currentStatus === 'LEGAL_APPROVED') {
            return '0';
        } else if (this.currentStatus === 'DISBURSEMENT_APPROVED') {
            return '0';
        } else {
            return 'DISBURSEMENT_APPROVED';
        }
    }


    public forwardBackwardDocStatusChange() {
        if (this.currentStatus === 'OFFER_APPROVED') {
            return 'LEGAL_PENDING';
        } else if (this.currentStatus === 'LEGAL_APPROVED') {
            return 'DISBURSEMENT_PENDING';
        } else {
            return this.currentStatus;
        }

    }


    public backwardTooltipMessageAndShowHideBackward() {
        const user = this.currentCADStage.fromUser.name + ' (' + this.currentCADStage.fromRole.roleName + ')';
        // tslint:disable-next-line:max-line-length
        if ((this.currentCADStage.fromRole.roleType === this.roleType.CAD_ADMIN) || (this.currentCADStage.fromRole.roleType === this.roleType.CAD_SUPERVISOR)) {
            this.isBackwardDisabled = true;

        } else {
            this.backwardToolTip = 'return file to ' + user;
        }
        if (this.currentCADStage.fromRole.roleType === this.roleType.MAKER) {
            this.showHideReturnToRm = false;
        }
    }

    openModel() {
        this.nbDialogService.open(SecurityComplianceCertificateComponent, {context: {cadFile: this.cadOfferLetterApprovedDoc}});
    }

}

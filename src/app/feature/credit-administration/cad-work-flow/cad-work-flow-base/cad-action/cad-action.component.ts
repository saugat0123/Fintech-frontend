import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {SecurityComplianceCertificateComponent} from '../legal-and-disbursement/security-compliance-certificate/security-compliance-certificate.component';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {LaxmiOfferLetterConst} from '../../../cad-document-template/laxmi/laxmi-offer-letter/laxmi-offer-letter-const';
import {CadDocStatus} from '../../../model/CadDocStatus';

@Component({
    selector: 'app-cad-action',
    templateUrl: './cad-action.component.html',
    styleUrls: ['./cad-action.component.scss']
})
export class CadActionComponent implements OnInit, OnChanges {

    @Input()
    selectedBranchId;

    @Input()
    cadId: number;

    @Input()
    currentStatus: any;

    @Input()
    currentCADStage: CadStage;

    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    @Output() isActionClicked: EventEmitter<any> = new EventEmitter();

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
    isOpened = false;
    forApproveMaker = [];
    currentUserRole: string;
    returnToRm = false;
    spinner = false;
    approvedLoan = false;
    inMyBucket = false;
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
    missingSignDoc = false;
    missingDraftDoc = false;
    public dialogRef: NbDialogRef<any>;
    customApproveSelection = false;
    isForApproveMaker = false;
    selectedTemplate;
    commentVar;
    hasRequierdDocument = false;
    toUser;
    toRole;
    breakException: any;
    isMakerOrApproval = false;
    isLegal = false;
    isDiscrepancy = false;
    isCsu = false;
    cadStageOfferApproved = false;
    updatedToRole;
    returnedFromLegal = false;
    partialDiscrepancy = false;

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
        this.checkCadDocument();
        if(this.cadOfferLetterApprovedDoc.discrepancy) {
            this.isDiscrepancy = true;
        }

        let cadList = false;
        let additionalList = false;
        this.cadOfferLetterApprovedDoc.cadFileList.forEach((r) => {
            if (r.remarks === 'DEFERRAL') {
                cadList = true;
            }
        });
        this.cadOfferLetterApprovedDoc.additionalDocumentList.forEach((r) => {
            if (r.remarks === 'DEFERRAL') {
                additionalList = true;
            }
        });
        this.partialDiscrepancy = cadList || additionalList;
        this.currentUserId = LocalStorageUtil.getStorage().userId;
        this.roleId = LocalStorageUtil.getStorage().roleId;
        this.currentUserRole = LocalStorageUtil.getStorage().roleType;
        if ((this.currentUserRole === RoleType.APPROVAL || this.currentUserRole === RoleType.MAKER) && this.cadOfferLetterApprovedDoc.docStatus !== CadDocStatus.DISCREPANCY_PENDING) {
            this.isMakerOrApproval = true;
        }
        if (this.currentUserRole === RoleType.CAD_LEGAL) {
            this.isLegal = true;
        }
        if (this.currentUserRole === RoleType.APPROVAL && LocalStorageUtil.getStorage().roleName.toLowerCase() === 'csu') {
            this.isCsu = true;
        }
        if (this.cadOfferLetterApprovedDoc.docStatus === CadDocStatus.DISBURSEMENT_APPROVED) {
            this.approvedLoan = true;
        }
        if (this.currentCADStage.toRole.id.toString() === this.roleId) {
            this.inMyBucket = true;
        }
        try {
            if (this.cadOfferLetterApprovedDoc.previousList.length > 1) {
                if (this.cadOfferLetterApprovedDoc.previousList[0].fromRole.roleType === RoleType.APPROVAL || this.cadOfferLetterApprovedDoc.previousList[0].fromRole.roleType === RoleType.COMMITTEE || this.cadOfferLetterApprovedDoc.docStatus !== CadDocStatus.DISBURSEMENT_APPROVED) {
                    this.cadOfferLetterApprovedDoc.previousList.splice(0, 1);
                }
            }
            this.cadOfferLetterApprovedDoc.previousList.forEach((data) => {
                if (!ObjectUtil.isEmpty(data.toUser)) {
                    if (data.toUser.id.toString() === this.currentUserId) {
                        this.toUser = data.fromUser;
                        this.toRole = data.fromRole;
                        throw this.breakException;
                    }
                } else if (data.toRole.id.toString() === this.roleId) {
                    this.toUser = data.fromUser;
                    this.toRole = data.fromRole;
                    throw this.breakException;
                }
            });
        } catch (e) {
        }
        if (LocalStorageUtil.getStorage().roleType === 'MAKER') {
            this.isMaker = true;
        } else {
            this.getNewDocStatusOnApprove();
        }
        this.backwardTooltipMessageAndShowHideBackward();

        this.checkForwardValidMessage();

        if (this.isCsu && this.currentStatus === 'OFFER_APPROVED' && this.inMyBucket) {
            this.cadStageOfferApproved = true;
        }

        if (this.currentCADStage.fromRole.roleType === RoleType.CAD_LEGAL
            && this.currentCADStage.toRole.roleType === RoleType.MAKER && this.currentStatus === 'OFFER_APPROVED') {
            this.returnedFromLegal = true;
        }
    }

    checkForwardValidMessage() {
        const storage = LocalStorageUtil.getStorage();
        if (storage.roleType === 'MAKER') {
            this.missingSignDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.draftPath === undefined || value.pathSigned === null).length > 0;
        }

        // CAD is fixed patched role
        if (storage.roleName === 'CSU') {
            this.missingDraftDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.draftPath === undefined || value.draftPath === null).length > 0;
        }
    }

    checkCadDocument() {
        const cadDocuments: any = this.cadOfferLetterApprovedDoc.offerDocumentList;
        let index = 0;
        if (cadDocuments.length > 0) {
            cadDocuments.forEach((data) => {
                if ((data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.PERSONAL_GUARANTEE) && (!ObjectUtil.isEmpty(data.draftPath)))
                    || (data.docName === LaxmiOfferLetterConst.value(LaxmiOfferLetterConst.LETTER_OF_COMMITMENT) && (!ObjectUtil.isEmpty(data.draftPath)))) {
                    index += 1;
                }
            });
            if (index === 2 || index > 2) {
                this.hasRequierdDocument = true;
            }
        }
    }

    onSubmit(templateLogin) {
        this.errorMsgStatus = false;
        this.falseCredential = false;
        this.submitted = true;
        if (this.formAction.invalid) {
            return;
        }

        this.onClose();
        this.closeNb();
        this.modalService.open(templateLogin);
        this.isOpened = false;
        this.isActionClicked.emit(this.isOpened);


    }


    onClose() {
        this.modalService.dismissAll(this.formAction.value);
        this.isOpened = false;
        this.isActionClicked.emit(this.isOpened);
        this.isForApproveMaker = false;
    }

    closeNb() {
        this.dialogRef.close();
        this.isOpened = false;
        this.isActionClicked.emit(this.isOpened);
        this.isForApproveMaker = false;
    }

    onLogin(dataValue) {
        this.spinner = true;
        const data: { email: string, password: string } = dataValue.value;
        data.email = LocalStorageUtil.getStorage().username;
        const requestBody = 'grant_type=password&username=' + data.email + '&password=' + data.password;
        if (this.returnedFromLegal && !ObjectUtil.isEmpty(this.toRole)) {
            if (this.toRole.roleType === RoleType.CAD_LEGAL) {
                this.formAction.patchValue({
                    documentStatus: [this.backwardDocStatus()]
                });
            }
        }
        this.http.post(this.securityUrl, requestBody, {headers: this.headers})
            .subscribe(
                () => {
                    this.onClose();
                    this.postAction();
                },
                error => {
                    this.spinner = false;
                    this.falseCredentialMessage = ObjectUtil.isEmpty(error.error.errorDescription) ? '' : error.error.errorDescription;
                    this.falseCredential = true;
                }
            );


    }

    postAction() {
        this.isForApproveMaker = false;
        this.cadService.saveAction(this.formAction.value).subscribe((response: any) => {
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.spinner = false;
            this.routerUtilsService.routeSummaryAndEncryptPathID(this.cadId);
        }, error => {
            this.forApproveMaker = [];
            switch (error.status) {
                case 417:
                    this.commentVar = this.formAction.get('comment').value;
                    // tslint:disable-next-line:max-line-length
                    this.cadService.getMakerUserByBranchID
                    (this.cadOfferLetterApprovedDoc.loanHolder.branch.id).subscribe((resUser: any) => {
                        this.approvedForwardBackward(this.selectedTemplate, 'APPROVED', false);
                        this.isForApproveMaker = true;
                        this.forApproveMaker = resUser.detail;
                        if (this.forApproveMaker.length < 1) {
                            this.toastService.show(new Alert(AlertType.ERROR, 'NO User Found Please Contact Admin'));
                        } else {
                            this.formAction.patchValue({
                                toRole: this.forApproveMaker[this.forApproveMaker.length - 1].role,
                                toUser: this.forApproveMaker[this.forApproveMaker.length - 1],
                                customApproveSelection: true,
                                comment: this.commentVar

                            });
                        }
                        this.spinner = false;

                    }, error1 => {
                        this.toastService.show(new Alert(AlertType.ERROR, error1.error.message));
                        this.spinner = false;
                    });
                    break;
            }
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.spinner = false;
        });

    }

    public getUserList(role) {
        this.userList = [];
        if (role.roleType === RoleType.CAD_LEGAL) {
            this.formAction.patchValue({
                toRole: role
            });
            this.formAction.get('toUser').clearValidators();
            this.formAction.updateValueAndValidity();
        } else {
            this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
                this.userList = response.detail;
                this.updatedToRole = role;
                this.formAction.patchValue({
                    documentStatus: this.forwardBackwardDocStatusChange()
                });
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
        if (this.cadOfferLetterApprovedDoc.discrepancy && this.currentStatus === 'OFFER_APPROVED') {
            this.userList = [];
            this.formAction.patchValue({
                toRole: null
            });
        }
    }

    approvedForwardBackward(template, val, returnToMaker) {
        // if (!this.hasRequierdDocument) {
        //     this.toastService.show(new Alert(AlertType.WARNING, 'Please Generate Document Before Proceeding to next Stage'));
        //     return;
        // }
        this.returnToRm = returnToMaker;
        this.selectedTemplate = template;
        this.popUpTitle = val;
        this.userList = [];
        if (this.popUpTitle === 'FORWARD') {
            this.formAction = this.formBuilder.group(
                {
                    toRole: [undefined, Validators.required],
                    toUser: [undefined],
                    cadId: [this.cadId],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [this.forwardBackwardDocStatusChange()],
                    isBackwardForMaker: returnToMaker,
                    discrepancy: [this.cadOfferLetterApprovedDoc.discrepancy],
                    partialDiscrepancy: [this.cadOfferLetterApprovedDoc.partialDiscrepancy],
                }
            );
            const approvalType = 'CAD';
            const refId = 0;

            this.approvalRoleHierarchyService.getForwardRolesForRoleWithType(this.roleId, approvalType, refId)
                .subscribe((response: any) => {
                    this.sendForwardBackwardList = [];
                    this.sendForwardBackwardList = response.detail;
                    if (this.sendForwardBackwardList.length !== 0) {

                        if (this.isMaker && this.currentStatus === 'OFFER_PENDING') {
                            this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.APPROVAL
                                || f.role.roleType === RoleType.CAD_LEGAL);
                        } else {
                            if (this.isMaker && this.currentStatus === 'OFFER_APPROVED') {
                                if(this.cadOfferLetterApprovedDoc.discrepancy) {
                                    this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.CRC || f.role.roleType === RoleType.APPROVAL);

                                } else {
                                    this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.CAD_LEGAL || f.role.roleType === RoleType.APPROVAL);

                                }
                            } else {
                                if (this.isMaker && this.currentStatus === 'LEGAL_APPROVED') {
                                    this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.CRC);
                                } else {
                                    if (this.isMaker && this.currentStatus === 'LIMIT_APPROVED') {
                                        this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.COPS);
                                    }
                                }
                            }
                        }
                        if (this.isCsu && this.currentStatus === 'OFFER_APPROVED') {
                            this.sendForwardBackwardList = this.sendForwardBackwardList.filter(f => f.role.roleType === RoleType.CAD_LEGAL);
                        }
                        const tempList = !ObjectUtil.isEmpty(this.sendForwardBackwardList) ?
                            this.sendForwardBackwardList.length : 0;
                           if (tempList > 1) {
                               this.getUserList(this.sendForwardBackwardList[0].role);
                               if (ObjectUtil.isEmpty(this.toRole)) {
                                   this.updatedToRole = this.sendForwardBackwardList[0].role;
                                   const tempDocumentStatus = this.forwardBackwardDocStatusChange();
                                   this.formAction.get('documentStatus').patchValue(tempDocumentStatus);
                               }
                           }
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
                    isBackwardForMaker: returnToMaker,
                    customApproveSelection: [false],
                    toUser: [undefined],
                    toRole: [undefined],
                    discrepancy: [this.cadOfferLetterApprovedDoc.discrepancy],
                    partialDiscrepancy: [this.partialDiscrepancy],


                }
            );
        } else {
            this.formAction = this.formBuilder.group(
                {
                    cadId: [this.cadId],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [this.backwardDocStatus()],
                    isBackwardForMaker: returnToMaker,
                    customApproveSelection: [false],
                    toUser: [undefined],
                    toRole: [undefined],
                    discrepancy: [this.cadOfferLetterApprovedDoc.discrepancy],
                    partialDiscrepancy: [this.cadOfferLetterApprovedDoc.partialDiscrepancy],

                }
            );
            if (!ObjectUtil.isEmpty(this.toUser) && !ObjectUtil.isEmpty(this.toRole)) {
                this.formAction.patchValue({
                    toUser: this.toUser,
                    toRole: this.toRole,
                });
            }
        }
        // this.modalService.open(template,{backdrop: false, scrollable: true});
        this.dialogRef = this.nbDialogService.open(template,
            {
                closeOnBackdropClick: false,
                hasBackdrop: false,
                hasScroll: true
            });

        this.isOpened = true;
        this.isActionClicked.emit(this.isOpened);
    }

    public getNewDocStatusOnApprove() {
        if (this.currentStatus === 'OFFER_PENDING') {
            this.approvedLabel = 'APPROVE OFFER LETTER AND FORWARD';
            return 'OFFER_APPROVED';
        } else if (this.currentStatus === 'LEGAL_PENDING') {
            this.approvedLabel = 'APPROVE LEGAL AND FORWARD';
            return 'LEGAL_APPROVED';
        } else if (this.currentStatus === 'LIMIT_PENDING') {
            this.approvedLabel = 'APPROVE LIMIT AND FORWARD';
            return 'LIMIT_APPROVED';
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
            if (!ObjectUtil.isEmpty(this.updatedToRole) && this.isMaker) {
                if (this.updatedToRole.roleType === RoleType.APPROVAL) {
                    return 'OFFER_APPROVED';
                }
            }
            return 'LEGAL_PENDING';
        } else if (this.currentStatus === 'LEGAL_APPROVED') {
            return 'LIMIT_PENDING';
        } else if (this.currentStatus === 'LIMIT_APPROVED') {
            return 'DISBURSEMENT_PENDING';
        } else {
            return this.currentStatus;
        }

    }

    public backwardDocStatus() {
        switch (this.currentStatus) {
            case 'OFFER_APPROVED':
                if (this.returnedFromLegal && !ObjectUtil.isEmpty(this.toRole)) {
                    if (this.toRole.roleType === RoleType.CAD_LEGAL) {
                        return 'LEGAL_PENDING';
                    }
                }
                return 'OFFER_PENDING';
                break;
            case 'LEGAL_PENDING':
                return 'OFFER_APPROVED';
                break;
            case 'LEGAL_APPROVED':
                if (this.toRole.roleType === RoleType.APPROVAL) {
                    return 'OFFER_PENDING';
                } else {
                    return 'LEGAL_PENDING';
                }
                break;
            case 'LIMIT_PENDING':
                if (this.currentUserRole === this.roleType.CRC) {
                    if (this.cadOfferLetterApprovedDoc.discrepancy) {
                        if(!ObjectUtil.isEmpty(this.toRole)) {
                            if (this.toRole.roleType === RoleType.MAKER || this.returnToRm) {
                                return 'OFFER_APPROVED';
                            } else {
                                return 'OFFER_PENDING';
                            }
                        } else {
                            this.toRole = this.currentCADStage.fromRole;
                            this.toUser = this.currentCADStage.fromUser;
                            if (this.toRole.roleType === RoleType.MAKER || this.returnToRm) {
                                return 'OFFER_APPROVED';
                            } else {
                                return 'OFFER_PENDING';
                            }
                        }
                    } else {
                        if (this.returnToRm) {
                            return 'LEGAL_APPROVED';
                        } else {
                            return 'LEGAL_PENDING';
                        }
                    }
                }
                break;
            case 'DISBURSEMENT_PENDING':
                if (this.currentUserRole === this.roleType.COPS) {
                    if (this.returnToRm) {
                        return 'LIMIT_APPROVED';
                    } else {
                        return 'LIMIT_PENDING';
                    }
                }
                break;
            default:
                return this.currentStatus;

        }
    }


    public backwardTooltipMessageAndShowHideBackward() {
        let user;

        if (!ObjectUtil.isEmpty(this.toUser)) {
            user = this.toUser.name + ' (' + this.toUser.role.roleName + ')';
            user = this.toUser.name + ' (' + this.toUser.role.roleName + ')';
        } else {
            user = this.currentCADStage.fromUser.name + ' (' + this.currentCADStage.fromRole.roleName + ')';
        }
        // tslint:disable-next-line:max-line-length
        if ((this.currentCADStage.fromRole.roleType === this.roleType.CAD_SUPERVISOR)) {
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

    ngOnChanges(changes: SimpleChanges): void {
        this.checkForwardValidMessage();
        this.checkCadDocument();

    }

}

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
import {
    SecurityComplianceCertificateComponent
} from '../legal-and-disbursement/security-compliance-certificate/security-compliance-certificate.component';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {DmsLoanFileComponent} from '../../../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {CadDocStatus} from '../../../model/CadDocStatus';
import {NgxSpinnerService} from 'ngx-spinner';

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
    isOpened = false;
    forApproveMaker = [];
    currentUserRole: string;
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
    unAssign = false;
    checked = false;
    pathValueData;
    isMakerOrApproval = false;
    isDiscrepancy = false;


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
                private loanFormService: LoanFormService,
                private spinnerService: NgxSpinnerService
    ) {
    }

    ngOnInit() {
        this.currentUserId = LocalStorageUtil.getStorage().userId;
        this.roleId = LocalStorageUtil.getStorage().roleId;
        this.currentUserRole = LocalStorageUtil.getStorage().roleType;
        if (this.cadOfferLetterApprovedDoc.discrepancy) {
            this.isDiscrepancy = true;
        }
        if ((this.currentUserRole === RoleType.APPROVAL || this.currentUserRole === RoleType.MAKER)
            && this.cadOfferLetterApprovedDoc.docStatus !== CadDocStatus.DISCREPANCY_PENDING) {
            this.isMakerOrApproval = true;
        }
        if (LocalStorageUtil.getStorage().roleType === 'MAKER') {
            this.isMaker = true;
        } else {
            this.getNewDocStatusOnApprove();
        }
        this.backwardTooltipMessageAndShowHideBackward();

        this.checkForwardValidMessage();
        if (this.currentCADStage.docAction === 'PULLED'
            && this.isMaker && this.currentCADStage.fromUser.id.toString() === this.currentUserId
            && this.currentStatus === 'OFFER_PENDING') {
            this.unAssign = true;
        }
    }

    checkForwardValidMessage() {
        const storage = LocalStorageUtil.getStorage();
        if (storage.roleType === 'MAKER') {
            this.missingSignDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.draftPath === undefined || value.pathSigned === null).length > 0;
        }

        // CAD is fixed patched role
        if (storage.roleName === 'CAD') {
            this.missingDraftDoc = this.cadOfferLetterApprovedDoc.offerDocumentList.filter(value =>
                value.draftPath === undefined || value.draftPath === null).length > 0;
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
    close() {
        this.modalService.dismissAll();
    }
    openPopUp(template) {
        this.modalService.open(template, {
            size: 'xl',
            windowClass: 'on-pull-click full-width modal'
        });
    }
    closeNb() {
        this.dialogRef.close();
        this.isOpened = false;
        this.isActionClicked.emit(this.isOpened);
        this.isForApproveMaker = false;
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
        this.isForApproveMaker = false;
        this.spinnerService.show();
        this.cadService.saveAction(this.formAction.value).subscribe((response: any) => {
            this.spinnerService.hide();
            this.onClose();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
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
                    }, error1 => this.toastService.show(new Alert(AlertType.ERROR, error1.error.message)));
                    break;
            }
            this.spinnerService.hide();
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

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
                    screenShotDocPath: [undefined],
                    discrepancy: [this.isDiscrepancy]
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
            const discrepancyApproved = this.cadOfferLetterApprovedDoc.discrepancy && !this.cadOfferLetterApprovedDoc.discrepancyApproved;
            this.popUpTitle = this.approvedLabel;
            if (newDocStatus === '0') {
                this.toastService.show(new Alert(AlertType.ERROR, 'This Document is Already Approved'));
                return;
            }
            this.formAction = this.formBuilder.group(
                {
                    cadId: [this.cadId],
                    docAction: [discrepancyApproved ? 'DISCREPANCY_APPROVED' : newDocStatus],
                    comment: [undefined, Validators.required],
                    documentStatus: [discrepancyApproved ? 'OFFER_PENDING' : newDocStatus],
                    isBackwardForMaker: returnToMaker,
                    customApproveSelection: [false],
                    toUser: [undefined],
                    toRole: [undefined],
                    screenShotDocPath: [undefined],
                    discrepancy: [this.isDiscrepancy],


                }
            );
        } else {
            this.formAction = this.formBuilder.group(
                {
                    cadId: [this.cadId],
                    docAction: [val],
                    comment: [undefined, Validators.required],
                    documentStatus: [this.forwardBackwardDocStatusChange()],
                    isBackwardForMaker: returnToMaker,
                    customApproveSelection: [false],
                    toUser: [undefined],
                    toRole: [undefined],
                    screenShotDocPath: [undefined],
                    discrepancy: [this.isDiscrepancy],

                }
            );

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
        } else if (this.currentStatus === 'OFFER_APPROVED') {
            return '0';
        } else if (this.currentStatus === 'LEGAL_APPROVED') {
            return '0';
        } else if (this.currentStatus === 'DISBURSEMENT_APPROVED') {
            return '0';
        } else if (this.currentStatus === 'PARTIAL_DISCREPANCY_PENDING' && this.currentUserRole === 'CAD_LEGAL') {
            return 'LEGAL_APPROVED';
        } else {
            return 'DISBURSEMENT_APPROVED';
        }
    }


    public forwardBackwardDocStatusChange() {
        if (this.currentStatus === 'OFFER_APPROVED') {
            return 'LEGAL_PENDING';
        } else if (this.currentStatus === 'LEGAL_APPROVED') {
            return 'DISBURSEMENT_PENDING';
        } else if (this.currentStatus === 'DISBURSEMENT_PENDING') {
            return 'OFFER_PENDING';
        } else {
            return this.currentStatus;
        }

    }


    public backwardTooltipMessageAndShowHideBackward() {
        const user = this.currentCADStage.fromUser.name + ' (' + this.currentCADStage.fromRole.roleName + ')';
        if ((this.currentCADStage.fromRole.roleType === this.roleType.CAD_ADMIN)
            || (this.currentCADStage.fromRole.roleType === this.roleType.CAD_SUPERVISOR)) {
            this.isBackwardDisabled = true;
        } else {
            this.backwardToolTip = 'return file to ' + user;
        }
        if (this.currentCADStage.fromRole.roleType === this.roleType.MAKER) {
            this.showHideReturnToRm = false;
        }
        if (this.currentCADStage.docAction === 'PULLED') {
            this.isBackwardDisabled = false;
        } else if (this.currentCADStage.docAction === 'ASSIGNED') {
            this.isBackwardDisabled = true;
        } else {
            if (this.isMaker) {
                this.isBackwardDisabled = true;
            }
        }
    }

    openModel() {
        this.nbDialogService.open(SecurityComplianceCertificateComponent, {context: {cadFile: this.cadOfferLetterApprovedDoc}});
    }

    ngOnChanges(changes: SimpleChanges): void {
        this.checkForwardValidMessage();
    }

    unAssignAssignedLoan() {
        this.cadService.unAssignAssignedLoan(this.cadId).subscribe(() => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Unassigned Loan'));
            this.route.navigateByUrl('/home/credit');
            this.modalService.dismissAll();
        }, err => {
            this.toastService.show(new Alert(AlertType.DANGER, 'Something Went Wrong'));
            this.modalService.dismissAll();
        });
    }


    uploadSignature(event) {
        const file: File[] = event.target.files;
        const formData: FormData = new FormData();
        for (let i = 0; i < file.length; i++) {
            if (file[i].size > DmsLoanFileComponent.FILE_SIZE_5MB) {
                this.toastService.show(new Alert(AlertType.INFO, 'Maximum File Size is 5MB'));
                return;
            }
            formData.append('file', file[i]);
        }
        formData.append('cadId', this.cadId.toString());
        formData.append('branchId', this.cadOfferLetterApprovedDoc.loanHolder.branch.id.toString());
        formData.append('customerType', this.cadOfferLetterApprovedDoc.loanHolder.customerType);
        formData.append('customerInfoId', this.cadOfferLetterApprovedDoc.loanHolder.id.toString());
        formData.append('uploadedDoc', (this.pathValueData === undefined ? '' : this.pathValueData));
        this.cadService.uploadCadScreeShotFile(formData).subscribe((res: any) => {
            this.checked = true;
            this.pathValueData = res.detail;
            this.formAction.patchValue({
                screenShotDocPath: res.detail.toString()
            });
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to Upload file' + error.error.message));
        });
    }

    previewDoc(url: any) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    deleteDocument(index: number) {
        this.loanFormService.deleteCustomerDocFromSystem(this.pathValueData[index]).subscribe((res: any) => {
            delete this.pathValueData[index];
            this.pathValueData.splice(index, 1);
        }, error => {
            this.toastService.show(new Alert(AlertType.WARNING, 'Unable to delete document!'));
        });
        if (this.pathValueData.length < 1) {
            this.checked = false;
        }
    }
}

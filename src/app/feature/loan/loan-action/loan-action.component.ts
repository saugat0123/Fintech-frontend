import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ActionModel} from '../model/action';
import {RoleType} from '../../admin/modal/roleType';
import {DocAction} from '../model/docAction';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CustomerLoanFlag} from '../../../@core/model/customer-loan-flag';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {LoanActionModalComponent} from './loan-action-modal/loan-action-modal.component';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {LoanActionCombinedModalComponent} from './loan-action-combined-modal/loan-action-combined-modal.component';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ProductUtils} from '../../admin/service/product-mode.service';
import {LoanDataHolder} from '../model/loanData';
import {DocStatus} from '../model/docStatus';

@Component({
    selector: 'app-loan-action',
    templateUrl: './loan-action.component.html',
    styleUrls: ['./loan-action.component.scss']
})
export class LoanActionComponent implements OnInit, OnChanges {

    @ViewChild('confirmModal', {static: true})
    confirmModal: TemplateRef<any>;

    @Input() loanConfigId: number;
    @Input() id: number;
    @Input() loanCategory: string;
    @Input() beneficiaryId: any;
    @Input() catalogueStatus = false;
    @Input() loanFlags: CustomerLoanFlag[];
    @Input() actionsList: ActionModel;
    @Input() combinedLoanId: number;
    @Input() hasDeferredDocs: boolean;
    @Input() customerType;
    @Input() branchId;
    @Input() customerLoanHolder: LoanDataHolder;
    @Input() isRemitLoan;
    public isMaker = false;
    public committeeRole = false;
    private dialogRef: NbDialogRef<any>;
    isOpen = false;
    showCadDocumentRoute = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    status: any;
    docStatus = DocStatus;
    currentUser = LocalStorageUtil.getStorage().roleName.toLowerCase();
    fileUnder = false;

    constructor(
        private alertService: AlertService,
        private toastService: ToastService,
        private nbDialogService: NbDialogService,
        private router: Router,
        private loanFormService: LoanFormService,
    ) {
    }

    ngOnInit() {
        this.loanFormService.detail(this.id).subscribe((data) => {
            this.customerLoanHolder = data.detail;
            if (LocalStorageUtil.getStorage().userId === this.customerLoanHolder.currentStage.toUser.id.toString()) {
                this.fileUnder = true;
            }
        });
        this.status = this.customerLoanHolder.documentStatus;
        const roleName: string = LocalStorageUtil.getStorage().roleName;
        const roleType: string = LocalStorageUtil.getStorage().roleType;
        if (roleName !== 'admin') {
            this.isMaker = roleType === RoleType.MAKER;
        }
        if (roleType === RoleType.MAKER) {
            this.isMaker = true;
        }

        if (roleName.toLowerCase() === 'cad' || roleType === RoleType.MAKER) {
            this.showCadDocumentRoute = true;
        }
        this.committeeRole = roleType === RoleType.COMMITTEE;
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!ObjectUtil.isEmpty(changes.customerLoanHolder)) {
            this.customerLoanHolder = changes.customerLoanHolder.currentValue;
        }
        if (!ObjectUtil.isEmpty(changes.loanFlags)) {
            if (changes.loanFlags.currentValue) {
                this.loanFlags = this.loanFlags.filter((l) =>
                    (l.customerLoanId === Number(this.id) || ObjectUtil.isEmpty(l.customerLoanId)));
            }
        }
    }

    public loanAction(action: 'forward' | 'backward' | 'backwardCommittee' | 'approve' | 'reject' | 'close' | 'send back to sender' | 'send back to agent'): void {
        this.close();
        let context;
        switch (action) {
            case 'backward':
                context = {
                    popUpTitle: 'Return',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    branchId: this.branchId,
                    docAction: DocAction.value(DocAction.BACKWARD),
                    docActionMsg: 'Returned',
                    documentStatus: DocStatus.PENDING,
                    customerLoanHolder: this.customerLoanHolder
                };
                if (this.customerLoanHolder.dualApproved) {
                    context.documentStatus = DocStatus.DUAL_APPROVAL_PENDING;
                }
                break;
            case 'backwardCommittee':
                context = {
                    popUpTitle: 'Send Backward To ' + LocalStorageUtil.getStorage().roleName,
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: DocAction[DocAction.BACKWARD_TO_COMMITTEE],
                    docActionMsg: 'Returned Back To Committee',
                    documentStatus: DocStatus.PENDING,
                    branchId: this.branchId,
                    customerLoanHolder: this.customerLoanHolder,
                    toRole: {id: Number(LocalStorageUtil.getStorage().roleId)}
                };
                break;
            case 'forward':
                if (this.loanFlags && this.loanFlags.length > 0) {
                    this.loanFlags.sort((a, b) => a.order - b.order);
                    this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));

                    return;
                }
                context = {
                    popUpTitle: 'Send Forward',
                    isForward: true,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: DocAction.value(DocAction.FORWARD),
                    docActionMsg: 'Forwarded',
                    documentStatus: DocStatus.PENDING,
                    branchId: this.branchId,
                    isMaker: this.isMaker,
                    customerLoanHolder: this.customerLoanHolder
                };
                if (this.customerLoanHolder.dualApproved) {
                    context.documentStatus = DocStatus.DUAL_APPROVAL_PENDING;
                }
                break;
            case 'approve':
                if (this.loanFlags && this.loanFlags.length > 0) {
                    this.loanFlags.sort((a, b) => a.order - b.order);

                    return;
                }
                if (this.customerLoanHolder.isHsov && LocalStorageUtil.getStorage().roleName.toLowerCase() !== 'hsov') {
                    context = {
                        popUpTitle: 'Approve',
                        isForward: true,
                        customerLoanHolder: this.customerLoanHolder,
                        loanConfigId: this.loanConfigId,
                        customerLoanId: this.id,
                        docAction: 'HSOV_PENINDG',
                        docActionMsg: 'Hsov Pending',
                        documentStatus: DocStatus.HSOV_PENDING,
                        isRemitLoan: this.isRemitLoan,
                        beneficiaryId: this.beneficiaryId
                    };
                } else if (this.customerLoanHolder.dualApproval && !this.customerLoanHolder.dualApproved) {
                    context = {
                        popUpTitle: 'Approve',
                        isForward: false,
                        customerLoanHolder: this.customerLoanHolder,
                        loanConfigId: this.loanConfigId,
                        branchId: this.branchId,
                        customerLoanId: this.id,
                        docAction: 'DUAL_APPROVAL_PENDING',
                        docActionMsg: 'Dual Approval Pending',
                        documentStatus: DocStatus.DUAL_APPROVAL_PENDING,
                        isRemitLoan: this.isRemitLoan,
                        beneficiaryId: this.beneficiaryId
                    };
                } else {
                    context = {
                        popUpTitle: 'Approve',
                        isForward: false,
                        customerLoanHolder: this.customerLoanHolder,
                        loanConfigId: this.loanConfigId,
                        customerLoanId: this.id,
                        docAction: 'APPROVED',
                        docActionMsg: 'Approved',
                        documentStatus: DocStatus.APPROVED,
                        isRemitLoan: this.isRemitLoan,
                        beneficiaryId: this.beneficiaryId
                    };

                }

                break;
            case 'reject':
                context = {
                    popUpTitle: 'Reject',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'REJECT',
                    docActionMsg: 'Rejected',
                    documentStatus: DocStatus.REJECTED,
                    isRemitLoan: this.isRemitLoan,
                    customerLoanHolder: this.customerLoanHolder,
                    beneficiaryId: this.beneficiaryId
                };
                break;

            case 'send back to sender':
                context = {
                    popUpTitle: 'Send Back To Sender',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'SEND_BACK_TO_SENDER',
                    docActionMsg: 'Return back to sender',
                    beneficiaryId: this.beneficiaryId,
                    documentStatus: DocStatus.SEND_BACK_TO_SENDER
                };
                break;

            case 'send back to agent':
                context = {
                    popUpTitle: 'Send Back To Agent',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'SEND_BACK_TO_AGENT',
                    docActionMsg: 'Return back to agent',
                    beneficiaryId: this.beneficiaryId,
                    documentStatus: DocStatus.SEND_BACK_TO_AGENT
                };
                break;
            case 'close':
                context = {
                    popUpTitle: 'Close',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'CLOSED',
                    docActionMsg: 'Closed',
                    documentStatus: DocStatus.CLOSED
                };
                break;
        }
        if (this.hasDeferredDocs) {
            context.additionalDetails = {
                hasDeferredDocs: true
            };
        }
        if (ObjectUtil.isEmpty(this.combinedLoanId)) {
            this.dialogRef = this.nbDialogService.open(LoanActionModalComponent, {
                context,
                closeOnBackdropClick: false,
                hasBackdrop: false,
                hasScroll: true
            });

        } else {
            context.combinedLoanId = this.combinedLoanId;
            context.isMaker = this.isMaker;
            context.branchId = this.branchId,
                this.dialogRef = this.nbDialogService.open(LoanActionCombinedModalComponent,
                    {
                        context,
                        closeOnBackdropClick: false,
                        hasBackdrop: false,
                        hasScroll: true
                    });

        }
        this.isOpen = true;

    }

    public onEdit() {
        this.router.navigate(['/home/loan/loanForm'], {
            queryParams: {
                loanId: this.loanConfigId,
                customerId: this.id,
                loanCategory: this.loanCategory
            }
        });
    }

    public deleteCustomerLoan() {
        this.loanFormService.deleteLoanCustomer(this.id).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully Deleted'));
                this.router.navigate(['/home/pending']);
            },
            error => {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            });
    }

    openConfirmationModal() {
        this.nbDialogService.open(this.confirmModal, {autoFocus: true});
    }

    close() {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    detailedViewAction() {
        this.router.navigate(['/home/loan/detailed-summary'], {
            queryParams: {
                loanConfigId: this.loanConfigId,
                customerId: this.id,
                customerType: this.customerType
            }
        });
    }

    onUploadDocument() {
        this.router.navigate(['/home/loan/cad-document'], {
            queryParams: {
                loanId: this.loanConfigId,
                customerId: this.id,
                loanCategory: this.loanCategory
            }
        });
    }
}

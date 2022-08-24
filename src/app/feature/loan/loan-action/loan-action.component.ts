import {Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {AlertService} from '../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ActionModel} from '../model/action';
import {DocStatus} from '../model/docStatus';
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
import {LoanFlag} from '../../../@core/model/enum/loan-flag.enum';
import {LoanDataHolder} from '../model/loanData';
import {LoanType} from '../model/loanType';
import {Document} from '../../admin/modal/document';
import {EnumUtils} from '../../../@core/utils/enums.utils';
import {DocumentCheckType} from '../../../@core/model/enum/document-check-type.enum';
import {User} from '../../admin/modal/user';
import {LoanActionService} from './service/loan-action.service';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ApprovalLimitService} from '../../admin/component/approvallimit/approval-limit.service';
import {UserService} from '../../../@core/service/user.service';

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
    @Input() catalogueStatus = false;
    @Input() loanFlags: CustomerLoanFlag[];
     actionsList = new ActionModel();
    @Input() combinedLoanId: number;
    hasDeferredDocs: boolean;
    @Input() customerType;
    @Input() branchId;
    @Input() customerLoanHolder: LoanDataHolder;
    @Input() isDetailedView: boolean;
    public isMaker = false;
    public committeeRole = false;
    private dialogRef: NbDialogRef<any>;
    isOpen = false;
    showCadDocumentRoute = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    user = new User();
    loanDataHolder = new LoanDataHolder();
    loanType = LoanType;

    constructor(
        private alertService: AlertService,
        private toastService: ToastService,
        private nbDialogService: NbDialogService,
        private router: Router,
        private loanFormService: LoanFormService,
        private loanActionService: LoanActionService,
        private loanConfigService: LoanConfigService,
        private approvalLimitService: ApprovalLimitService,
        private userService: UserService,
    ) {
    }

    ngOnInit() {
        this.getLoanDataHolder();
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
        if (changes.loanFlags.currentValue) {
            this.loanFlags = this.loanFlags.filter((l) =>
                (l.customerLoanId === Number(this.id) || ObjectUtil.isEmpty(l.customerLoanId)));
        }
    }

    public loanAction(action: 'forward' | 'backward' | 'backwardCommittee' | 'approve' | 'reject' | 'close'): void {
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
                    documentStatus: DocStatus.PENDING
                };
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
                    toRole: {id: Number(LocalStorageUtil.getStorage().roleId)}
                };
                break;
            case 'forward':
                if (this.loanFlags && this.loanFlags.length > 0 && this.customerLoanHolder.loanType.toString() !== LoanType.getEnum(LoanType.FULL_SETTLEMENT_LOAN)
                    && this.customerLoanHolder.loanType.toString() !== LoanType.getEnum(LoanType.CLOSURE_LOAN)) {
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
                    customerLoanHolder: this.loanDataHolder
                };
                break;
            case 'approve':
                if (this.loanFlags && this.loanFlags.length > 0) {
                    this.loanFlags.sort((a, b) => a.order - b.order);

                        return;
                }
                context = {
                    popUpTitle: 'Approve',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'APPROVED',
                    docActionMsg: 'Approved',
                    documentStatus: DocStatus.APPROVED
                };
                break;
            case 'reject':
                context = {
                    popUpTitle: 'Reject',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'REJECT',
                    docActionMsg: 'Rejected',
                    documentStatus: DocStatus.REJECTED
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
            context.branchId =  this.branchId,
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
                customerType: this.customerType,
                catalogue : this.catalogueStatus
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
    getLoanDataHolder() {
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
                this.actionsList.roleTypeMaker = this.user.role.roleType === 'MAKER';
            }
        );
        this.actionsList.approved = false;
        this.actionsList.sendForward = false;
        this.actionsList.edit = false;
        this.actionsList.sendBackward = false;
        this.actionsList.rejected = false;
        this.actionsList.closed = false;
        this.loanFormService.detail(this.id).subscribe(async (response: any) => {
            this.loanDataHolder = response.detail;
            this.loanCategory = this.loanDataHolder.loanCategory;
            // this.currentIndex = this.loanDataHolder.previousList.length;

            this.actionsList.approved = true;
            this.actionsList.sendForward = true;
            this.actionsList.edit = true;
            this.actionsList.sendBackward = true;
            this.actionsList.rejected = true;
            this.actionsList.closed = true;
            if ((this.loanDataHolder.createdBy.toString() === LocalStorageUtil.getStorage().userId) ||
                (this.loanDataHolder.currentStage.toRole.roleType.toString() === 'MAKER')) {
                this.actionsList.sendBackward = false;
                this.actionsList.edit = true;
                this.actionsList.approved = false;
                this.actionsList.closed = false;
            } else {
                this.actionsList.edit = false;
            }

            if (this.loanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
                this.actionsList.approved = false;
            } else {
                this.actionsList.closed = false;
            }
            this.actionsList.loanApproveStatus = this.loanDataHolder.documentStatus.toString() === 'APPROVED';

            if (this.user.role.roleName !== 'admin') {
                await this.loanActionService.getSendForwardList().subscribe((res: any) => {
                    const forward = res.detail;
                    if (forward.length === 0) {
                        this.actionsList.sendForward = false;
                    }
                });
            }
            if (this.loanDataHolder.currentStage.docAction.toString() === 'APPROVED' ||
                this.loanDataHolder.currentStage.docAction.toString() === 'REJECT' ||
                this.loanDataHolder.currentStage.docAction.toString() === 'CLOSED') {
                this.actionsList.approved = false;
                this.actionsList.sendForward = false;
                this.actionsList.edit = false;
                this.actionsList.sendBackward = false;
                this.actionsList.rejected = false;
                this.actionsList.closed = false;
            }

            await this.approvalLimitService.getLimitByRoleAndLoan(this.loanDataHolder.loan.id, this.loanDataHolder.loanCategory)
                .subscribe((res: any) => {
                    if (res.detail === undefined) {
                        this.actionsList.approved = false;
                    } else {
                        if (this.loanDataHolder.proposal !== null
                            && this.loanDataHolder.proposal.proposedLimit > res.detail.amount) {
                            this.actionsList.approved = false;
                        }
                    }
                });
            if (this.loanDataHolder.isSol) {
                if (this.loanDataHolder.solUser.id !== this.user.id) {
                    this.actionsList.approved = false;
                }
            }
            // check deferred docs
            let deferredDocs: Document[];
            switch (this.loanDataHolder.loanType) {
                case EnumUtils.getEnum(LoanType, LoanType.NEW_LOAN):
                    deferredDocs = this.loanDataHolder.loan.initial;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.ENHANCED_LOAN):
                    deferredDocs = this.loanDataHolder.loan.enhance;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.RENEWED_LOAN):
                    deferredDocs = this.loanDataHolder.loan.renew;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.CLOSURE_LOAN):
                    deferredDocs = this.loanDataHolder.loan.closure;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.PARTIAL_SETTLEMENT_LOAN):
                    deferredDocs = this.loanDataHolder.loan.partialSettlement;
                    break;
                case EnumUtils.getEnum(LoanType, LoanType.FULL_SETTLEMENT_LOAN):
                    deferredDocs = this.loanDataHolder.loan.fullSettlement;
                    break;
                default:
                    deferredDocs = [];
            }
            if (!ObjectUtil.isEmpty(deferredDocs)) {
                deferredDocs = deferredDocs.filter((d) => (
                    !ObjectUtil.isEmpty(d.checkType) && d.checkType === EnumUtils.getEnum(DocumentCheckType, DocumentCheckType.DEFERRAL)
                ));
                const uploadedDocIds = this.loanDataHolder.customerDocument.map(d => d.document.id);
                this.hasDeferredDocs = !deferredDocs.every(d => uploadedDocIds.includes(d.id));
            }
        });
    }

}

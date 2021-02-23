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
    @Input() actionsList: ActionModel;
    @Input() combinedLoanId: number;
    @Input() hasDeferredDocs: boolean;
    @Input() customerType;
    @Input() branchId;
    @Input() customerLoanHolder: LoanDataHolder;
    public isMaker = false;
    public committeeRole = false;
    private dialogRef: NbDialogRef<any>;
    isOpen = false;
    showCadDocumentRoute = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;


    constructor(
        private alertService: AlertService,
        private toastService: ToastService,
        private nbDialogService: NbDialogService,
        private router: Router,
        private loanFormService: LoanFormService,
    ) {
    }

    ngOnInit() {
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
                    documentStatus: DocStatus.PENDING,
                    branchId: this.branchId,
                    toRole: {id: Number(LocalStorageUtil.getStorage().roleId)}
                };
                break;
            case 'forward':
                // if (this.loanFlags && this.loanFlags.length > 0) {
                //     this.loanFlags.sort((a, b) => a.order - b.order);
                //     this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));
                //     if (!((this.loanFlags[0].flag === LoanFlag[LoanFlag.EMPTY_COMPANY_VAT_PAN_EXPIRY]) ||
                //         (this.loanFlags[0].flag === LoanFlag[LoanFlag.COMPANY_VAT_PAN_EXPIRY]))) {
                //         return;
                //     }
                // }
                context = {
                    popUpTitle: 'Send Forward',
                    isForward: true,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: DocAction.value(DocAction.FORWARD),
                    documentStatus: DocStatus.PENDING,
                    branchId: this.branchId,
                    isMaker: this.isMaker,
                    customerLoanHolder: this.customerLoanHolder
                };
                break;
            case 'approve':
                if (this.loanFlags && this.loanFlags.length > 0) {
                    this.loanFlags.sort((a, b) => a.order - b.order);
                    this.toastService.show(new Alert(AlertType.INFO, this.loanFlags[0].description));
                    if (!((this.loanFlags[0].flag === LoanFlag[LoanFlag.EMPTY_COMPANY_VAT_PAN_EXPIRY]) ||
                        (this.loanFlags[0].flag === LoanFlag[LoanFlag.COMPANY_VAT_PAN_EXPIRY]))) {
                        return;
                    }
                }
                context = {
                    popUpTitle: 'Approve',
                    isForward: false,
                    loanConfigId: this.loanConfigId,
                    customerLoanId: this.id,
                    docAction: 'APPROVED',
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

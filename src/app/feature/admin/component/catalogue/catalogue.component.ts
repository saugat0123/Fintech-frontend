import {Component, Input, OnInit} from '@angular/core';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {LoanConfig} from '../../modal/loan-config';
import {LoanConfigService} from '../loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {DocStatus} from '../../../loan/model/docStatus';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoleAccess} from '../../modal/role-access';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Role} from '../../modal/role';
import {RoleService} from '../role-permission/role.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user/user.service';
import {LoanActionService} from '../../../loan/loan-action/service/loan-action.service';
import {LoanType} from '../../../loan/model/loanType';
import {RoleType} from '../../modal/roleType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {DocAction} from '../../../loan/model/docAction';
import {LoanStage} from '../../../loan/model/loanStage';
import {SocketService} from '../../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from './catalogue.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {NbDialogRef, NbDialogService, NbTrigger} from '@nebular/theme';
import {CustomerLoanFlag} from '../../../../@core/model/customer-loan-flag';
import {LoanFlag} from '../../../../@core/model/enum/loan-flag.enum';
import {Province} from '../../modal/province';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {LoginPopUp} from '../../../../@core/login-popup/login-pop-up';
import {ApprovalRoleHierarchyService} from '../../../loan/approval/approval-role-hierarchy.service';
import {SingleLoanTransferModelComponent} from '../../../transfer-loan/components/single-loan-transfer-model/single-loan-transfer-model.component';
import {CombinedLoanTransferModelComponent} from '../../../transfer-loan/components/combined-loan-transfer-model/combined-loan-transfer-model.component';

@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    roleList: Array<Role> = new Array<Role>();
    page = 1;
    spinner = false;
    onActionChangeSpinner = false;
    transferToggle = false;
    shareToggle = false;
    pageable: Pageable = new Pageable();
    age: number;
    docStatus = DocStatus;
    loanType = LoanType;
    filterForm: FormGroup;
    tempLoanType = null;
    validStartDate = true;
    validEndDate = true;
    transferDoc = false;
    isMaker = false;
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;
    loanDataHolder: LoanDataHolder;
    transferUserList;
    formAction: FormGroup;
    redirected = false;
    isFilterCollapsed = true;
    showBranch = true;
    showBranchProvince = true;
    nbTrigger = NbTrigger;
    public insuranceToggle = false;
    selectedUserForTransfer;
    provinces: Province[];
    public typesDropdown: {
        name: string,
        value: string,
        closeRenewFilter: boolean   // affected by loan close renew filter
    }[] = [];
    public typesPossibleDropdown: { name: string, value: string, closeRenewFilter: boolean }[] = [
        {name: 'Update Loan', value: 'UPDATE_LOAN', closeRenewFilter: false},
        {name: 'Renew Loan', value: 'RENEWED_LOAN', closeRenewFilter: true},
        {name: 'Close Loan', value: 'CLOSURE_LOAN', closeRenewFilter: true},
        {name: 'Enhance Loan', value: 'ENHANCED_LOAN', closeRenewFilter: true},
        {name: 'Partial Settle Loan', value: 'PARTIAL_SETTLEMENT_LOAN', closeRenewFilter: true},
        {name: 'Full Settle Loan', value: 'FULL_SETTLEMENT_LOAN', closeRenewFilter: true},
    ];
    transferSpinner = false;

    canReInitiateLoan = false;
    reInitiateSpinner = false;
    reInitiateLoanCustomerName: string;
    reInitiateLoanFacilityName: string;
    reInitiateLoanBranchName: string;
    reInitiateLoanType: string;
    isOpen = false;
    private dialogRef: NbDialogRef<any>;
    approvalType: string;
    defaultRoleHierarchies = [];
    approvalRoleHierarchies = [];
    currentRole: string;
    popUpTitle = 'Transfer';
    currentRoleOrder: number;
    currentRoleType: string;
    roleTypeMaker: string;
    length = false;
    isFileUnderCurrentToUser: any;
    loanConfigId: number;
    customerId: number;
    roleId: number;
    constructor(
        private branchService: BranchService,
        private loanConfigService: LoanConfigService,
        private toastService: ToastService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal,
        private loanActionService: LoanActionService,
        private userService: UserService,
        private roleService: RoleService,
        private socketService: SocketService,
        private catalogueService: CatalogueService,
        private location: AddressService,
        private nbDialogService: NbDialogService,
        private service: ApprovalRoleHierarchyService) {
    }

    static loadData(other: CatalogueComponent) {
        other.spinner = true;
        other.loanFormService.getCatalogues(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
            other.transferToggle = true;
            other.shareToggle = true;
            other.insuranceToggle = true;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
            other.spinner = false;
            other.transferToggle = true;
        });
    }

    ngOnInit() {
        this.approvalType = LocalStorageUtil.getStorage().productUtil.LOAN_APPROVAL_HIERARCHY_LEVEL;
        this.roleId = parseInt(LocalStorageUtil.getStorage().roleId, 10);
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.redirected = paramsValue.redirect === 'true';
            });

        this.buildFilterForm();
        this.buildActionForm();

        this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
        if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
            this.isMaker = true;
        }
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }
        if (this.roleAccess === RoleAccess.OWN) {
            this.showBranch = false;
            this.showBranchProvince = false;
        }

        if (this.accessSpecific || this.accessAll) {
            this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                this.branchList = response.detail;
                this.branchList.sort((a, b) => a.name.localeCompare(b.name));
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
            });
        }
        if (this.accessAll) {
            this.roleService.getAll().subscribe(
                (response: any) => {
                    this.roleList = response.detail;
                    this.roleList.splice(0, 1); // removes ADMIN
                }, error => {
                    this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Roles'));
                }
            );
        }
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });


        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === 'ADMIN') {
            this.transferDoc = true;
        }

        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === RoleType.ADMIN || LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
            this.canReInitiateLoan = true;
        }

        if (!this.redirected) {
            // reset filter object if not redirected from other component
            const resetSearch: CatalogueSearch = new CatalogueSearch();
            // resetSearch.documentStatus = DocStatus.value(DocStatus.PENDING);
            this.catalogueService.search = resetSearch;
        }
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });
        CatalogueComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            loanNewRenew: [undefined],
            docStatus: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            role: [undefined],
            customerName: [undefined],
            companyName: [undefined],
            showShareLoanExcessingLimit: [undefined],
            users: [undefined],
            showExpriringInsurance: [undefined],
            provinceId: [undefined]
        });
    }

    buildActionForm(): void {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined, Validators.required],
                toRole: [undefined, Validators.required],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );
    }

    changePage(page: number) {
        this.page = page;
        CatalogueComponent.loadData(this);
    }

    getDifferenceInDays(createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const current = new Date();
        return Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }

    getDaysDifference(lastModifiedDate: Date, createdDate: Date): number {
        const createdAt = new Date(createdDate);
        const lastModifiedAt = new Date(lastModifiedDate);
        return Math.floor((Date.UTC(lastModifiedAt.getFullYear(), lastModifiedAt.getMonth(), lastModifiedAt.getDate()) -
            Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
    }

    checkIfDateFiltration() {
        this.validStartDate = this.filterForm.get('startDate').valid;
        this.validEndDate = this.filterForm.get('endDate').valid;
    }

    onSearch() {
        this.tempLoanType = null;
        this.catalogueService.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined :
            this.filterForm.get('branch').value;
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                if (paramsValue.search === 'APPROVED') {
                    this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.APPROVED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'REJECTED') {
                    this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.REJECTED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'CLOSED') {
                    this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.CLOSED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'PENDING') {
                    this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.PENDING) : this.filterForm.get('docStatus').value;
                } else if (this.filterForm.get('docStatus').value === 'null' ||
                    this.filterForm.get('docStatus').value === null) {
                    this.catalogueService.search.documentStatus = null;
                } else {
                    this.catalogueService.search.documentStatus = this.filterForm.get('docStatus').value;
                }
            });

        this.catalogueService.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ?
            undefined : this.filterForm.get('loanType').value;
        this.catalogueService.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanNewRenew').value) ? undefined :
            this.filterForm.get('loanNewRenew').value;
        if (!ObjectUtil.isEmpty(this.filterForm.get('startDate').value) && this.filterForm.get('endDate').value) {
            this.catalogueService.search.currentStageDate = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.catalogueService.search.currentUserRole = ObjectUtil.isEmpty(this.filterForm.get('role').value) ? undefined :
            this.filterForm.get('role').value;
        this.catalogueService.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
            this.filterForm.get('customerName').value;
        this.catalogueService.search.companyName = ObjectUtil.isEmpty(this.filterForm.get('companyName').value) ? undefined :
            this.filterForm.get('companyName').value;
        this.catalogueService.search.users = ObjectUtil.isEmpty(this.filterForm.get('users').value) ? undefined :
            this.filterForm.get('users').value;
        this.catalogueService.search.provinceId = ObjectUtil.isEmpty(this.filterForm.get('provinceId').value) ? undefined :
            this.filterForm.get('provinceId').value;
        CatalogueComponent.loadData(this);
    }

    onChangeTransferToggle(event) {
        this.transferToggle = false;
        if (event) {
            this.catalogueService.search.docAction = DocAction.value(DocAction.TRANSFER);
            this.onSearch();
        } else {
            this.catalogueService.search.docAction = undefined;
            this.onSearch();
        }
    }

    onChangeShareToggle(event) {
        this.shareToggle = false;
        if (event) {
            this.catalogueService.search.showShareLoanExcessingLimit = 'true';
            this.onSearch();
        } else {
            this.catalogueService.search.showShareLoanExcessingLimit = undefined;
            this.onSearch();
        }
    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId,
                catalogue: true
            }
        });
    }

    clearSearch() {
        this.buildFilterForm();
    }

    onTransferClick(template, customerLoanId, userId, branchId) {
        this.transferSpinner = true;
        this.userService.getUserListForTransfer(userId, branchId).subscribe((res: any) => {
            this.transferUserList = res.detail;
            this.transferSpinner = false;
        });
        this.formAction.patchValue({
                customerLoanId: customerLoanId,
                docAction: DocAction.value(DocAction.TRANSFER),
                documentStatus: DocStatus.PENDING,
                comment: 'TRANSFER'
            }
        );
        this.modalService.open(template, {size: 'lg', backdrop: 'static', keyboard: false});
    }

    onClose() {
        this.buildActionForm();
        this.modalService.dismissAll();
    }

    changeAction() {
        this.onActionChangeSpinner = true;
        this.loanDataHolder.loanType = this.tempLoanType;
        this.loanFormService.renewLoan(this.loanDataHolder).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated loan type.'));
                this.modalService.dismissAll('Close modal');
                this.tempLoanType = null;
                this.clearSearch();
                this.catalogueService.search.documentStatus = DocStatus.value(DocStatus.APPROVED);
                this.onSearch();
                this.onActionChangeSpinner = false;
                this.router.navigate(['/home/loan/summary'], {
                queryParams: {
                    loanConfigId: res.detail.loan.id,
                    customerId: res.detail.id
                }
            });
            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to update loan type.'));
                this.modalService.dismissAll('Close modal');
            }
        );

    }

    docTransfer(userId, roleId, user) {
        this.selectedUserForTransfer = user;
        const users = {id: userId};
        const role = {id: roleId};
        this.formAction.patchValue({
                toUser: users,
                toRole: role
            }
        );
    }

    action(templates) {
        this.modalService.dismissAll();
        this.modalService.open(templates, {backdrop: 'static', keyboard: false});
    }

    confirm(comment: string) {
        this.transferSpinner = true;
        this.formAction.patchValue({
            comment: comment
        });
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));
            this.transferSpinner = false;
            this.modalService.dismissAll();
            this.sendLoanNotification(response.detail.customerLoanId);
            CatalogueComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.modalService.dismissAll();

        });
    }

    onChange(data, onActionChange) {
        this.loanConfigId = data.loan.id;
        this.customerId = data.id;
        if (this.tempLoanType === 'UPDATE_LOAN_INFORMATION') {
            this.router.navigate(['/home/update-loan/dashboard'], {
                queryParams: {
                    id: data.id
                }
            });
            return;
        }
        this.loanDataHolder = data;
        this.modalService.open(onActionChange);
    }

    renewedOrCloseFrom(loanConfigId, childId) {
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: childId,
                catalogue: true
            }
        });
    }

    getCsv() {
        this.spinner = true;
        this.loanFormService.download(this.catalogueService.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();
            this.spinner = false;
        }, error => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message === null ? 'Unable to download!' : error.error.message));
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
            if (docAction === DocAction.value(DocAction.TRANSFER)) {
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

    onChangeInsuranceToggle(event) {
        this.insuranceToggle = false;
        if (event) {
            this.catalogueService.search.isInsuranceExpired = 'true';
            this.onSearch();
        } else {
            this.catalogueService.search.isInsuranceExpired = undefined;
            this.onSearch();
        }
    }

    public getSortedLoanFlags(loanFlags: CustomerLoanFlag[], customerLoanId: number): CustomerLoanFlag[] {
        loanFlags = loanFlags.filter((l) => (l.customerLoanId === customerLoanId || ObjectUtil.isEmpty(l.customerLoanId)));
        loanFlags.sort((a, b) => a.order - b.order);
        return loanFlags;
    }

    public showUpdateLoanInfo(loanFlags: CustomerLoanFlag[]): boolean {
        return loanFlags.map((f) => f.flag).includes(LoanFlag[LoanFlag.INSURANCE_EXPIRY]);
    }

    onReInitiateClick(template, customerLoanId, customerName, loanFacilityName, loanType, branchName) {
        this.reInitiateLoanCustomerName = customerName;
        this.reInitiateLoanFacilityName = loanFacilityName;
        this.reInitiateLoanType = loanType;
        this.reInitiateLoanBranchName = branchName;
        this.formAction.patchValue({
                customerLoanId: customerLoanId,
                docAction: DocAction.value(DocAction.RE_INITIATE),
                comment: 'Re-initiate'
            }
        );
        this.modalService.open(template, {size: 'lg', backdrop: 'static', keyboard: false});
    }

    reInitiateConfirm(comment: string) {
        const ref = this.modalService.open(LoginPopUp);
        let isAuthorized = false;
        ref.componentInstance.returnAuthorizedState.subscribe((receivedEntry) => {
            isAuthorized = receivedEntry;
            if (isAuthorized) {
                this.modalService.dismissAll();
                this.reInitiateSpinner = true;
                this.formAction.patchValue({
                    comment: comment
                });
                this.loanFormService.reInitiateLoan(this.formAction.value).subscribe((response: any) => {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan has been successfully re-initiated.'));
                    this.reInitiateSpinner = false;
                    this.modalService.dismissAll();
                    CatalogueComponent.loadData(this);
                }, error => {
                    this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
                    this.modalService.dismissAll();
                });
            }
        });
    }

    public close(): void {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    public transferLoanFile(loanId: number, loanConfigId: number, customerLoanId: number,
                            branchId: number, combinedLoanId: number, roleId: number, loanDataHolder: any): void {
        let refId;
        if (!ObjectUtil.isEmpty(combinedLoanId)) {
            refId = loanId;
        } else {
            refId = loanId;
        }
        this.close();
        let context;
        context = {
            approvalType: this.approvalType,
            refId: refId,
            isMaker: this.roleTypeMaker,
            currentRole: this.currentRole,
            loanConfigId: loanConfigId,
            customerLoanId: customerLoanId,
            branchId: branchId,
            customerLoanHolder: loanDataHolder,
            popUpTitle: this.popUpTitle,
            isTransfer: true,
            currentRoleOrder: this.currentRoleOrder,
            docAction: DocAction.value(DocAction.TRANSFER),
            documentStatus: DocStatus.PENDING,
            toRoleId: roleId,
            isFileUnderCurrentToUser: loanDataHolder.currentStage.toUser,
        };
        if (ObjectUtil.isEmpty(combinedLoanId)) {
            this.dialogRef = this.nbDialogService.open(SingleLoanTransferModelComponent, {
                context,
                closeOnBackdropClick: false,
                hasBackdrop: false,
                hasScroll: true
            });
        } else {
            context.combinedLoanId = combinedLoanId;
            context.isMaker = this.roleTypeMaker;
            context.branchId =  branchId;
            this.dialogRef = this.nbDialogService.open(CombinedLoanTransferModelComponent, {
                context,
                closeOnBackdropClick: false,
                hasBackdrop: false,
                hasScroll: true
            });
        }
        this.isOpen = true;
    }
}

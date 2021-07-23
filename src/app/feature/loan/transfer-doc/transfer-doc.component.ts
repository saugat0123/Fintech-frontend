import {Component, OnInit} from '@angular/core';

import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {TransferDocService, Transfersearch} from './transfer-doc.service';
import {NbDialogRef, NbDialogService, NbTrigger} from '@nebular/theme';
import {Branch} from '../../admin/modal/branch';
import {LoanConfig} from '../../admin/modal/loan-config';
import {LoanDataHolder} from '../model/loanData';
import {Role} from '../../admin/modal/role';
import {DocStatus} from '../model/docStatus';
import {LoanType} from '../model/loanType';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {BranchService} from '../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {SocketService} from '../../../@core/service/socket.service';
import {RoleService} from '../../admin/component/role-permission/role.service';
import {UserService} from '../../../@core/service/user.service';
import {LoanActionService} from '../loan-action/service/loan-action.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {RoleType} from '../../admin/modal/roleType';
import {RoleAccess} from '../../admin/modal/role-access';
import {LoanStage} from '../model/loanStage';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CustomerLoanFlag} from '../../../@core/model/customer-loan-flag';
import {LoanFlag} from '../../../@core/model/enum/loan-flag.enum';
import {DocAction} from '../model/docAction';
import {AddressService} from '../../../@core/service/baseservice/address.service';
import {ApprovalRoleHierarchyService} from '../approval/approval-role-hierarchy.service';
import {SingleLoanTransferModelComponent} from '../../transfer-loan/components/single-loan-transfer-model/single-loan-transfer-model.component';
import {CombinedLoanTransferModelComponent} from '../../transfer-loan/components/combined-loan-transfer-model/combined-loan-transfer-model.component';

@Component({
    selector: 'app-transfer-doc',
    templateUrl: './transfer-doc.component.html',
    styleUrls: ['./transfer-doc.component.scss']
})
export class TransferDocComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    roleList: Array<Role> = new Array<Role>();
    page = 1;
    spinner = false;
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
    nbTrigger = NbTrigger;
    public insuranceToggle = false;
    selectedUserForTransfer;
    transferSpinner = false;
    showHideTransferRespectToStatus: { toggled: boolean }[] = [];
    isOpen = false;
    private dialogRef: NbDialogRef<any>;
    approvalType: string;
    defaultRoleHierarchies = [];
    approvalRoleHierarchies = [];
    currentRole: string;
    popUpTitle: string;
    currentRoleOrder: number;
    currentRoleType: string;
    roleTypeMaker: string;
    length = false;
    isFileUnderCurrentToUser: any;

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
        private transferdocservice: TransferDocService,
        private location: AddressService,
        private nbDialogService: NbDialogService,
        private service: ApprovalRoleHierarchyService) {
    }

    static loadData(other: TransferDocComponent) {
        other.spinner = true;
        other.loanFormService.getCatalogues(other.transferdocservice.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            // tslint:disable-next-line:max-line-length
            other.loanDataHolderList.forEach((l) => other.showHideTransferRespectToStatus.push({toggled: other.checkApprovedRejectOrCloseByStatus(l.documentStatus)}));
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
        }

        if (this.accessSpecific || this.accessAll) {
            this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                this.branchList = response.detail;
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
                    console.log(error);
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


        if (LocalStorageUtil.getStorage().username === 'SPADMIN' || LocalStorageUtil.getStorage().roleType === 'ADMIN'
            || LocalStorageUtil.getStorage().roleType === RoleType.MAKER || LocalStorageUtil.getStorage().roleType === RoleType.APPROVAL
            || LocalStorageUtil.getStorage().roleType === RoleType.COMMITTEE) {
            this.transferDoc = true;
        }

        if (!this.redirected) {
            // reset filter object if not redirected from other component
            const resetSearch: Transfersearch = new Transfersearch();
            // resetSearch.documentStatus = DocStatus.value(DocStatus.PENDING);
            this.transferdocservice.search = resetSearch;
        }
        TransferDocComponent.loadData(this);
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
            showExpriringInsurance: [undefined]
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
    };

    changePage(page: number) {
        this.page = page;
        TransferDocComponent.loadData(this);
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
        this.transferdocservice.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined :
            this.filterForm.get('branch').value;
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                if (paramsValue.search === 'APPROVED') {
                    this.transferdocservice.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.APPROVED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'REJECTED') {
                    this.transferdocservice.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.REJECTED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'CLOSED') {
                    this.transferdocservice.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.CLOSED) : this.filterForm.get('docStatus').value;
                } else if (paramsValue.search === 'PENDING') {
                    this.transferdocservice.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                        DocStatus.value(DocStatus.PENDING) : this.filterForm.get('docStatus').value;
                } else if (this.filterForm.get('docStatus').value === 'null' ||
                    this.filterForm.get('docStatus').value === null) {
                    this.transferdocservice.search.documentStatus = null;
                } else {
                    this.transferdocservice.search.documentStatus = this.filterForm.get('docStatus').value;
                }
            });

        this.transferdocservice.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ?
            undefined : this.filterForm.get('loanType').value;
        this.transferdocservice.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanNewRenew').value) ? undefined :
            this.filterForm.get('loanNewRenew').value;
        if (!ObjectUtil.isEmpty(this.filterForm.get('startDate').value) && this.filterForm.get('endDate').value) {
            this.transferdocservice.search.currentStageDate = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        this.transferdocservice.search.currentUserRole = ObjectUtil.isEmpty(this.filterForm.get('role').value) ? undefined :
            this.filterForm.get('role').value;
        this.transferdocservice.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
            this.filterForm.get('customerName').value;
        this.transferdocservice.search.companyName = ObjectUtil.isEmpty(this.filterForm.get('companyName').value) ? undefined :
            this.filterForm.get('companyName').value;
        TransferDocComponent.loadData(this);
    }

    onChangeTransferToggle(event) {
        this.transferToggle = false;
        if (event) {
            this.transferdocservice.search.docAction = DocAction.value(DocAction.TRANSFER);
            this.onSearch();
        } else {
            this.transferdocservice.search.docAction = undefined;
            this.onSearch();
        }
    }

    onChangeShareToggle(event) {
        this.shareToggle = false;
        if (event) {
            this.transferdocservice.search.showShareLoanExcessingLimit = 'true';
            this.onSearch();
        } else {
            this.transferdocservice.search.showShareLoanExcessingLimit = undefined;
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
            TransferDocComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            this.modalService.dismissAll();

        });
    }

    onChange(data, onActionChange) {
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


    getCsv() {
        this.loanFormService.download(this.transferdocservice.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

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
    };

    onChangeInsuranceToggle(event) {
        this.insuranceToggle = false;
        if (event) {
            this.transferdocservice.search.isInsuranceExpired = 'true';
            this.onSearch();
        } else {
            this.transferdocservice.search.isInsuranceExpired = undefined;
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

    checkApprovedRejectOrCloseByStatus(status) {
        switch (status) {
            case DocStatus[DocStatus.APPROVED]:
                return false;
            case DocStatus[DocStatus.REJECTED]:
                return false;
            case DocStatus[DocStatus.CLOSED]:
                return false;

            default:
                return true;
        }

    }

    public close(): void {
        if (this.isOpen) {
            this.dialogRef.close();
            this.isOpen = false;
        }
    }

    public transferLoanFile(refId: number, loanConfigId: number, customerLoanId: number,
                            branchId: number, combinedLoanId: number, loanDataHolder: any): void {
        this.roleHierarchyList(refId, loanDataHolder);
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
            toRole: {id: Number(LocalStorageUtil.getStorage().roleId)},
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

    private roleHierarchyList(refId: number, loanDataHolder: any): void {
        this.service.findAll(this.approvalType, refId).subscribe((response: any) => {
            this.defaultRoleHierarchies = response.detail;
            this.length = this.defaultRoleHierarchies.length > 0;
            this.approvalRoleHierarchies = this.defaultRoleHierarchies.reverse();
            const currentRoleId = loanDataHolder.currentStage.toUser.role.id;
            this.roleTypeMaker = loanDataHolder.currentStage.toUser.role.roleType;
            this.defaultRoleHierarchies.filter((f) => {
                const roleId = f.role.id;
                f.isCurrentRole = false;
                if (currentRoleId === roleId) {
                    f.isCurrentRole = true;
                    this.currentRole = f.role.roleName;
                    this.currentRoleOrder = f.role.roleOrder;
                    this.isFileUnderCurrentToUser = loanDataHolder.currentStage.toUser;
                }
                this.popUpTitle = 'Transfer';
            });
        });
    }
}


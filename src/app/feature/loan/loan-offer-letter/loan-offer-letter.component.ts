import {Component, OnInit} from '@angular/core';
import {Branch} from '../../admin/modal/branch';
import {LoanConfig} from '../../admin/modal/loan-config';
import {LoanDataHolder} from '../model/loanData';
import {Role} from '../../admin/modal/role';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../model/loanType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanFormService} from '../component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanActionService} from '../loan-action/service/loan-action.service';
import {UserService} from '../../admin/component/user/user.service';
import {SocketService} from '../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from '../../admin/component/catalogue/catalogue.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {RoleType} from '../../admin/modal/roleType';
import {RoleAccess} from '../../admin/modal/role-access';
import {DocStatus} from '../model/docStatus';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {CustomerOfferLetterService} from '../service/customer-offer-letter.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CustomerOfferLetter} from '../model/customer-offer-letter';
import {NgxSpinnerService} from 'ngx-spinner';
import {AffiliateId} from '../../../@core/utils/constants/affiliateId';
import {Pattern} from '../../../@core/utils/constants/pattern';

@Component({
    selector: 'app-loan-offer-letter',
    templateUrl: './loan-offer-letter.component.html',
    styleUrls: ['./loan-offer-letter.component.scss']
})
export class LoanOfferLetterComponent implements OnInit {

    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    assignedOfferLetterList: Array<CustomerOfferLetter> = new Array<CustomerOfferLetter>();
    roleList: Array<Role> = new Array<Role>();
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    age: number;
    loanType = LoanType;
    filterForm: FormGroup;
    tempLoanType = null;
    validStartDate = true;
    validEndDate = true;
    transferDoc = false;
    roleType = false;
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;
    loanDataHolder: LoanDataHolder;
    formAction: FormGroup;
    redirected = false;
    isFilterCollapsed = true;
    loanConfig: LoanConfig = new LoanConfig();
    valForwardBackward;
    roleName = false;
    userList = [];
    roleListInCAD = [];
    offerLetterAssignForm: FormGroup;
    submitted = false;
    isCAD_ADMIN = false;
    toggleArray: { toggled: boolean }[] = [];
    selectedBranchId = 0;
    errorMessage = null;
    filterUserList = [];
    isAssignSelected = false;
    cbsLoanFileNumber: string;
    loanId;
    docStatus = DocStatus;
    alphaNumericPattern = Pattern.ALPHA_NUMERIC;

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
        private socketService: SocketService,
        private catalogueService: CatalogueService,
        private customerOfferLetterService: CustomerOfferLetterService,
        private spinnerService: NgxSpinnerService) {
    }

    static loadData(other: LoanOfferLetterComponent) {
        other.spinnerService.show();
        other.catalogueService.search.committee = 'true';
        if (other.isCAD_ADMIN) {
            // tslint:disable-next-line:max-line-length
            other.customerOfferLetterService.getIssuedOfferLetter(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
                other.loanDataHolderList = response.detail.content;
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.loanDataHolderList.forEach(() => other.toggleArray.push({toggled: false}));
                other.spinner = false;
                other.spinnerService.hide();

            }, error => {
                other.spinnerService.hide();
                console.error(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
                other.spinner = false;
            });
        } else {
            // tslint:disable-next-line:max-line-length
            other.customerOfferLetterService.getAssignedOfferLetter(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
                other.assignedOfferLetterList = response.detail.content;
                other.assignedOfferLetterList.forEach(() => other.toggleArray.push({toggled: false}));
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
                other.spinnerService.hide();
            }, error => {
                console.error(error);
                other.spinnerService.hide();
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
                other.spinner = false;
            });
        }
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.redirected = paramsValue.redirect === 'true';
            });

        this.getUserListForFilter();
        if (LocalStorageUtil.getStorage().roleName === 'CAD') {
            this.roleName = true;
        }
        this.buildFilterForm();
        this.buildActionForm();
        this.buildOfferLetterAssignForm();
        this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
        if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
            this.roleType = true;
        }
        if (LocalStorageUtil.getStorage().roleType === RoleType.CAD_ADMIN) {
            this.isCAD_ADMIN = true;
        }
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }

        if (this.accessSpecific || this.accessAll) {
            this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
                this.branchList = response.detail;
            }, error => {
                console.error(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
            });
        }
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });


        if (LocalStorageUtil.getStorage().username === 'SPADMIN') {
            this.transferDoc = true;
        }

        if (!this.redirected) {
            // reset filter object if not redirected from other component
            const resetSearch: CatalogueSearch = new CatalogueSearch();
            resetSearch.documentStatus = DocStatus.value(DocStatus.PENDING);
            this.catalogueService.search = resetSearch;
        }
        LoanOfferLetterComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            loanNewRenew: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            role: [undefined],
            customerName: [undefined],
            postApprovalAssignStatus: [undefined],
            postApprovalAssignedUser: [undefined]
        });
    }

    buildActionForm(): void {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
                docAction: [undefined],
                comment: [undefined, Validators.required],
                documentStatus: [undefined]
            }
        );
    }


    buildOfferLetterAssignForm(): void {
        this.offerLetterAssignForm = this.formBuilder.group(
            {
                customerLoanId: [undefined],
                user: [undefined, Validators.required],
                role: [undefined, Validators.required]
            });
    }

    changePage(page: number) {
        this.page = page;
        LoanOfferLetterComponent.loadData(this);
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
        this.catalogueService.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ? undefined :
            this.filterForm.get('loanType').value;
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
        this.catalogueService.search.postApprovalAssignStatus = ObjectUtil.isEmpty(this.filterForm.get('postApprovalAssignStatus')
            .value) ? undefined :
            this.filterForm.get('postApprovalAssignStatus').value;
        this.catalogueService.search.documentStatus = 'APPROVED';
        this.catalogueService.search.postApprovalAssignedUser = ObjectUtil.isEmpty(this.filterForm.get('postApprovalAssignedUser')
            .value) ? undefined :
            this.filterForm.get('postApprovalAssignedUser').value;
        LoanOfferLetterComponent.loadData(this);
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
        this.isFilterCollapsed = true;
    }


    onClose() {
        this.modalService.dismissAll();
    }


    docTransfer(userId, roleId) {
        const users = {id: userId};
        const role = {id: roleId};
        this.formAction.patchValue({
                toUser: users,
                toRole: role
            }
        );
    }

    confirm() {
        this.onClose();
        this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                this.formAction.get('docAction').value));

            LoanOfferLetterComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

        });
    }

    onChange(data, onActionChange) {
        this.loanDataHolder = data;
        this.modalService.open(onActionChange);

    }


    getCsv() {
        this.loanFormService.download(this.catalogueService.search).subscribe((response: any) => {
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        });
    }

    generateOfferLetter(customerLoan: LoanDataHolder) {
        this.router.navigate(['/home/cad-document'],
            {
                queryParams: {
                    customerId: customerLoan.id,
                }
            });
    }

    /*uploadOfferLetterTemplate(customerLoan: LoanDataHolder) {
        const modalRef = this.modalService.open(OfferLetterUploadComponent, {backdrop: 'static'});
        modalRef.componentInstance.customerOfferLetter = customerLoan.customerOfferLetter;
        modalRef.componentInstance.customerId = customerLoan.id;
        ModalUtils.resolve(modalRef.result, LoanOfferLetterComponent.loadData, this);
    }*/

    openForwardBackward(template, offerLetterId, val) {
        this.valForwardBackward = 'FORWARD to CAD ?';
        if (val === 0) {
            this.valForwardBackward = 'Backward to RM ?';
        }
        this.modalService.dismissAll();
        this.modalService.open(template);
    }

    assignOfferLetter() {
        this.submitted = true;
        if (this.offerLetterAssignForm.invalid) {
            return;
        }
        const user = this.offerLetterAssignForm.get('user').value;
        const role = this.offerLetterAssignForm.get('role').value;
        const assign = {
            customerLoanId: this.offerLetterAssignForm.get('customerLoanId').value,
            userId: user.id,
            roleId: role.id
        };

        this.customerOfferLetterService.assignOfferLetter(assign).subscribe((res: any) => {
            this.submitted = false;
            this.modalService.dismissAll();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY ASSIGN TO ' + user.username));
            LoanOfferLetterComponent.loadData(this);
        }, error => {
            this.spinnerService.hide();
            this.submitted = false;
            this.modalService.dismissAll();
            try {
                error.error.errors.forEach(e => {
                    this.toastService.show(new Alert(AlertType.ERROR, e.message));
                });
            } catch (e) {
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            }


        });

    }

    openModel(template, customerLoanId, branchId) {
        this.selectedBranchId = branchId;
        this.offerLetterAssignForm.patchValue({
            customerLoanId: customerLoanId
        });
        this.getRoleListPresentInCad();
        this.modalService.open(template);
    }


    public getRoleListPresentInCad() {
        this.customerOfferLetterService.getRolesPresentInCADHEIRARCHY().subscribe((res: any) => {
            this.roleListInCAD = res.detail;
            if (this.roleListInCAD.length > 1) {
                this.getUserList(this.roleListInCAD[0].role);
            }

        });
    }

    public getUserList(role) {
        this.offerLetterAssignForm.patchValue({
            role: role,
            user: undefined
        });
        this.userService.getUserListByRoleIdAndBranchIdForDocumentAction(role.id, this.selectedBranchId).subscribe((response: any) => {
            this.errorMessage = null;
            this.userList = response.detail;
            if (this.userList.length === 1) {
                this.offerLetterAssignForm.patchValue({
                    user: this.userList[0],
                    role: role
                });
            } else if (this.userList.length > 1) {
                this.offerLetterAssignForm.patchValue({
                    user: this.userList[0],
                    role: role
                });

            } else {
                this.errorMessage = 'NO User Present in this Role';
            }
        });
    }

    getUserListForFilter() {
        const searchDto = {};
        this.customerOfferLetterService.getUserListForFilter(searchDto).subscribe((res: any) => {
            this.filterUserList = res.detail;
        });
    }

    selectedAssign(event) {
        if (event.value === 'NOT_ASSIGNED') {
            this.isAssignSelected = false;
            this.filterForm.patchValue({
                postApprovalAssignedUser: null,
            });
        } else {
            this.isAssignSelected = true;
        }
    }

    openCadModel(template, loanId , cbsLoanFileNumber) {
        this.cbsLoanFileNumber = cbsLoanFileNumber;
        this.loanId = loanId;
        this.modalService.open(template);
    }

    saveCbsNumber() {
        const loanDataHolder = new LoanDataHolder();
        loanDataHolder.id = this.loanId;
        loanDataHolder.cbsLoanFileNumber = this.cbsLoanFileNumber;
        this.loanFormService.saveCbsNumbers(loanDataHolder).subscribe(value => {
            this.modalService.dismissAll();
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved CBS Number'));
            LoanOfferLetterComponent.loadData(this);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
            LoanOfferLetterComponent.loadData(this);
        });
    }
}

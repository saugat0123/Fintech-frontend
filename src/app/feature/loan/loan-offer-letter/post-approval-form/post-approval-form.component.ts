import {Component, Input, OnInit} from '@angular/core';
import {CustomerOfferLetter} from '../../model/customer-offer-letter';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Branch} from '../../../admin/modal/branch';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanDataHolder} from '../../model/loanData';
import {Role} from '../../../admin/modal/role';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../model/loanType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ModalUtils, ToastService} from '../../../../@core/utils';
import {LoanFormService} from '../../component/loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {UserService} from '../../../admin/component/user/user.service';
import {SocketService} from '../../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from '../../../admin/component/catalogue/catalogue.service';
import {CustomerOfferLetterService} from '../../service/customer-offer-letter.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';
import {RoleAccess} from '../../../admin/modal/role-access';
import {DocStatus} from '../../model/docStatus';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';

@Component({
    selector: 'app-post-approval-form',
    templateUrl: './post-approval-form.component.html',
    styleUrls: ['./post-approval-form.component.scss']
})
export class PostApprovalFormComponent implements OnInit {

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

    static loadData(other: PostApprovalFormComponent) {
        other.spinnerService.show();
        // other.catalogueService.search.committee = 'true';
            // tslint:disable-next-line:max-line-length
            other.customerOfferLetterService.getIssuedOfferLetter(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
                other.loanDataHolderList = response.detail.content;
                console.log(response.detail.content);
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
        }


    ngOnInit() {
        console.log(this.loanDataHolderList);
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.redirected = paramsValue.redirect === 'true';
            });
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
        PostApprovalFormComponent.loadData(this);
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
            postApprovalAssignStatus: [undefined]
        });
    }

    buildActionForm(): void {
        this.formAction = this.formBuilder.group(
            {
                loanConfigId: [undefined],
                customerLoanId: [undefined],
                toUser: [undefined],
                toRole: [undefined],
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
        PostApprovalFormComponent.loadData(this);

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
        this.catalogueService.search.documentStatus = 'APPROVED';
        PostApprovalFormComponent.loadData(this);
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
}

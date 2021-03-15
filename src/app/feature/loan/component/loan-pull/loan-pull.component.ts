import {Component, OnInit} from '@angular/core';
import {ToastService} from '../../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanFormService} from '../loan-form/service/loan-form.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CatalogueSearch, CatalogueService} from '../../../admin/component/catalogue/catalogue.service';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanDataHolder} from '../../model/loanData';
import {Branch} from '../../../admin/modal/branch';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {Role} from '../../../admin/modal/role';
import {DocStatus} from '../../model/docStatus';
import {LoanType} from '../../model/loanType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanActionService} from '../../loan-action/service/loan-action.service';
import {UserService} from '../../../admin/component/user/user.service';
import {SocketService} from '../../../../@core/service/socket.service';
import {RoleType} from '../../../admin/modal/roleType';
import {RoleAccess} from '../../../admin/modal/role-access';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DocAction} from '../../model/docAction';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {ProductUtils} from '../../../admin/service/product-mode.service';

@Component({
    selector: 'app-loan-pull',
    templateUrl: './loan-pull.component.html',
    styleUrls: ['./loan-pull.component.scss']
})
export class LoanPullComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
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
    toggleArray: { toggled: boolean }[] = [];
    productUtils:ProductUtils = LocalStorageUtil.getStorage().productUtil;


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
        private catalogueService: CatalogueService) {
    }

    static loadData(other: LoanPullComponent) {
        other.catalogueService.search.committee = 'true';
        other.loanFormService.getCommitteePull(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.loanDataHolderList.forEach(() => other.toggleArray.push({toggled: false}));
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.redirected = paramsValue.redirect === 'true';
            });

        this.buildFilterForm();
        this.buildActionForm();

        this.roleAccess = LocalStorageUtil.getStorage().roleAccess;
        if (LocalStorageUtil.getStorage().roleType === RoleType.MAKER) {
            this.roleType = true;
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
        LoanPullComponent.loadData(this);
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            loanNewRenew: [undefined],
            startDate: [undefined],
            endDate: [undefined],
            role: [undefined],
            customerName: [undefined]
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

    changePage(page: number) {
        this.page = page;
        LoanPullComponent.loadData(this);
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
        LoanPullComponent.loadData(this);
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

    onPullClick(template, customerLoanId, userId) {

        this.formAction.patchValue({
                customerLoanId: customerLoanId,
                docAction: DocAction.value(DocAction.PULLED),
                documentStatus: DocStatus.PENDING,
                comment: 'PULLED'
            }
        );
        this.modalService.open(template);
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

            LoanPullComponent.loadData(this);
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


}


import {Component, OnInit} from '@angular/core';
import {Branch} from '../../../../admin/modal/branch';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {LoanDataHolder} from '../../../model/loanData';
import {Role} from '../../../../admin/modal/role';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../model/loanType';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BranchService} from '../../../../admin/component/branch/branch.service';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {LoanFormService} from '../../loan-form/service/loan-form.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanActionService} from '../../../loan-action/service/loan-action.service';
import {UserService} from '../../../../admin/component/user/user.service';
import {SocketService} from '../../../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from '../../../../admin/component/catalogue/catalogue.service';
import {PaginationUtils} from '../../../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../../admin/modal/roleType';
import {RoleAccess} from '../../../../admin/modal/role-access';
import {DocStatus} from '../../../model/docStatus';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DocAction} from '../../../model/docAction';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {LoanHolderLoans} from '../../../../../component/dashboard/modal/loanHolderLoans';
import {ProposalCalculationUtils} from '../../loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../../../@core/utils/constants/loan-data-key';

@Component({
    selector: 'app-customer-wise-loan-pull',
    templateUrl: './customer-wise-loan-pull.component.html',
    styleUrls: ['./customer-wise-loan-pull.component.scss']
})
export class CustomerWiseLoanPullComponent implements OnInit {
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
    loanHolderLoanList: Array<LoanHolderLoans> = new Array<LoanHolderLoans>();
    loanForCombine: { loan: Array<LoanDataHolder> }[] = [];
    initStatus;
    clientType = [];
    subSector = [];
    model: LoanDataHolder = new LoanDataHolder();
    isCombine = false;
    formVal = [];

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

    static  loadData(other: CustomerWiseLoanPullComponent) {
        other.spinner = true;
        other.toggleArray = [];
        other.loanForCombine = [];
        other.loanHolderLoanList = [];
        other.catalogueService.search.committee = 'true';
        other.loanFormService.getCommitteePull(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
            other.loanHolderLoanList = response.detail.content;
            other.loanHolderLoanList.forEach(() => other.toggleArray.push({toggled: false}));
            other.loanHolderLoanList.forEach((l) => other.loanForCombine.push({loan: other.getLoansData(l.combineList)}));

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
        CustomerWiseLoanPullComponent.loadData(this);
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
        CustomerWiseLoanPullComponent.loadData(this);
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
        CustomerWiseLoanPullComponent.loadData(this);
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

    onPullClick(template, customerLoanId, loans) {
        const customerLoan: LoanDataHolder = loans;
        this.formVal = [];
        if (ObjectUtil.isEmpty(customerLoan.combinedLoan)) {
            this.isCombine = false;

            this.formAction.patchValue({
                    customerLoanId: customerLoanId,
                    docAction: DocAction.value(DocAction.PULLED),
                    documentStatus: DocStatus.PENDING,
                    comment: 'PULLED'
                }
            );
        } else {
            this.isCombine = true;
            const customerLoanIdList = customerLoan.data.split(',').map(Number);

            this.formVal = customerLoanIdList.map(c => {
                return {
                    customerLoanId: c,
                    docAction: DocAction.value(DocAction.PULLED),
                    documentStatus: DocStatus.PENDING,
                    comment: 'PULLED'
                };
            });
        }

        this.modalService.open(template);
    }

    onClose() {
        this.modalService.dismissAll();
    }

    openCommentModal(template, data: LoanDataHolder) {
        this.model = new LoanDataHolder();
        this.model = data;
        this.modalService.open(template);
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
        this.spinner = true;
        if (this.isCombine) {
            this.loanFormService.postCombinedLoanAction(this.formVal, false).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                    'PULLED'));

                CustomerWiseLoanPullComponent.loadData(this);
            }, error => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

            });
        } else {
            this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
                    this.formAction.get('docAction').value));

                CustomerWiseLoanPullComponent.loadData(this);
            }, error => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

            });
        }
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

    public getLoansData(datas) {
        const finalOp = [];
        const inputArray: Array<Map<number, Array<LoanDataHolder>>> = datas;
        inputArray.forEach(data => {
            let loanData = new LoanDataHolder();
            let name = '';
            const input: Map<number, Array<LoanDataHolder>> = data;

            // tslint:disable-next-line:forin
            for (const key in input) {
                const loanDataList: Array<LoanDataHolder> = data[key];
                loanData = new LoanDataHolder();
                loanData = loanDataList[0];
                // tslint:disable-next-line:max-line-length
                loanData.proposal.proposedLimit = ProposalCalculationUtils.calculateTotalFromProposalList(LoanDataKey.PROPOSE_LIMIT, loanDataList);
                name = loanDataList.map(a => {
                    return a.loan;
                }).map(b => {
                    return b.name;
                }).join(',');
                loanData.loan.name = name;
                const ids = loanDataList.map(a => {
                    return a.id;
                }).join(',');
                loanData.data = ids;
                finalOp.push(loanData);
            }


        });
        return finalOp;

    }

}

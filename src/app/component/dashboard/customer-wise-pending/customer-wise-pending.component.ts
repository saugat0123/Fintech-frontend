import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {LoanDataHolder} from '../../../feature/loan/model/loanData';
import {LoanType} from '../../../feature/loan/model/loanType';
import {User} from '../../../feature/admin/modal/user';
import {DocStatus} from '../../../feature/loan/model/docStatus';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';
import {ProductUtils} from '../../../feature/admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {NbTrigger} from '@nebular/theme';
import {DmsLoanService} from '../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {UserService} from '../../../@core/service/user.service';
import {LoanConfigService} from '../../../feature/admin/component/loan-config/loan-config.service';
import {LoanFormService} from '../../../feature/loan/component/loan-form/service/loan-form.service';
import {BranchService} from '../../../feature/admin/component/branch/branch.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../@core/utils';
import {DatePipe} from '@angular/common';
import {AddressService} from '../../../@core/service/baseservice/address.service';
import {PaginationUtils} from '../../../@core/utils/PaginationUtils';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../@core/utils/api/ApiConfig';
import {LoanHolderLoans} from '../modal/loanHolderLoans';
import {ProposalCalculationUtils} from '../../../feature/loan/component/loan-summary/ProposalCalculationUtils';
import {LoanDataKey} from '../../../@core/utils/constants/loan-data-key';
import {CustomerService} from '../../../feature/admin/service/customer.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SafePipe} from '../../../feature/memo/pipe/safe.pipe';
import {LoanTag} from '../../../feature/loan/model/loanTag';

@Component({
    selector: 'app-customer-wise-pending',
    templateUrl: './customer-wise-pending.component.html',
    styleUrls: ['./customer-wise-pending.component.scss']
})
export class CustomerWisePendingComponent implements OnInit {

    dmsLoanFiles: Array<DmsLoanFile>;
    loanDataHolders: Array<LoanDataHolder>;
    loanType = LoanType;
    user: User = new User();
    search: any = {
        documentStatus: DocStatus.value(DocStatus.PENDING),
        loanConfigId: undefined,
        branchIds: undefined,
        loanNewRenew: undefined,
        customerName: undefined,
        provinceId: undefined,
        customerType: undefined,
        clientType: undefined,
        customerCode: undefined,
        toUser: undefined,
        loanTag: undefined,
    };
    filterForm: FormGroup;
    loanList: Array<LoanConfig> = new Array<LoanConfig>();
    pageable: Pageable = new Pageable();
    spinner = false;
    page = 1;
    branchList = [];
    provinces = [];
    branchFilter = true;
    isFilterCollapsed = true;
    docStatus = DocStatus;
    docStatusMakerList = [];
    showDocStatusList = false;
    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    nbTrigger = NbTrigger;
    userRoleType;
    loanHolderLoanList: Array<LoanHolderLoans> = new Array<LoanHolderLoans>();
    toggleArray: { toggled: boolean }[] = [];
    loanForCombine: { loan: Array<LoanDataHolder> }[] = [];
    initStatus;
    clientType = [];
    loanTag = LoanTag.values();
    subSector = [];
    model = new LoanDataHolder();
    displayCombineLoanList = [];
    loanHolderLoanListTemp: Array<LoanHolderLoans> = new Array<LoanHolderLoans>();

    constructor(
        private service: DmsLoanService,
        private userService: UserService,
        private loanConfigService: LoanConfigService,
        private loanFormService: LoanFormService,
        private branchService: BranchService,
        private router: Router,
        private toastService: ToastService,
        private route: ActivatedRoute,
        private datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private location: AddressService,
        private customerService: CustomerService,
        private modalService: NgbModal,
        private safePipe: SafePipe) {
    }


    static loadData(other: CustomerWisePendingComponent) {
        other.spinner = true;
        other.toggleArray = [];
        other.loanForCombine = [];
        other.loanHolderLoanList = [];
        other.loanHolderLoanListTemp = [];
        other.loanFormService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe(
            (response: any) => {
                other.loanHolderLoanList = response.detail.content;
                other.loanHolderLoanListTemp = response.detail.content;
                other.loanHolderLoanList.forEach(() => other.toggleArray.push({toggled: false}));
                other.loanHolderLoanList.forEach((l) => other.loanForCombine.push({loan: other.getLoansData(l.combineList)}));
                other.pageable = PaginationUtils.getPageable(response.detail);
                other.spinner = false;
            }, error => {
                console.log(error);
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.getClientType();
        this.getSubSector();
        this.search.documentStatus = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
        this.initStatus = this.search.documentStatus;
        this.buildFilterForm();
        if (this.search.documentStatus.toString() === DocStatus.value(DocStatus.PENDING)) {
            this.showDocStatusList = false;
        } else {
            this.docStatusForMaker();
            this.showDocStatusList = true;
        }
        CustomerWisePendingComponent.loadData(this);
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.loanConfigService.getAll().subscribe(
            (response: any) => {
                this.loanList = response.detail;
            }
        );

        const roleAccess = LocalStorageUtil.getStorage().roleAccess;
        if (roleAccess === 'ALL') {
            this.branchService.getAll().subscribe((res: any) => {
                this.branchFilter = true;
                this.branchList = res.detail;
            });
        } else {
            this.branchService.getBranchAccessByCurrentUser().subscribe((res: any) => {
                if (roleAccess === 'OWN') {
                    this.branchList = [];
                    this.branchFilter = false;
                }
                this.branchList = res.detail;
            });
        }
        this.userRoleType = LocalStorageUtil.getStorage().roleType;
        this.location.getProvince().subscribe((response: any) => {
            this.provinces = response.detail;
        });
    }

    getClientType() {
        this.customerService.clientType().subscribe((res: any) => {
                this.clientType = res.detail;
            }
            , error => {
                console.error(error);
            });
    }

    getSubSector() {
        this.customerService.subSector().subscribe((res: any) => {
                const response = res.detail;
                const sectorArray = [];
                Object.keys(res.detail).forEach(value => {
                    sectorArray.push({
                        key: value, value: response[value]
                    });
                });
                this.subSector = sectorArray;
            }
            , error => {
                console.error(error);
            });
    }

    buildFilterForm() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            customerName: [undefined],
            loanType: [undefined],
            loan: [undefined],
            documentStatus: [undefined],
            provinceId: [undefined],
            customerType: [undefined],
            clientType: [undefined],
            customerCode: [undefined],
            loanTag: [undefined],
        });
    }

    onSearch() {

        this.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined : this.filterForm.get('branch').value;
        this.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loan').value) ? undefined : this.filterForm.get('loan').value;
        this.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ? undefined :
            this.filterForm.get('loanType').value;
        this.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
            this.filterForm.get('customerName').value;
        this.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('documentStatus').value) ? this.initStatus :
            this.filterForm.get('documentStatus').value;
        this.search.provinceId = ObjectUtil.isEmpty(this.filterForm.get('provinceId').value) ? undefined :
            this.filterForm.get('provinceId').value;
        this.search.customerType = ObjectUtil.isEmpty(this.filterForm.get('customerType').value) ? undefined :
            this.filterForm.get('customerType').value;
        this.search.clientType = ObjectUtil.isEmpty(this.filterForm.get('clientType').value) ? undefined :
            this.filterForm.get('clientType').value;
        this.search.customerCode = ObjectUtil.isEmpty(this.filterForm.get('customerCode').value) ? undefined :
            this.filterForm.get('customerCode').value;
        this.search.loanTag = ObjectUtil.isEmpty(this.filterForm.get('loanTag').value) ? undefined :
            this.filterForm.get('loanTag').value;
        CustomerWisePendingComponent.loadData(this);
    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerId
            }
        });
    }

    changePage(page: number) {
        this.page = page;
        CustomerWisePendingComponent.loadData(this);
    }

    getCsv() {
        this.spinner = true;
        this.search.toUser = LocalStorageUtil.getStorage().userId;
        this.loanFormService.download(this.search).subscribe((response: any) => {
            this.spinner = false;
            const link = document.createElement('a');
            link.target = '_blank';
            link.href = ApiConfig.URL + '/' + response.detail;
            link.download = ApiConfig.URL + '/' + response.detail;
            link.setAttribute('visibility', 'hidden');
            link.click();

        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to download'));
            this.spinner = false;
        });
    }

    docStatusForMaker() {
        DocStatus.values().forEach((value) => {
            if (value === DocStatus.value(DocStatus.DISCUSSION) ||
                value === DocStatus.value(DocStatus.DOCUMENTATION) ||
                value === DocStatus.value(DocStatus.VALUATION) ||
                value === DocStatus.value(DocStatus.INITIAL) ||
                value === DocStatus.value(DocStatus.UNDER_REVIEW)) {
                this.docStatusMakerList.push(value);
            }
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
                finalOp.push(loanData);
            }


        });
        return finalOp;

    }

    openCommentModal(template, data: LoanDataHolder) {
        this.model = new LoanDataHolder();
        this.model = data;
        this.modalService.open(template);
    }

    onClose() {
        this.modalService.dismissAll();
    }


    public customSafePipe(val) {
        return this.safePipe.transform(val);
    }

    combineLoanListDisplay(data, template, index) {
        const list = this.loanHolderLoanListTemp[index].combineList;
        this.displayCombineLoanList = [];
        list.forEach(l => {
            const input: Map<number, Array<LoanDataHolder>> = l;
            Object.keys(input).forEach(key => {
                if (key.toString() === data.combinedLoan.id.toString()) {

                    this.displayCombineLoanList = input[data.combinedLoan.id];

                }
            });

            // tslint:disable-next-line:max-line-length
            this.displayCombineLoanList[0].proposal.proposedLimit = JSON.parse(this.displayCombineLoanList[0].proposal.data)['proposedLimit'];
            this.displayCombineLoanList[0].loan.name = this.displayCombineLoanList[0].loan.name.toString().split(',')[0];
        });

        this.modalService.open(template);
    }

    onClickLoan(loanConfigId: number, customerLoan: number) {
        this.spinner = true;
        this.modalService.dismissAll();
        this.router.navigate(['/home/loan/summary'], {
            queryParams: {
                loanConfigId: loanConfigId,
                customerId: customerLoan
            }
        });
    }

}

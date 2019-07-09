import {Component, OnInit} from '@angular/core';
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
import {FormBuilder, FormGroup} from '@angular/forms';
import {RoleAccess} from '../../modal/role-access';
import {Router} from '@angular/router';

@Component({
    selector: 'app-catalogue',
    templateUrl: './catalogue.component.html',
    styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
    branchList: Array<Branch> = new Array<Branch>();
    loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
    loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
    page = 1;
    spinner = false;
    pageable: Pageable = new Pageable();
    age: number;
    docStatus = DocStatus;
    filterForm: FormGroup;
    validStartDate = true;
    validEndDate = true;
    search = {
        branchIds: undefined,
        documentStatus: DocStatus.value(DocStatus.PENDING),
        loanConfigId: undefined,
        currentStageDate: undefined
    };
    roleAccess: string;
    accessSpecific: boolean;
    accessAll: boolean;

    constructor(private branchService: BranchService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private router: Router,
                private loanFormService: LoanFormService,
                private formBuilder: FormBuilder) {
    }

    static loadData(other: CatalogueComponent) {
        other.loanFormService.getCatalogues(other.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;
        }, error => {
            console.error(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
            other.spinner = false;
        });
    }

    ngOnInit() {
        this.filterForm = this.formBuilder.group({
            branch: [undefined],
            loanType: [undefined],
            docStatus: [undefined],
            startDate: [undefined],
            endDate: [undefined]
        });
        this.roleAccess = localStorage.getItem('roleAccess');
        if (this.roleAccess === RoleAccess.SPECIFIC) {
            this.accessSpecific = true;
        } else if (this.roleAccess === RoleAccess.ALL) {
            this.accessAll = true;
        }
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branchList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanTypeList = response.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
        CatalogueComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        CatalogueComponent.loadData(this);
    }

    getDifferenceInDays(date: Date): number {
        const past = new Date(date);
        const current = new Date();
        return Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
            Date.UTC(past.getFullYear(), past.getMonth(), past.getDate())) / (1000 * 60 * 60 * 24));
    }

    checkIfDateFiltration() {
        this.validStartDate = this.filterForm.get('startDate').valid;
        this.validEndDate = this.filterForm.get('endDate').valid;
    }

    ok() {
        this.search.branchIds = this.filterForm.get('branch').value === null ? undefined :
            this.filterForm.get('branch').value;
        this.search.documentStatus = this.filterForm.get('docStatus').value === null ? DocStatus.value(DocStatus.PENDING) :
            this.filterForm.get('docStatus').value;
        this.search.loanConfigId = this.filterForm.get('loanType').value === null ? undefined :
            this.filterForm.get('loanType').value;
        if (this.filterForm.get('startDate').value !== null && this.filterForm.get('endDate').value) {
            this.search.currentStageDate = JSON.stringify({
                // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
                'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
                'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
            });
        }
        CatalogueComponent.loadData(this);
    }

    onClick(loanConfigId: number, customerId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: loanConfigId, customerId: customerId, catalogue: true}});


    }

}

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
import {DatePipe} from '@angular/common';

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
    search: any = {
        documentStatus: 'PENDING'
    };
    pageable: Pageable = new Pageable();
    age: number;

    constructor(private branchService: BranchService,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private loanFormService: LoanFormService,
                private datePipe: DatePipe) {
    }

    static loadData(other: CatalogueComponent) {
        other.loanFormService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe((response: any) => {
            other.loanDataHolderList = response.detail.content;
            other.pageable = PaginationUtils.getPageable(response.detail);
            other.spinner = false;

        }, error => {
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
            other.spinner = false;
        });
        other.branchService.getAll().subscribe((response: any) => {
            other.branchList = response.detail;
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        other.loanConfigService.getAll().subscribe((response: any) => {
            other.loanTypeList = response.detail;
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });

    }

    ngOnInit() {
        CatalogueComponent.loadData(this);
    }

    changePage(page: number) {
        this.page = page;
        CatalogueComponent.loadData(this);
    }

    getDifferenceInDays(date: Date): number {
        const date1 = new Date(date);
        const date2 = new Date();
        console.log('2', date2);
        return Math.floor((Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) -
            Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) / (1000 * 60 * 60 * 24));
    }

}

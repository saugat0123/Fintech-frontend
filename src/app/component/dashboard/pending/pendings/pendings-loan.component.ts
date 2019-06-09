import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../../feature/admin/modal/dms-loan-file';
import {User} from '../../../../feature/admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {LoanConfig} from '../../../../feature/admin/modal/loan-config';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';

import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {LoanConfigService} from '../../../../feature/admin/component/loan-config/loan-config.service';
import {DmsLoanService} from '../../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {DatePipe} from '@angular/common';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {DocStatus} from '../../../../feature/loan/model/docStatus';

@Component({
    selector: 'app-pendings',
    templateUrl: './pendings-loan.component.html',
    styleUrls: ['./pendings-loan.component.css']
})
export class PendingsLoanComponent implements OnInit {
    dmsLoanFiles: Array<DmsLoanFile>;
    loanDataHolders: Array<LoanDataHolder>;
    user: User = new User();
    search: any = {
        documentStatus: 'PENDING'
    };
    loanList: Array<LoanConfig> = new Array<LoanConfig>();
    pageable: Pageable = new Pageable();
    spinner = false;
    page = 1;
    documentStatusList = DocStatus;


    constructor(private service: DmsLoanService,
                private userService: UserService,
                private loanConfigService: LoanConfigService,
                private loanFormService: LoanFormService,
                private router: Router,
                private toastService: ToastService,
                private datePipe: DatePipe) {


    }


    static loadData(other: PendingsLoanComponent) {
        other.spinner = true;
        other.loanFormService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe(
            (response: any) => {
                other.dmsLoanFiles = response.detail.content;
                other.loanDataHolders = response.detail.content;
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
        PendingsLoanComponent.loadData(this);
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


    }


    clearSearch() {
        this.search = {};
    }

    onSearch() {
        if (this.search.createdAt != null) {
            const date = this.search.createdAt;
            this.search.createdAt = this.datePipe.transform(date, 'yyyy-MM-dd');

        }
        PendingsLoanComponent.loadData(this);
    }

    onChoose(loanConfigId) {
        this.search.loanConfigId = loanConfigId;
    }

    statusSelect(docStatus) {
        this.search.documentStatus = docStatus;
    }

    onClick(customerId: number, loanConfigId: number) {
        this.spinner = true;
        this.router.navigate(['/home/loan/summary'], {queryParams: {loanConfigId: loanConfigId, customerId: customerId}});


    }

    changePage(page: number) {

        this.page = page;
        PendingsLoanComponent.loadData(this);
    }
}

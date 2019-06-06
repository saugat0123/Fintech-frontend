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

@Component({
    selector: 'app-pendings',
    templateUrl: './pendings-loan.component.html',
    styleUrls: ['./pendings-loan.component.css']
})
export class PendingsLoanComponent implements OnInit {
    dmsLoanFiles: Array<DmsLoanFile>;
    user: User = new User();
    search: any = {};
    loanList: Array<LoanConfig> = new Array<LoanConfig>();
    pageable: Pageable = new Pageable();
    spinner = false;
    page = 1;

    constructor(private service: DmsLoanService,
                private userService: UserService,
                private loanConfigService: LoanConfigService,
                private router: Router,
                private toastService: ToastService,
                private datePipe: DatePipe) {
    }


    static loadData(other: PendingsLoanComponent) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search, other.page, 10).subscribe(
            (response: any) => {
                other.dmsLoanFiles = response.detail.content;
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
            console.log(this.search.createdAt);
            const date = this.search.createdAt;
            this.search.createdAt = this.datePipe.transform(date, 'yyyy-MM-dd');
            console.log(this.search.createdAt);

        }
        PendingsLoanComponent.loadData(this);
    }

    onChoose(loanConfigId) {
        this.search.loanConfigId = loanConfigId;
    }

    onClick(id: number) {
        this.router.navigate(['/home/loan/summary', id]);

    }

    changePage(page: number) {

        this.page = page;
        PendingsLoanComponent.loadData(this);
    }
}

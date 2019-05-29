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

@Component({
    selector: 'app-pendings',
    templateUrl: './pendings.component.html',
    styleUrls: ['./pendings.component.css']
})
export class PendingsComponent implements OnInit {
    dmsLoanFiles: Array<DmsLoanFile>;
    user: User = new User();
    search: any = {};
    loanList: Array<LoanConfig>;
    pageable: Pageable = new Pageable();
    spinner = false;
    page = 1;

    constructor(private service: DmsLoanService,
                private userService: UserService,
                private loanConfigService: LoanConfigService,
                private router: Router) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.service.getPaginationWithSearchObject(other.search).subscribe(
            (response: any) => {
                other.dmsLoanFiles = response.detail.content;
                other.service.setDataList(other.dmsLoanFiles);
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
        PendingsComponent.loadData(this);
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
        PendingsComponent.loadData(this);

    }

    onClick(id: number) {
        this.router.navigate(['/home/loan/summary', id]);

    }

    changePage(page: number) {
        this.page = page;
        PendingsComponent.loadData(this);
    }


}

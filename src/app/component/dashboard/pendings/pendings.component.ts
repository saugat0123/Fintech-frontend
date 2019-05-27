import {Component, DoCheck, OnInit} from '@angular/core';
import {CommonService} from '../../../@core/service/baseservice/common-baseservice';
import {DmsLoanFile} from '../../../feature/admin/modal/dms-loan-file';
import {User} from '../../../feature/admin/modal/user';
import {UserService} from '../../../@core/service/user.service';
import {LoanConfig} from '../../../feature/admin/modal/loan-config';
import {CommonDataService} from '../../../@core/service/baseservice/common-dataService';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {CommonPageService} from '../../../@core/service/baseservice/common-pagination-service';
import {Pageable} from '../../../@core/service/baseservice/common-pageable';

@Component({
    selector: 'app-pendings',
    templateUrl: './pendings.component.html',
    styleUrls: ['./pendings.component.css']
})
export class PendingsComponent implements OnInit, DoCheck {
    dmsLoanFiles: Array<DmsLoanFile>;
    user: User = new User();
    loanConfigs: LoanConfig[] = [];
    search: any = {};
    loanList: Array<LoanConfig>;
    currentApi: string;
    pageable: Pageable = new Pageable();
    spinner = false;

    constructor(private commonService: CommonService,
                private dataService: CommonDataService,
                private userService: UserService,
                private commonPageService: CommonPageService) {
    }

    static loadData(other: any) {
        other.spinner = true;
        other.commonService.getByPostAllPageable(other.currentApi, other.search, 1, 10).subscribe(
            (response: any) => {
                other.dmsLoanFiles = response.detail.content;
                other.dataService.setDataList(other.dmsLoanFiles);
                other.commonPageService.setCurrentApi(other.currentApi);
                other.pageable = other.commonPageService.setPageable(response.detail);
                other.spinner = false;
            }, error => {
                other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
                other.spinner = false;
            }
        );
    }

    ngOnInit() {
        this.currentApi = 'v1/dmsLoanFile/get';
        PendingsComponent.loadData(this);
        this.userService.getLoggedInUser().subscribe(
            (response: any) => {
                this.user = response.detail;
            }
        );
        this.commonService.getByAll('v1/config/getAll').subscribe(
            (response: any) => {
                this.loanList = response.detail;
            }
        );
    }

    clearSearch() {
        this.search = {};
    }

    ngDoCheck(): void {
        this.dmsLoanFiles = this.dataService.getDataList();
    }

    onSearch() {
        this.dataService.setData(this.search);
        PendingsComponent.loadData(this);

    }


}

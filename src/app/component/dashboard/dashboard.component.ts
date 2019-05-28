import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../@core/service/baseservice/common-dataService';
import {CommonService} from '../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {Permission} from '../../feature/admin/modal/permission';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BreadcrumbService} from '../../@theme/components/breadcrum/breadcrumb.service';
import {LoanDataService} from '../../feature/loan/service/loan-data.service';
import {DashboardService} from './dashboard.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    title = 'Dashboard';
    loanType: any;
    loanList: any;
    spinner = false;

    permission: Permission = new Permission();
    permissionName: string;
    loanCategory: FormGroup;
    permissions = [];
    addViewLoanCategory = false;
    userCountView = false;
    sectorCountView = false;
    segmentCountView = false;
    branchCountView = false;
    notificationView = false;
    pendingView = false;

    constructor(
        private dashboardService: DashboardService,
        private dataService: CommonDataService,
        private router: Router,
        private commonService: CommonService,
        private formBuilder: FormBuilder,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        this.dashboardService.getAll().subscribe((response: any) => {
            this.loanList = response.detail;
            this.dataService.setLoan(response.detail);

        });

        this.commonService.getByPost('v1/permission/chkPerm', 'DASHBOARD').subscribe(
            (response: any) => {
                this.permissions = response.detail;
                for (let i = 0; this.permissions.length > i; i++) {
                    if (this.permissions[i].type === 'LOAN CATEGORY') {
                        this.addViewLoanCategory = true;
                    } else if (this.permissions[i].type === 'USER COUNT') {
                        this.userCountView = true;
                    } else if (this.permissions[i].type === 'BRANCH COUNT') {
                        this.branchCountView = true;
                    } else if (this.permissions[i].type === 'SEGMENT COUNT') {
                        this.segmentCountView = true;
                    } else if (this.permissions[i].type === 'SECTOR COUNT') {
                        this.sectorCountView = true;
                    } else if (this.permissions[i].type === 'NOTIFICATION') {
                        this.notificationView = true;
                    } else if (this.permissions[i].type === 'PENDING') {
                        this.pendingView = true;
                    }
                }
            }
        );
        this.dashboardService.getAll().subscribe((response: any) => {
            this.loanList = response.detail;
        });

    }

    loan() {
        this.spinner = true;
        this.router.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanType, customerId: 'jimmy'}});
    }
}

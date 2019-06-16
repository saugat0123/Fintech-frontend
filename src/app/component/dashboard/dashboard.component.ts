import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Permission} from '../../feature/admin/modal/permission';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BreadcrumbService} from '../../@theme/components/breadcrum/breadcrumb.service';
import {LoanDataService} from '../../feature/loan/service/loan-data.service';
import {LoanConfigService} from '../../feature/admin/component/loan-config/loan-config.service';
import {PermissionService} from '../../@core/service/permission.service';
import {RoleType} from '../../feature/admin/modal/roleType';

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
    roleType = false;

    constructor(
        private loanConfigService: LoanConfigService,
        private loanService: LoanDataService,
        private router: Router,
        private permissionService: PermissionService,
        private formBuilder: FormBuilder,
        private breadcrumbService: BreadcrumbService
    ) {
    }

    ngOnInit() {
        this.breadcrumbService.notify(this.title);
        if (localStorage.getItem('roleType') === RoleType[0]) {
            this.roleType = true;
            this.loanConfigService.getAll().subscribe((response: any) => {
                this.loanList = response.detail;
                this.loanService.setLoan(response.detail);

            });
        }

        this.permissionService.getPermissionOf('DASHBOARD').subscribe(
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
        this.loanConfigService.getAll().subscribe((response: any) => {
            this.loanList = response.detail;
        });

    }

    loan() {
        this.spinner = true;
        this.router.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanType, customerId: null}});
    }
}

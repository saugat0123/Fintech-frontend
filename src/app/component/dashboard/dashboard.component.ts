import {AfterContentInit, Component, OnInit, TemplateRef} from '@angular/core';
import {Router} from '@angular/router';
import {Permission} from '../../feature/admin/modal/permission';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BreadcrumbService} from '../../@theme/components/breadcrum/breadcrumb.service';
import {LoanDataService} from '../../feature/loan/service/loan-data.service';
import {LoanConfigService} from '../../feature/admin/component/loan-config/loan-config.service';
import {PermissionService} from '../../@core/service/permission.service';
import {RoleType} from '../../feature/admin/modal/roleType';
import {UserService} from '../../feature/admin/component/user/user.service';
import {BranchService} from '../../feature/admin/component/branch/branch.service';
import {User} from '../../feature/admin/modal/user';


@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterContentInit {

    title = 'Dashboard';
    loanType: any;
    loanList: any;
    loading: boolean;
    spinner = false;
    customerId: number;
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
    userCount;
    branchCount;
    loggedUser: User;

    constructor(
        private loanConfigService: LoanConfigService,
        private loanService: LoanDataService,
        private router: Router,
        private permissionService: PermissionService,
        private formBuilder: FormBuilder,
        private breadcrumbService: BreadcrumbService,
        private userService: UserService,
        private branchService: BranchService,
        private route: Router,
    ) {
    }

    ngAfterContentInit() {
        const roleName: string = localStorage.getItem('roleName');
        const roleType: string = localStorage.getItem('roleType');
        if (roleName !== 'admin') {
            this.roleType = roleType === RoleType.MAKER;
        }

        if (roleType === RoleType.MAKER) {
            this.loanConfigService.getAll().subscribe((response: any) => {
                this.loanList = response.detail;
                this.loanService.setLoan(response.detail);
            });
        }
    }

    ngOnInit() {
        this.loading = false;
        this.breadcrumbService.notify(this.title);

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
        this.userService.getStatus().subscribe((response: any) => {

            this.userCount = response.detail.users;

        });

        this.branchService.getStatus().subscribe((response: any) => {

            this.branchCount = response.detail.branches;
        });
    }

    selectLoan(template: TemplateRef<any>) {
        this.loading = true;
        this.newLoan();
    }

    newLoan() {
        this.router.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanType, customerId: null}});

    }

    existingLoan(template: TemplateRef<any>) {

    }

    getLoanData() {
        this.route.navigate(['/home/loan/loanForm'], {queryParams: {loanId: this.loanType, customerId: this.customerId}});

    }
}

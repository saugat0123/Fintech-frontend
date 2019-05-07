import {Component, OnInit} from '@angular/core';
import {CommonDataService} from '../../shared-service/baseservice/common-dataService';
import {CommonService} from '../../shared-service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {RolePermissionRight} from '../../module/admin/modal/role-permission-right';
import {Permission} from '../../module/admin/modal/permission';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanConfig} from '../../module/admin/modal/loan-config';
import {Document} from '../../module/admin/modal/document';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
    permission: Permission = new Permission();
    permissionName: string;
    title = 'Dashboard';
    loanType: any;
    loan: LoanConfig = new LoanConfig();
    loanList: any;
    loanCategory: FormGroup;
    initialDocument: Document[] = [];
    renewDocument: Document[] = [];
    permissions = [];
    addViewLoanCategory = false;
    userCountView = false;
    sectorCountView = false;
    segmentCountView = false;
    branchCountView = false;
    notificationView = false;
    pendingView = false;
    rolePermissionRights: RolePermissionRight = new RolePermissionRight();

    constructor(
        private commonService: CommonService,
        private dataService: CommonDataService,
        private router: Router,
        private formBuilder: FormBuilder
    ) {
    }

    ngOnInit() {
        this.dataService.changeTitle(this.title);

        this.dataService.changeTitle(this.title);
        this.commonService.getByAll('v1/config/getAll').subscribe((response: any) => {
            this.loanList = response.detail;
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
        this.commonService.getByAll('v1/config/getAll').subscribe((response: any) => {
            console.log(response.detail);
            this.loanList = response.detail;
        });


        this.loanCategory = this.formBuilder.group({
            loanList: [null]
        });
    }

    getLoanTemplate() {
        this.dataService.setData(this.loanType);
        this.router.navigate(['/home/loan']);
    }

    // addLoan(event) {
    //     let loanType = event.target.value;
    //     for (this.loan of this.loanList) {
    //         if (loanType === this.loan.name) {
    //             this.dataService.setInitialDocument(this.loan.initial);
    //             this.dataService.setRenewDocument(this.loan.renew);
    //         }
    //     }
    //     this.router.navigate(['home/loanType']);
    // }
}

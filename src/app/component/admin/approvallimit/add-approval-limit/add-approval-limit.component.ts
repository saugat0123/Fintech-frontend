import {Component, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {ApprovalLimit} from '../../../../modal/approval-limit';
import {CommonService} from '../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../shared-service/baseservice/common-dataService';

declare var $;

@Component({
    selector: 'app-add-approval-limit',
    templateUrl: './add-approval-limit.component.html',
    styleUrls: ['./add-approval-limit.component.css']
})
export class AddApprovalLimitComponent implements OnInit {
    task: string;
    submitted = false;
    spinner = false;
    roleList;
    loanList;
    globalMsg;
    loanCategory: any;
    branch: any;
    authorities: any;
    approvalLimit: ApprovalLimit = new ApprovalLimit();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/role/active').subscribe((response: any) => {
            this.roleList = response.detail;
        });

        this.commonService.getByAll('v1/config/getAll').subscribe((response: any) => {
            this.loanList = response.detail;
        });


    }


    ngDoCheck(): void {
        this.approvalLimit = this.dataService.getApprovalLimit();
        console.log("approval",this.approvalLimit);
        if (this.approvalLimit.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        this.approvalLimit.loanCategory = this.loanCategory;
        this.approvalLimit.authorities = this.authorities;
        console.log("sub", this.approvalLimit)
        console.log("app sub",this.approvalLimit)
        this.commonService.saveOrEdit(this.approvalLimit, 'v1/approvallimit').subscribe(result => {
                $('.add-approvalLimit').modal('hide');
                if (this.approvalLimit.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED APPROVAL LIMIT';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED APPROVAL LIMIT';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.approvalLimit = new ApprovalLimit();
                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/approvalLimit']));
                    this.dataService.alertmsg();


            }, error => {

                $('.add-approvalLimit').modal('hide');

                this.globalMsg = 'error occurs';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/approvalLimit']));
                    this.dataService.alertmsg();

            }
        );
    }

}



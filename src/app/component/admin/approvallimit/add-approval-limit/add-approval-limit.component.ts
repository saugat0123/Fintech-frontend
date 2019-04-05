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
        if (this.approvalLimit.id == null) {
            this.task = 'Add';
        } else {
console.log(this.approvalLimit)
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        console.log(this.approvalLimit)
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
                $('.alert-custom').slideDown();


            }, error => {

                $('.add-approvalLimit').modal('hide');

                this.globalMsg = 'error occurs';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/approvalLimit']));
                $('.alert-custom').slideDown();

            }
        );
    }

}



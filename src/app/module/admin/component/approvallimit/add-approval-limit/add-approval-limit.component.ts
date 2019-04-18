import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../shared-service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../shared-service/baseservice/common-dataService';
import {Role} from '../../../modal/role';
import {LoanConfig} from '../../../modal/loan-config';
import {ApprovalLimit} from '../../../modal/approval-limit';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-add-approval-limit',
    templateUrl: './add-approval-limit.component.html',
    styleUrls: ['./add-approval-limit.component.css']
})
export class AddApprovalLimitComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    roleList: Array<Role>;
    loanList: Array<LoanConfig>;
    globalMsg: string;
    loanCategory = new LoanConfig();
    authorities = new Role();
    approvalLimit: ApprovalLimit = new ApprovalLimit();

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private modalService: NgbModal,
        private activeModal: NgbActiveModal) {
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
            this.task = 'Edit';
            if (this.approvalLimit.authorities != null) {
                this.authorities = this.approvalLimit.authorities;
            }
            if (this.approvalLimit.loanCategory != null) {
                this.loanCategory = this.approvalLimit.loanCategory;
            }

        }

    }

    onSubmit() {
        this.submitted = true;
        this.approvalLimit.loanCategory = this.loanCategory;
        this.approvalLimit.authorities = this.authorities;
        this.commonService.saveOrEdit(this.approvalLimit, 'v1/approvallimit').subscribe(result => {
                this.modalService.dismissAll(AddApprovalLimitComponent);
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


            }, error => {

                this.modalService.dismissAll(AddApprovalLimitComponent);
                this.globalMsg = 'error occurs';
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('home/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['home/approvalLimit']));

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(AddApprovalLimitComponent);
    }

}



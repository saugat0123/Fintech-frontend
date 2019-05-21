import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
import {Role} from '../../../modal/role';
import {LoanConfig} from '../../../modal/loan-config';
import {ApprovalLimit} from '../../../modal/approval-limit';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BreadcrumbService} from '../../../../../@theme/components/breadcrum/breadcrumb.service';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';


@Component({
    selector: 'app-approval-limit-form',
    templateUrl: './approval-limit-form.component.html'
})
export class ApprovalLimitFormComponent implements OnInit, DoCheck {
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
        private activeModal: NgbActiveModal,
        private router: Router,
        private commonService: CommonService,
        private dataService: CommonDataService,
        private breadcrumbService: BreadcrumbService,
        private alertService: AlertService,
        private toastService: ToastService
    ) {
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
        this.commonService.saveOrEdit(this.approvalLimit, 'v1/approvallimit').subscribe(() => {

                if (this.approvalLimit.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Created Approval Limit'));
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Approval Limit'));
                }

                this.approvalLimit = new ApprovalLimit();

                this.activeModal.close(ModalResponse.SUCCESS);


            }, error => {

                console.error(error);

                const alert = new Alert(AlertType.ERROR, error.error.message);
                this.toastService.show(alert);

                this.activeModal.dismiss(ModalResponse.SUCCESS);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

}



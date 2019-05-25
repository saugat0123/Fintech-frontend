import {Component, DoCheck, Input, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
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

    @Input()
    model: ApprovalLimit;

    task: string;
    submitted = false;
    spinner = false;
    roleList: Array<Role>;
    loanList: Array<LoanConfig>;
    globalMsg: string;
    loanCategory = new LoanConfig();
    authorities = new Role();

    constructor(
        private activeModal: NgbActiveModal,
        private commonService: CommonService,
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

        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
            if (this.model.authorities != null) {
                this.authorities = this.model.authorities;
            }
            if (this.model.loanCategory != null) {
                this.loanCategory = this.model.loanCategory;
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        this.model.loanCategory = this.loanCategory;
        this.model.authorities = this.authorities;
        this.commonService.saveOrEdit(this.model, 'v1/approvallimit').subscribe(() => {

                if (this.model.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Created Approval Limit'));
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Approval Limit'));
                }

                this.model = new ApprovalLimit();

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



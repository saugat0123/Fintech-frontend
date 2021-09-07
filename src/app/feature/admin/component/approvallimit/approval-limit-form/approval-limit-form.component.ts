import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {Role} from '../../../modal/role';
import {LoanConfig} from '../../../modal/loan-config';
import {ApprovalLimit} from '../../../modal/approval-limit';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AlertService} from '../../../../../@theme/components/alert/alert.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {ApprovalLimitService} from '../approval-limit.service';
import {LoanConfigService} from '../../loan-config/loan-config.service';
import {RoleService} from '../../role-permission/role.service';


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

    loanCategory = new LoanConfig();
    authorities = new Role();

    constructor(
        private service: ApprovalLimitService,
        private loanConfigService: LoanConfigService,
        private roleService: RoleService,
        private activeModal: NgbActiveModal,
        private alertService: AlertService,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.roleService.getApprovalRoles().subscribe((response: any) => {

            this.roleList = response.detail;
        });

        this.loanConfigService.getAll().subscribe((response: any) => {

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
        this.spinner = true;
        this.submitted = true;
        this.model.loanCategory = this.loanCategory;
        this.model.authorities = this.authorities;
        this.service.save(this.model).subscribe(() => {

                if (this.model.id == null) {
                    this.spinner = false;
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Created Approval Limit'));
                } else {
                    this.spinner = false;
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Approval Limit'));
                }

                this.model = new ApprovalLimit();

                this.activeModal.close(ModalResponse.SUCCESS);


            }, error => {

                console.error(error);

                const alert = new Alert(AlertType.ERROR, error.error.message);
                this.spinner = false;
                this.toastService.show(alert);

                this.activeModal.dismiss(ModalResponse.SUCCESS);
            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }

    setApprovalType(event) {
        const loans = this.loanList.filter(s => s.id === event);
        this.model.loanApprovalType = loans[0].loanCategory;
    }
}



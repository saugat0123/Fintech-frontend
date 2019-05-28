import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {LoanTemplate} from '../../../modal/loan-template';
import {LoanConfig} from '../../../modal/loan-config';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanTemplateService} from '../loan-template/loan-template.service';
import {LoanConfigService} from '../loan-config.service';


@Component({
    selector: 'app-add-loan',
    templateUrl: './add-loan.component.html'
})
export class AddLoanComponent implements OnInit, DoCheck {

    @Input()
    model: LoanConfig;

    task: string;

    templateList: Array<LoanTemplate>;

    constructor(
        private service: LoanConfigService,
        private loanTemplateService: LoanTemplateService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.loanTemplateService.getAll().subscribe((response: any) => {
            this.templateList = response.detail;
        });
    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }
    }

    onSubmit() {

        this.service.save(this.model).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Template'));

                this.model = new LoanConfig();

                this.activeModal.close(ModalResponse.SUCCESS);

            }, error => {

                console.log(error);

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Template'));

                this.activeModal.dismiss(error);

            }
        );
    }

    onClose() {
        this.activeModal.dismiss(ModalResponse.CANCEL);
    }
}

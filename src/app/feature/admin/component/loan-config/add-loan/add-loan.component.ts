import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {LoanTemplate} from '../../../modal/template';
import {LoanConfig} from '../../../modal/loan-config';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';


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
        private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {
        this.commonService.getByAll('v1/loanTemplate/getAll').subscribe((response: any) => {
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
        this.commonService.saveOrEdit(this.model, 'v1/config').subscribe(() => {

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

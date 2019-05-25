import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Component, DoCheck, Input, OnInit} from '@angular/core';
import {LoanTemplate} from '../../../../modal/template';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';


@Component({
    selector: 'app-template-add-model',
    templateUrl: './template-add-model.component.html'
})
export class TemplateAddModelComponent implements OnInit, DoCheck {

    @Input()
    model: LoanTemplate = new LoanTemplate;

    task: string;
    submitted = false;
    spinner = false;

    constructor(
        private commonService: CommonService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        if (this.model.id == null) {
            this.task = 'Add';
        } else {
            this.task = 'Edit';
        }

    }

    onSubmit() {
        this.submitted = true;
        // this.branch.created=null;
        this.commonService.saveOrEdit(this.model, 'v1/loanTemplate').subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Template'));

                this.model = new LoanTemplate();

                this.activeModal.dismiss(ModalResponse.SUCCESS);

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

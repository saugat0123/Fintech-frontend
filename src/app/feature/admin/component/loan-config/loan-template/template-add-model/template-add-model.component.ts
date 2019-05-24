import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {Component, DoCheck, OnInit} from '@angular/core';
import {LoanTemplate} from '../../../../modal/template';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ModalResponse, ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';


@Component({
    selector: 'app-template-add-model',
    templateUrl: './template-add-model.component.html'
})
export class TemplateAddModelComponent implements OnInit, DoCheck {
    task: string;
    submitted = false;
    spinner = false;
    globalMsg: string;
    loanTemplate: LoanTemplate = new LoanTemplate;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
        private activeModal: NgbActiveModal,
        private toastService: ToastService
    ) {
    }

    ngOnInit() {

    }

    ngDoCheck(): void {
        if (this.dataService.getData() === undefined) {
            this.task = 'Add';
        } else {
            this.loanTemplate = this.dataService.getData();
            if (this.loanTemplate.id !== undefined) {
                this.task = 'Edit';
            } else {
                this.task = 'Add';
            }

        }

    }

    onSubmit() {
        this.submitted = true;
        // this.branch.created=null;
        this.commonService.saveOrEdit(this.loanTemplate, 'v1/loanTemplate').subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Template'));

                this.loanTemplate = new LoanTemplate();

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

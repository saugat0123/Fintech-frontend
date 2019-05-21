import {Component, DoCheck, OnInit} from '@angular/core';

import {Router} from '@angular/router';
import {CommonService} from '../../../../../@core/service/baseservice/common-baseservice';
import {CommonDataService} from '../../../../../@core/service/baseservice/common-dataService';
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

    loanConfig = new LoanConfig();
    task: string;
    globalMsg: string;
    templateList: Array<LoanTemplate>;

    constructor(
        private commonService: CommonService,
        private router: Router,
        private dataService: CommonDataService,
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
        if (this.dataService.getData() == null) {
            this.task = 'Add';
        } else {
            this.loanConfig = this.dataService.getData();
            this.task = 'Add';
        }
    }

    onSubmit() {
        this.commonService.saveOrEdit(this.loanConfig, 'v1/config').subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Template'));

                this.loanConfig = new LoanConfig();

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

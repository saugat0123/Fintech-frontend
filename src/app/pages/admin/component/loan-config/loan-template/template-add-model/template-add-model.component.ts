import {CommonService} from '../../../../../../@core/service/baseservice/common-baseservice';
import {Router} from '@angular/router';
import {CommonDataService} from '../../../../../../@core/service/baseservice/common-dataService';
import {Component, DoCheck, OnInit} from '@angular/core';
import {LoanTemplate} from '../../../../modal/template';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';


@Component({
    selector: 'app-template-add-model',
    templateUrl: './template-add-model.component.html',
    styleUrls: ['./template-add-model.component.css']
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
        private modalService: NgbModal,
        private activeModal: NgbActiveModal
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
        this.commonService.saveOrEdit(this.loanTemplate, 'v1/loanTemplate').subscribe(result => {
            this.modalService.dismissAll(TemplateAddModelComponent);
                if (this.loanTemplate.id == null) {
                    this.globalMsg = 'SUCCESSFULLY ADDED loan Template';
                } else {
                    this.globalMsg = 'SUCCESSFULLY EDITED loan Template';
                }

                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('true');
                this.loanTemplate = new LoanTemplate;
                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/template']));


            }, error => {

                this.modalService.dismissAll(TemplateAddModelComponent);

                this.globalMsg = error.error.message;
                this.dataService.getGlobalMsg(this.globalMsg);
                this.dataService.getAlertMsg('false');

                this.router.navigateByUrl('pages/dashboard', {skipLocationChange: true}).then(() =>
                    this.router.navigate(['pages/branch']));

            }
        );
    }
    onClose() {
        this.activeModal.dismiss(TemplateAddModelComponent);
    }

}

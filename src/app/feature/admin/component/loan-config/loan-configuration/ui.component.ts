import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfig} from '../../../modal/loan-config';
import {Document} from '../../../modal/document';
import {Router} from '@angular/router';
import {LoanTemplate} from '../../../modal/loan-template';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanTemplateService} from '../loan-template/loan-template.service';
import {DocumentService} from '../../document/document.service';
import {LoanConfigService} from '../loan-config.service';


@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {
    spinner = false;
    title: string;
    pageable: Pageable = new Pageable();
    search: any = {};
    globalMsg: any;
    loanTemplateList: any;
    comfirmLoanTemplateList = Array<LoanTemplate>();
    loanConfig: LoanConfig = new LoanConfig();
    fundable: boolean;
    renewal: boolean;
    show = false;
    submitted: boolean;
    initialDocuemnt = Array<Document>();
    renewalDocuemnt = Array<Document>();
    documentList = Array<Document>();

    constructor(
        private loanTemplateService: LoanTemplateService,
        private documentService: DocumentService,
        private service: LoanConfigService,
        private activeModal: NgbActiveModal,
        private router: Router,
        private toastService: ToastService
    ) {

    }

    ngOnInit() {
        this.getTemplate();

        this.documentService.getAll().subscribe((response: any) => {
            this.documentList = response.detail;
        });
    }

    getTemplate() {
        this.spinner = true;
        this.loanTemplateService.getAll().subscribe((response: any) => {
            this.loanTemplateList = response.detail;
            this.spinner = false;

        }, error => {

            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Templates'));

            this.spinner = false;
        });

    }

    updateSelectTemplate(template) {
        const t: LoanTemplate = template;
        this.comfirmLoanTemplateList.push(t);
        this.loanTemplateList.splice(this.loanTemplateList.indexOf(t), 1);
    }


    updateUnselectTemplate(template) {
        const t: LoanTemplate = template;
        this.loanTemplateList.push(t);
        this.comfirmLoanTemplateList.splice(this.comfirmLoanTemplateList.indexOf(t), 1);
    }

    setFunableTrue() {
        this.fundable = true;
        console.log(this.fundable);
    }

    setFunableFalse() {
        this.fundable = false;
        console.log(this.fundable);
    }

    setRenewalTrue() {
        this.renewal = true;
        console.log(this.renewal);
    }

    setRenewalFalse() {
        this.renewal = false;
        console.log(this.renewal);
    }

    toggle() {
        this.show = !this.show;
    }

    updateInitialDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.initialDocuemnt.push(d);
            console.log(this.initialDocuemnt);
        } else {
            const index: number = this.initialDocuemnt.indexOf(d);
            if (index !== -1) {
                this.initialDocuemnt.splice(index, 1);
                console.log(this.initialDocuemnt);
            }
        }
    }

    updateRenewalDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.renewalDocuemnt.push(d);
            console.log(this.renewalDocuemnt);
        } else {
            const index: number = this.renewalDocuemnt.indexOf(d);
            if (index !== -1) {
                this.renewalDocuemnt.splice(index, 1);
                console.log(this.renewalDocuemnt);
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.loanConfig.isRenewable = this.renewal;
        this.loanConfig.isFundable = this.fundable;
        this.loanConfig.templateList = this.comfirmLoanTemplateList;
        this.loanConfig.initial = this.initialDocuemnt;
        this.loanConfig.renew = this.renewalDocuemnt;


        this.service.save(this.loanConfig).subscribe(() => {

                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Config!'));

                this.loanConfig = new LoanConfig();

                this.activeModal.close(ModalResponse.SUCCESS);


            }, error => {

                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Config!'));

                this.activeModal.dismiss(error);
            }
        );
    }

}

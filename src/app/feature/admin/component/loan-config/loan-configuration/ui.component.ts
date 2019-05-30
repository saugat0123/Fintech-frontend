import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanConfig} from '../../../modal/loan-config';
import {Document} from '../../../modal/document';
import {LoanTemplate} from '../../../modal/loan-template';
import {ModalResponse, ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanTemplateService} from '../loan-template/loan-template.service';
import {DocumentService} from '../../document/document.service';
import {LoanConfigService} from '../loan-config.service';
import {Router} from '@angular/router';


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
    initialDocument = Array<Document>();
    renewalDocument = Array<Document>();
    documentList = Array<Document>();

    constructor(
        private loanTemplateService: LoanTemplateService,
        private documentService: DocumentService,
        private service: LoanConfigService,
        private toastService: ToastService,
        private router: Router
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
            this.initialDocument.push(d);
            console.log(this.initialDocument);
        } else {
            const index: number = this.initialDocument.indexOf(d);
            if (index !== -1) {
                this.initialDocument.splice(index, 1);
                console.log(this.initialDocument);
            }
        }
    }

    updateRenewalDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.renewalDocument.push(d);
            console.log(this.renewalDocument);
        } else {
            const index: number = this.renewalDocument.indexOf(d);
            if (index !== -1) {
                this.renewalDocument.splice(index, 1);
                console.log(this.renewalDocument);
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.loanConfig.isRenewable = this.renewal;
        this.loanConfig.isFundable = this.fundable;
        this.loanConfig.templateList = this.comfirmLoanTemplateList;
        this.loanConfig.initial = this.initialDocument;
        this.loanConfig.renew = this.renewalDocument;
        this.service.save(this.loanConfig).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Config!'));
                this.loanConfig = new LoanConfig();
                this.router.navigate(['home/admin/config']);
            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Config!'));
            }
        );
    }
}

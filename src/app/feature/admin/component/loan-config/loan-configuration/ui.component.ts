import {Component, OnInit} from '@angular/core';
import {Pageable} from '../../../../../@core/service/baseservice/common-pageable';
import {LoanConfig} from '../../../modal/loan-config';
import {Document} from '../../../modal/document';
import {LoanTemplate} from '../../../modal/loan-template';
import {ToastService} from '../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {LoanTemplateService} from '../loan-template/loan-template.service';
import {DocumentService} from '../../document/document.service';
import {LoanConfigService} from '../loan-config.service';
import {ActivatedRoute, Router} from '@angular/router';


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
    confirmLoanTemplateList = Array<LoanTemplate>();
    loanConfig: LoanConfig = new LoanConfig();
    show = false;
    submitted: boolean;
    initialDocumentList =  [];
    finalInitialDocument = Array<Document>();
    renewalDocumentList = [];
    finalRenewalDocument = Array<Document>();
    eligibilityDocumentList = [];
    finalEligibilityDocument = Array<Document>();
    id: number;

    constructor(
        private loanTemplateService: LoanTemplateService,
        private documentService: DocumentService,
        private service: LoanConfigService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.getTemplate();
    }

    ngOnInit() {
        this.id = Number(this.route.snapshot.queryParamMap.get('id'));
        this.documentService.getAll().subscribe((response: any) => {
            this.initialDocumentList = response.detail;
        });
        this.documentService.getAll().subscribe((response: any) => {
            this.renewalDocumentList = response.detail;
        });
        this.documentService.getAll().subscribe((response: any) => {
            this.eligibilityDocumentList = response.detail;
        });
        if (this.id !== undefined && this.  id !== 0) {
            this.service.detail(this.id).subscribe((response: any) => {
                this.loanConfig = response.detail;
                this.loanConfig.templateList.forEach(loanConfigTemplate => {
                    if (loanConfigTemplate.id === loanConfigTemplate.id) {
                        this.confirmLoanTemplateList.push(loanConfigTemplate);
                        this.loanTemplateList.splice(this.loanTemplateList.indexOf(loanConfigTemplate), 1);
                    }
                });
                this.initialDocumentList.forEach(initialDocument => {
                    this.loanConfig.initial.forEach(loanConfigInitialDocument => {
                        if (initialDocument.id === loanConfigInitialDocument.id) {
                            this.finalInitialDocument.push(initialDocument);
                            initialDocument.checked = true;
                        }
                    });
                });
                this.renewalDocumentList.forEach(renewalDocument => {
                    this.loanConfig.renew.forEach(loanConfigRenewalDocument => {
                        if (renewalDocument.id === loanConfigRenewalDocument.id) {
                            this.finalRenewalDocument.push(renewalDocument);
                            renewalDocument.checked = true;
                        }
                    });
                });
                this.eligibilityDocumentList.forEach(eligibilityDocument => {
                    this.loanConfig.eligibilityDocuments.forEach(loanEligibilityDocument => {
                        if (eligibilityDocument.id === loanEligibilityDocument.id) {
                            this.finalEligibilityDocument.push(eligibilityDocument);
                            eligibilityDocument.checked = true;
                        }
                    });
                });
            });
        }
        console.log(this.initialDocumentList);
        console.log(this.finalRenewalDocument);
        console.log(this.finalEligibilityDocument);
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
        this.confirmLoanTemplateList.push(t);
        this.loanTemplateList.splice(this.loanTemplateList.indexOf(t), 1);
    }


    updateUnselectTemplate(template) {
        const t: LoanTemplate = template;
        this.loanTemplateList.push(t);
        this.confirmLoanTemplateList.splice(this.confirmLoanTemplateList.indexOf(t), 1);
    }

    toggle() {
        this.show = !this.show;
    }

    updateInitialDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.finalInitialDocument.push(d);
            console.log(this.finalInitialDocument);
        } else {
            const index: number = this.finalInitialDocument.indexOf(d);
            if (index !== -1) {
                this.finalInitialDocument.splice(index, 1);
            }
            console.log(this.finalInitialDocument);
        }
    }

    updateRenewalDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.finalRenewalDocument.push(d);
            console.log(this.finalRenewalDocument);
        } else {
            const index: number = this.finalRenewalDocument.indexOf(d);
            if (index !== -1) {
                this.finalRenewalDocument.splice(index, 1);
            }
            console.log(this.finalRenewalDocument);
        }
    }

    updateEligibilityDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.finalEligibilityDocument.push(d);
        } else {
            const index: number = this.finalEligibilityDocument.indexOf(d);
            if (index !== -1) {
                this.finalEligibilityDocument.splice(index, 1);
            }
        }
    }

    onSubmit() {
        this.submitted = true;
        this.globalMsg = 'test successful';
        this.loanConfig.templateList = this.confirmLoanTemplateList;
        this.loanConfig.initial = this.finalInitialDocument;
        this.loanConfig.renew = this.finalRenewalDocument;
        this.loanConfig.eligibilityDocuments = this.finalEligibilityDocument;
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

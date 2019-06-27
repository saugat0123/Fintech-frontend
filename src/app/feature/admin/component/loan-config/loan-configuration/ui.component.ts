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
import {OfferLetter} from '../../../modal/offerLetter';
import {OfferLetterService} from '../offer-letter.service';


@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit {
    spinner = false;
    title: string;
    pageable: Pageable = new Pageable();
    search: string;
    globalMsg: string;
    loanTemplateList: any;
    confirmLoanTemplateList = Array<LoanTemplate>();
    loanConfig: LoanConfig = new LoanConfig();
    show = false;
    submitted: boolean;
    initialDocumentList = [];
    finalInitialDocument = Array<Document>();
    renewalDocumentList = [];
    finalRenewalDocument = Array<Document>();
    eligibilityDocumentList = [];
    finalEligibilityDocument = Array<Document>();
    id: number;
    offerLetterList: Array<OfferLetter>;
    selectedOfferLetterIdList: Array<number>;
    selectedOfferLetterList: Array<OfferLetter> = new Array<OfferLetter>();

    constructor(
        private loanTemplateService: LoanTemplateService,
        private documentService: DocumentService,
        private offerLetterService: OfferLetterService,
        private service: LoanConfigService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute
    ) {
    }

    static loadData(other: UIComponent) {
        other.getTemplate();
        other.offerLetterService.getAll().subscribe((responseList: any) => {
            other.offerLetterList = responseList.detail;
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Offer Letter'));
        });
        other.documentService.getAll().subscribe((response: any) => {
            other.initialDocumentList = response.detail;
        });
        other.documentService.getAll().subscribe((response: any) => {
            other.renewalDocumentList = response.detail;
        });
        other.documentService.getAll().subscribe((response: any) => {
            other.eligibilityDocumentList = response.detail;
        });

    }

    ngOnInit() {
        UIComponent.loadData(this);
        this.id = Number(this.route.snapshot.queryParamMap.get('id'));
        if (this.id !== undefined && this.id !== 0) {
            this.service.detail(this.id).subscribe((response: any) => {
                this.loanConfig = response.detail;
                this.selectedOfferLetterIdList = new Array<number>();
                this.loanConfig.offerLetters.forEach(selectedOfferLetter => {
                    this.selectedOfferLetterIdList.push(selectedOfferLetter.id);
                });
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
        } else {
            const index: number = this.finalInitialDocument.indexOf(d);
            if (index !== -1) {
                this.finalInitialDocument.splice(index, 1);
            }
        }
    }

    updateRenewalDocument(events, document: Document) {
        const d: Document = document;
        if (events.target.checked === true) {
            this.finalRenewalDocument.push(d);
        } else {
            const index: number = this.finalRenewalDocument.indexOf(d);
            if (index !== -1) {
                this.finalRenewalDocument.splice(index, 1);
            }
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
        this.selectedOfferLetterIdList.forEach(offerLetterId => {
            const offerLetter = new OfferLetter();
            offerLetter.id = Number(offerLetterId);
            this.selectedOfferLetterList.push(offerLetter);
        });
        this.loanConfig.templateList = this.confirmLoanTemplateList;
        this.loanConfig.initial = this.finalInitialDocument;
        this.loanConfig.renew = this.finalRenewalDocument;
        this.loanConfig.eligibilityDocuments = this.finalEligibilityDocument;
        this.loanConfig.offerLetters = this.selectedOfferLetterList;
        this.service.save(this.loanConfig).subscribe(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Loan Config!'));
                this.loanConfig = new LoanConfig();
                this.router.navigate(['home/admin/config']);
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Config!'));
            }
        );
    }
}

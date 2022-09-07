import {Component, DoCheck, ElementRef, OnInit, ViewChild} from '@angular/core';
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
import {Status} from '../../../../../@core/Status';
import {NgxSpinnerService} from 'ngx-spinner';
import {ProductModeService, ProductUtils} from '../../../service/product-mode.service';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {LoanTag} from '../../../../loan/model/loanTag';
import {FormGroup, FormGroupName, NgForm} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../../customer/model/customerType';
import {loanNature} from 'src/app/feature/admin/modal/loanNature';
import {financedAssets} from 'src/app/feature/admin/modal/financedAssets';
import {environment} from '../../../../../../environments/environment';


@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css']
})
export class UIComponent implements OnInit, DoCheck {
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
    closureDocumentList = [];
    finalClosureDocument = Array<Document>();
    eligibilityDocumentList = [];
    finalEligibilityDocument = Array<Document>();
    enhanceDocumentList = [];
    finalEnhanceDocument = Array<Document>();
    partialSettlementDocumentList = [];
    finalPartialSettlementDocument = Array<Document>();
    fullSettlementDocumentList = [];
    finalFullSettlementDocument = Array<Document>();
    id: number;
    offerLetterList: Array<OfferLetter>;
    selectedOfferLetterIdList: Array<number>;
    selectedOfferLetterList: Array<OfferLetter> = new Array<OfferLetter>();
    showEligibility = false;

    productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
    loanCategories = CustomerType.enumObject();
    selectedLoanCategory: string;
    loanTagList = LoanTag.enumObject();
    selectedLoanTag = LoanTag.getKeyByValue(LoanTag.GENERAL);
    cadDocumentUploadList = [];
    finalCadDocumentUploadList = Array<Document>();
    formLabel: string;
    form: FormGroup;

    @ViewChild('loanConfigForm', {static: true}) loanConfigForm: NgForm;
    finalRenewWithEnhancementDocument = Array<Document>();
    renewWithEnhancementDocumentList = [];
    otherCycleDoc = {};
    otherCycleFinal = {};
    otherCycleList = ['Security Full Release', 'Security Partial Release', 'Realignment', 'Interest Revision', 'Others Memo', 'waiver/defferal Memo'];
    otherCycleKeys = ['securityFullRelease', 'securityPartialRelease', 'realignment', 'interestRevision', 'othersMemo', 'waiverDefferalMemo'];

    constructor(
        private loanTemplateService: LoanTemplateService,
        private documentService: DocumentService,
        private offerLetterService: OfferLetterService,
        private service: LoanConfigService,
        private toastService: ToastService,
        private router: Router,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private productModeService: ProductModeService,
        private el: ElementRef,
    ) {
    }

    loanNature = loanNature.enumObject();
    financedAssets = financedAssets.enumObject();

    static loadData(other: UIComponent) {
        other.loanConfig = other.route.snapshot.data.result ? other.route.snapshot.data.result.detail : new LoanConfig();
        other.selectedLoanCategory = other.loanConfig.loanCategory;
        other.getTemplate();
        other.offerLetterService.getAll().subscribe((responseList: any) => {
            other.offerLetterList = responseList.detail;
        }, error => {
            console.log(error);
            other.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Offer Letter'));
        });

        other.id = Number(other.route.snapshot.queryParamMap.get('id'));
        // Id of New Loan cycle is set 1 in patch backend
        other.documentService.getByLoanCycleAndStatus(1, Status.ACTIVE).subscribe((response: any) => {
            other.initialDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.selectedLoanTag = other.loanConfig.loanTag;
                    other.selectedOfferLetterIdList = new Array<number>();
                    other.loanConfig.offerLetters.forEach(selectedOfferLetter => {
                        other.selectedOfferLetterIdList.push(selectedOfferLetter.id);
                    });
                    other.loanConfig.templateList.forEach(loanConfigTemplate => {
                        other.loanTemplateList.forEach(loanTemplate => {
                            if (loanConfigTemplate.id === loanTemplate.id) {
                                other.confirmLoanTemplateList.push(loanConfigTemplate);
                                other.loanTemplateList.splice(other.loanTemplateList.indexOf(loanTemplate), 1);
                            }
                        });
                    });
                    other.initialDocumentList.forEach(initialDocument => {
                        other.loanConfig.initial.forEach(loanConfigInitialDocument => {
                            if (initialDocument.id === loanConfigInitialDocument.id) {
                                other.finalInitialDocument.push(initialDocument);
                                initialDocument.checked = true;
                            }
                        });
                    });
                    other.selectedLoanCategory = other.loanConfig.loanCategory;
                });
            }
        });

        // Id of Renew Loan cycle is set 2 in patch backend
        other.documentService.getByLoanCycleAndStatus(2, Status.ACTIVE).subscribe((response: any) => {
            other.renewalDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.renewalDocumentList.forEach(renewalDocument => {
                        other.loanConfig.renew.forEach(loanConfigRenewalDocument => {
                            if (renewalDocument.id === loanConfigRenewalDocument.id) {
                                other.finalRenewalDocument.push(renewalDocument);
                                renewalDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });

        // Id of Closure Loan cycle is set 3 in patch backend
        other.documentService.getByLoanCycleAndStatus(3, Status.ACTIVE).subscribe((response: any) => {
            other.closureDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.closureDocumentList.forEach(closureDocument => {
                        other.loanConfig.closure.forEach(loanConfigClosureDocument => {
                            if (closureDocument.id === loanConfigClosureDocument.id) {
                                other.finalClosureDocument.push(closureDocument);
                                closureDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });
        other.showEligibility = other.productModeService.isProductEnable('ELIGIBILITY');
        if (other.showEligibility) {

            // Id for Eligibility is set 4 in patch backend
            other.documentService.getByLoanCycleAndStatus(4, Status.ACTIVE).subscribe((response: any) => {
                other.eligibilityDocumentList = response.detail;

                if (other.id !== undefined && other.id !== 0) {
                    other.service.detail(other.id).subscribe((res: any) => {
                        other.loanConfig = res.detail;
                        other.eligibilityDocumentList.forEach(eligibilityDocument => {
                            other.loanConfig.eligibilityDocuments.forEach(eligibilityDocuments => {
                                if (eligibilityDocument.id === eligibilityDocuments.id) {
                                    other.finalEligibilityDocument.push(eligibilityDocument);
                                    eligibilityDocument.checked = true;
                                }
                            });
                        });
                    });
                }
            });
        }

        // Id of Enhance Loan cycle is set 5 in patch backend
        other.documentService.getByLoanCycleAndStatus(5, Status.ACTIVE).subscribe((response: any) => {
            other.enhanceDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.enhanceDocumentList.forEach(enhanceDocument => {
                        other.loanConfig.enhance.forEach(loanConfigEnhanceDocument => {
                            if (enhanceDocument.id === loanConfigEnhanceDocument.id) {
                                other.finalEnhanceDocument.push(enhanceDocument);
                                enhanceDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });

        // Id of Partial Settlement Loan cycle is set 6 in patch backend
        other.documentService.getByLoanCycleAndStatus(6, Status.ACTIVE).subscribe((response: any) => {
            other.partialSettlementDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.partialSettlementDocumentList.forEach(partialDocument => {
                        other.loanConfig.partialSettlement.forEach(loanConfigPartialDocument => {
                            if (partialDocument.id === loanConfigPartialDocument.id) {
                                other.finalPartialSettlementDocument.push(partialDocument);
                                partialDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });

        // Id of Full Settlement Loan cycle is set 7 in patch backend
        other.documentService.getByLoanCycleAndStatus(7, Status.ACTIVE).subscribe((response: any) => {
            other.fullSettlementDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.loanConfig = res.detail;
                    other.fullSettlementDocumentList.forEach(fullDocument => {
                        other.loanConfig.fullSettlement.forEach(loanConfigFullDocument => {
                            if (fullDocument.id === loanConfigFullDocument.id) {
                                other.finalFullSettlementDocument.push(fullDocument);
                                fullDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });

        if (other.productUtils.CAD_LITE_VERSION || other.productUtils.FULL_CAD) {
            // Id of cad Loan cycle is set 12 in patch backend
            other.documentService.getByLoanCycleAndStatus(12, Status.ACTIVE).subscribe((response: any) => {
                other.cadDocumentUploadList = response.detail;

                if (other.id !== undefined && other.id !== 0) {
                    other.service.detail(other.id).subscribe((res: any) => {
                        other.loanConfig = res.detail;
                        other.cadDocumentUploadList.forEach(cadDocument => {
                            other.loanConfig.approvedDocument.forEach(loanConfigFullDocument => {
                                if (cadDocument.id === loanConfigFullDocument.id) {
                                    other.finalCadDocumentUploadList.push(cadDocument);
                                    cadDocument.checked = true;
                                }
                            });
                        });
                    });
                }
            });
        }

        // Id of Renew with Enhancement Loan cycle is set to 13 in loan_cycle.sql patch backend
        other.documentService.getByLoanCycleAndStatus(13, Status.ACTIVE).subscribe((response: any) => {
            other.renewWithEnhancementDocumentList = response.detail;

            if (other.id !== undefined && other.id !== 0) {
                other.service.detail(other.id).subscribe((res: any) => {
                    other.renewWithEnhancementDocumentList.forEach(renewWithEnhancementDocument => {
                        other.loanConfig.renewWithEnhancement.forEach(loanConfigRenewWithEnhancementDocument => {
                            if (renewWithEnhancementDocument.id === loanConfigRenewWithEnhancementDocument.id) {
                                other.finalRenewWithEnhancementDocument.push(renewWithEnhancementDocument);
                                renewWithEnhancementDocument.checked = true;
                            }
                        });
                    });
                });
            }
        });

        for (let i = 16; i <= 21; i++) {
            other.documentService.getByLoanCycleAndStatus(i, Status.ACTIVE).subscribe((response: any) => {
                const currentIndex = i - 16;
                const data = response.detail as Document [];
                if (data.length > 0) {
                    const selected = [];
                    data.forEach((d, ix) => {
                        if (other.loanConfig.id !== undefined && other.loanConfig.id !== 0) {
                            other.loanConfig[other.otherCycleKeys[currentIndex]].forEach(da => {
                                if (d.id === da.id) {
                                    data[ix].checked = true;
                                }
                            });
                        }
                        selected.push(data[ix]);
                    });
                    const docs = other.otherCycleKeys[currentIndex];
                    other.otherCycleDoc[docs] = data;
                    other.otherCycleFinal[docs] = selected;

                } else {
                    const docs = other.otherCycleKeys[currentIndex];
                    other.otherCycleDoc[docs] = data;
                    other.otherCycleFinal[docs] = [];
                }
            });
        }


        const index = other.loanTagList.indexOf(other.loanTagList.filter(value => value.toString() === 'MICRO LOAN')[0]);
            other.loanTagList.forEach(value => {
                if (value.toString() === 'MICRO LOAN') {
                    other.loanTagList.indexOf(value);
                }
            });

    }

    ngOnInit() {
        UIComponent.loadData(this);
    }

    getTemplate() {
        this.spinner.show();
        this.loanTemplateService.getAll().subscribe((response: any) => {
            this.loanTemplateList = response.detail;
            this.spinner.hide();
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Templates'));
            this.spinner.show();
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

    updateDocument(events, document: Document, documentArray: Document[]) {
        if (events.target.checked === true) {
            documentArray.push(document);
        } else {
            const index: number = documentArray.indexOf(document);
            if (index !== -1) {
                documentArray.splice(index, 1);
            }
        }
    }

    private scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }

    close() {
        this.router.navigate(['home/admin/config']);
    }

    ngDoCheck(): void {
        if (this.loanConfig.id == null) {
            this.formLabel = 'Add';
        } else {
            this.formLabel = 'Edit';
        }
    }

    onSubmit() {
        this.submitted = true;
        this.spinner.show();
        if (this.selectedOfferLetterIdList !== undefined) {
            this.selectedOfferLetterIdList.forEach(offerLetterId => {
                const offerLetter = new OfferLetter();
                offerLetter.id = Number(offerLetterId);
                this.selectedOfferLetterList.push(offerLetter);
            });
        }
        if (this.loanConfigForm.invalid) {
            this.spinner.hide();
            this.scrollToFirstInvalidControl();
            this.toastService.show(new Alert(AlertType.ERROR, ' Required Field should not left blank'));
            return;
        }

        if (ObjectUtil.isEmpty(this.loanConfigForm.control.get('category').value)) {
            this.spinner.hide();
            this.toastService.show(new Alert(AlertType.ERROR, ' Category Field should not left blank'));
            return;
        }
        this.loanConfig.templateList = this.confirmLoanTemplateList;
        this.loanConfig.initial = this.finalInitialDocument;
        this.loanConfig.renew = this.finalRenewalDocument;
        this.loanConfig.closure = this.finalClosureDocument;
        this.loanConfig.enableEligibility = true;
        this.loanConfig.eligibilityDocuments = this.finalEligibilityDocument;
        this.loanConfig.enhance = this.finalEnhanceDocument;
        this.loanConfig.partialSettlement = this.finalPartialSettlementDocument;
        this.loanConfig.fullSettlement = this.finalFullSettlementDocument;
        this.loanConfig.approvedDocument = this.finalCadDocumentUploadList;
        this.loanConfig.renewWithEnhancement = this.finalRenewWithEnhancementDocument;
        this.otherCycleKeys.forEach((d) => {
            this.otherCycleFinal[d] = this.otherCycleDoc[d].filter(doc => doc.checked === true);
        });
        Object.assign(this.loanConfig, this.otherCycleFinal);
        this.loanConfig.offerLetters = this.selectedOfferLetterList;
        this.loanConfig.loanCategory = this.selectedLoanCategory;
        this.loanConfig.loanTag = this.selectedLoanTag;

        this.service.save(this.loanConfig).subscribe(() => {
                if (this.loanConfig.id == null) {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Loan Configuration'));
                    this.loanConfig = new LoanConfig();
                    this.router.navigate(['home/admin/config']).then(() => {
                        this.spinner.hide();
                    });
                } else {
                    this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Loan Configuration'));
                    this.loanConfig = new LoanConfig();
                    this.router.navigate(['home/admin/config']).then(() => {
                        this.spinner.hide();
                    });
                }
            }, error => {
                this.spinner.hide();
                console.log(error);
                this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Save Loan Config!'));
            }
        );
    }

    onLoanTagChange() {
        console.log(this.selectedLoanTag);
    }


    nbUpdateCheckBoxInitial($event, checkAll) {
        this.finalInitialDocument = [];
        this.initialDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalInitialDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalInitialDocument = [];
            }
        });

    }

    nbUpdateCheckBoxRenewal($event, checkAll) {
        this.finalRenewalDocument = [];
        this.renewalDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalRenewalDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalRenewalDocument = [];
            }
        });

    }

    nbUpdateCheckBoxClosure($event, checkAll) {
        this.finalClosureDocument = [];
        this.closureDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalClosureDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalClosureDocument = [];
            }
        });

    }

    nbUpdateCheckBoxEligibility($event, checkAll) {
        this.finalEligibilityDocument = [];
        this.eligibilityDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalEligibilityDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalEligibilityDocument = [];
            }
        });

    }

    nbUpdateCheckBoxEnhance($event, checkAll) {
        this.finalEnhanceDocument = [];
        this.enhanceDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalEnhanceDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalEnhanceDocument = [];
            }
        });

    }

    nbUpdateCheckBoxPartial($event, checkAll) {
        this.finalPartialSettlementDocument = [];
        this.partialSettlementDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalPartialSettlementDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalPartialSettlementDocument = [];
            }
        });

    }

    nbUpdateCheckBoxFull($event, checkAll) {
        this.finalFullSettlementDocument = [];
        this.fullSettlementDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalFullSettlementDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalFullSettlementDocument = [];
            }
        });

    }

    nbUpdateCheckBoxCad($event, checkAll) {
        this.finalCadDocumentUploadList = [];
        this.cadDocumentUploadList.forEach((d) => {
            if (checkAll) {
                this.finalCadDocumentUploadList.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalCadDocumentUploadList = [];
            }
        });

    }

    nbUpdateCheckBoxRenewalEnhance($event, checkAll) {
        this.finalRenewWithEnhancementDocument = [];
        this.renewWithEnhancementDocumentList.forEach((d) => {
            if (checkAll) {
                this.finalRenewWithEnhancementDocument.push(d);
                Object.assign(d, {checked: true});
            } else {
                d.checked = false;
                this.finalRenewWithEnhancementDocument = [];
            }
        });
    }

    setChecked(key, checkAll) {
        this.otherCycleDoc[key].forEach((d) => {
            Object.assign(d, {checked: checkAll});
        });
    }

    onSelect(key, event, data, docIndex) {
        if (event.target.checked) {
            this.otherCycleDoc[key][docIndex].checked = true;
        } else {
            this.otherCycleDoc[key][docIndex].checked = false;
        }
    }
}

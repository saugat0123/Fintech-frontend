import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../../../admin/component/user/user.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {CustomValidator} from '../../../../@core/validator/custom-validator';
import {CreditMemoService} from '../../service/credit-memo.service';
import {CreditMemoFullRoutes} from '../../credit-memo-full-routes';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Document} from '../../../admin/modal/document';
import {CreditMemoType} from '../../model/credit-memo-type';
import {CreditMemoDocument} from '../../model/credit-memo-document';
import {CreditMemo} from '../../model/credit-memo';
import {CreditMemoTypeService} from '../../service/credit-memo-type';
import {CreditMemoMemoTypeDocument} from '../../model/credit-memo-memo-type-document';
import {Editor} from '../../../../@core/utils/constants/editor';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {DocPath} from './doc-path';
import {Security} from '../../../loan/model/security';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-compose',
    templateUrl: './compose.component.html',
    styleUrls: ['./compose.component.scss']
})
export class ComposeComponent implements OnInit {
    public static FILE_SIZE_10MB = 10485760;

    isNewMemo: boolean;
    raisedFromCatalogue = false;

    memoTask: string;
    memoId: number;

    memoTypes: CreditMemoType[] = [];
    customerLoanList: LoanDataHolder[] = [];
    loanTypeList: LoanConfig[] = [];

    creditMemoDocuments: Document[] = [];
    creditMemoTypeDocuments: Document[] = [];
    editedCreditMemoDocuments: CreditMemoDocument[] = [];
    editedCreditMemoTypeDocuments: CreditMemoMemoTypeDocument[] = [];
    errorMessage = '';
    memo: CreditMemo = new CreditMemo();
    memoComposeForm: FormGroup;

    docSpinner = false;
    ckeConfig = Editor.CK_CONFIG;
    tempDocPath = Array<DocPath>();
    customerInfoId;
    allApproveLoan: LoanDataHolder [] = [];
    mergeSecurity: Security [] = [];
    selectedLoanList = [];
    proposalForm;
    loanId;

    constructor(
        private formBuilder: FormBuilder,
        private userService: UserService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private toastService: ToastService,
        private creditMemoService: CreditMemoService,
        private creditMemoTypeService: CreditMemoTypeService,
        private loanConfigService: LoanConfigService,
        private customerLoanService: LoanFormService,
        private spinnerService: NgxSpinnerService
    ) {
    }

    get subject() {
        return this.memoComposeForm.get('subject');
    }

    get refNumber() {
        return this.memoComposeForm.get('referenceNumber');
    }

    get type() {
        return this.memoComposeForm.get('type');
    }

    get content() {
        return this.memoComposeForm.get('content');
    }

    get customerLoan() {
        return this.memoComposeForm.get('customerLoan');
    }

    ngOnInit() {
        this.getCreditMemoTypes();
        this.getLoanTypes();
        this.proposalForm = this.formBuilder.group({
            data: this.formBuilder.array([])
        });
        this.memoId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
        this.activatedRoute.queryParams.subscribe((params) => {
            this.spinnerService.show();
            if (!(Object.keys(params).length === 0 && params.constructor === Object)) {
                this.raisedFromCatalogue = true;
                this.customerInfoId = params.customerInfoId;
                this.loanConfigService.detail(params.loanCategoryId).subscribe(response => {
                    const paramLoanConfig = response.detail as LoanConfig;
                    this.creditMemoDocuments = paramLoanConfig.creditMemoDocuments;
                });
                this.customerLoanService.getLoansByLoanHolderId(this.customerInfoId).subscribe({
                    next: (res: any) => {
                        this.allApproveLoan = res.detail;
                    },
                    error: () => {
                        this.spinnerService.hide();
                        this.toastService.show(new Alert(AlertType.ERROR, 'OPPS Something went Wrong Could Not Fetch Loan Data!!!'));
                    },
                    complete: () => {
                        const proposalForm = (this.proposalForm.get('data') as FormArray);
                        if (this.allApproveLoan.length > 0) {
                            this.allApproveLoan = this.allApproveLoan.filter(d => d.documentStatus.toString() === 'APPROVED');
                            this.allApproveLoan.forEach((d) => {
                                proposalForm.push(this.formBuilder.group({
                                    loanId: d.id,
                                    proposalData: this.formBuilder.group(JSON.parse(d.proposal.data))
                                }));
                                this.selectedLoanList.push(d.loan);
                                if (d.securities.length > 0) {
                                    d.securities.forEach((s) => {
                                        this.mergeSecurity.push(s);
                                    });
                                }
                            });
                        }
                        this.spinnerService.hide();
                    }});
                this.loanId = params.loanId;
                this.getCustomerLoanFromCategory({id: params.loanCategoryId}, params.loanId);
            }
        });
        if (this.memoId === null || this.memoId === 0 || this.memoId === undefined) {
            this.isNewMemo = true;
            this.memoTask = 'Compose New';
            this.memo = new CreditMemo();
        } else {
            this.isNewMemo = false;
            this.memoTask = 'Edit';
            this.creditMemoService.detail(Number(this.memoId)).subscribe((response: any) => {
                this.memo = response.detail;
                this.buildMemoForm(this.memo);

                // Setting existing documents --
                this.creditMemoDocuments = this.memo.customerLoan.loan.creditMemoDocuments;
                this.editedCreditMemoDocuments = this.memo.documents;
                this.editedCreditMemoDocuments.forEach((singleDoc, i) => {
                    this.creditMemoDocuments.forEach((initDoc, j) => {
                        if (singleDoc.document.id === initDoc.id) {
                            initDoc.checked = true;
                            initDoc.url = singleDoc.path;
                        }
                    });
                });

            }, error => console.error(error));
        }

        if (this.memoId === null || this.memoId === 0 || this.memoId === undefined) {
            this.isNewMemo = true;
            this.memoTask = 'Compose New';
            this.memo = new CreditMemo();
        } else {
            this.isNewMemo = false;
            this.memoTask = 'Edit';
            window.localStorage.removeItem('tempPath');
            this.creditMemoService.detail(Number(this.memoId)).subscribe((response: any) => {
                this.memo = response.detail;
                this.buildMemoForm(this.memo);

                // Setting existing documents --

                this.creditMemoTypeDocuments = response.detail.type.documents;
                this.editedCreditMemoTypeDocuments = this.memo.memoTypeDocuments;
                this.editedCreditMemoTypeDocuments.forEach((singleDoc, i) => {
                    this.creditMemoTypeDocuments.forEach((initDoc, j) => {
                        if (singleDoc.document.id === initDoc.id) {
                            initDoc.checked = true;
                            initDoc.url = singleDoc.path;
                        }
                    });
                });

            }, error => console.error(error));
        }
        this.buildMemoForm(this.memo);
    }

    buildMemoForm(memo: CreditMemo) {
        this.memoComposeForm = this.formBuilder.group(
            {
                subject: [memo.subject, [Validators.required, CustomValidator.notEmpty]],
                referenceNumber: [memo.referenceNumber, [Validators.required, CustomValidator.notEmpty]],
                type: [memo.type, Validators.required],
                content: [memo.content, [Validators.required, CustomValidator.notEmpty]],
                customerLoan: new FormControl({
                    value: !ObjectUtil.isEmpty(memo.customerLoan) ? memo.customerLoan : undefined,
                    disabled: true
                }, Validators.required),
            }
        );
    }

    getCreditMemoTypes() {
        this.creditMemoTypeService.getAll().subscribe(response => {
            this.memoTypes = response.detail;
        });
    }

    getLoanTypes() {
        this.loanConfigService.getAll().subscribe(response => {
            this.loanTypeList = response.detail;
        });
    }

    getCustomerLoanFromCategory(loanConfig, loanId) {
        if (loanId === null) {
            this.raisedFromCatalogue = false;
            this.creditMemoDocuments = loanConfig.creditMemoDocuments;
            this.memoComposeForm.get('customerLoan').patchValue(undefined);
        }

        const searchObj = {loanConfigId: String(loanConfig.id)};
        this.customerLoanService.getAllCustomerLoanByConfigId(searchObj, 1, 100).subscribe(response => {
            this.customerLoanList = response.detail.content;
            if (this.raisedFromCatalogue) {
                const activeCustomerLoan = this.customerLoanList.filter(
                    customerLoan => customerLoan.id === Number(loanId)
                );
                // this.memoComposeForm.get('customerLoan').patchValue(activeCustomerLoan[0]);
            }
        });
    }

    documentUploader(event, uploadedDocument, index: number, type: any) {
        this.docSpinner = true;

        const file = event.target.files[0];

        if (file.size > ComposeComponent.FILE_SIZE_10MB) {
            this.errorMessage = 'Maximum File Size Exceeds for  ' + uploadedDocument.name;
            type === this.editedCreditMemoDocuments ?
                (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '' :
                (<HTMLInputElement>document.getElementById(`uploadCreditMemoTypeDocument${index}`)).value = '';
            this.docSpinner = false;

        } else if (ObjectUtil.isEmpty(this.memoComposeForm.get('customerLoan').value)) {
            this.errorGenerator(type, index, 'Please select a customer loan to proceed with the upload!');
            this.docSpinner = false;

        } else if (ObjectUtil.isEmpty(this.memoComposeForm.get('type').value)) {
            this.errorGenerator(type, index, 'Please select credit memo type to proceed with the upload!');
            this.docSpinner = false;

        } else {
            type === this.editedCreditMemoDocuments ?
                console.log((<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '') :
                console.log((<HTMLInputElement>document.getElementById(`uploadCreditMemoTypeDocument${index}`)).value = '');
            this.errorMessage = undefined;
            const formData: FormData = new FormData();

            formData.append('file', file);
            formData.append('documentId', uploadedDocument.id);
            formData.append('customerName', (this.memoComposeForm.get('customerLoan').value as LoanDataHolder).customerInfo.customerName);
            formData.append('citizenshipNumber',
                (this.memoComposeForm.get('customerLoan').value as LoanDataHolder).customerInfo.citizenshipNumber);
            formData.append('memoType', (this.memoComposeForm.get('type').value as CreditMemoType).name);
            formData.append('documentName', uploadedDocument.name);
            formData.append('customerLoanId',
                (this.memoComposeForm.get('customerLoan').value as LoanDataHolder).id.toString());
            formData.append('DocumentType', type === this.editedCreditMemoDocuments ? 'FacilityCreditMemoDocument' : 'creditTypeMemoDocument');

            this.creditMemoService.uploadCreditMemoDocument(formData).subscribe(
                (result: any) => {
                    const doc = new DocPath();
                    doc.path = result.detail.path;
                    doc.index = index;
                    doc.docType = type === this.editedCreditMemoDocuments ? 'FacilityCreditMemoDocument' : 'creditTypeMemoDocument';
                    const findDuplicates = this.tempDocPath.findIndex(res => res.index === index && res.docType === doc.docType);
                    if (findDuplicates !== -1) {
                        this.tempDocPath.splice(findDuplicates, 1);
                    }
                    this.tempDocPath.push(doc);
                    localStorage.setItem('tempPath', JSON.stringify(this.tempDocPath));
                    const customerDocumentObject = result.detail;
                    if (type.length > 0) {
                        type.forEach((singleDoc, docIndex) => {
                            if (singleDoc.document.id === uploadedDocument.id) {
                                type.splice(docIndex, 1);
                            }
                        });
                    }
                    type.push(customerDocumentObject);
                    type === this.editedCreditMemoDocuments ? this.creditMemoDocuments[index].checked =
                        true : this.creditMemoTypeDocuments[index].checked = true;
                    this.docSpinner = false;
                },
                error => {
                    type === this.editedCreditMemoDocuments ? this.creditMemoDocuments[index].checked =
                        false : this.creditMemoTypeDocuments[index].checked = false;
                    this.errorGenerator(type, index, 'Failed to upload Selected File.');
                    this.docSpinner = false;
                }
            );
        }

    }

    errorGenerator(type: any, index: number, errorMessage: any): void {
        this.toastService.show(new Alert(AlertType.ERROR, errorMessage));
        type === this.editedCreditMemoDocuments ?
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '' :
            (<HTMLInputElement>document.getElementById(`uploadCreditMemoTypeDocument${index}`)).value = '';
    }


    saveMemo() {
        if (this.raisedFromCatalogue) {
            const activeCustomerLoan = this.customerLoanList.filter(
                customerLoan => customerLoan.id === Number(this.loanId)
            );
            this.memo.customerLoan = activeCustomerLoan[0];
            console.log(activeCustomerLoan[0]);
        }
        this.memo.subject = this.memoComposeForm.get('subject').value;
        this.memo.referenceNumber = this.memoComposeForm.get('referenceNumber').value;
        this.memo.type = this.memoComposeForm.get('type').value;
        this.memo.content = this.memoComposeForm.get('content').value;
        this.memo.documents = this.editedCreditMemoDocuments;
        this.memo.memoTypeDocuments = this.editedCreditMemoTypeDocuments;
        this.memo.proposalData = JSON.stringify(this.proposalForm.value);
        this.creditMemoService.save(this.memo).subscribe((response: any) => {
            const savedCreditMemo = response.detail;
            this.router.navigate([`${CreditMemoFullRoutes.READ}/${savedCreditMemo.id}`]).then(() => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved memo!'));
            });
        }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save memo!'));
        });
    }


    getCreditMemoTypeDocuments(memotype) {
        this.editedCreditMemoTypeDocuments = [];
        this.creditMemoTypeDocuments = [];
        memotype.documents.forEach(resp => {
            this.creditMemoTypeDocuments.push(resp);
        });
    }


    previewGeneralDoc(path: string, name: string, index: number, docType: string) {
        const doc = JSON.parse(localStorage.getItem('tempPath'));
        if (doc !== null && path === null || path === undefined) {
            doc.forEach(response => {
                if (response.docType === docType && response.index === index) {
                    this.previewDoc(response.path);
                } else {
                    console.log('error ::: null documents');
                }
            });
        } else {
            if (path !== null || path !== undefined) {
                this.previewDoc(path);
            } else {
                console.log('error ::: null documents');
            }
        }
    }

    previewDoc(path: string): void {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${path}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }
}

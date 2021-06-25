import {Component, Input, OnInit} from '@angular/core';
import {Document} from '../../admin/modal/document';
import {LoanType} from '../../loan/model/loanType';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ActivatedRoute, Params} from '@angular/router';
import {LoanConfig} from '../../admin/modal/loan-config';
import {LoanDataHolder} from '../../loan/model/loanData';

import {Alert, AlertType} from '../../../@theme/model/Alert';
import {ToastService} from '../../../@core/utils';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {CustomerDocuments} from '../../loan/model/customerDocuments';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-customer-loan-document',
    templateUrl: './customer-loan-document.component.html',
    styleUrls: ['./customer-loan-document.component.scss']
})
export class CustomerLoanDocumentComponent implements OnInit {
    public static FILE_SIZE_5MB = 5242880;
    public static FILE_SIZE_10MB = 10485760;
    @Input() loanDataHolder: LoanDataHolder;
    @Input() loanType: LoanType;
    initialDocuments: Document[] = [];
    renewDocuments: Document[] = [];
    loanConfig: LoanConfig = new LoanConfig();
    loanName: string;
    customerDocumentArray: Array<CustomerDocuments> = new Array<CustomerDocuments>();
    documentMap: string;
    paramProperties: any;
    errorMessage: string;
    loanConfigId;
    documentName;
    documentId;
    initialDocIndex;
    actualLoanId;
    deleteDocument = [];

    constructor(private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                private activatedRoute: ActivatedRoute,
                private loanFormService: LoanFormService,
                private modelService: NgbModal,) {
    }

    ngOnInit() {
        let loanId = null;
        let customerId = null;
        this.activatedRoute.queryParams.subscribe(
            (paramsValue: Params) => {
                this.paramProperties = {
                    loanId: null,
                    customerId: null,
                    loanCategory: null
                };
                this.paramProperties = paramsValue;
                loanId = this.paramProperties.loanId;
                customerId = this.paramProperties.customerId;
                this.loanConfigId = loanId;
                if (customerId === undefined) {
                    customerId = '';
                }
                this.actualLoanId = customerId;
                if (ObjectUtil.isEmpty(this.paramProperties.loanId) || (!ObjectUtil.isEmpty(this.loanDataHolder.loan))) {
                    loanId = this.loanDataHolder.loan.id;
                    this.loanConfigId = loanId;
                }
            });


        this.loanConfigService.detail(loanId).subscribe(
            (response: any) => {
                this.loanConfig = response.detail;
                this.loanName = this.loanConfig.name;
                switch (LoanType[this.loanType]) {
                    case LoanType.NEW_LOAN:
                        this.initialDocuments = this.loanConfig.initial;
                        break;
                    case LoanType.RENEWED_LOAN:
                        this.initialDocuments = this.loanConfig.renew;
                        break;
                    case LoanType.CLOSURE_LOAN:
                        this.initialDocuments = this.loanConfig.closure;
                        break;
                    case LoanType.ENHANCED_LOAN:
                        this.initialDocuments = this.loanConfig.enhance;
                        break;
                    case LoanType.PARTIAL_SETTLEMENT_LOAN:
                        this.initialDocuments = this.loanConfig.partialSettlement;
                        break;
                    case LoanType.FULL_SETTLEMENT_LOAN:
                        this.initialDocuments = this.loanConfig.fullSettlement;
                        break;
                    case LoanType.RENEW_WITH_ENHANCEMENT:
                        this.initialDocuments = this.loanConfig.renewWithEnhancement;
                        break;
                    default:
                        this.initialDocuments = this.loanConfig.initial;
                }

                if (!ObjectUtil.isEmpty(this.loanDataHolder.customerDocument)) {
                    this.customerDocumentArray = this.loanDataHolder.customerDocument;
                    this.customerDocumentArray.forEach((singleDoc, i) => {
                        this.initialDocuments.forEach((initDoc, j) => {
                            if (singleDoc.document.id === initDoc.id) {
                                initDoc.checked = true;
                            }
                        });
                    });
                }
                this.deleteDocument = this.customerDocumentArray;
                console.log('Backend', this.customerDocumentArray);
            }
        );

        /*if (this.renewDocuments.length > 0) {
          this.renew = true;
        }*/
    }

    documentUploader(event, documentName: string, documentId, index: number) {
        const file = event.target.files[0];
        if (file.size > CustomerLoanDocumentComponent.FILE_SIZE_5MB) {
            this.errorMessage = 'Maximum File Size Exceeds for  ' + documentName;
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
        } else if (ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.idNumber)) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Citizenship Number is required to upload file.'));
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
        } else if (ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.name)) {
            this.toastService.show(new Alert(AlertType.ERROR, 'Customer Name is required to upload file.'));
            (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
        } else {
            this.errorMessage = undefined;
            const formData: FormData = new FormData();

            formData.append('file', file);
            formData.append('loanId', this.loanConfigId.toString());
            formData.append('documentName', documentName);
            formData.append('documentId', documentId);
            formData.append('loanHolderId', this.loanDataHolder.loanHolder.id.toString());
            formData.append('customerType', this.loanDataHolder.loanHolder.customerType);
            formData.append('actualLoanId', this.actualLoanId);
            if (this.loanDataHolder.loanType === null || this.loanDataHolder.loanType === undefined) {
                formData.append('action', 'new');
            }

            if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEWED_LOAN) {
                formData.append('action', 'renew');
            }

            if (LoanType[this.loanDataHolder.loanType] === LoanType.CLOSURE_LOAN) {
                formData.append('action', 'close');
            }

            if (LoanType[this.loanDataHolder.loanType] === LoanType.ENHANCED_LOAN) {
                formData.append('action', 'ENHANCE');
            }
            if (LoanType[this.loanDataHolder.loanType] === LoanType.FULL_SETTLEMENT_LOAN) {
                formData.append('action', 'FULL_SETTLEMENT');
            }
            if (LoanType[this.loanDataHolder.loanType] === LoanType.PARTIAL_SETTLEMENT_LOAN) {
                formData.append('action', 'PARTIAL_SETTLEMENT_LOAN');
            }
            if (LoanType[this.loanDataHolder.loanType] === LoanType.RENEW_WITH_ENHANCEMENT) {
                formData.append('action', 'RENEW_WITH_ENHANCEMENT');
            }
            this.loanFormService.uploadFile(formData).subscribe(
                (result: any) => {
                    const customerDocumentObject = result.detail;
                    if (this.customerDocumentArray.length > 0) {
                        this.customerDocumentArray.forEach((singleDoc, docIndex) => {
                            if (singleDoc.document.id === documentId) {
                                this.customerDocumentArray.splice(docIndex, 1);
                            }
                        });
                    }
                    this.customerDocumentArray.push(customerDocumentObject);
                    this.initialDocuments[index].checked = true;
                    console.log('Doc path::::', this.customerDocumentArray);
                },
                error => {
                    console.error(error);
                    this.initialDocuments[index].checked = false;
                    (<HTMLInputElement>document.getElementById(`uploadDocument${index}`)).value = '';
                    this.toastService.show(new Alert(AlertType.ERROR, 'Failed to upload Selected File.'
                        + error.error.message));
                }
            );
        }
    }

    openModel(model, documentName: string, documentId, index: number) {
        this.documentName = documentName;
        this.documentId = documentId;
        this.initialDocIndex = index;
        this.modelService.open(model);
    }

    onClose() {
        this.modelService.dismissAll();
    }

    confirmDelete(i) {
        console.log(i);
        this.deleteDocument.forEach(resp => {

            console.log('test delete', resp.id);
            for (let j = 0; this.customerDocumentArray.length > j; j++) {
                if (this.initialDocuments[i].id === this.customerDocumentArray[j].document.id) {
                    console.log('INSIDE:::', this.customerDocumentArray[j].documentPath);
                    console.log('customerDocId', resp.id);
                    // tslint:disable-next-line:max-line-length
                    if (this.customerDocumentArray[j].document.id === resp.document.id) {
                        this.loanFormService.deleteCustomerDocument(this.initialDocuments[i].id, this.customerDocumentArray[j].documentPath,
                            resp.id === undefined ? null : resp.id, this.actualLoanId).subscribe((res: any) => {
                            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully DELETED '.concat(this.documentName)));
                        }, error => {
                            this.toastService.show(new Alert(AlertType.ERROR, error.error.message === undefined ?
                                ' Successfully DELETED ' : error.error.message));
                        });
                        // this.customerDocumentArray.splice(j, 1);
                        this.initialDocuments[i].checked = false;
                        break;
                    }
                }
            }

        });
       // tslint:disable-next-line:max-line-length
        // this.loanFormService.deleteDocument(this.initialDocuments[i].id, this.customerDocumentArray[this.documentId].documentPath).subscribe((res: any) => {
        //     this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully DELETED '.concat(this.documentName)));
        // }, error => {
        //     this.toastService.show(new Alert(AlertType.ERROR, error.error.message === undefined ?
        //         ' Successfully DELETED ' : error.error.message));
        // });

        // console.log('After:::', this.customerDocumentArray);
        this.modelService.dismissAll();
    }
}

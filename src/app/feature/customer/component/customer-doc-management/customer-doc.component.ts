import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {DocumentService} from '../../../admin/component/document/document.service';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerGeneralDocument} from '../../model/customerGeneralDocument';
import {CustomerService} from '../../service/customer.service';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CustomerInfoService} from '../../service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {CustomerGeneralDocumentService} from '../../service/customer-general-document.service';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {DmsLoanFileComponent} from '../../../loan/component/loan-main-template/dms-loan-file/dms-loan-file.component';
import {CustomerType} from '../../model/customerType';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {RoleType} from '../../../admin/modal/roleType';

@Component({
    selector: 'app-customer-doc',
    templateUrl: './customer-doc.component.html',
    styleUrls: ['./customer-doc.component.scss']
})
export class CustomerDocComponent implements OnInit {
    @Output() refreshCustomerInfo = new EventEmitter<boolean>();
    @Input()
    customerInfo: CustomerInfoData;
    generalDocumentReq: CustomerGeneralDocument[] = [];
    listOfLoanOfCustomer = [];
    errorMessage = '';
    uploadFile;
    customerGeneralDoc = {
        docPath: null,
        document: null,
        id: null,
        version: null,
        customerInfoId: null
    };
    documentName;
    documentId;
    index;
    currentRoleTypeMaker = false;
    spinner = false;

    constructor(private documentService: DocumentService,
                private loanService: LoanFormService,
                private customerService: CustomerService,
                private customerInfoService: CustomerInfoService,
                private toastService: ToastService,
                private customerGeneralDocumentService: CustomerGeneralDocumentService,
                private modelService: NgbModal) {
    }

    ngOnInit() {
        this.getGeneralLoanConfigDocument();
        this.getLoanOfLoanHolder();
        const roleType: string = LocalStorageUtil.getStorage().roleType;
        this.currentRoleTypeMaker = roleType === RoleType.MAKER;
    }

    openModel(model, documentName: string, documentId, index: number) {
        this.documentName = documentName;
        this.documentId = documentId;
        this.index = index;
        this.modelService.open(model);
    }

    uploadDoc(event) {
        this.uploadFile = event.target.files[0];
    }

    onClose() {
        this.modelService.dismissAll();
    }

    onFileChange(documentName: string, documentId, index: number) {
        const formData: FormData = new FormData();
        formData.append('file', this.uploadFile);
        formData.append('documentName', documentName);
        formData.append('documentId', documentId);
        formData.append('customerName', this.customerInfo.name);
        formData.append('customerInfoId', this.customerInfo.id.toString());
        formData.append('customerType', this.customerInfo.customerType);
        if (ObjectUtil.isEmpty(this.customerInfo.name)) {
            this.modelService.dismissAll();
            this.toastService.show(new Alert(AlertType.INFO, 'Customer Name Cannot Be Empty'));
            return;
        } else if (this.uploadFile.size > DmsLoanFileComponent.FILE_SIZE_5MB) {
            this.modelService.dismissAll();
            this.toastService.show(new Alert(AlertType.INFO, 'Maximum File Size Exceeds for'.concat(documentName)));
            return;
        }
        this.spinner = true;
        this.customerGeneralDocumentService.uploadDoc(formData).subscribe((res: any) => {
            // const customerGeneralDocument: CustomerGeneralDocument = res.detail;
            // if (!ObjectUtil.isEmpty(this.customerInfo)) {
            //     this.customerGeneralDoc.id = this.customerInfo.customerGeneralDocuments[index]
            //         ? this.customerInfo.customerGeneralDocuments[index].id : null;
            //     this.customerGeneralDoc.version = this.customerInfo.customerGeneralDocuments[index]
            //         ? this.customerInfo.customerGeneralDocuments[index].version : null;
            // }
            // this.customerGeneralDoc.customerInfoId = this.customerInfo.id;
            // this.customerGeneralDoc.docPath = customerGeneralDocument.docPath;
            // this.customerGeneralDoc.document = customerGeneralDocument.document;
            // this.customerGeneralDocumentService.save(this.customerGeneralDoc)
            //     .subscribe(() => {
            //         this.modelService.dismissAll();
            //         this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved '.concat(documentName)));
            //         this.refreshCustomerInfo.emit(true);
            //     }, error => {
            //         this.modelService.dismissAll();
            //         console.error(error);
            //         this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save '.concat(documentName)));
            //     });
            this.modelService.dismissAll();
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully saved '.concat(documentName)));
            this.refreshCustomerInfo.emit(true);
            this.spinner = false;
        }, error => {
            this.modelService.dismissAll();
            console.error(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to save '.concat(documentName)));
        });
        this.generalDocumentReq[index].checked = true;
    }

    previewGeneralDoc(url: string, name: string) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    getGeneralLoanConfigDocument() {
        if (!ObjectUtil.isEmpty(this.customerInfo.customerType)) {
            let loanCycleId;
            if (CustomerType[this.customerInfo.customerType] === CustomerType.INSTITUTION) {
                loanCycleId = 10;
            } else if (CustomerType[this.customerInfo.customerType] === CustomerType.INDIVIDUAL) {
                loanCycleId = 9;
            }
            this.documentService.getByLoanCycleAndStatus(loanCycleId, 'ACTIVE').subscribe((res: any) => {
                this.generalDocumentReq = res.detail;
                if (!ObjectUtil.isEmpty(this.customerInfo.customerGeneralDocuments)) {
                    const customerDocumentArray = this.customerInfo.customerGeneralDocuments;
                    customerDocumentArray.forEach((singleDoc, i) => {
                        this.generalDocumentReq.forEach((initDoc, j) => {
                            if (singleDoc.document.id === initDoc.id) {
                                initDoc.checked = true;
                                initDoc.docPath = singleDoc.docPath;
                            }
                        });
                    });
                }
            });
        }
    }


    getLoanOfLoanHolder() {
        this.loanService.getLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
            this.listOfLoanOfCustomer = res.detail;
        });
    }

    refresh() {
        this.refreshCustomerInfo.emit(true);
    }

    confirmDelete(i) {
        this.modelService.dismissAll();
        const removeDocument = this.generalDocumentReq[this.index];
        const docId = removeDocument.id;
        this.customerGeneralDocumentService.deleteDocument(docId, this.customerInfo.id, removeDocument.docPath).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, ' Successfully DELETED '.concat(this.documentName)));
            this.refresh();
        }, error => {
            // tslint:disable-next-line:max-line-length
            this.toastService.show(new Alert(AlertType.ERROR, error.error.message === undefined ? ' Successfully DELETED ' : error.error.message));
        });
    }

}

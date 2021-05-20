import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {RemarksEnum} from '../../../../../admin/modal/remarksEnum';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ToastService} from '../../../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {ApiConfig} from '../../../../../../@core/utils/api/ApiConfig';
import {CadChecklistDocTemplateModalComponent} from '../../../../cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {DocumentService} from '../../../../../admin/component/document/document.service';
import {Status} from '../../../../../../@core/Status';
import {environment} from '../../../../../../../environments/environment';
import {Clients} from '../../../../../../../environments/Clients';

@Component({
    selector: 'app-document-checklist-lite',
    templateUrl: './document-checklist-lite.component.html',
    styleUrls: ['./document-checklist-lite.component.scss']
})
export class DocumentChecklistLiteComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;
    customerCadFile = [];
    @Output()
    responseCadData: EventEmitter<CustomerApprovedLoanCadDocumentation> = new EventEmitter<CustomerApprovedLoanCadDocumentation>();

    uploadFile;
    spinner = false;
    saveEditParam = {
        loanId: undefined,
        documentId: undefined,
        amount: undefined,
        remarks: undefined
    };
    remarkOption = RemarksEnum.enumObject();

    uploadModalDto = {
        loadDataHolderId: undefined,
        customerLoanId: undefined,
        approvedDocId: undefined,
        documentName: undefined
    };
    document: Array<Document> = [];
    client = environment.client;
    clientList = Clients;

    constructor(private creditAdministrationService: CreditAdministrationService,
                private toastService: ToastService,
                private nbDialogService: NbDialogService,
                private routerUtilsService: RouterUtilsService,
                private modelService: NgbModal,
                private documentService: DocumentService) {
    }

    ngOnInit() {
        this.displaySelectedData();
        this.initial();

    }

    initial() {
        if (this.document.length < 1) {
            this.documentService.getByLoanCycleAndStatus(12, Status.ACTIVE).subscribe(res => {
                this.document = res.detail;
                if (!ObjectUtil.isEmpty(this.cadData) && !(ObjectUtil.isEmpty(this.document))) {
                    this.customerLoanList = this.cadData.assignedLoan;

                    this.cadData.cadFileList.forEach(singleCadFile => {
                        this.document.forEach(singleDocument => {
                            if (singleDocument.id === singleCadFile.cadDocument.id) {
                                singleDocument.checked = true;
                                singleDocument.url = singleCadFile.path;
                                singleDocument.amount = singleCadFile.amount;
                                singleDocument.remarks = singleCadFile.remarks;
                                singleDocument.uploadedDate = singleCadFile.uploadedDate;
                            }
                        });
                    });
                }
            }, error => {
                console.log(error);
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Unable to load document '));

            });
        }
    }

    uploadOfferLetter(event) {
        this.uploadFile = event.target.files[0];
    }

    save(loanHolderId, customerLoanId, documentId, documentName) {
        this.spinner = true;
        const formData: FormData = new FormData();
        formData.append('file', this.uploadFile);
        formData.append('customerInfoId', loanHolderId);
        formData.append('loanID', customerLoanId);
        formData.append('documentId', documentId);
        formData.append('customerApprovedDocId', this.cadData.id.toString());

        formData.append('documentName', documentName);

        this.creditAdministrationService.uploadCreditCheckList(formData).subscribe((res: any) => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved ' + documentName));
                this.responseCadData.emit(res.detail);
            }, error => {
                this.spinner = false;
                this.toastService.show(new Alert(AlertType.ERROR, error));
            }
        );

    }

    previewDoc(url: string, name: string) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}?${Math.floor(Math.random() * 100) + 1}`;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

    populateCadTemplate(documentId, loanId) {
        this.nbDialogService.open(CadChecklistDocTemplateModalComponent, {
            context: {
                documentId: documentId,
                cadData: this.cadData,
                customerLoanId: loanId
            }
        });
    }

    // tslint:disable-next-line:use-lifecycle-interface
    ngOnChanges(changes: SimpleChanges): void {
        //this.initial();
        this.displaySelectedData();
    }

    saveText(customerLoanId, documentId, amount, remarks) {
        this.spinner = true;
        let flag = true;
        if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.cadFileList)) {
            this.cadData.cadFileList.forEach(singleCadFile => {
                if (singleCadFile.customerLoanId === customerLoanId && singleCadFile.cadDocument.id === documentId) {
                    flag = false;
                    singleCadFile.amount = amount;
                    singleCadFile.remarks = remarks;
                }
            });
            if (flag) {
                const cadFile = new CadFile();
                const document = new Document();
                cadFile.amount = amount;
                cadFile.remarks = remarks;
                document.id = documentId;
                cadFile.cadDocument = document;
                cadFile.customerLoanId = customerLoanId;
                this.cadData.cadFileList.push(cadFile);
            }
        } else {
            const cadFile = new CadFile();
            const document = new Document();
            cadFile.amount = amount;
            cadFile.remarks = remarks;
            document.id = documentId;
            cadFile.cadDocument = document;
            cadFile.customerLoanId = customerLoanId;
            this.cadData.cadFileList.push(cadFile);
        }

        this.creditAdministrationService.saveCadDocumentBulk(this.cadData).subscribe((res) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Data'));
            this.spinner = false;
            this.close();
            this.responseCadData.emit(res.detail);

        }, error => {
            this.spinner = false;
            this.close();
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save Data'));
        });
    }

    openSaveEditForm(template, loanId, docId, amount, remarks) {
        this.saveEditParam.loanId = loanId;
        this.saveEditParam.documentId = docId;
        this.saveEditParam.amount = amount;
        this.saveEditParam.remarks = remarks;

        this.modelService.open(template);
    }

    close() {
        this.modelService.dismissAll();
    }

    openDocUploadModal(modal, loadDataHolderId, customerLoanId, approvedDocId, documentName) {
        this.uploadModalDto.documentName = documentName;
        this.uploadModalDto.approvedDocId = approvedDocId;
        this.uploadModalDto.customerLoanId = customerLoanId;
        this.uploadModalDto.loadDataHolderId = loadDataHolderId;
        this.nbDialogService.open(modal);
    }

    responseFromAdditionalDocument(event) {
        this.responseCadData.emit(event);
    }


    displaySelectedData() {
        this.document = this.cadData.requiredDocument;
        if (!ObjectUtil.isEmpty(this.cadData) && !(ObjectUtil.isEmpty(this.document))) {
            this.customerLoanList = this.cadData.assignedLoan;

            this.cadData.cadFileList.forEach(singleCadFile => {
                this.document.forEach(singleDocument => {
                    if (singleDocument.id === singleCadFile.cadDocument.id) {
                        singleDocument.checked = true;
                        singleDocument.url = singleCadFile.path;
                        singleDocument.amount = singleCadFile.amount;
                        singleDocument.remarks = singleCadFile.remarks;
                        singleDocument.uploadedDate = singleCadFile.uploadedDate;
                    }
                });
            });
        }

    }
}

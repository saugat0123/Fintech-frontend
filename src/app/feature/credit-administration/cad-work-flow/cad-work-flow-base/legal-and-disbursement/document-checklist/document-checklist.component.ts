import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ApiConfig} from '../../../../../../@core/utils/api/ApiConfig';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../../../utils/router-utils.service';
import {NbDialogService} from '@nebular/theme';
import {CadChecklistDocTemplateModalComponent} from '../../../../cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {CadFile} from '../../../../model/CadFile';
import {Document} from '../../../../../admin/modal/document';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RemarksEnum} from '../../../../../admin/modal/remarksEnum';

@Component({
    selector: 'app-document-checklist',
    templateUrl: './document-checklist.component.html',
    styleUrls: ['./document-checklist.component.scss']
})
export class DocumentChecklistComponent implements OnInit, OnChanges {
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
        remarks: undefined};
    remarkOption = RemarksEnum.enumObject();

    uploadModalDto = {
        loadDataHolderId: undefined,
        customerLoanId: undefined,
        approvedDocId: undefined,
        documentName: undefined
    };

    constructor(private creditAdministrationService: CreditAdministrationService,
                private toastService: ToastService,
                private nbDialogService: NbDialogService,
                private routerUtilsService: RouterUtilsService,
                private modelService: NgbModal) {
    }

    ngOnInit() {
        this.initial();
    }

    initial() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;

            this.cadData.cadFileList.forEach(singleCadFile => {
                this.customerLoanList.forEach(loanList => {
                    if (singleCadFile.customerLoanId === loanList.id) {
                        loanList.loan.approvedDocument.forEach(doc => {
                            if (doc.id === singleCadFile.cadDocument.id) {
                                doc.checked = true;
                                doc.url = singleCadFile.path;
                                doc.amount = singleCadFile.amount;
                                doc.remarks = singleCadFile.remarks;
                                doc.uploadedDate =  singleCadFile.uploadedDate;
                            }
                        });
                    }
                });
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
        link.href = `${ApiConfig.URL}/${url}`;
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

    ngOnChanges(changes: SimpleChanges): void {
        this.initial();
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

            // this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
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

    openDocUploadModal(modal , loadDataHolderId , customerLoanId , approvedDocId , documentName) {
        this.uploadModalDto.documentName = documentName;
        this.uploadModalDto.approvedDocId = approvedDocId;
        this.uploadModalDto.customerLoanId = customerLoanId;
        this.uploadModalDto.loadDataHolderId = loadDataHolderId;
        this.nbDialogService.open(modal);
    }

    responseFromAdditionalDocument(event){
        this.responseCadData.emit(event)
    }
}

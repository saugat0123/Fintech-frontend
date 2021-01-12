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

    uploadModalDto = {
        loadDataHolderId: undefined,
        customerLoanId: undefined,
        approvedDocId: undefined,
        documentName: undefined
    };

    constructor(private creditAdministrationService: CreditAdministrationService,
                private toastService: ToastService,
                private nbDialogService: NbDialogService,
                private routerUtilsService: RouterUtilsService) {
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

    openDocUploadModal(modal , loadDataHolderId , customerLoanId , approvedDocId , documentName) {
        this.uploadModalDto.documentName = documentName;
        this.uploadModalDto.approvedDocId = approvedDocId;
        this.uploadModalDto.customerLoanId = customerLoanId;
        this.uploadModalDto.loadDataHolderId = loadDataHolderId;
        this.nbDialogService.open(modal);
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {ToastService} from '../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CadChecklistDocTemplateModalComponent} from '../../cad-offerletter-profile/cad-checklist-doc-template-modal/cad-checklist-doc-template-modal.component';
import {CommonService} from '../../../../@core/service/common.service';

@Component({
    selector: 'app-document-checklist-view',
    templateUrl: './document-checklist-view.component.html',
    styleUrls: ['./document-checklist-view.component.scss']
})
export class DocumentChecklistViewComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;
    customerCadFile = [];

    uploadFile;

    constructor(private creditAdministrationService: CreditAdministrationService,
                private toastService: ToastService,
                private nbDialogService: NbDialogService,
                private routerUtilsService: RouterUtilsService,
                public commonService: CommonService) {
    }

    ngOnInit() {
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
        const formData: FormData = new FormData();
        formData.append('file', this.uploadFile);
        formData.append('customerInfoId', loanHolderId);
        formData.append('loanID', customerLoanId);
        formData.append('documentId', documentId);
        formData.append('customerApprovedDocId', this.cadData.id.toString());

        formData.append('documentName', documentName);

        this.creditAdministrationService.uploadCreditCheckList(formData).subscribe((res: any) => {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved ' + documentName));
                this.routerUtilsService.reloadCadProfileRoute(this.cadData.id);
            }, error => {
                this.toastService.show(new Alert(AlertType.ERROR, error));
            }
        );

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
}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../loan/model/loanData';
import {CreditAdministrationService} from '../../../../service/credit-administration.service';
import {ApiConfig} from '../../../../../../@core/utils/api/ApiConfig';
import {ToastService} from '../../../../../../@core/utils';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {RouterUtilsService} from '../../../../utils/router-utils.service';

@Component({
    selector: 'app-document-checklist',
    templateUrl: './document-checklist.component.html',
    styleUrls: ['./document-checklist.component.scss']
})
export class DocumentChecklistComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;
    customerCadFile = [];

    uploadFile;

    constructor(private creditAdministrationService: CreditAdministrationService,
                private toastService: ToastService,
                private routerUtilsService: RouterUtilsService) {
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

    previewGeneralDoc(url: string, name: string) {
        const link = document.createElement('a');
        link.target = '_blank';
        link.href = `${ApiConfig.URL}/${url}`;
        // link.download = name;
        link.setAttribute('visibility', 'hidden');
        link.click();
    }

}

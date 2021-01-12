import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
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

    constructor(public commonService: CommonService) {
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
                                doc.amount = singleCadFile.amount;
                                doc.remarks = singleCadFile.remarks;
                                doc.uploadedDate = singleCadFile.uploadedDate;
                            }
                        });
                    }
                });
            });
        }
    }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {LoanDataHolder} from '../../../../../loan/model/loanData';

@Component({
    selector: 'app-document-checklist',
    templateUrl: './document-checklist.component.html',
    styleUrls: ['./document-checklist.component.scss']
})
export class DocumentChecklistComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList : Array<LoanDataHolder>;
    customerCadFile = [];
    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;
        }
    }

}

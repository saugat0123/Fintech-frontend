import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-cad-loan-document',
    templateUrl: './cad-loan-document.component.html',
    styleUrls: ['./cad-loan-document.component.scss']
})
export class CadLoanDocumentComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;
    setClassName = 'far fa-file-pdf';
    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;
        }
    }

    public classByExtension(fileName){

    }

}

import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {LoanDataHolder} from '../../../../loan/model/loanData';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {CommonService} from '../../../../../@core/service/common.service';

@Component({
    selector: 'app-cad-loan-document',
    templateUrl: './cad-loan-document.component.html',
    styleUrls: ['./cad-loan-document.component.scss']
})
export class CadLoanDocumentComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    customerLoanList: Array<LoanDataHolder>;
    setClassName = 'far fa-file-pdf fa-1x text-danger';

    constructor(public service: CommonService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.customerLoanList = this.cadData.assignedLoan;
        }
    }

    public classByExtension(fileName) {

    }


    openDocument(file) {
        let fileName = file;
        if (file !== null) {
            fileName = ApiConfig.URL + '/' + file;

            const link = document.createElement('a');
            link.href = fileName;
            link.target = '_blank';
            link.click();
        }
    }
}

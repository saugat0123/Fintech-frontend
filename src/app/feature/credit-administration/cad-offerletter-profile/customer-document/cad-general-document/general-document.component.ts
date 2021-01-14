import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerGeneralDocument} from '../../../../customer/model/customerGeneralDocument';
import {CommonService} from '../../../../../@core/service/common.service';
import {CustomerGeneralDocumentService} from '../../../../customer/service/customer-general-document.service';

@Component({
    selector: 'app-general-document',
    templateUrl: './general-document.component.html',
    styleUrls: ['./general-document.component.scss']
})
export class GeneralDocumentComponent implements OnInit {
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    loanHolder: CustomerInfoData;
    customerGeneralDocument: Array<CustomerGeneralDocument>;

    constructor(public service: CommonService,
                private customerGeneralDocService: CustomerGeneralDocumentService) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadData)) {
            this.loanHolder = this.cadData.loanHolder;

            this.customerGeneralDocService.detail(this.loanHolder.id).subscribe((res: any) => {
                this.customerGeneralDocument = res.detail;
                if (ObjectUtil.isEmpty(this.customerGeneralDocument)) {
                    this.customerGeneralDocument = [];
                }
            });
        }


    }

}

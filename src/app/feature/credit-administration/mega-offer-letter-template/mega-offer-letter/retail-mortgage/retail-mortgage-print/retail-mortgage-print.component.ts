import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../../../mega-offer-letter-const';
import {ObjectUtil} from "../../../../../../@core/utils/ObjectUtil";
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
    selector: 'app-retail-mortgage-print',
    templateUrl: './retail-mortgage-print.component.html',
    styleUrls: ['./retail-mortgage-print.component.scss']
})
export class RetailMortgagePrintComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() form: any;
    offerLetterConst = MegaOfferLetterConst;
    loanHolderInfo;

    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.loanHolder)) {
            this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
        }
    }

}

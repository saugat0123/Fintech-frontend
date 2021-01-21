import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {ProposalCalculationUtils} from '../../../loan/component/loan-summary/ProposalCalculationUtils';
import {CommonService} from '../../../../@core/service/common.service';

@Component({
    selector: 'app-exposure-view',
    templateUrl: './exposure-view.component.html',
    styleUrls: ['./exposure-view.component.scss']
})
export class ExposureViewComponent implements OnInit {
    @Input()
    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    @Input() displayHistory: boolean;
    disbursementDetails = [];
    disbursementDetailsHistory = [];
    @Input() fromScc: boolean;

    constructor(public service: CommonService) {
    }

    ngOnInit() {
        // tslint:disable-next-line:max-line-length
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.exposure)
            && (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.exposure.data))) {
            const data = JSON.parse(this.cadOfferLetterApprovedDoc.exposure.data);
            this.disbursementDetails = data.disbursementDetails;
        }
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.exposure)
            && (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.exposure.historyData))) {
            this.disbursementDetailsHistory = JSON.parse(this.cadOfferLetterApprovedDoc.exposure.historyData);
        }
    }

    totalSum(list, key) {
        let total = 0;
        list.forEach(value => {
            if (value[key]) {
                total += parseFloat(ProposalCalculationUtils.isNumber(value[key]));
            }
        });
        return ProposalCalculationUtils.isNumber(total);
    }

    totalFundedNonFunded(list, key, filterFundedNonFunded) {
        let total = 0;
        list.forEach(value => {
            if (value[key] && value.isFunded === filterFundedNonFunded) {
                total += parseFloat(ProposalCalculationUtils.isNumber(value[key]));
            }
        });
        return ProposalCalculationUtils.isNumber(total);

    }
}

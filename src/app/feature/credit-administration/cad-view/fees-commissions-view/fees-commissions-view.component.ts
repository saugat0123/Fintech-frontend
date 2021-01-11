import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-fees-commissions-view',
    templateUrl: './fees-commissions-view.component.html',
    styleUrls: ['./fees-commissions-view.component.scss']
})
export class FeesCommissionsViewComponent implements OnInit {
    @Input()
    cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;

    feeCommission;

    constructor() {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.feesAndCommission)) {
            console.log(this.cadOfferLetterApprovedDoc.feesAndCommission);
            this.feeCommission = JSON.parse(this.cadOfferLetterApprovedDoc.feesAndCommission);
            console.log(this.feeCommission);
        }
    }

    get totalFeeAmount() {
        let t = 0;
        if (!ObjectUtil.isEmpty(this.feeCommission)) {
            this.feeCommission.feeAmountDetails.forEach(f => {
                (f.loanFeeDetails.forEach(l => t += Number(l.feeAmount)));
            });
        }
        return t;
    }

}

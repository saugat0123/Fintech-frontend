import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
    selector: 'app-section8-insurance-clause',
    templateUrl: './section8-insurance-clause.component.html',
    styleUrls: ['./section8-insurance-clause.component.scss']
})
export class Section8InsuranceClauseComponent implements OnInit {
    @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
    tempData;
    trustReceiptVisible;
    acceptance;
    autoLoanVisible: boolean;
    stockInsurance: boolean;
    buildingInsurance: boolean;
    insuranceVisible: boolean;

    constructor() {}


    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
            this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
        }
        const securities = this.tempData.securities;
        this.trustReceiptVisible = this.tempData.importLoanTrust;
        this.acceptance = this.tempData.timeLetterCreditForm;
        if (!ObjectUtil.isEmpty(this.tempData.termLoanForm) && this.tempData.termLoanForm.termLoanDetails.length > 0) {
            const tmpData = this.tempData.termLoanForm.termLoanDetails;
            tmpData.forEach(val => {
                if (val.termLoanFor === 'VEHICLE') {
                    this.autoLoanVisible = true;
                }
            });
        }
        if (!ObjectUtil.isEmpty(this.tempData.autoLoanMasterForm)) {
            this.autoLoanVisible = true;
        }
        if (securities.primarySecurity.some(s => s.insuranceRequired === true)
            || securities.secondarySecurity.some(s => s.insuranceRequired === true)) {
            this.insuranceVisible = true;
        }
        if (securities.primarySecurity.some(s => s.securityType === 'LAND_AND_BUILDING' && s.insuranceRequired === true)
            || securities.secondarySecurity.some(s => s.securityType === 'LAND_AND_BUILDING' && s.insuranceRequired === true)) {
            this.buildingInsurance = true;
        }
        if (securities.primarySecurity.some(s => s.securityType === 'HYPOTHECATION' && s.insuranceRequired === true)) {
            this.stockInsurance = true;
        }
    }

}

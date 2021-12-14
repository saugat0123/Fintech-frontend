import {Component, Input, OnInit} from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-section8-insurance-clause-print',
  templateUrl: './section8-insurance-clause-print.component.html',
  styleUrls: ['./section8-insurance-clause-print.component.scss']
})
export class Section8InsuranceClausePrintComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  tempData;
  trustReceiptVisible;
  acceptance;
  autoLoanVisible;
  stockInsurance: boolean;
  buildingInsurance: boolean;
  insuranceVisible: boolean;
  constructor() { }


  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    const securities = this.tempData.securities;
    this.trustReceiptVisible = this.tempData.importLoanTrust;
    this.acceptance = this.tempData.timeLetterCreditForm;
    this.autoLoanVisible = this.tempData.termLoanForm;
    if (securities.primarySecurity.some(s => s.insuranceRequired === true)
        || securities.secondarySecurity.some(s => s.insuranceRequired === true)
    ) {
      this.insuranceVisible = true;
    }
    if (securities.primarySecurity.some(s => s.securityType === 'LAND_AND_BUILDING' && s.insuranceRequired === true)
        || securities.secondarySecurity.some(s => s.securityType === 'LAND_AND_BUILDING' && s.insuranceRequired === true)) {
      this.buildingInsurance = true;
    }
    if (securities.primarySecurity.some(s => s.securityType === 'HYPOTHECATION' && s.insuranceRequired === true)
        || securities.secondarySecurity.some(s => s.securityType === 'HYPOTHECATION' && s.secondarySecurity === true)) {
      this.stockInsurance = true;
    }
  }

}

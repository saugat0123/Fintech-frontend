import {Component, Input, OnInit} from '@angular/core';
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
  form;
  insuranceVisible = false;
  constructor() { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
    }
    const trustReceipt = this.tempData.importLoanTrust;
    const securities = this.tempData.securities;
    if (securities.primarySecurity.filter(s => s.insuranceRequired === true).length > 0
        || securities.secondarySecurity.filter(s => s.insuranceRequired === true).length > 0
    ) {
      this.insuranceVisible = true;
    }
    if (trustReceipt.selected) {
      this.trustReceiptVisible = true;
    }
  }

}

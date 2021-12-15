import { Component, OnInit, Input } from '@angular/core';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section7-security-clause-print',
  templateUrl: './section7-security-clause-print.component.html',
  styleUrls: ['./section7-security-clause-print.component.scss']
})
export class Section7SecurityClausePrintComponent implements OnInit {
  @Input() customerApprovedDoc;
  loanHolderInfo;
  branchName;
  mortgageType1;
  fixedDeposit;
  tempData;
  isGharJaggaVisible: boolean;
  isSamanMojdatVisible: boolean;
  isReceivableVisible: boolean;

  constructor(
      private formbuilder: FormBuilder
  ) {
  }
  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.branchName = this.loanHolderInfo.branch.ct;
    }
    const securities = this.tempData.securities;
    this.fixedDeposit = this.tempData.overdraftFixedForm;
    this.mortgageType1 = this.tempData.smeGlobalForm.mortgageType;
    if (
        securities.primarySecurity.filter(s => s.securityType === 'LAND' || s.securityType === 'LAND_AND_BUILDING').length > 0
        || securities.secondarySecurity.filter(s => s.securityType === 'LAND' || s.securityType === 'LAND_AND_BUILDING').length > 0

    ) {
      this.isGharJaggaVisible = true;
    }
    if (
        securities.primarySecurity.filter(s => s.securityType === 'HYPOTHECATION').length > 0
    ) {
      this.isSamanMojdatVisible = true;
    }
    if (
        securities.primarySecurity.filter(s => s.securityType === 'ASSIGNMENT').length  > 0
    ) {
      this.isReceivableVisible = true;
    }
  }

}

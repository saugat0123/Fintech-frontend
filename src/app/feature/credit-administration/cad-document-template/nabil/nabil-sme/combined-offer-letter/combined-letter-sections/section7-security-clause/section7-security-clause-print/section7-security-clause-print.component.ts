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
  fixedDeposit: boolean;
  tempData;
  isGharJaggaVisible: boolean;
  isSamanMojdatVisible: boolean;
  isReceivableVisible: boolean;
  freeInformation;
  isFinancing = false;

  constructor() {
  }
  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.customerApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
      this.freeInformation = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].supportedInformation);
      this.branchName = this.loanHolderInfo.branch.ct;
      this.isFinancing = this.tempData.smeGlobalForm.arFinancing;
    }
    const securities = this.tempData.securities;
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
    if (securities.primarySecurity.filter(s => s.securityType === 'LIEN AGAINST FD' ||
        s.securityType === 'LIEN AGAINST DEBENTURE').length  > 0) {
      this.fixedDeposit = true;
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section7-security-clause',
  templateUrl: './section7-security-clause.component.html',
  styleUrls: ['./section7-security-clause.component.scss']
})
export class Section7SecurityClauseComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc;
  form: FormGroup;
  loanHolderInfo;
  mortgageType1;
  fixedDeposit: boolean;
  tempData;
  isGharJaggaVisible: boolean;
  isSamanMojdatVisible: boolean;
  isReceivableVisible: boolean;
  freeInformation;
  isFinancing = false;

  constructor(private formbuilder: FormBuilder) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(this.cadOfferLetterApprovedDoc.loanHolder.nepData);
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      this.isFinancing = this.tempData.smeGlobalForm.arFinancing;
      this.fillForm();
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

  buildForm() {
    this.form = this.formbuilder.group({
      nameOfBranch: [undefined],
      yearlyText: [undefined],
    });
  }

  fillForm() {
    this.form.patchValue({
      nameOfBranch: this.loanHolderInfo.branch ? this.loanHolderInfo.branch.ct : '',
      yearlyText: !ObjectUtil.isEmpty(this.freeInformation) ? this.freeInformation.section7 : 'मासिक/त्रैमासिक',
    });
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-section4-security-collateral',
  templateUrl: './section4-security-collateral.component.html',
  styleUrls: ['./section4-security-collateral.component.scss']
})
export class Section4SecurityCollateralComponent implements OnInit {
  @Input() cadData;
  form: FormGroup;
  section4Data;
  isLandAndBuilding: boolean;
  isAutoLoan: boolean;
  primaryCollateral: Array<any> = new Array<any>();
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.cadData) && !ObjectUtil.isEmpty(this.cadData.offerDocumentList)) {
      this.section4Data = JSON.parse(this.cadData.offerDocumentList[0].initialInformation);
    }
    this.buildForm();
    this.checkCondition();
  }

  checkCondition() {
    this.section4Data.securities.primarySecurity.forEach(val => {
      if (val.securityType === 'LAND_AND_BUILDING' || val.securityType === 'LAND') {
        this.isLandAndBuilding = true;
        this.primaryCollateral.push(val);
      }if (val.securityType === 'AUTO LOAN') {
        this.isAutoLoan = true;
      }
    });
  }

  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfClient: [undefined],
      tenureOfFixedDeposit: [undefined],
      fixedDepositHolderName: [undefined],
      amountOfDeposit: [undefined],
      amountOfDepositInWords: [undefined],
      expiryDate: [undefined],
      receiptNum: [undefined],
      nameOfGuarantor: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined]
    });
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../../model/customerApprovedLoanCadDocumentation';
import {ObjectUtil} from '../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {Editor} from '../../../../../../../../@core/utils/constants/editor';
import {TableMaker} from '../../../../../../../../@core/utils/constants/tableMaker';
import {NepaliToEngNumberPipe} from '../../../../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
  selector: 'app-section3-security-and-collateral',
  templateUrl: './section3-security-and-collateral.component.html',
  styleUrls: ['./section3-security-and-collateral.component.scss']
})
export class Section3SecurityAndCollateralComponent implements OnInit {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  form: FormGroup;
  tempData: any;
  securityDetails: any;
  securityTypeCondition = false;
  collateralShareCondition = false;
  securityTypeHypothecationCondition = false;
  securityTypeLienCondition = false;
  hypoPurposeTrading = false;
  hypoPurposeManufacturing = false;
  assignment = false;
  assignmentNew = false;
  paripassuNew = false;
  paripassu = false;
  vehicleRegister = false;
  vehicleRegisterNew = false;
  generalCounter = false;
  generalCounterNew = false;
  securityTypeSecondaryCondition = false;
  collateralShareSecondaryCondition = false;
  securityTypeSecondaryPersonalCondition = false;
  personalGuaranteeToBeUsedSecondary = false;
  securityTypeSecondaryCorporateCondition =  false;
  corporateGuaranteeSecondary = false;
  securityTypeSecondaryCrossCondition = false;
  crossGuaranteeSecondary = false;
  securityTypeSecondarySharePledgeCondition = false;
  sharePledgeSecondary = false;
  fdLoop;
  depositLoop;
  debentureLoop;
  primaryNewMortgage = false;
  primaryExistingMortgage = false;
  primaryEnhancementMortgage = false;
  tempLandBuilding;
  tempCollateral;
  tempParipassu;
  guarantorData;
  tempSecondaryLandBuilding;
  tempSecondaryCollateral;
  secondaryNewMortgage = false;
  secondaryExistingMortgage = false;
  secondaryEnhancementMortgage = false;
  guarantorNames: Array<any> = new Array<any>();
  allguarantorNames;
  finalPersonalName;
  finalCorporateName;
  finalCrossName;
  personalGuarantorsName: Array<any> = new Array<any>();
  corporateGuarantorsName: Array<any> = new Array<any>();
  crossGuarantorsName: Array<any> = new Array<any>();
  guarantorParsed: Array<any> = new Array<any>();
  tempPersonalGuarantors;
  tempCorporateGuarantors;
  tempCrossguarantors;
  temp2;
  ckEditorConfig = TableMaker.CK_CONFIG;
  freeTextVal;
  table;
  freeInformation;
  primarySecurityFreeTable: any;
  secondarySecurityFreeTable: any;

  constructor(private formBuilder: FormBuilder,
              public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.securityDetails = this.tempData.securities;
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.freeInformation = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
      const tempFree = '<table border="1" cellpadding="1" cellspacing="1" style="width:100%"><tbody>' +
          '<tr><td colspan="1" rowspan="2" style="text-align:center">' +
          '<strong>घर/जग्गा धनीको नाम थर</strong></td><td colspan="3" rowspan="1" style="text-align:center">' +
          '<strong>घर/जग्गाको अवस्थिति</strong></td><td colspan="1" rowspan="2" style="text-align:center">' +
          '<strong>सिट नं.</strong></td><td colspan="1" rowspan="2" style="text-align:center">' +
          '<strong>कित्ता नं.</strong></td><td colspan="1" rowspan="2" style="text-align:center">' +
          '<strong>क्षेत्रफल</strong></td></tr><tr><td style="text-align:center">' +
          '<strong>जिल्ला</strong></td><td style="text-align:center"><strong>नगर/गा.वि.स.</strong></td>' +
          '<td style="text-align:center"><strong>वडा नं.</strong></td></tr><tr>' +
          '<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>' +
          '<td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>' +
          '&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>' +
          '<td>&nbsp;</td></tr></tbody></table><p>&nbsp;</p>';
      this.primarySecurityFreeTable = this.secondarySecurityFreeTable = tempFree;
      if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation)) {
        this.freeTextVal = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation);
        this.form.get('freeText2').patchValue(this.freeTextVal.section3.freeText2);
        this.form.get('freeText5').patchValue(this.freeTextVal.section3.freeText5);
        this.table = this.freeTextVal.section3.freeTable;
        if (this.freeTextVal.section3.primarySecurityFreeTable !== '') {
          this.primarySecurityFreeTable = this.freeTextVal.section3.primarySecurityFreeTable;
        }
        if (this.freeTextVal.section3.secondarySecurityFreeTable !== '') {
          this.secondarySecurityFreeTable = this.freeTextVal.section3.secondarySecurityFreeTable;
        }
      }
      this.fillForm();
      this.guarantorData.forEach(any => {
        this.guarantorParsed.push(JSON.parse(any.nepData));
      });
      this.guarantorDetails();
    }
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
    this.checkLienLoop();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      textField: [undefined],
      otherBorrowingClientName: [undefined],
      nameOfMemberBank: [undefined],
      freeBankName: [undefined],
      fdAmountInFigure: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInWords: [undefined],
      crossGuarantorName: [undefined],
      corporateGuarantorName: [undefined],
      guarantorName: [undefined],
      otherBankName: [undefined],
      nameOfAccoutHolder: [undefined],
      freeAccountHolderName: [undefined],
      depositAccountNumber: [undefined],
      depositAmountInFigure: [undefined],
      customerName: [undefined],
      freeCustomerName: [undefined],
      fdHolderName: [undefined],
      debentureAmountInFigure: [undefined],
      freeText1: [undefined],
      freeText2: [undefined],
      freeText3: [undefined],
      freeText4: [undefined],
      freeText5: [undefined],
      otherBorrowingClientNameSecondary: [undefined],
      guarantorAmount: [undefined],
      guarantorAmountInWords: [undefined],
      personalGuarantorAmount: [undefined],
      personalGuarantorAmountInWords: [undefined],
      personalGuaranteeName: [undefined],
      freeTable: [undefined],
      primarySecurityFreeTable: [undefined],
      secondarySecurityFreeTable: [undefined]

    });
  }

  fillForm() {
    const guarantorAmount = this.guarantorParse(this.guarantorData[0].nepData, 'gurantedAmount');
    const guarantorName = this.nepaliCurrencyWordPipe.transform(this.guarantorParse(this.guarantorData[0].nepData, 'gurantedAmount', 'en'));
    this.form.patchValue({
      guarantorAmount: guarantorAmount,
      guarantorAmountInWords: guarantorName,
      textField: (!ObjectUtil.isEmpty(this.freeInformation) && !ObjectUtil.isEmpty(this.freeInformation.section3.textField)) ?
          this.freeInformation.section3.textField : 'थप/अतिरिक्त',
    });
  }

  checkPrimaryConditions() {
    this.tempLandBuilding = this.securityDetails.primarySecurity.filter(val =>
        val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
    this.tempCollateral = this.securityDetails.primarySecurity.filter(val =>
        val.collateralShareCT === 'YES');
    this.tempParipassu = this.securityDetails.primarySecurity.filter(val =>
        val.paripassuContentsCT !== null);
    if (this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach(i => {
        if (i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
          this.securityTypeCondition = true;
          this.checkMortgage(i);
        }
        if (i.collateralShareCT === 'YES') {
          this.collateralShareCondition = true;
        }
        if (i.securityTypeCT === 'HYPOTHECATION') {
          this.securityTypeHypothecationCondition = true;
        }
        if (i.hypothecationPurposeCT === 'For Trading Unit') {
          this.hypoPurposeTrading = true;
        }
        if (i.hypothecationPurposeCT === 'For Manufacturing Case') {
          this.hypoPurposeManufacturing = true;
        }
        if (i.assignmentToBeUsedCT !== null) {
          this.assignment = true;
          if (i.assignmentToBeUsedCT === 'NEW') {
            this.assignmentNew = true;
          }
        }
        if (i.paripassuContentsCT !== null) {
          this.paripassu = true;
          if (i.paripassuContentsCT === 'NEW') {
            this.paripassuNew = true;
          }
        }
        if (i.securityTypeCT === 'LIEN AGAINST FD' || i.securityTypeCT === 'LIEN AGAINST DEPOSIT ACCOUNT' || i.securityTypeCT === 'LIEN AGAINST DEBENTURE') {
          this.securityTypeLienCondition = true;
        }
        if (i.vehicleRegistrationCT !== null) {
          this.vehicleRegister = true;
          if (i.vehicleRegistrationCT === 'NEW') {
            this.vehicleRegisterNew = true;
          }
        }
        if (i.generalCounterGuaranteeCT !== null) {
          this.generalCounter = true;
          if (i.generalCounterGuaranteeCT === 'NEW') {
            this.generalCounterNew = true;
          }
        }
      });
    }
  }

  checkSecondaryConditions() {
    this.tempSecondaryLandBuilding = this.securityDetails.secondarySecurity.filter(val =>
        val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
    this.tempSecondaryCollateral = this.securityDetails.secondarySecurity.filter(val =>
        val.collateralShareCT === 'YES');
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach(i => {
        if (i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
          this.securityTypeSecondaryCondition = true;
          {
            this.checkSecondaryMortgage(i);
          }        }
        if (i.collateralShareCT === 'YES') {
          this.collateralShareSecondaryCondition = true;
        }
        if (i.securityTypeCT === 'PERSONAL_GUARANTEE') {
          this.securityTypeSecondaryPersonalCondition = true;
        }
        if (i.personalGuaranteeToBeUsedCT !== null) {
          if (i.personalGuaranteeToBeUsedCT === 'NEW') {
            this.personalGuaranteeToBeUsedSecondary = true;
          }
        }
        if (i.securityTypeCT === 'CORPORATE_GUARANTEE') {
          this.securityTypeSecondaryCorporateCondition = true;
        }
        if (i.corporateGuaranteeCT !== null) {
          if (i.corporateGuaranteeCT === 'NEW') {
            this.corporateGuaranteeSecondary = true;
          }
        }
        if (i.securityTypeCT === 'CROSS_GUARANTEE') {
          this.securityTypeSecondaryCrossCondition = true;
        }
        if (i.crossGuaranteeCT !== null) {
          if (i.crossGuaranteeCT === 'NEW') {
            this.crossGuaranteeSecondary = true;
          }
        }
        if (i.securityTypeCT === 'SHARE_PLEDGE') {
          this.securityTypeSecondarySharePledgeCondition = true;
        }
        if (i.sharePledgeToBeUsedCT !== null) {
          if (i.sharePledgeToBeUsedCT === 'NEW') {
            this.sharePledgeSecondary = true;
          }
        }
      });
    }
  }

  checkLienLoop() {
    this.fdLoop = this.securityDetails.primarySecurity.filter(i =>
        i.securityTypeCT === 'LIEN AGAINST FD'
    );
    this.depositLoop = this.securityDetails.primarySecurity.filter(i =>
        i.securityTypeCT === 'LIEN AGAINST DEPOSIT ACCOUNT'
    );
    this.debentureLoop = this.securityDetails.primarySecurity.filter(i =>
        i.securityTypeCT === 'LIEN AGAINST DEBENTURE'
    );
  }

  checkMortgage(any) {
    if (any.mortgageType === 'New') {
      this.primaryNewMortgage = true;
    }
    if (any.mortgageType === 'Existing') {
      this.primaryExistingMortgage = true;
    }
    if (any.mortgageType === 'Enhancement') {
      this.primaryEnhancementMortgage = true;
    }
  }

  checkSecondaryMortgage(any) {
    if (any.mortgageType === 'New') {
      this.secondaryNewMortgage = true;
    }
    if (any.mortgageType === 'Existing') {
      this.secondaryExistingMortgage = true;
    }
    if (any.mortgageType === 'Enhancement') {
      this.secondaryEnhancementMortgage = true;
    }
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    try {
      if (ObjectUtil.isEmpty(trans)) {
        return data[key].ct;
      } else {
        return data[key].en;
      }
    } catch (exp) {
      console.log(exp);
    }
  }

  guarantorDetails() {
    this.tempPersonalGuarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Personal Guarantor');
    this.tempCorporateGuarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Corporate Guarantor');
    this.tempCrossguarantors = this.guarantorParsed.filter(val =>
        val.guarantorType.en === 'Cross Guarantor');
    this.tempCorporateGuarantors.forEach(i => {
      this.corporateGuarantorsName.push(i.guaranteeProviderName ? i.guaranteeProviderName.ct : '');
    });
    this.tempCrossguarantors.forEach(i => {
      this.crossGuarantorsName.push(i.guaranteeProviderName ? i.guaranteeProviderName.ct : '');
    });
  }

  commonGuarantorDetails(guarantorName, finalName) {
    if (guarantorName.length === 1) {
      finalName = guarantorName[0];
    }
    if (guarantorName.length === 2) {
      finalName = guarantorName.join(' र ');
    }
    if (guarantorName.length > 2) {
      for (let i = 0; i < guarantorName.length - 1; i++) {
        this.temp2 = guarantorName.join(' , ');
      }
      const temp1 = guarantorName[guarantorName.length - 1];
      finalName = this.temp2 + ' र ' + temp1;
    }
    return finalName ? finalName : '';
  }

}

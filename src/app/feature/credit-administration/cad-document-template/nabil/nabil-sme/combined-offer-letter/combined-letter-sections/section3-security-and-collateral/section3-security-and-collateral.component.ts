import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {CustomerApprovedLoanCadDocumentation} from "../../../../../../model/customerApprovedLoanCadDocumentation";
import {ObjectUtil} from "../../../../../../../../@core/utils/ObjectUtil";

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


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.tempData = JSON.parse(this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation);
      this.securityDetails = this.tempData.securities;
      this.guarantorData = this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
      this.fillForm();
    }
    console.log('Guarantor Data:', this.guarantorData);
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
    this.checkLienLoop();
  }

  buildForm() {
    this.form = this.formBuilder.group({
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
    })
  }

  fillForm() {
    console.log('tempData: ', this.tempData);
    this.form.patchValue({
      crossGuarantorName: this.securityDetails.secondarySecurity.crossGuaranteeCT,
      corporateGuarantorName: this.securityDetails.secondarySecurity.corporateGuaranteeCT,
    });
  }

  checkPrimaryConditions() {
    this.tempLandBuilding = this.securityDetails.primarySecurity.filter(val =>
        val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');
    console.log('Temp Land and Building', this.tempLandBuilding);
    this.tempCollateral = this.securityDetails.primarySecurity.filter(val =>
        val.collateralShareCT === 'YES');
    this.tempParipassu = this.securityDetails.primarySecurity.filter(val =>
        val.paripassuContentsCT !== null);
    if(this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach(i => {
        if(i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
          this.securityTypeCondition = true;
          this.checkMortgage(i);
        }
        if(i.collateralShareCT === 'YES') {
          this.collateralShareCondition = true;
        }
        if(i.securityTypeCT === 'HYPOTHECATION') {
          this.securityTypeHypothecationCondition = true;
        }
        if(i.hypothecationPurposeCT === 'For Trading Unit') {
          this.hypoPurposeTrading = true;
        }
        if(i.hypothecationPurposeCT === 'For Manufacturing Case') {
          this.hypoPurposeManufacturing = true;
        }
        if(i.assignmentToBeUsedCT !== null) {
          this.assignment = true;
          if(i.assignmentToBeUsedCT === 'NEW') {
            this.assignmentNew = true;
          }
        }
        if(i.paripassuContentsCT !== null) {
          this.paripassu = true;
          if(i.paripassuContentsCT === 'NEW') {
            this.paripassuNew = true;
          }
        }
        if(i.securityTypeCT === 'LIEN AGAINST FD' || i.securityTypeCT === 'LIEN AGAINST DEPOSIT ACCOUNT' || i.securityTypeCT === 'LIEN AGAINST DEBENTURE') {
          this.securityTypeLienCondition = true;
        }
        if(i.vehicleRegistrationCT !== null) {
          this.vehicleRegister = true;
          if(i.vehicleRegistrationCT === 'NEW') {
            this.vehicleRegisterNew = true;
          }
        }
        if(i.generalCounterGuaranteeCT !== null) {
          this.generalCounter = true;
          if(i.generalCounterGuaranteeCT === 'NEW') {
            this.generalCounterNew = true;
          }
        }
      });
    }
  }

  checkSecondaryConditions() {
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach(i => {
        if(i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
          this.securityTypeSecondaryCondition = true;
        }
        if(i.collateralShareCT === 'YES') {
          this.collateralShareSecondaryCondition = true;
        }
        if(i.securityTypeCT === 'PERSONAL_GUARANTEE') {
          this.securityTypeSecondaryPersonalCondition = true;
        }
        if(i.personalGuaranteeToBeUsedCT !== null) {
          if(i.personalGuaranteeToBeUsedCT === 'NEW') {
            this.personalGuaranteeToBeUsedSecondary = true;
          }
        }
        if(i.securityTypeCT === 'CORPORATE_GUARANTEE') {
          this.securityTypeSecondaryCorporateCondition = true;
        }
        if(i.corporateGuaranteeCT !== null) {
          if(i.corporateGuaranteeCT === 'NEW') {
            this.corporateGuaranteeSecondary = true;
          }
        }
        if(i.securityTypeCT === 'CROSS_GUARANTEE') {
          this.securityTypeSecondaryCrossCondition = true;
        }
        if(i.crossGuaranteeCT !== null) {
          if(i.crossGuaranteeCT === 'NEW') {
            this.crossGuaranteeSecondary = true;
          }
        }
        if(i.securityTypeCT === 'SHARE_PLEDGE') {
          this.securityTypeSecondarySharePledgeCondition = true;
        }
        if(i.sharePledgeToBeUsedCT !== null) {
          if(i.sharePledgeToBeUsedCT === 'NEW') {
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
    console.log('Check Mortgage:', any);
    if(any.mortgageType === 'New') {
      this.primaryNewMortgage = true;
    }
    if(any.mortgageType === 'Existing') {
      this.primaryExistingMortgage = true;
    }
    if(any.mortgageType === 'Enhancement'){
      this.primaryEnhancementMortgage = true;
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

}

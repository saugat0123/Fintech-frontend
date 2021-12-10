import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-section3-security-and-collateral-print',
  templateUrl: './section3-security-and-collateral-print.component.html',
  styleUrls: ['./section3-security-and-collateral-print.component.scss']
})
export class Section3SecurityAndCollateralPrintComponent implements OnInit {
  @Input() letterData;
  @Input() customerApprovedDoc;
  @Input() freeText;
  securityDetails;
  securityTypeCondition = false;
  collateralShareCondition = false;
  securityTypeHypothecationCondition = false;
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

  constructor() { }

  ngOnInit() {
    this.securityDetails = this.letterData.securities;
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
  }

  checkPrimaryConditions() {
    if(this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach(i => {
        if(i.securityTypeCT === 'LAND' || i.securityTypeCT === 'LAND_AND_BUILDING') {
          this.securityTypeCondition = true;
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

}

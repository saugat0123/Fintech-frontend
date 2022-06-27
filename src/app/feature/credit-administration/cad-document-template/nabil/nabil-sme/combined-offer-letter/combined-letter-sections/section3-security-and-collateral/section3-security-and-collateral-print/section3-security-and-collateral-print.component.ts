import { Component, Input, OnInit } from "@angular/core";
import { NepaliCurrencyWordPipe } from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import { ObjectUtil } from "../../../../../../../../../@core/utils/ObjectUtil";

@Component({
  selector: "app-section3-security-and-collateral-print",
  templateUrl: "./section3-security-and-collateral-print.component.html",
  styleUrls: ["./section3-security-and-collateral-print.component.scss"],
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
  securityTypeSecondaryCorporateCondition = false;
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
  guarantorAmount;
  guarantorAmountWords;
  securityTypeLienCondition = false;
  free;
  table;
  primarySecurityFreeTable: any;
  secondarySecurityFreeTable: any;

  constructor(public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) {}

  ngOnInit() {
    this.securityDetails = this.letterData.securities;
    this.guarantorData =
      this.customerApprovedDoc.assignedLoan[0].taggedGuarantors;
    this.free = JSON.parse(
      this.customerApprovedDoc.offerDocumentList[0].supportedInformation
    );
    if (this.free !== null) {
      this.table = this.free.section3 ? this.free.section3.freeTable : '';
      this.primarySecurityFreeTable = (this.free.section3 && this.free.section3.primarySecurityFreeTable !== '') ?
          this.free.section3.primarySecurityFreeTable : '';
      this.secondarySecurityFreeTable = (this.free.section3 && this.free.section3.secondarySecurityFreeTable !== '') ?
          this.free.section3.secondarySecurityFreeTable : '';
    }
    this.guarantorData.forEach((any) => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
    this.guarantorAmount = this.guarantorParse(
      this.guarantorData[0].nepData,
      "gurantedAmount"
    );
    this.guarantorAmountWords = this.nepaliCurrencyWordPipe.transform(
      this.guarantorParse(this.guarantorData[0].nepData, "gurantedAmount", "en")
    );
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
    this.checkLienLoop();
    this.guarantorDetails();
  }

  checkPrimaryConditions() {
    this.tempLandBuilding = this.securityDetails.primarySecurity.filter(
      (val) =>
        val.securityTypeCT === "LAND" ||
        val.securityTypeCT === "LAND_AND_BUILDING"
    );
    this.tempCollateral = this.securityDetails.primarySecurity.filter(
      (val) => val.collateralShareCT === "YES"
    );
    this.tempParipassu = this.securityDetails.primarySecurity.filter(
      (val) => val.paripassuContentsCT !== null
    );
    if (this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach((i) => {
        if (
          i.securityTypeCT === "LAND" ||
          i.securityTypeCT === "LAND_AND_BUILDING"
        ) {
          this.securityTypeCondition = true;
          this.checkMortgage(i);
        }
        if (i.collateralShareCT === "YES") {
          this.collateralShareCondition = true;
        }
        if (i.securityTypeCT === "HYPOTHECATION") {
          this.securityTypeHypothecationCondition = true;
        }
        if (i.hypothecationPurposeCT === "For Trading Unit") {
          this.hypoPurposeTrading = true;
        }
        if (i.hypothecationPurposeCT === "For Manufacturing Case") {
          this.hypoPurposeManufacturing = true;
        }
        if (i.assignmentToBeUsedCT !== null) {
          this.assignment = true;
          if (i.assignmentToBeUsedCT === "NEW") {
            this.assignmentNew = true;
          }
        }
        if (i.paripassuContentsCT !== null) {
          this.paripassu = true;
          if (i.paripassuContentsCT === "NEW") {
            this.paripassuNew = true;
          }
        }
        if (
          i.securityTypeCT === "LIEN AGAINST FD" ||
          i.securityTypeCT === "LIEN AGAINST DEPOSIT ACCOUNT" ||
          i.securityTypeCT === "LIEN AGAINST DEBENTURE"
        ) {
          this.securityTypeLienCondition = true;
        }
        if (i.vehicleRegistrationCT !== null) {
          this.vehicleRegister = true;
          if (i.vehicleRegistrationCT === "NEW") {
            this.vehicleRegisterNew = true;
          }
        }
        if (i.generalCounterGuaranteeCT !== null) {
          this.generalCounter = true;
          if (i.generalCounterGuaranteeCT === "NEW") {
            this.generalCounterNew = true;
          }
        }
      });
    }
  }

  checkSecondaryConditions() {
    this.tempSecondaryLandBuilding =
      this.securityDetails.secondarySecurity.filter(
        (val) =>
          val.securityTypeCT === "LAND" ||
          val.securityTypeCT === "LAND_AND_BUILDING"
      );
    this.tempSecondaryCollateral =
      this.securityDetails.secondarySecurity.filter(
        (val) => val.collateralShareCT === "YES"
      );
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach((i) => {
        if (
          i.securityTypeCT === "LAND" ||
          i.securityTypeCT === "LAND_AND_BUILDING"
        ) {
          this.securityTypeSecondaryCondition = true;
          this.checkSecondaryMortgage(i);
        }
        if (i.collateralShareCT === "YES") {
          this.collateralShareSecondaryCondition = true;
        }
        if (i.securityTypeCT === "PERSONAL_GUARANTEE") {
          this.securityTypeSecondaryPersonalCondition = true;
        }
        if (i.personalGuaranteeToBeUsedCT !== null) {
          if (i.personalGuaranteeToBeUsedCT === "NEW") {
            this.personalGuaranteeToBeUsedSecondary = true;
          }
        }
        if (i.securityTypeCT === "CORPORATE_GUARANTEE") {
          this.securityTypeSecondaryCorporateCondition = true;
        }
        if (i.corporateGuaranteeCT !== null) {
          if (i.corporateGuaranteeCT === "NEW") {
            this.corporateGuaranteeSecondary = true;
          }
        }
        if (i.securityTypeCT === "CROSS_GUARANTEE") {
          this.securityTypeSecondaryCrossCondition = true;
        }
        if (i.crossGuaranteeCT !== null) {
          if (i.crossGuaranteeCT === "NEW") {
            this.crossGuaranteeSecondary = true;
          }
        }
        if (i.securityTypeCT === "SHARE_PLEDGE") {
          this.securityTypeSecondarySharePledgeCondition = true;
        }
        if (i.sharePledgeToBeUsedCT !== null) {
          if (i.sharePledgeToBeUsedCT === "NEW") {
            this.sharePledgeSecondary = true;
          }
        }
      });
    }
  }

  checkLienLoop() {
    this.fdLoop = this.securityDetails.primarySecurity.filter(
      (i) => i.securityTypeCT === "LIEN AGAINST FD"
    );
    this.depositLoop = this.securityDetails.primarySecurity.filter(
      (i) => i.securityTypeCT === "LIEN AGAINST DEPOSIT ACCOUNT"
    );
    this.debentureLoop = this.securityDetails.primarySecurity.filter(
      (i) => i.securityTypeCT === "LIEN AGAINST DEBENTURE"
    );
  }

  checkMortgage(any) {
    if (any.mortgageType === "New") {
      this.primaryNewMortgage = true;
    }
    if (any.mortgageType === "Existing") {
      this.primaryExistingMortgage = true;
    }
    if (any.mortgageType === "Enhancement") {
      this.primaryEnhancementMortgage = true;
    }
  }

  checkSecondaryMortgage(any) {
    if (any.mortgageType === "New") {
      this.secondaryNewMortgage = true;
    }
    if (any.mortgageType === "Existing") {
      this.secondaryExistingMortgage = true;
    }
    if (any.mortgageType === "Enhancement") {
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
    this.tempPersonalGuarantors = this.guarantorParsed.filter(
      (val) => val.guarantorType.en === "Personal Guarantor"
    );
    this.tempCorporateGuarantors = this.guarantorParsed.filter(
      (val) => val.guarantorType.en === "Corporate Guarantor"
    );
    this.tempCrossguarantors = this.guarantorParsed.filter(
      (val) => val.guarantorType.en === "Cross Guarantor"
    );
    this.personalGuarantorDetails();
    this.tempCorporateGuarantors.forEach((i) => {
      this.corporateGuarantorsName.push(
        i.guaranteeProviderName ? i.guaranteeProviderName.ct : ""
      );
    });
    this.tempCrossguarantors.forEach((i) => {
      this.crossGuarantorsName.push(
        i.guaranteeProviderName ? i.guaranteeProviderName.ct : ""
      );
    });
  }

  personalGuarantorDetails() {
    let rel: String = "";
    this.tempPersonalGuarantors.forEach((i) => {
      if (i.gender.en === "FEMALE" && i.relationMedium.en === "0") {
        rel = "श्रीमती";
      }
      if (i.gender.en === "FEMALE" && i.relationMedium.en === "1") {
        rel = "सुश्री";
      }
      if (i.gender.en === "MALE") {
        rel = "श्रीमान्";
      }
      if (!ObjectUtil.isEmpty(i.guarantorName)) {
        this.personalGuarantorsName.push(rel + " " + i.guarantorName.ct);
      }
    });
  }

  commonGuarantorDetails(guarantorName, finalName) {
    if (guarantorName.length === 1) {
      finalName = guarantorName[0];
    }
    if (guarantorName.length === 2) {
      finalName = guarantorName.join(" र ");
    }
    if (guarantorName.length > 2) {
      for (let i = 0; i < guarantorName.length - 1; i++) {
        this.temp2 = guarantorName.join(" , ");
      }
      const temp1 = guarantorName[guarantorName.length - 1];
      finalName = this.temp2 + " र " + temp1;
    }
    return finalName ? finalName : "";
  }
}

import {
  Component,
  Input,
  OnInit,
  AfterViewChecked,
  ChangeDetectorRef,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NabilOfferLetterConst } from "../../../../nabil-offer-letter-const";
import { NbDialogRef } from "@nebular/theme";
import { CustomerApprovedLoanCadDocumentation } from "../../../../model/customerApprovedLoanCadDocumentation";
import { NepaliNumberAndWords } from "../../../../model/nepaliNumberAndWords";
import { ObjectUtil } from "../../../../../../@core/utils/ObjectUtil";
import { CreditAdministrationService } from "../../../../service/credit-administration.service";
import { OfferDocument } from "../../../../model/OfferDocument";
import { Alert, AlertType } from "../../../../../../@theme/model/Alert";
import { ToastService } from "../../../../../../@core/utils";
import { RouterUtilsService } from "../../../../utils/router-utils.service";
import { NepaliCurrencyWordPipe } from "../../../../../../@core/pipe/nepali-currency-word.pipe";
import { CustomerSubType } from "../../../../../customer/model/customerSubType";
import { CustomerType } from "../../../../../customer/model/customerType";

@Component({
  selector: "app-ddsl-without-subsidy",
  templateUrl: "./ddsl-without-subsidy.component.html",
  styleUrls: ["./ddsl-without-subsidy.component.scss"],
})
export class DdslWithoutSubsidyComponent implements OnInit, AfterViewChecked {
  @Input() cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  @Input() preview;
  @Input() letter: any;
  @Input() renewal: any;
  @Input() loanLimit;
  form: FormGroup;
  offerLetterConst = NabilOfferLetterConst;
  offerLetterDocument: OfferDocument;
  initialInfoPrint;
  spinner = false;
  afterSave = false;
  existingOfferLetter = false;
  selectedSecurity;
  position1 = ";Dks{ clws[t";
  position2 = "zfvf k|aGws÷al/i7 ;Dks{ k|aGws";
  offerLetterData;
  nepaliNumber = new NepaliNumberAndWords();
  nepaliAmount = [];
  loanHolderInfo;
  loanOptions;
  mortgageOptions;
  tempData;
  securityDetails: any;
  customerType;
  guarantorData;
  guarantorNames: Array<any> = new Array<any>();
  allguarantorNames;
  finalName;
  offerDocumentDetails;
  freeTextVal: any = {};
  freeInformation: any;
  customerSubType = CustomerSubType;
  personalGuarantorsName: Array<any> = new Array<any>();
  guarantorParsed: Array<any> = new Array<any>();
  tempPersonalGuarantors;
  temp2;
  finalPersonalName;
  tempLandBuilding;
  securityTypeCondition = false;
  securityTypeHypothecation = false;
  securityTypeConditionFixedAssests = false;
  securityTypeConditionStock = false;
  securityTypeConditionAssestsPlants = false;
  securityTypeConditionDocuments = false;
  tempSecondaryLandBuilding;
  securityTypeSecondaryCondition = false;
  securityTypeSecondaryConditionFixedAssests = false;
  securityTypeSecondaryConditionStock = false;
  securityTypeSecondaryConditionAssestsPlants = false;
  securityTypeSecondaryConditionDocuments = false;
  securityTypeConditionLandAndBuilding = false;
  securityTypeConditionLandAndBuildingSecondary = false;
  kittaNumbers: Array<any> = new Array<any>();
  plotNumber;
  promissoryVisible: boolean;
  boardVisible: boolean;
  loanDeedVisible: boolean;
  mortgagedVisible: boolean;
  continuityVisible: boolean;
  supplementaryVisible: boolean;
  attorneyVisible: boolean;
  multiVisible: boolean;
  guaranteeVisible: boolean;
  wealthVisible: boolean;
  bankersClause1: boolean;
  bankersClause2: boolean;
  insuranceDeclarationVisible: boolean;
  undertakingLetterVisible: boolean;
  declarationVisible: boolean;
  leaseVisible: boolean;
  consentLetterVisible: boolean;
  buildingVisible: boolean;
  hirePurchaseVisible: boolean;
  comprehensiveVisible: boolean;
  thirdPartyVisible: boolean;
  blueBook: boolean;
  loanSubordinationAgreement: boolean;
  pariPasu: boolean;
  partnershipDeed: boolean;
  letterSetOff: boolean;
  securityTypeConditionPg = false;
  client = CustomerType;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: NbDialogRef<DdslWithoutSubsidyComponent>,
    private administrationService: CreditAdministrationService,
    private toastService: ToastService,
    private routerUtilsService: RouterUtilsService,
    public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}
  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }
  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc)) {
      this.loanHolderInfo = JSON.parse(
        this.cadOfferLetterApprovedDoc.loanHolder.nepData
      );
      this.tempData = JSON.parse(
        this.cadOfferLetterApprovedDoc.offerDocumentList[0].initialInformation
      );
      this.requiredDocument();
      this.securityDetails = this.tempData.securities;
    }
    this.loanOptions = this.tempData.loanOption.ct;
    this.selectedSecurity = this.tempData.securityType.ct;
    this.customerType = this.loanHolderInfo.clientType.en;
    this.mortgageOptions = this.tempData.mortgageType.ct;
    this.guarantorData =
      this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors;
    // console.log('Guarantors Details', this.cadOfferLetterApprovedDoc.assignedLoan[0].taggedGuarantors);
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.offerDocumentList)) {
      this.offerDocumentDetails = this.cadOfferLetterApprovedDoc
        .offerDocumentList[0]
        ? JSON.parse(
            this.cadOfferLetterApprovedDoc.offerDocumentList[0]
              .initialInformation
          )
        : "";
    }
    this.guarantorData.forEach((any) => {
      this.guarantorParsed.push(JSON.parse(any.nepData));
    });
    this.guarantorDetails();
    this.checkOfferLetterData();
    this.checkPrimaryConditions();
    this.checkSecondaryConditions();
    const securities = this.tempData.securities;
    securities.primarySecurity.forEach((pd) => {
      pd.propertyDetails.forEach((p) => {
        if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
          this.kittaNumbers.push(p.securityOwnersKittaNoCT);
        }
      });
    });
    securities.secondarySecurity.forEach((pd) => {
      pd.propertyDetails.forEach((p) => {
        if (!ObjectUtil.isEmpty(p.securityOwnersKittaNoCT)) {
          this.kittaNumbers.push(p.securityOwnersKittaNoCT);
        }
      });
    });
  }
  getKittaNumbers(plotNumber, kittaNumbers) {
    if (plotNumber.length === 1) {
      kittaNumbers = plotNumber[0];
    }
    if (plotNumber.length === 2) {
      kittaNumbers = plotNumber.join(" र ");
    }
    if (plotNumber.length > 2) {
      for (let i = 0; i < plotNumber.length - 1; i++) {
        this.temp2 = plotNumber.join(" , ");
      }
      const temp1 = plotNumber[plotNumber.length - 1];
      kittaNumbers = this.temp2 + " र " + temp1;
    }
    return kittaNumbers ? kittaNumbers : "";
  }

  buildForm() {
    return (this.form = this.formBuilder.group({
      referenceNo: [undefined],
      selectedSecurity: [undefined],
      loanOptions: [undefined],
      mortgageOptions: [undefined],
      freeTextVal: [undefined],
      sanctionLetterDate: [undefined],
      borrowersName: [undefined],
      borrowerAddress: [undefined],
      customerLoanApplicationDate: [undefined],
      previousSanctionLetterDate: [undefined],
      requestLetterDate: [undefined],
      karjaPurpose: [undefined],
      loanAmount: [undefined],
      loanAmountInWord: [undefined],
      marginInPercentageFoot: [undefined],
      marginInPercentageMotor: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      totalInterestRate: [undefined],
      EMIAmount: [undefined],
      EMIAmountInWord: [undefined],
      totalNoOfInstallment: [undefined],
      nameOfFacility: [undefined],
      serviceCharge: [undefined],
      totalTenureOfLoan: [undefined],
      approvedCFRLoanAmount: [undefined],
      approvedCFRLoanAmountInWord: [undefined],
      approvedCFRPersonalGuarantor: [undefined],
      totalLimit: [undefined],
      totalLimitInWord: [undefined],
      nameOfBranch: [undefined],
      extraFinancialClause: [undefined],
      additionalOtherClause: [undefined],
      plotNumber: [undefined],
      personalGuaranteeAmount: [undefined],
      nameOfPersonalGuarantor: [undefined],
      extraSecurityDocument: [undefined],
      nameOfARO: [undefined],
      position1: [undefined],
      nameOfBranchManager: [undefined],
      position2: [undefined],
      extraTermsAndConditionsNRB: [undefined],
      sanctionLetterAcceptedDate: [undefined],
      securities: this.formBuilder.array([]),
      loanType: [undefined],
      loanTypeEn: [undefined],
      loanAmountInFigure: [undefined],
      guarantorName: [undefined],
    }));
  }

  fillForm() {
    let customerAddress;
    if (this.customerType === this.client.INSTITUTION) {
      customerAddress =
        this.loanHolderInfo.registeredMunicipality.ct +
        "-" +
        this.loanHolderInfo.permanentWard.ct +
        ", " +
        this.loanHolderInfo.registeredDistrict.ct +
        ", " +
        this.loanHolderInfo.registeredProvince.ct;
    }
    if (this.customerType === this.client.INDIVIDUAL) {
      customerAddress =
        this.loanHolderInfo.permanentMunicipality.ct +
        "-" +
        this.loanHolderInfo.permanentWard.ct +
        ", " +
        this.loanHolderInfo.permanentDistrict.ct +
        ", " +
        this.loanHolderInfo.permanentProvince.ct;
    }
    let autoRefNumber;
    if (!ObjectUtil.isEmpty(this.cadOfferLetterApprovedDoc.assignedLoan)) {
      autoRefNumber = this.cadOfferLetterApprovedDoc.assignedLoan[0].refNo;
    }
    // Date of Application
    const dateOfApplication = this.tempData.dateOfApplicationType
      ? this.tempData.dateOfApplicationType.en
      : "";
    let finaldateOfApplication;
    if (dateOfApplication === "AD") {
      finaldateOfApplication = this.tempData.dateOfApplication
        ? this.tempData.dateOfApplication.ct
        : "";
    } else {
      finaldateOfApplication = this.tempData.dateOfApplicationNepali
        ? this.tempData.dateOfApplicationNepali.ct
        : "";
    }
    // Date of Approval
    const dateOfApproval = this.tempData.sanctionLetterDateType
      ? this.tempData.sanctionLetterDateType.en
      : "";
    let finaldateOfApproval;
    if (dateOfApproval === "AD") {
      finaldateOfApproval = this.tempData.sanctionLetterDate
        ? this.tempData.sanctionLetterDate.ct
        : "";
    } else {
      finaldateOfApproval = this.tempData.sanctionLetterDateNepali
        ? this.tempData.sanctionLetterDateNepali.ct
        : "";
    }
    // Previous Sanction Date
    const dateOfPreviousSanction = this.tempData.previousSanctionType
      ? this.tempData.previousSanctionType.en
      : "";
    let finalPreviousSanction;
    if (dateOfPreviousSanction === "AD") {
      finalPreviousSanction = this.tempData.previousSanctionDate
        ? this.tempData.previousSanctionDate.ct
        : "";
    } else {
      finalPreviousSanction = this.tempData.previousSanctionDateNepali
        ? this.tempData.previousSanctionDateNepali.ct
        : "";
    }
    this.form.patchValue({
      referenceNo: autoRefNumber ? autoRefNumber : "",
      borrowersName: this.loanHolderInfo.name
        ? this.loanHolderInfo.name.ct
        : "",
      borrowerAddress: customerAddress ? customerAddress : "",
      // customerLoanApplicationDate: finaldateOfApplication ? finaldateOfApplication : '',
      sanctionLetterDate: finaldateOfApproval ? finaldateOfApproval : "",
      previousSanctionLetterDate: finalPreviousSanction
        ? finalPreviousSanction
        : "",
      requestLetterDate: finaldateOfApplication ? finaldateOfApplication : "",
      karjaPurpose: this.tempData.purposeOfLoan
        ? this.tempData.purposeOfLoan.ct
        : "",
      loanType: this.tempData.loanSubType ? this.tempData.loanSubType.ct : "",
      loanTypeEn: this.tempData.loanSubType
        ? this.tempData.loanSubType.en.eData
        : "",
      loanAmount: this.tempData.loanAmountFigure
        ? this.tempData.loanAmountFigure.ct
        : "",
      loanAmountInWord: this.tempData.loanAmountFigureWords
        ? this.tempData.loanAmountFigureWords.ct
        : "",
      marginInPercentageMotor: this.tempData.marginInPercentageMotor
        ? this.tempData.marginInPercentageMotor.ct
        : "",
      marginInPercentageFoot: this.tempData.marginInPercentageFoot
        ? this.tempData.marginInPercentageFoot.ct
        : "",
      totalLimit: this.tempData.loanLimitAmountFigure
        ? this.tempData.loanLimitAmountFigure.ct
        : "",
      totalLimitInWord: this.tempData.loanLimitAmountFigureWords
        ? this.tempData.loanLimitAmountFigureWords.ct
        : "",
      baseRate: this.tempData.baseRate ? this.tempData.baseRate.ct : "",
      premiumRate: this.tempData.premiumRate
        ? this.tempData.premiumRate.ct
        : "",
      totalInterestRate: this.tempData.interestRate
        ? this.tempData.interestRate.ct
        : "",
      EMIAmount: this.tempData.EMIAmountFigure
        ? this.tempData.EMIAmountFigure.ct
        : "",
      EMIAmountInWord: this.tempData.EMIAmountWord
        ? this.tempData.EMIAmountWord.ct
        : "",
      totalNoOfInstallment: this.tempData.totalInstallmentFigure
        ? this.tempData.totalInstallmentFigure.ct
        : "",
      nameOfFacility: this.tempData.nameOfFacility
        ? this.tempData.nameOfFacility.ct
        : "",
      serviceCharge: this.tempData.serviceCharge
        ? this.tempData.serviceCharge.ct
        : "",
      totalTenureOfLoan: this.tempData.totalTenureOfLoan
        ? this.tempData.totalTenureOfLoan.ct
        : "",
      /*approvedCFRLoanAmount: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',
            approvedCFRLoanAmountInWord: this.tempData.loanAmountFigure ? this.tempData.loanAmountFigure.ct : '',*/
      nameOfBranch: this.loanHolderInfo.branch
        ? this.loanHolderInfo.branch.ct
        : "",
      nameOfARO: this.tempData.nameOfStaff ? this.tempData.nameOfStaff.ct : "",
      nameOfBranchManager: this.tempData.nameOfBranchManager
        ? this.tempData.nameOfBranchManager.ct
        : "",
      extraFinancialClause: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.firstText
        : "",
      additionalOtherClause: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.secondText
        : "",
      extraSecurityDocument: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.thirdText
        : "",
      extraTermsAndConditionsNRB: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.fourthText
        : "",
      position1: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.fifthText
        : this.position1,
      position2: !ObjectUtil.isEmpty(this.freeInformation)
        ? this.freeInformation.sixthText
        : this.position2,
      plotNumber: this.kittaNumbers ? this.kittaNumbers : "",
    });
  }

  checkPrimaryConditions() {
    /* this.tempLandBuilding = this.securityDetails.primarySecurity.filter(val =>
            val.securityTypeCT === 'LAND' || val.securityTypeCT === 'LAND_AND_BUILDING');*/
    if (this.securityDetails.primarySecurity.length > 0) {
      this.securityDetails.primarySecurity.forEach((i) => {
        if (
          i.securityTypeCT === "LAND" ||
          i.securityTypeCT === "LAND_AND_BUILDING"
        ) {
          this.securityTypeCondition = true;
        }
        if (i.securityTypeCT === "LAND_AND_BUILDING") {
          this.securityTypeConditionLandAndBuilding = true;
        }
      });
    }
    // if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'FIXED_ASSETS')) {
    //     this.securityTypeConditionFixedAssests = true;
    // }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityTypeCT === "HYPOTHECATION"
      )
    ) {
      this.securityTypeHypothecation = true;
      this.securityTypeConditionFixedAssests = true;
      this.securityTypeConditionStock = true;
      this.securityTypeConditionAssestsPlants = true;
    }
    // if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'STOCK')) {
    //     this.securityTypeConditionStock = true;
    // }
    // if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
    //     this.securityTypeConditionAssestsPlants = true;
    // }
    // if (this.securityDetails.primarySecurity.some(s => s.securityTypeCT === 'DOCUMENTS')) {
    //     this.securityTypeConditionDocuments = true;
    // }
    if (
      this.securityDetails.primarySecurity.some(
        (s) => s.securityTypeCT === "ASSIGNMENT"
      )
    ) {
      this.securityTypeConditionDocuments = true;
      this.securityTypeConditionDocuments = true;
    }
  }
  checkSecondaryConditions() {
    this.tempSecondaryLandBuilding =
      this.securityDetails.secondarySecurity.filter(
        (val) =>
          val.securityTypeCT === "LAND" ||
          val.securityTypeCT === "LAND_AND_BUILDING"
      );
    if (this.securityDetails.secondarySecurity.length > 0) {
      this.securityDetails.secondarySecurity.forEach((i) => {
        if (
          i.securityTypeCT === "LAND" ||
          i.securityTypeCT === "LAND_AND_BUILDING"
        ) {
          this.securityTypeSecondaryCondition = true;
        }
        if (i.securityTypeCT === "LAND_AND_BUILDING") {
          this.securityTypeConditionLandAndBuildingSecondary = true;
        }
      });
    }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityTypeCT === "HYPOTHECATION"
      )
    ) {
      this.securityTypeSecondaryConditionFixedAssests = true;
      this.securityTypeSecondaryConditionStock = true;
      this.securityTypeSecondaryConditionAssestsPlants = true;
    }
    // if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'STOCK')) {
    //     this.securityTypeSecondaryConditionStock = true;
    // }
    // if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS')) {
    //     this.securityTypeSecondaryConditionAssestsPlants = true;
    // }
    // if (this.securityDetails.secondarySecurity.some(s => s.securityTypeCT === 'DOCUMENTS')) {
    //     this.securityTypeSecondaryConditionDocuments = true;
    // }
    if (
      this.securityDetails.secondarySecurity.some(
        (s) => s.securityTypeCT === "ASSIGNMENT"
      )
    ) {
      this.securityTypeSecondaryConditionDocuments = true;
    }
    if (
        this.securityDetails.secondarySecurity.some(
            (s) => s.securityTypeCT === 'PERSONAL GUARANTEE'
        )
    ) {
      this.securityTypeConditionPg = true;
    }
  }

  close() {
    this.dialogRef.close();
  }

  checkOfferLetterData() {
    if (this.cadOfferLetterApprovedDoc.offerDocumentList.length > 0) {
      this.offerLetterDocument =
        this.cadOfferLetterApprovedDoc.offerDocumentList.filter(
          (value) =>
            value.docName.toString() ===
            this.offerLetterConst
              .value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY)
              .toString()
        )[0];
      if (ObjectUtil.isEmpty(this.offerLetterDocument)) {
        this.offerLetterDocument = new OfferDocument();
        this.offerLetterDocument.docName = this.offerLetterConst.value(
          this.offerLetterConst.DDSL_WITHOUT_SUBSIDY
        );
      } else {
        const initialInfo = JSON.parse(
          this.offerLetterDocument.initialInformation
        );
        if (
          !ObjectUtil.isEmpty(this.offerLetterDocument.supportedInformation)
        ) {
          this.offerLetterData = this.offerLetterDocument;
          this.setFreeText();
          this.freeInformation = JSON.parse(
            this.cadOfferLetterApprovedDoc.offerDocumentList[0]
              .supportedInformation
          );
        }
        this.initialInfoPrint = initialInfo;
        this.existingOfferLetter = true;
        this.initialInfoPrint = initialInfo;
        // this.selectedSecurity = initialInfo.securityType.en;
        this.fillForm();
      }
    } else {
      this.setFreeText();
      this.freeInformation = JSON.parse(
        this.cadOfferLetterApprovedDoc.offerDocumentList[0].supportedInformation
      );
      this.fillForm();
    }
  }

  submit(): void {
    this.spinner = true;
    this.cadOfferLetterApprovedDoc.docStatus = "OFFER_AND_LEGAL_PENDING";
    this.form.get("selectedSecurity").patchValue(this.selectedSecurity);

    if (this.existingOfferLetter) {
      this.cadOfferLetterApprovedDoc.offerDocumentList.forEach(
        (offerLetterPath) => {
          if (
            offerLetterPath.docName.toString() ===
            this.offerLetterConst
              .value(this.offerLetterConst.DDSL_WITHOUT_SUBSIDY)
              .toString()
          ) {
            this.setFreeText();
            offerLetterPath.supportedInformation = JSON.stringify(
              this.freeTextVal
            );
          }
        }
      );
    } else {
      const offerDocument = new OfferDocument();
      offerDocument.docName = this.offerLetterConst.value(
        this.offerLetterConst.DDSL_WITHOUT_SUBSIDY
      );
      offerDocument.initialInformation = JSON.stringify(this.form.value);
      this.setFreeText();
      offerDocument.supportedInformation = JSON.stringify(this.freeTextVal);
      // offerDocument.supportedInformation = this.form.get('additionalGuarantorDetails').value;
      this.cadOfferLetterApprovedDoc.offerDocumentList.push(offerDocument);
    }
    this.administrationService
      .saveCadDocumentBulk(this.cadOfferLetterApprovedDoc)
      .subscribe(
        () => {
          this.toastService.show(
            new Alert(AlertType.SUCCESS, "Successfully saved Offer Letter")
          );
          this.spinner = false;
          this.dialogRef.close();
          this.afterSave = true;
          this.routerUtilsService.reloadCadProfileRoute(
            this.cadOfferLetterApprovedDoc.id
          );
        },
        (error) => {
          console.error(error);
          this.toastService.show(
            new Alert(AlertType.ERROR, "Failed to save Offer Letter")
          );
          this.spinner = false;
          this.dialogRef.close();
          this.afterSave = false;
          this.routerUtilsService.reloadCadProfileRoute(
            this.cadOfferLetterApprovedDoc.id
          );
        }
      );
  }

  setFreeText() {
    this.freeTextVal = {
      firstText: this.form.get("extraFinancialClause").value,
      secondText: this.form.get("additionalOtherClause").value,
      thirdText: this.form.get("extraSecurityDocument").value,
      fourthText: this.form.get("extraTermsAndConditionsNRB").value,
      // fifthText: this.form.get('position1').value,
      // sixthText: this.form.get('position2').value,
      fifthText: !ObjectUtil.isEmpty(this.form.get("position1").value)
        ? this.form.get("position1").value
        : this.position1,
      sixthText: !ObjectUtil.isEmpty(this.form.get("position2").value)
        ? this.form.get("position2").value
        : this.position2,
    };
  }
  guarantorDetails() {
    if (this.customerType === this.client.INSTITUTION) {
      this.tempPersonalGuarantors = this.guarantorParsed.filter(
        (val) => val.guarantorType.en === "Personal Guarantor"
      );
    } else {
      this.tempPersonalGuarantors = this.guarantorParsed;
    }
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
    return finalName ? finalName : '';
  }

  guarantorParse(nepData, key, trans?) {
    const data = JSON.parse(nepData);
    if (ObjectUtil.isEmpty(trans)) {
      return data[key].ct;
    } else {
      return data[key].en;
    }
  }
  requiredDocument() {
    const temp = this.tempData;
    if (!ObjectUtil.isEmpty(temp.requiredDocuments)) {
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Promissory Note')) {
      this.promissoryVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Board Minute')) {
        this.boardVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Loan Deed')) {
        this.loanDeedVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Mortgaged Deed')) {
        this.mortgagedVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Continuity')) {
        this.continuityVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('General Letter Of Hypothecation with Supplementary Agreement')) {
        this.supplementaryVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Assignment Of Receivables with Power Of Attorney')) {
        this.attorneyVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Multiple Banking Declaration')) {
        this.multiVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Personal Guarantee')) {
        this.guaranteeVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Wealth Statement Of Guarantor')) {
        this.wealthVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Of Stock')) {
        this.bankersClause1 = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Of Building')) {
        this.bankersClause2 = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Insurance Declaration Statement')) {
        this.insuranceDeclarationVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Undertaking Letter')) {
        this.undertakingLetterVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Declaration Letter')) {
        this.declarationVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Lease Agreement')) {
        this.leaseVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
        this.consentLetterVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Consent from Mortgage Property Owner for Continuation Of Existing Mortgage')) {
        this.continuityVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Building Construction Complete Certificate')) {
        this.buildingVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Hire Purchase Agreement')) {
        this.hirePurchaseVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Comprehensive Insurance')) {
        this.comprehensiveVisible = true;
      }
      if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Consent for Third Party Transfer in Case Of Default')) {
        this.thirdPartyVisible = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Blue Book')) {
        this.blueBook = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Loan Subordination Agreement')) {
        this.loanSubordinationAgreement = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Pari-Pasu Deed')) {
        this.pariPasu = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Partnership Deed')) {
        this.partnershipDeed = true;
      }if (temp.requiredDocuments.requiredLegalDocument.requiredDocument.includes('Letter Of Set Off')) {
        this.letterSetOff = true;
      }
    }
  }
}

import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EngToNepaliNumberPipe } from "../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import { SbTranslateService } from "../../../../../../../@core/service/sbtranslate.service";
import { AddressService } from "../../../../../../../@core/service/baseservice/address.service";
import { District } from "../../../../../../admin/modal/district";
import { ObjectUtil } from "../../../../../../../@core/utils/ObjectUtil";
import { CustomerApprovedLoanCadDocumentation } from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: "app-common-security-section-primary",
  templateUrl: "./common-security-section-primary.component.html",
  styleUrls: ["./common-security-section-primary.component.scss"],
})
export class CommonSecuritySectionPrimaryComponent implements OnInit {
  @Input() customerApprove: CustomerApprovedLoanCadDocumentation;
  @Input() isEdit = false;
  commonPrimarySecurity: FormGroup;
  securityFormTranslate: FormGroup;
  holderDepositorTranslate: FormGroup;
  allDistrictList = [];
  provinceList = [];
  municipalityListForSecurities = [];
  hypoContents = [
    { value: "For Trading Unit" },
    { value: "For Manufacturing Case" },
  ];
  securityType = [
    { key: "LAND", value: "Land" },
    { key: "LAND_AND_BUILDING", value: "Land And Building" },
    { key: "HYPOTHECATION", value: "Hypothecation" },
    { key: "ASSIGNMENT", value: "Assignment" },
  ];
  // {key: 'FIXED_ASSETS', value: 'Fixed Assets'},
  //   {key: 'STOCK', value: 'Stock'},
  //   {key: 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS', value: 'Assets Plants Machinery & other equipments'},
  //   {key: 'LIVE_STOCKS_ANIMALS', value: 'Live Stocks Animals'},
  //   {key: 'DOCUMENTS', value: 'Documents'}
  multiContents = [{ value: "NEW" }, { value: "EXISTING" }];
  isInsuranceRequired = false;
  selectedValue;
  isNabil = false;
  isOther = false;
  tempValue;
  securities;
  initialInformation;

  constructor(
    private formBuilder: FormBuilder,
    private engNepNumberPipe: EngToNepaliNumberPipe,
    private translateService: SbTranslateService,
    private addressService: AddressService
  ) {}

  ngOnInit() {
    this.buildForm();
    if (this.customerApprove.offerDocumentList.length > 0) {
      this.initialInformation = JSON.parse(
        this.customerApprove.offerDocumentList[0].initialInformation
      );
    }
    this.getAllProvince();
    this.getAllDistrict();
    // SETTING SECURITY DETAILS:
    if (!ObjectUtil.isEmpty(this.initialInformation)) {
      this.securities = this.initialInformation.securities;
      if (!ObjectUtil.isEmpty(this.securities)) {
        this.setSecurityData();
      }
    }
  }
  buildForm() {
    this.commonPrimarySecurity = this.formBuilder.group({
      // securityType: [undefined],
      securityDetails: this.formBuilder.array([]),
    });
    if (!this.isEdit) {
      this.addMoreSecurityDetails();
    } else {
      this.selectedValue = true;
    }
  }

  get formControls() {
    return this.commonPrimarySecurity.controls;
  }

  addMoreSecurityDetails() {
    (this.commonPrimarySecurity.get("securityDetails") as FormArray).push(
      this.setSecurityDetailsArr()
    );
  }

  setSecurityDetailsArr() {
    return this.formBuilder.group({
      hypothecationPurpose: [undefined],
      hypothecationPurposeTrans: [undefined],
      hypothecationPurposeCT: [undefined],
      securityType: [undefined],
      securityTypeTrans: [undefined],
      securityTypeCT: [undefined],
      /* FOR LAND AND BUILDING */
      insuranceRequired: [false],
      securityOwnersName: [undefined],
      securityOwnersDistrict: [undefined],
      securityOwnersMunicipalityOrVdc: [undefined],
      securityOwnersMunicipality: [undefined],
      // marginInPercentage: [undefined],
      // marginInPercentageMotor: [undefined],
      // marginInPercentageFoot: [undefined],
      /*securityOwnersWardNo: [undefined],
      securityOwnersKittaNo: [undefined],
      securityOwnersLandArea: [undefined],
      securityOwnersSheetNo: [undefined],*/
      /* FOR TRANSLATED FIELDS */
      insuranceRequiredTrans: [false],
      securityOwnersNameTrans: [undefined],
      securityOwnersDistrictTrans: [undefined],
      securityOwnersMunicipalityOrVdcTrans: [undefined],
      securityOwnersMunicipalityTrans: [undefined],
      /*marginInPercentageTrans: [undefined],
      marginInPercentageMotorTrans: [undefined],
      marginInPercentageFootTrans: [undefined],*/
      /*securityOwnersWardNoTrans: [undefined],
      securityOwnersKittaNoTrans: [undefined],
      securityOwnersLandAreaTrans: [undefined],
      securityOwnersSheetNoTrans: [undefined],*/
      /* FOR CT VALUES */
      insuranceRequiredCT: [false],
      securityOwnersNameCT: [undefined],
      securityOwnersDistrictCT: [undefined],
      securityOwnersMunicipalityOrVdcCT: [undefined],
      securityOwnersMunicipalityCT: [undefined],
      /*marginInPercentageCT: [undefined],
      marginInPercentageMotorCT: [undefined],
      marginInPercentageFootCT: [undefined],*/
      /*securityOwnersWardNoCT: [undefined],
      securityOwnersKittaNoCT: [undefined],
      securityOwnersLandAreaCT: [undefined],
      securityOwnersSheetNoCT: [undefined],*/
      /*fdHolderDetails: this.formBuilder.array([this.buildFDHolderDetailsArr()]),
      depositorDetails: this.formBuilder.array([this.buildDepositorDetailsArr()]),
      debentureDetails: this.formBuilder.array([this.buildDebentureDetailsArr()]),*/
      propertyDetails: this.formBuilder.array([this.buildPropertyDetailsArr()]),
      requiredHypothecationInsurance: [undefined],
    });
  }

  async onChangeTranslate(arrName, source, index, target) {
    this.securityFormTranslate = this.formBuilder.group({
      securityOwnersName: this.commonPrimarySecurity.get([
        String(arrName),
        index,
        String(source),
      ]).value,
    });
    const sourceResponse = await this.translateService.translateForm(
      this.securityFormTranslate
    );
    this.commonPrimarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(sourceResponse.securityOwnersName);
    this.commonPrimarySecurity
      .get([String(arrName), index, String(source + "CT")])
      .patchValue(sourceResponse.securityOwnersName);
  }

  translateSecurityNumber(arrName, source, index, target) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
      String(
        this.commonPrimarySecurity.get([String(arrName), index, String(source)])
          .value
      )
    );
    this.commonPrimarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(nepaliNumTrans);
    this.commonPrimarySecurity
      .get([String(arrName), index, String(source + "CT")])
      .patchValue(nepaliNumTrans);
  }

  public getAllDistrict(): void {
    this.addressService.getAllDistrict().subscribe((response: any) => {
      this.allDistrictList = response.detail;
    });
  }

  public getAllProvince(): void {
    this.addressService.getProvince().subscribe((response: any) => {
      this.provinceList = response.detail;
    });
  }

  public getMunicipalityByDistrict(data, event, index): void {
    const district = new District();
    district.id = data;
    this.addressService
      .getMunicipalityVDCByDistrict(district)
      .subscribe((response: any) => {
        this.municipalityListForSecurities[index] = response.detail;
        this.municipalityListForSecurities[index].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        if (event !== null) {
          this.commonPrimarySecurity
            .get(["securityDetails", index, "securityOwnersMunicipalityOrVdc"])
            .patchValue(null);
        }
      });
  }

  setDefaultResponse(arrName, source, index, target) {
    this.commonPrimarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(
        this.commonPrimarySecurity.get([String(arrName), index, String(source)])
          .value.nepaliName
      );
    this.commonPrimarySecurity
      .get([String(arrName), index, String(source + "CT")])
      .patchValue(
        this.commonPrimarySecurity.get([String(arrName), index, String(source)])
          .value.nepaliName
      );
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.commonPrimarySecurity.get([
      formArrayName,
      index,
      "securityOwnersMunicipalityOrVdc",
    ]).value;
    if (tempVal === "VDC") {
      this.commonPrimarySecurity
        .get([formArrayName, index, controlName])
        .setValue(null);
    }
    this.setDefaultCTAndTransVal(
      "securityOwnersMunicipalityOrVdc",
      false,
      "securityDetails",
      index
    );
  }

  checkInsuranceRequired(data, index) {
    this.isInsuranceRequired = data;
    this.commonPrimarySecurity
      .get(["securityDetails", index, "insuranceRequired"])
      .patchValue(this.isInsuranceRequired);
    this.setDefaultCTAndTransVal(
      "insuranceRequired",
      false,
      "securityDetails",
      index
    );
  }

  selectedSecurity(data, index) {
    this.selectedValue = data;
    this.setDefaultCTAndTransVal(
      "securityType",
      false,
      "securityDetails",
      index
    );
  }

  removeSecurityDetails(i) {
    (this.commonPrimarySecurity.get("securityDetails") as FormArray).removeAt(
      i
    );
  }

  setDefaultCTAndTransVal(
    formControlName,
    options: boolean,
    formArrayName?,
    index?
  ) {
    if (options) {
      const controlVal = !ObjectUtil.isEmpty(
        this.commonPrimarySecurity.get(formControlName).value
      )
        ? this.commonPrimarySecurity.get(formControlName).value
        : "";
      this.commonPrimarySecurity
        .get(String(formControlName + "Trans"))
        .patchValue(controlVal);
      this.commonPrimarySecurity
        .get(String(formControlName + "CT"))
        .patchValue(controlVal);
    } else {
      const sourceValue = !ObjectUtil.isEmpty(
        this.commonPrimarySecurity.get([formArrayName, index, formControlName])
          .value
      )
        ? this.commonPrimarySecurity.get([
            formArrayName,
            index,
            formControlName,
          ]).value
        : "";
      this.commonPrimarySecurity
        .get([String(formArrayName), index, String(formControlName + "Trans")])
        .patchValue(sourceValue);
      this.commonPrimarySecurity
        .get([String(formArrayName), index, String(formControlName + "CT")])
        .patchValue(sourceValue);
    }
  }

  addPropertyDetails(i) {
    (
      this.commonPrimarySecurity.get([
        "securityDetails",
        i,
        "propertyDetails",
      ]) as FormArray
    ).push(this.buildPropertyDetailsArr());
  }

  removePropertyDetailsArr(i, secondIndex) {
    (
      this.commonPrimarySecurity.get([
        "securityDetails",
        i,
        "propertyDetails",
      ]) as FormArray
    ).removeAt(secondIndex);
  }

  buildPropertyDetailsArr() {
    return this.formBuilder.group({
      securityOwnersWardNo: [undefined],
      securityOwnersKittaNo: [undefined],
      securityOwnersLandArea: [undefined],
      securityOwnersSheetNo: [undefined],
      /* Translated fields for multi security Fields */
      securityOwnersWardNoTrans: [undefined],
      securityOwnersKittaNoTrans: [undefined],
      securityOwnersLandAreaTrans: [undefined],
      securityOwnersSheetNoTrans: [undefined],
      /* Final CT fields for multi security Fields */
      securityOwnersWardNoCT: [undefined],
      securityOwnersKittaNoCT: [undefined],
      securityOwnersLandAreaCT: [undefined],
      securityOwnersSheetNoCT: [undefined],
    });
  }

  async onChangeFormArrayTranslate(
    arrName,
    source,
    index,
    target,
    index1,
    secondArr
  ) {
    this.securityFormTranslate = this.formBuilder.group({
      securityTranslated: this.commonPrimarySecurity.get([
        String(arrName),
        index,
        String(secondArr),
        index1,
        String(source),
      ]).value,
    });
    const sourceResponse = await this.translateService.translateForm(
      this.securityFormTranslate
    );
    this.commonPrimarySecurity
      .get([String(arrName), index, String(secondArr), index1, String(target)])
      .patchValue(sourceResponse.securityTranslated);
    this.commonPrimarySecurity
      .get([
        String(arrName),
        index,
        String(secondArr),
        index1,
        String(source + "CT"),
      ])
      .patchValue(sourceResponse.securityTranslated);
  }

  translateSecurityFormArrayNumber(
    arrName,
    source,
    index,
    target,
    index1,
    secondArr
  ) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
      String(
        this.commonPrimarySecurity.get([
          String(arrName),
          index,
          String(secondArr),
          index1,
          String(source),
        ]).value
      )
    );
    // tslint:disable-next-line:max-line-length
    this.commonPrimarySecurity
      .get([String(arrName), index, String(secondArr), index1, String(target)])
      .patchValue(nepaliNumTrans);
    this.commonPrimarySecurity
      .get([
        String(arrName),
        index,
        String(secondArr),
        index1,
        String(source + "CT"),
      ])
      .patchValue(nepaliNumTrans);
  }

  public municipalityByDistrictIdForEdit(data, index?): void {
    const district = new District();
    district.id = data;
    this.addressService
      .getMunicipalityVDCByDistrict(district)
      .subscribe((response: any) => {
        this.municipalityListForSecurities[index] = response.detail;
        this.municipalityListForSecurities[index].sort((a, b) =>
          a.name.localeCompare(b.name)
        );
      });
  }

  setSecurityData(): void {
    const securityFormArr = this.commonPrimarySecurity.get(
      "securityDetails"
    ) as FormArray;
    this.securities.primarySecurity.forEach((val, index) => {
      if (!ObjectUtil.isEmpty(val.securityOwnersDistrict)) {
        this.municipalityByDistrictIdForEdit(
          val.securityOwnersDistrict.id,
          index
        );
      }
      securityFormArr.push(
        this.formBuilder.group({
          securityType: [val.securityType],
          securityOwnersName: [val.securityOwnersName],
          /*marginInPercentage: [val.marginInPercentage],
          marginInPercentageMotor: [val.marginInPercentageMotor],
          marginInPercentageFoot: [val.marginInPercentageFoot],*/
          securityOwnersMunicipalityOrVdc: [
            val.securityOwnersMunicipalityOrVdc,
          ],
          securityOwnersMunicipality: [val.securityOwnersMunicipality],
          securityOwnersDistrict: [val.securityOwnersDistrict],
          /* FOR HYPOTHECATION CONDITION*/
          hypothecationPurpose: [val.hypothecationPurpose],
          insuranceRequired: [val.insuranceRequired],
          // TRANSLATION FIELD OF SECURITY:
          securityTypeTrans: [val.securityTypeTrans],
          securityOwnersNameTrans: [val.securityOwnersNameTrans],
          /*marginInPercentageTrans: [val.marginInPercentageTrans],
          marginInPercentageMotorTrans: [val.marginInPercentageMotorTrans],
          marginInPercentageFootTrans: [val.marginInPercentageFootTrans],*/
          securityOwnersDistrictTrans: [val.securityOwnersDistrictTrans],
          securityOwnersMunicipalityTrans: [
            val.securityOwnersMunicipalityTrans,
          ],
          /* FOR HYPOTHECATION CONDITION*/
          hypothecationPurposeTrans: [val.hypothecationPurposeTrans],
          insuranceRequiredTrans: [val.insuranceRequiredTrans],
          // CT FIELDS OF SECURITY
          securityTypeCT: [val.securityTypeCT],
          securityOwnersNameCT: [val.securityOwnersNameCT],
          /*marginInPercentageCT: [val.marginInPercentageCT],
          marginInPercentageMotorCT: [val.marginInPercentageMotorCT],
          marginInPercentageFootCT: [val.marginInPercentageFootCT],*/
          securityOwnersDistrictCT: [val.securityOwnersDistrictCT],
          securityOwnersMunicipalityCT: [val.securityOwnersMunicipalityCT],
          /* FOR HYPOTHECATION CONDITION*/
          hypothecationPurposeCT: [val.hypothecationPurposeCT],
          insuranceRequiredCT: [val.insuranceRequiredCT],
          propertyDetails: this.formBuilder.array([]),
          requiredHypothecationInsurance: [val.requiredHypothecationInsurance],
        })
      );
      this.setProperties(val.propertyDetails, index);
    });
  }
  setProperties(data, i) {
    const property = this.commonPrimarySecurity.get([
      "securityDetails",
      i,
      "propertyDetails",
    ]) as FormArray;
    data.forEach((propertyData) => {
      property.push(
        this.formBuilder.group({
          securityOwnersWardNo: [propertyData.securityOwnersWardNo],
          securityOwnersKittaNo: [propertyData.securityOwnersKittaNo],
          securityOwnersLandArea: [propertyData.securityOwnersLandArea],
          securityOwnersSheetNo: [propertyData.securityOwnersSheetNo],
          // trans
          securityOwnersWardNoTrans: [propertyData.securityOwnersWardNoTrans],
          securityOwnersKittaNoTrans: [propertyData.securityOwnersKittaNoTrans],
          securityOwnersLandAreaTrans: [
            propertyData.securityOwnersLandAreaTrans,
          ],
          securityOwnersSheetNoTrans: [propertyData.securityOwnersSheetNoTrans],
          // CT
          securityOwnersWardNoCT: [propertyData.securityOwnersWardNoCT],
          securityOwnersKittaNoCT: [propertyData.securityOwnersKittaNoCT],
          securityOwnersLandAreaCT: [propertyData.securityOwnersLandAreaCT],
          securityOwnersSheetNoCT: [propertyData.securityOwnersSheetNoCT],
        })
      );
    });
  }
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }
}

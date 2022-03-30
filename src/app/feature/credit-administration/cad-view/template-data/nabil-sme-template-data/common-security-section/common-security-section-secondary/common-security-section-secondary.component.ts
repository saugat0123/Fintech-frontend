import { Component, Input, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { EngToNepaliNumberPipe } from "../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import { SbTranslateService } from "../../../../../../../@core/service/sbtranslate.service";
import { AddressService } from "../../../../../../../@core/service/baseservice/address.service";
import { District } from "../../../../../../admin/modal/district";
import { ObjectUtil } from "../../../../../../../@core/utils/ObjectUtil";
import { CustomerApprovedLoanCadDocumentation } from "../../../../../model/customerApprovedLoanCadDocumentation";

@Component({
  selector: "app-common-security-section-secondary",
  templateUrl: "./common-security-section-secondary.component.html",
  styleUrls: ["./common-security-section-secondary.component.scss"],
})
export class CommonSecuritySectionSecondaryComponent implements OnInit {
  @Input() customerApprove: CustomerApprovedLoanCadDocumentation;
  @Input() isEdit = false;
  commonSecondarySecurity: FormGroup;
  securityFormTranslate: FormGroup;
  holderDepositorTranslate: FormGroup;
  allDistrictList = [];
  provinceList = [];
  municipalityListForSecurities = [];
  securityType = [
    { key: "LAND", value: "Land" },
    { key: "LAND_AND_BUILDING", value: "Land And Building" },
    { key: "HYPOTHECATION", value: "Hypothecation" },
    { key: "ASSIGNMENT", value: "Assignment" },
    { key: 'PERSONAL GUARANTEE', value: 'Personal Guarantee' },
  ];
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
    this.commonSecondarySecurity = this.formBuilder.group({
      // securityType: [undefined],
      securityDetails: this.formBuilder.array([]),
    });
    /* FOR DEFAULT FORM*/
    if (!this.isEdit) {
      this.addMoreSecurityDetails();
    } else {
      this.selectedValue = true;
    }
  }

  get formControls() {
    return this.commonSecondarySecurity.controls;
  }

  addMoreSecurityDetails() {
    (this.commonSecondarySecurity.get("securityDetails") as FormArray).push(
      this.setSecurityDetailsArr()
    );
  }

  setSecurityDetailsArr() {
    return this.formBuilder.group({
      securityType: [undefined],
      securityTypeTrans: [undefined],
      securityTypeCT: [undefined],
      /* FOR LAND AND BUILDING */
      insuranceRequired: [false],
      securityOwnersName: [undefined],
      securityOwnersDistrict: [undefined],
      securityOwnersMunicipalityOrVdc: [undefined],
      securityOwnersMunicipality: [undefined],
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
      securityOwnersName: this.commonSecondarySecurity.get([
        String(arrName),
        index,
        String(source),
      ]).value,
    });
    const sourceResponse = await this.translateService.translateForm(
      this.securityFormTranslate
    );
    this.commonSecondarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(sourceResponse.securityOwnersName);
    this.commonSecondarySecurity
      .get([String(arrName), index, String(source + "CT")])
      .patchValue(sourceResponse.securityOwnersName);
  }

  translateSecurityNumber(arrName, source, index, target) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
      String(
        this.commonSecondarySecurity.get([
          String(arrName),
          index,
          String(source),
        ]).value
      )
    );
    this.commonSecondarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(nepaliNumTrans);
    this.commonSecondarySecurity
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
          this.commonSecondarySecurity
            .get(["securityDetails", index, "securityOwnersMunicipalityOrVdc"])
            .patchValue(null);
        }
      });
  }

  setDefaultResponse(arrName, source, index, target) {
    this.commonSecondarySecurity
      .get([String(arrName), index, String(target)])
      .patchValue(
        this.commonSecondarySecurity.get([
          String(arrName),
          index,
          String(source),
        ]).value.nepaliName
      );
    this.commonSecondarySecurity
      .get([String(arrName), index, String(source + "CT")])
      .patchValue(
        this.commonSecondarySecurity.get([
          String(arrName),
          index,
          String(source),
        ]).value.nepaliName
      );
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.commonSecondarySecurity.get([
      formArrayName,
      index,
      "securityOwnersMunicipalityOrVdc",
    ]).value;
    if (tempVal === "VDC") {
      this.commonSecondarySecurity
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
    this.commonSecondarySecurity
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
    (this.commonSecondarySecurity.get("securityDetails") as FormArray).removeAt(
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
        this.commonSecondarySecurity.get(formControlName).value
      )
        ? this.commonSecondarySecurity.get(formControlName).value
        : "";
      this.commonSecondarySecurity
        .get(String(formControlName + "Trans"))
        .patchValue(controlVal);
      this.commonSecondarySecurity
        .get(String(formControlName + "CT"))
        .patchValue(controlVal);
    } else {
      const sourceValue = !ObjectUtil.isEmpty(
        this.commonSecondarySecurity.get([
          formArrayName,
          index,
          formControlName,
        ]).value
      )
        ? this.commonSecondarySecurity.get([
            formArrayName,
            index,
            formControlName,
          ]).value
        : "";
      this.commonSecondarySecurity
        .get([String(formArrayName), index, String(formControlName + "Trans")])
        .patchValue(sourceValue);
      this.commonSecondarySecurity
        .get([String(formArrayName), index, String(formControlName + "CT")])
        .patchValue(sourceValue);
    }
  }

  changeHoldingBank(data) {
    const tempData = !ObjectUtil.isEmpty(data) ? data : "";
    this.isNabil = tempData === "NABIL";
    this.isOther = tempData === "OTHER";
  }

  addPropertyDetails(i) {
    (
      this.commonSecondarySecurity.get([
        "securityDetails",
        i,
        "propertyDetails",
      ]) as FormArray
    ).push(this.buildPropertyDetailsArr());
  }

  removePropertyDetailsArr(i, secondIndex) {
    (
      this.commonSecondarySecurity.get([
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
      securityTranslated: this.commonSecondarySecurity.get([
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
    this.commonSecondarySecurity
      .get([String(arrName), index, String(secondArr), index1, String(target)])
      .patchValue(sourceResponse.securityTranslated);
    this.commonSecondarySecurity
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
        this.commonSecondarySecurity.get([
          String(arrName),
          index,
          String(secondArr),
          index1,
          String(source),
        ]).value
      )
    );
    // tslint:disable-next-line:max-line-length
    this.commonSecondarySecurity
      .get([String(arrName), index, String(secondArr), index1, String(target)])
      .patchValue(nepaliNumTrans);
    this.commonSecondarySecurity
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
    const securityFormArr = this.commonSecondarySecurity.get(
      "securityDetails"
    ) as FormArray;
    this.securities.secondarySecurity.forEach((val, index) => {
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
          securityOwnersMunicipalityOrVdc: [
            val.securityOwnersMunicipalityOrVdc,
          ],
          securityTypeTrans: [val.securityTypeTrans],
          securityTypeCT: [val.securityTypeCT],
          securityOwnersMunicipality: [val.securityOwnersMunicipality],
          securityOwnersDistrict: [val.securityOwnersDistrict],
          // TRANSLATION FIELD OF SECURITY:
          securityOwnersNameTrans: [val.securityOwnersNameTrans],
          securityOwnersDistrictTrans: [val.securityOwnersDistrictTrans],
          securityOwnersMunicipalityTrans: [
            val.securityOwnersMunicipalityTrans,
          ],
          // CT FIELDS OF SECURITY
          securityOwnersNameCT: [val.securityOwnersNameCT],
          securityOwnersDistrictCT: [val.securityOwnersDistrictCT],
          securityOwnersMunicipalityCT: [val.securityOwnersMunicipalityCT],
          propertyDetails: this.formBuilder.array([]),
          requiredHypothecationInsurance: [val.requiredHypothecationInsurance],
        })
      );
      this.setProperties(val.propertyDetails, index);
    });
  }
  setProperties(data, i) {
    const property = this.commonSecondarySecurity.get([
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

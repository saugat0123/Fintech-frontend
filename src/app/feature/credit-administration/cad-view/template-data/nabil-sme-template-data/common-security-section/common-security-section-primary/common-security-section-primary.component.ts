import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {District} from '../../../../../../admin/modal/district';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-common-security-section-primary',
  templateUrl: './common-security-section-primary.component.html',
  styleUrls: ['./common-security-section-primary.component.scss']
})
export class CommonSecuritySectionPrimaryComponent implements OnInit {
  commonPrimarySecurity: FormGroup;
  securityFormTranslate: FormGroup;
  holderDepositorTranslate: FormGroup;
  allDistrictList = [];
  provinceList = [];
  municipalityListForSecurities = [];
  securityType = [{key: 'LAND', value: 'Land'},
    {key: 'LAND_AND_BUILDING', value: 'Land And Building'},
    {key: 'FIXED_ASSETS', value: 'Fixed Assets'},
    {key: 'STOCK', value: 'Stock'},
    {key: 'ASSETS_PLANTS_MACHINERY_AND_OTHER_EQUIPMENTS', value: 'Assets Plants Machinery & other equipments'},
    {key: 'LIVE_STOCKS_ANIMALS', value: 'Live Stocks Animals'}
  ];
  multiContents = [{value: 'NEW'}, {value: 'EXISTING'}];
  isInsuranceRequired = false;
  selectedValue;
  isNabil = false;
  isOther = false;
  tempValue;

  constructor(
      private formBuilder: FormBuilder,
      private engNepNumberPipe: EngToNepaliNumberPipe,
      private translateService: SbTranslateService,
      private addressService: AddressService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.getAllProvince();
    this.getAllDistrict();
  }
  buildForm() {
    this.commonPrimarySecurity = this.formBuilder.group({
      // securityType: [undefined],
      securityDetails: this.formBuilder.array([]),
    });
    /* FOR DEFAULT FORM*/
    this.addMoreSecurityDetails();
  }

  get formControls() {
    return this.commonPrimarySecurity.controls;
  }


  addMoreSecurityDetails() {
    (this.commonPrimarySecurity.get('securityDetails') as FormArray).push(this.setSecurityDetailsArr());
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
    });
  }

  async onChangeTranslate(arrName, source, index, target) {
    this.securityFormTranslate = this.formBuilder.group({
      securityOwnersName: this.commonPrimarySecurity.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
    this.commonPrimarySecurity.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.commonPrimarySecurity.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  translateSecurityNumber(arrName, source, index, target) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
        String(this.commonPrimarySecurity.get([String(arrName), index, String(source)]).value));
    this.commonPrimarySecurity.get([String(arrName), index, String(target)]).patchValue(nepaliNumTrans);
    this.commonPrimarySecurity.get([String(arrName), index, String(source + 'CT')]).patchValue(nepaliNumTrans);
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
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.commonPrimarySecurity.get(['securityDetails', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
          }
        }
    );
  }

  setDefaultResponse(arrName, source, index, target) {
    this.commonPrimarySecurity.get([String(arrName), index, String(target)]).patchValue(
        this.commonPrimarySecurity.get([String(arrName), index, String(source)]).value.nepaliName);
    this.commonPrimarySecurity.get([String(arrName), index, String(source + 'CT')]).patchValue(
        this.commonPrimarySecurity.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.commonPrimarySecurity.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
    if (tempVal === 'VDC') {
      this.commonPrimarySecurity.get([formArrayName, index, controlName]).setValue(null);
    }
    this.setDefaultCTAndTransVal('securityOwnersMunicipalityOrVdc', false, 'securityDetails', index);
  }

  checkInsuranceRequired(data, index) {
    this.isInsuranceRequired = data;
    this.commonPrimarySecurity.get(['securityDetails', index, 'insuranceRequired']).patchValue(this.isInsuranceRequired);
    this.setDefaultCTAndTransVal('insuranceRequired', false, 'securityDetails', index);
  }


  selectedSecurity(data, index) {
    this.selectedValue = data;
    this.setDefaultCTAndTransVal('securityType', false, 'securityDetails', index);
  }

  removeSecurityDetails(i) {
    (this.commonPrimarySecurity.get('securityDetails') as FormArray).removeAt(i);
  }

  setDefaultCTAndTransVal(formControlName, options: boolean, formArrayName?, index?) {
    if (options) {
      const controlVal = !ObjectUtil.isEmpty(this.commonPrimarySecurity.get(formControlName).value) ?
          this.commonPrimarySecurity.get(formControlName).value : '';
      this.commonPrimarySecurity.get(String(formControlName + 'Trans')).patchValue(controlVal);
      this.commonPrimarySecurity.get(String(formControlName + 'CT')).patchValue(controlVal);
    } else {
      const sourceValue = !ObjectUtil.isEmpty(this.commonPrimarySecurity.get([formArrayName, index, formControlName]).value) ?
          this.commonPrimarySecurity.get([formArrayName, index, formControlName]).value : '';
      this.commonPrimarySecurity.get([String(formArrayName), index, String(formControlName + 'Trans')]).patchValue(sourceValue);
      this.commonPrimarySecurity.get([String(formArrayName), index, String(formControlName + 'CT')]).patchValue(sourceValue);
    }
  }

  addPropertyDetails(i) {
    (this.commonPrimarySecurity.get(['securityDetails', i, 'propertyDetails']) as FormArray).push(this.buildPropertyDetailsArr());
  }

  removePropertyDetailsArr(i, secondIndex) {
    (this.commonPrimarySecurity.get(['securityDetails', i, 'propertyDetails']) as FormArray).removeAt(secondIndex);
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

  async onChangeFormArrayTranslate(arrName, source, index, target, index1, secondArr) {
    this.securityFormTranslate = this.formBuilder.group({
      securityTranslated: this.commonPrimarySecurity.get([String(arrName), index, String(secondArr), index1, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
    this.commonPrimarySecurity.get([String(arrName), index, String(secondArr), index1 , String(target)]).patchValue(
        sourceResponse.securityTranslated);
    this.commonPrimarySecurity.get([String(arrName), index, String(secondArr), index1, String(source + 'CT')]).patchValue(
        sourceResponse.securityTranslated);
  }

  translateSecurityFormArrayNumber(arrName, source, index, target, index1, secondArr) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
        String(this.commonPrimarySecurity.get([String(arrName), index, String(secondArr), index1, String(source)]).value));
    // tslint:disable-next-line:max-line-length
    this.commonPrimarySecurity.get([String(arrName), index, String(secondArr), index1 , String(target)]).patchValue(nepaliNumTrans);
    this.commonPrimarySecurity.get(
        [String(arrName), index, String(secondArr), index1, String(source + 'CT')]
    ).patchValue(nepaliNumTrans);
  }
}

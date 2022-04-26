import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../../@core/service/sbtranslate.service';
import {AddressService} from '../../../../../../../@core/service/baseservice/address.service';
import {ObjectUtil} from '../../../../../../../@core/utils/ObjectUtil';
import {District} from '../../../../../../admin/modal/district';
import {TableMaker} from '../../../../../../../@core/utils/constants/tableMaker';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EnglishDateTransformPipe} from '../../../../../../../@core/pipe/english-date-transform.pipe';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-retail-secondary-security',
  templateUrl: './retail-secondary-security.component.html',
  styleUrls: ['./retail-secondary-security.component.scss']
})
export class RetailSecondarySecurityComponent implements OnInit {
  @Input() initialData;
  retailSecondarySecurityForm: FormGroup;
  securityFormTranslate: FormGroup;
  holderDepositorTranslate: FormGroup;
  allDistrictList = [];
  provinceList = [];
  municipalityListForSecurities = [];
  securityType = [
    {key: 'LAND', value: 'Land'},
    {key: 'LAND_AND_BUILDING', value: 'Land And Building'},
    {key: 'AUTO LOAN', value: 'Auto Loan'},
    {key: 'TD', value: 'TD'},
    {key: 'SHARE SECURITY', value: 'Share Security'},
    {key: 'PERSONAL GUARANTEE', value: 'Personal Guarantee'},
  ];
  mortgageType = [
    {value: 'New'},
    {value: 'Remortgage'},
    {value: 'Enhancement'}
  ];
  collateralShare = [{value: 'YES'}, {value: 'NO'}];
  multiContents = [{value: 'NEW'}, {value: 'EXISTING'}];
  isInsuranceRequired = false;
  selectedValue;
  isNabil = false;
  isOther = false;
  securitySelected = false;
  tempValue;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ckEditorConfig = TableMaker.CK_CONFIG;
  shareTable: Array<any> = new Array<any>();
  constructor(private formBuilder: FormBuilder,
              private engNepNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private addressService: AddressService,
              public currencyWordPipe: NepaliCurrencyWordPipe,
              private englishCalenderPipe: EnglishDateTransformPipe,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    this.buildForm();
    this.getAllProvince();
    this.getAllDistrict();
    if (!ObjectUtil.isEmpty(this.initialData)) {
      if (!ObjectUtil.isEmpty(this.initialData.secondarySecurity[0].securityType)) {
        this.securitySelected = true;
        console.log('Initial Data:', this.initialData);
        this.setFormArray(this.initialData.secondarySecurity);
        this.selectedValue = true;
      }
    }
    /* FOR DEFAULT FORM*/
    if (!this.securitySelected) {
      this.addMoreSecurityDetails();
    }
  }

  buildForm() {
    this.retailSecondarySecurityForm = this.formBuilder.group({
      // securityType: [undefined],
      securityDetails: this.formBuilder.array([]),
    });
  }

  get formControls() {
    return this.retailSecondarySecurityForm.controls;
  }

  addMoreSecurityDetails() {
    (this.retailSecondarySecurityForm.get('securityDetails') as FormArray).push(this.setSecurityDetailsArr());
  }

  setSecurityDetailsArr() {
    return this.formBuilder.group({
      securityType: [undefined],
      securityTypeTrans: [undefined],
      securityTypeCT: [undefined],
      /* FOR LAND AND BUILDING */
      collateralShare: [undefined],
      insuranceRequired: [false],
      nameOfBorrowingClient: [undefined],
      securityOwnersName: [undefined],
      securityOwnersDistrict: [undefined],
      securityOwnersMunicipalityOrVdc: [undefined],
      securityOwnersMunicipality: [undefined],

      /* FOR TRANSLATED FIELDS */
      collateralShareTrans: [undefined],
      insuranceRequiredTrans: [false],
      nameOfBorrowingClientTrans: [undefined],
      securityOwnersNameTrans: [undefined],
      securityOwnersDistrictTrans: [undefined],
      securityOwnersMunicipalityOrVdcTrans: [undefined],
      securityOwnersMunicipalityTrans: [undefined],
      /*securityOwnersWardNoTrans: [undefined],
      securityOwnersKittaNoTrans: [undefined],
      securityOwnersLandAreaTrans: [undefined],
      securityOwnersSheetNoTrans: [undefined],*/
      /* FOR CT VALUES */
      nameOfBorrowingClientCT: [undefined],
      collateralShareCT: [undefined],
      insuranceRequiredCT: [false],
      securityOwnersNameCT: [undefined],
      securityOwnersDistrictCT: [undefined],
      securityOwnersMunicipalityOrVdcCT: [undefined],
      securityOwnersMunicipalityCT: [undefined],

      mortgageType: [undefined],
      mortgageTypeTrans: [undefined],
      mortgageTypeCT: [undefined],

      fixedDepositHolderName: [undefined],
      FDAmountInFigure: [undefined],
      FDAmountInWords: [undefined],
      tenureOfFixedDeposit: [undefined],
      FDReceiptNumber: [undefined],
      accountNumber: [undefined],
      bankName: [undefined],
      FDExpiryDateType: [undefined],
      FDExpiryDate: [undefined],
      FDExpiryDateNepali: [undefined],

      fixedDepositHolderNameTrans: [undefined],
      FDAmountInFigureTrans: [undefined],
      FDAmountInWordsTrans: [undefined],
      tenureOfFixedDepositTrans: [undefined],
      FDReceiptNumberTrans: [undefined],
      accountNumberTrans: [undefined],
      bankNameTrans: [undefined],
      FDExpiryDateTypeTrans: [undefined],
      FDExpiryDateTrans: [undefined],
      FDExpiryDateNepaliTrans: [undefined],

      fixedDepositHolderNameCT: [undefined],
      FDAmountInFigureCT: [undefined],
      FDAmountInWordsCT: [undefined],
      tenureOfFixedDepositCT: [undefined],
      FDReceiptNumberCT: [undefined],
      accountNumberCT: [undefined],
      bankNameCT: [undefined],
      FDExpiryDateTypeCT: [undefined],
      FDExpiryDateCT: [undefined],
      FDExpiryDateNepaliCT: [undefined],

      shareSecurityTable: [undefined],
      propertyDetails: this.formBuilder.array([this.buildPropertyDetailsArr()]),
    });
  }

  async onChangeTranslate(arrName, source, index, target) {
    this.securityFormTranslate = this.formBuilder.group({
      securityOwnersName: this.retailSecondarySecurityForm.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  translateSecurityNumber(arrName, source, index, target) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
        String(this.retailSecondarySecurityForm.get([String(arrName), index, String(source)]).value));
    this.retailSecondarySecurityForm.get([String(arrName), index, String(target)]).patchValue(nepaliNumTrans);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(nepaliNumTrans);
  }

  convertWords(formArray, index, origin, dest) {
    const tempFigure = this.retailSecondarySecurityForm.get([formArray, index, origin]).value;
    if (!ObjectUtil.isEmpty(tempFigure)) {
      this.retailSecondarySecurityForm.get([formArray, index, dest]).patchValue(this.currencyWordPipe.transform(tempFigure));
      this.retailSecondarySecurityForm.get([formArray, index, dest + 'Trans']).patchValue(this.currencyWordPipe.transform(tempFigure));
      this.retailSecondarySecurityForm.get([formArray, index, dest + 'CT']).patchValue(this.currencyWordPipe.transform(tempFigure));
    }
  }

  dateConvert(mainArray, index, origin, type) {
    const dateType = type;
    if (!ObjectUtil.isEmpty(dateType)) {
      if (dateType === 'AD') {
        if (!ObjectUtil.isEmpty(this.retailSecondarySecurityForm.get([mainArray, index, origin]).value)) {
          const ADDate = this.datePipe.transform(this.retailSecondarySecurityForm.get([mainArray, index, origin]).value);
          const tempAdDate = !ObjectUtil.isEmpty(ADDate) ? this.datePipe.transform(ADDate) : '';
          const finalADDate = this.englishCalenderPipe.transform(tempAdDate);
          if (!ObjectUtil.isEmpty(tempAdDate)) {
            this.retailSecondarySecurityForm.get([mainArray, index, origin + 'Trans']).patchValue(finalADDate);
            this.retailSecondarySecurityForm.get([mainArray, index, origin + 'CT']).patchValue(finalADDate);
          }
        }
      } else if (dateType === 'BS') {
        if (!ObjectUtil.isEmpty(this.retailSecondarySecurityForm.get([mainArray, index, origin]).value)) {
          const BSDate = this.retailSecondarySecurityForm.get([mainArray, index, origin]).value.nDate;
          if (!ObjectUtil.isEmpty(BSDate)) {
            this.retailSecondarySecurityForm.get([mainArray, index, origin + 'Trans']).patchValue(BSDate);
            this.retailSecondarySecurityForm.get([mainArray, index, origin + 'CT']).patchValue(BSDate);
          }
        }
      }
    }
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
    if (!ObjectUtil.isEmpty(data)) {
      district.id = data;
      this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
          (response: any) => {
            this.municipalityListForSecurities[index] = response.detail;
            this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
            if (event !== null) {
              this.retailSecondarySecurityForm.get(['securityDetails', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
            }
          }
      );
    }
  }

  public municipalityByDistrictIdForEdit(data, index?): void {
    const district = new District();
    if (!ObjectUtil.isEmpty(data)) {
      district.id = data;
      this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
          (response: any) => {
            this.municipalityListForSecurities[index] = response.detail;
            this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));

          }
      );
    }
  }

  setDefaultResponse(arrName, source, index, target) {
    this.retailSecondarySecurityForm.get([String(arrName), index, String(target)]).patchValue(
        this.retailSecondarySecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(
        this.retailSecondarySecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  clearSecurityMunType(controlName, index, formArrayName) {
    const tempVal = this.retailSecondarySecurityForm.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
    if (tempVal === 'VDC') {
      this.retailSecondarySecurityForm.get([formArrayName, index, controlName]).setValue(null);
    }
    this.setDefaultCTAndTransVal('securityOwnersMunicipalityOrVdc', false, 'securityDetails', index);
  }

  checkInsuranceRequired(data, index) {
    this.isInsuranceRequired = data;
    this.retailSecondarySecurityForm.get(['securityDetails', index, 'insuranceRequired']).patchValue(this.isInsuranceRequired);
    this.setDefaultCTAndTransVal('insuranceRequired', false, 'securityDetails', index);
  }


  selectedSecurity(data, index) {
    this.selectedValue = data;
    this.setDefaultCTAndTransVal('securityType', false, 'securityDetails', index);
  }

  removeSecurityDetails(i) {
    (this.retailSecondarySecurityForm.get('securityDetails') as FormArray).removeAt(i);
  }

  setDefaultCTAndTransVal(formControlName, options: boolean, formArrayName?, index?) {
    if (options) {
      const controlVal = !ObjectUtil.isEmpty(this.retailSecondarySecurityForm.get(formControlName).value) ?
          this.retailSecondarySecurityForm.get(formControlName).value : '';
      this.retailSecondarySecurityForm.get(String(formControlName + 'Trans')).patchValue(controlVal);
      this.retailSecondarySecurityForm.get(String(formControlName + 'CT')).patchValue(controlVal);
    } else {
      const sourceValue = !ObjectUtil.isEmpty(this.retailSecondarySecurityForm.get([formArrayName, index, formControlName]).value) ?
          this.retailSecondarySecurityForm.get([formArrayName, index, formControlName]).value : '';
      this.retailSecondarySecurityForm.get([String(formArrayName), index, String(formControlName + 'Trans')]).patchValue(sourceValue);
      this.retailSecondarySecurityForm.get([String(formArrayName), index, String(formControlName + 'CT')]).patchValue(sourceValue);
    }
  }

  addPropertyDetails(i) {
    (this.retailSecondarySecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray).push(this.buildPropertyDetailsArr());
  }

  removePropertyDetailsArr(i, secondIndex) {
    (this.retailSecondarySecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray).removeAt(secondIndex);
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
      securityTranslated: this.retailSecondarySecurityForm.get([String(arrName), index, String(secondArr), index1, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(secondArr), index1, String(target)]).patchValue(
        sourceResponse.securityTranslated);
    this.retailSecondarySecurityForm.get([String(arrName), index, String(secondArr), index1, String(source + 'CT')]).patchValue(
        sourceResponse.securityTranslated);
  }

  translateSecurityFormArrayNumber(arrName, source, index, target, index1, secondArr) {
    const nepaliNumTrans = this.engNepNumberPipe.transform(
        String(this.retailSecondarySecurityForm.get([String(arrName), index, String(secondArr), index1, String(source)]).value));
    this.retailSecondarySecurityForm.get([String(arrName), index, String(secondArr), index1, String(target)]).patchValue(nepaliNumTrans);
    this.retailSecondarySecurityForm.get(
        [String(arrName), index, String(secondArr), index1, String(source + 'CT')]
    ).patchValue(nepaliNumTrans);
  }

  setFormArray(formData) {
    const formArray = this.retailSecondarySecurityForm.get('securityDetails') as FormArray;
    formData.forEach((val, index) => {
      if (!ObjectUtil.isEmpty(val.securityOwnersName)) {
        this.municipalityByDistrictIdForEdit(val.securityOwnersDistrict.id, index);
      }
      formArray.push(
          this.formBuilder.group({
            securityType: [val.securityType],
            securityTypeTrans: [val.securityTypeTrans],
            securityTypeCT: [val.securityTypeCT],
            /* FOR LAND AND BUILDING */
            collateralShare: [val.collateralShare],
            insuranceRequired: [val.insuranceRequired],
            nameOfBorrowingClient: [val.nameOfBorrowingClient],
            securityOwnersName: [val.securityOwnersName],
            securityOwnersDistrict: [val.securityOwnersDistrict],
            securityOwnersMunicipalityOrVdc: [val.securityOwnersMunicipalityOrVdc],
            securityOwnersMunicipality: [val.securityOwnersMunicipality],
            /*securityOwnersWardNo: [val.securityOwnersWardNo],
            securityOwnersKittaNo: [val.securityOwnersKittaNo],
            securityOwnersLandArea: [val.securityOwnersLandArea],
            securityOwnersSheetNo: [val.securityOwnersSheetNo],*/
            /* FOR TRANSLATED FIELDS */
            collateralShareTrans: [val.collateralShareTrans],
            insuranceRequiredTrans: [val.insuranceRequiredTrans],
            nameOfBorrowingClientTrans: [val.nameOfBorrowingClientTrans],
            securityOwnersNameTrans: [val.securityOwnersNameTrans],
            securityOwnersDistrictTrans: [val.securityOwnersDistrictTrans],
            securityOwnersMunicipalityOrVdcTrans: [val.securityOwnersMunicipalityOrVdcTrans],
            securityOwnersMunicipalityTrans: [val.securityOwnersMunicipalityTrans],
            /*securityOwnersWardNoTrans: [val.securityOwnersWardNoTrans],
            securityOwnersKittaNoTrans: [val.securityOwnersKittaNoTrans],
            securityOwnersLandAreaTrans: [val.securityOwnersLandAreaTrans],
            securityOwnersSheetNoTrans: [val.securityOwnersSheetNoTrans],*/
            /* FOR CT VALUES */
            nameOfBorrowingClientCT: [val.nameOfBorrowingClientCT],
            collateralShareCT: [val.collateralShareCT],
            insuranceRequiredCT: [val.insuranceRequiredCT],
            securityOwnersNameCT: [val.securityOwnersNameCT],
            securityOwnersDistrictCT: [val.securityOwnersDistrictCT],
            securityOwnersMunicipalityOrVdcCT: [val.securityOwnersMunicipalityOrVdcCT],
            securityOwnersMunicipalityCT: [val.securityOwnersMunicipalityCT],
            /*securityOwnersWardNoCT: [val.securityOwnersWardNoCT],
            securityOwnersKittaNoCT: [val.securityOwnersKittaNoCT],
            securityOwnersLandAreaCT: [val.securityOwnersLandAreaCT],
            securityOwnersSheetNoCT: [val.securityOwnersSheetNoCT],*/

            mortgageType: [val.mortgageType],
            mortgageTypeTrans: [val.mortgageTypeTrans],
            mortgageTypeCT: [val.mortgageTypeCT],

            fixedDepositHolderName: [val.fixedDepositHolderName],
            FDAmountInFigure: [val.FDAmountInFigure],
            FDAmountInWords: [val.FDAmountInWords],
            tenureOfFixedDeposit: [val.tenureOfFixedDeposit],
            FDReceiptNumber: [val.FDReceiptNumber],
            accountNumber: [val.accountNumber],
            bankName: [val.bankName],
            FDExpiryDateType: [val.FDExpiryDateType],
            FDExpiryDate: [new Date(val.FDExpiryDate)],
            FDExpiryDateNepali: [val.FDExpiryDateNepali],

            fixedDepositHolderNameTrans: [val.fixedDepositHolderNameTrans],
            FDAmountInFigureTrans: [val.FDAmountInFigureTrans],
            FDAmountInWordsTrans: [val.FDAmountInWordsTrans],
            tenureOfFixedDepositTrans: [val.tenureOfFixedDepositTrans],
            FDReceiptNumberTrans: [val.FDReceiptNumberTrans],
            accountNumberTrans: [val.accountNumberTrans],
            bankNameTrans: [val.bankNameTrans],
            FDExpiryDateTypeTrans: [val.FDExpiryDateTypeTrans],
            FDExpiryDateTrans: [val.FDExpiryDateTrans],
            FDExpiryDateNepaliTrans: [val.FDExpiryDateNepaliTrans],

            fixedDepositHolderNameCT: [val.fixedDepositHolderNameCT],
            FDAmountInFigureCT: [val.FDAmountInFigureCT],
            FDAmountInWordsCT: [val.FDAmountInWordsCT],
            tenureOfFixedDepositCT: [val.tenureOfFixedDepositCT],
            FDReceiptNumberCT: [val.FDReceiptNumberCT],
            accountNumberCT: [val.accountNumberCT],
            bankNameCT: [val.bankNameCT],
            FDExpiryDateTypeCT: [val.FDExpiryDateTypeCT],
            FDExpiryDateCT: [val.FDExpiryDateCT],
            FDExpiryDateNepaliCT: [val.FDExpiryDateNepaliCT],
            shareSecurityTable: [val.shareSecurityTable],

            propertyDetails: this.formBuilder.array([]),
          })
      );
      this.setPropertyDetails(val.propertyDetails, index);
      this.shareTable[index] = val.shareSecurityTable;
    });
  }

  setPropertyDetails(data, i) {
    const propertyFormArray = this.retailSecondarySecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray;
    data.forEach((propertyData, index) => {
      propertyFormArray.push(
          this.formBuilder.group({
            securityOwnersWardNo: [propertyData.securityOwnersWardNo],
            securityOwnersKittaNo: [propertyData.securityOwnersKittaNo],
            securityOwnersLandArea: [propertyData.securityOwnersLandArea],
            securityOwnersSheetNo: [propertyData.securityOwnersSheetNo],
            /* Translated fields for multi security Fields */
            securityOwnersWardNoTrans: [propertyData.securityOwnersWardNoTrans],
            securityOwnersKittaNoTrans: [propertyData.securityOwnersKittaNoTrans],
            securityOwnersLandAreaTrans: [propertyData.securityOwnersLandAreaTrans],
            securityOwnersSheetNoTrans: [propertyData.securityOwnersSheetNoTrans],
            /* Final CT fields for multi security Fields */
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
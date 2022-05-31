import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../../../../../@core/service/sbtranslate.service';
import {AddressService} from '../../../../../../../../../../@core/service/baseservice/address.service';
import {District} from '../../../../../../../../../admin/modal/district';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-section2-sme-security',
    templateUrl: './section2-sme-security.component.html',
    styleUrls: ['./section2-sme-security.component.scss']
})
export class Section2SmeSecurityComponent implements OnInit {
    @Input() initialData;
    section2SecurityForm: FormGroup;
    securityFormTranslate: FormGroup;
    allDistrictList = [];
    provinceList = [];
    municipalityListForSecurities = [];
    securityType = [{key: 'LAND', value: 'Land'},
        {key: 'LAND_AND_BUILDING', value: 'Land And Building'},
        {key: 'PERSONAL_GUARANTEE', value: 'Personal Guarantee'},
        {key: 'CORPORATE_GUARANTEE', value: 'Corporate Guarantee'},
        {key: 'CROSS_GUARANTEE', value: 'Cross Guarantee'},
        {key: 'SHARE_PLEDGE', value: 'Share Pledge'}
    ];
    mortgageType = [
        {value: 'New'},
        {value: 'Existing'},
        {value: 'Enhancement'}
    ];
    collateralShare = [{value: 'YES'}, {value: 'NO'}];
    multiContents = [{value: 'NEW'}, {value: 'EXISTING'}];
    isInsuranceRequired = false;
    selectedValue;
    securityDetailsSelected = false;

    constructor(private formBuilder: FormBuilder,
                private engNepNumberPipe: EngToNepaliNumberPipe,
                private translateService: SbTranslateService,
                private addressService: AddressService) {
    }

    ngOnInit() {
        this.buildForm();
        this.getAllProvince();
        this.getAllDistrict();
        if (!ObjectUtil.isEmpty(this.initialData)) {
            if (!ObjectUtil.isEmpty(this.initialData.secondarySecurity[0].securityType)) {
                this.securityDetailsSelected = true;
                this.setFormArray(this.initialData.secondarySecurity);
                this.selectedValue = true;
            }
            /* FOR DEFAULT FORM*/
        }
        if (!this.securityDetailsSelected) {
            this.addMoreSecurityDetails();
        }
    }

    buildForm() {
        this.section2SecurityForm = this.formBuilder.group({
            securityDetails: this.formBuilder.array([]),
        });
    }

    get formControls() {
        return this.section2SecurityForm.controls;
    }

    addMoreSecurityDetails() {
        (this.section2SecurityForm.get('securityDetails') as FormArray).push(this.buildSecurityArray());
    }

    buildSecurityArray() {
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
/*            securityOwnersWardNo: [undefined],
            securityOwnersKittaNo: [undefined],
            securityOwnersLandArea: [undefined],
            securityOwnersSheetNo: [undefined],*/
            /* FOR TRANSLATED FIELDS */
            collateralShareTrans: [undefined],
            insuranceRequiredTrans: [false],
            nameOfBorrowingClientTrans: [undefined],
            securityOwnersNameTrans: [undefined],
            securityOwnersDistrictTrans: [undefined],
            securityOwnersMunicipalityOrVdcTrans: [undefined],
            securityOwnersMunicipalityTrans: [undefined],
/*            securityOwnersWardNoTrans: [undefined],
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
/*            securityOwnersWardNoCT: [undefined],
            securityOwnersKittaNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],*/

            /* FOR PERSONAL GUARANTEE CONDITIONAL */
            personalGuaranteeToBeUsed: [undefined],
            personalGuaranteeToBeUsedTrans: [undefined],
            personalGuaranteeToBeUsedCT: [undefined],

            /* FOR CORPORATE GUARANTEE */
            corporateGuarantee: [undefined],
            corporateGuaranteeTrans: [undefined],
            corporateGuaranteeCT: [undefined],

            /* FOR CROSS GUARANTEE CONTENTS */
            crossGuarantee: [undefined],
            crossGuaranteeTrans: [undefined],
            crossGuaranteeCT: [undefined],

            /* FOR SHARE PLEDGE FIELDS */
            sharePledgeToBeUsed: [undefined],
            nameOfCompany: [undefined],
            numberOfShare: [undefined],
            nameOfShareHolder: [undefined],
            shareHolderName: [undefined],

            /*Translation fields */
            sharePledgeToBeUsedTrans: [undefined],
            nameOfCompanyTrans: [undefined],
            numberOfShareTrans: [undefined],
            nameOfShareHolderTrans: [undefined],
            shareHolderNameTrans: [undefined],

            /* for CT value */
            sharePledgeToBeUsedCT: [undefined],
            nameOfCompanyCT: [undefined],
            numberOfShareCT: [undefined],
            nameOfShareHolderCT: [undefined],
            shareHolderNameCT: [undefined],

            mortgageType: [undefined],
            mortgageTypeTrans: [undefined],
            mortgageTypeCT: [undefined],
            propertyDetails: this.formBuilder.array([this.buildPropertyDetailsArr()]),
        });
    }

    async onChangeTranslate(arrName, source, index, target) {
        this.securityFormTranslate = this.formBuilder.group({
            securityOwnersName: this.section2SecurityForm.get([String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
        this.section2SecurityForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
        this.section2SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
    }

    translateSecurityNumber(arrName, source, index, target) {
        const nepaliNumTrans = this.engNepNumberPipe.transform(
            String(this.section2SecurityForm.get([String(arrName), index, String(source)]).value));
        this.section2SecurityForm.get([String(arrName), index, String(target)]).patchValue(nepaliNumTrans);
        this.section2SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(nepaliNumTrans);
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
                    this.section2SecurityForm.get(['securityDetails', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
                }
            }
        );
    }

    setDefaultResponse(arrName, source, index, target) {
        this.section2SecurityForm.get([String(arrName), index, String(target)]).patchValue(
            this.section2SecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
        this.section2SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(
            this.section2SecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
    }

    clearSecurityMunType(controlName, index, formArrayName) {
        const tempVal = this.section2SecurityForm.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
        if (tempVal === 'VDC') {
            this.section2SecurityForm.get([formArrayName, index, controlName]).setValue(null);
        }
        this.setDefaultCTAndTransVal('securityOwnersMunicipalityOrVdc', false, 'securityDetails', index);
    }

    checkInsuranceRequired(data, index) {
        this.isInsuranceRequired = data;
        this.section2SecurityForm.get(['securityDetails', index, 'insuranceRequired']).patchValue(this.isInsuranceRequired);
        this.setDefaultCTAndTransVal('insuranceRequired', false, 'securityDetails', index);
    }


    selectedSecurity(data, index) {
        this.selectedValue = data;
        this.setDefaultCTAndTransVal('securityType', false, 'securityDetails', index);
    }

    removeSecurityDetails(i) {
        (this.section2SecurityForm.get('securityDetails') as FormArray).removeAt(i);
    }

    setDefaultCTAndTransVal(formControlName, options: boolean, formArrayName?, index?) {
        if (options) {
            const controlVal = !ObjectUtil.isEmpty(this.section2SecurityForm.get(formControlName).value) ?
                this.section2SecurityForm.get(formControlName).value : '';
            this.section2SecurityForm.get(String(formControlName + 'Trans')).patchValue(controlVal);
            this.section2SecurityForm.get(String(formControlName + 'CT')).patchValue(controlVal);
        } else {
            const sourceValue = !ObjectUtil.isEmpty(this.section2SecurityForm.get([formArrayName, index, formControlName]).value) ?
                this.section2SecurityForm.get([formArrayName, index, formControlName]).value : '';
            this.section2SecurityForm.get([String(formArrayName), index, String(formControlName + 'Trans')]).patchValue(sourceValue);
            this.section2SecurityForm.get([String(formArrayName), index, String(formControlName + 'CT')]).patchValue(sourceValue);
        }
    }

    buildPropertyDetailsArr() {
        return this.formBuilder.group({
            securityOwnersWardNo: [undefined],
            securityOwnersKittaNo: [undefined],
            securityOwnersLandArea: [undefined],
            securityOwnersSheetNo: [undefined],
            /* For Translated Value */
            securityOwnersWardNoTrans: [undefined],
            securityOwnersKittaNoTrans: [undefined],
            securityOwnersLandAreaTrans: [undefined],
            securityOwnersSheetNoTrans: [undefined],
            /* For CT values */
            securityOwnersWardNoCT: [undefined],
            securityOwnersKittaNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],
        });
    }

    addPropertyDetails(i) {
        (this.section2SecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray).push(
            this.buildPropertyDetailsArr()
        );
    }

    removePropertyDetailsArr(i, index) {
        (this.section2SecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray).removeAt(index);
    }

    async onChangeArrayTranslate(arrName, source, index, target, index1, secondArr) {
        this.securityFormTranslate = this.formBuilder.group({
            securityTranslated: this.section2SecurityForm.get([String(arrName), index, String(secondArr), index1, String(source)]).value
        });
        const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
        this.section2SecurityForm.get([String(arrName), index, String(secondArr), index1 , String(target)]).patchValue(
            sourceResponse.securityTranslated);
        this.section2SecurityForm.get([String(arrName), index, String(secondArr), index1, String(source + 'CT')]).patchValue(
            sourceResponse.securityTranslated);
    }

    translateSecurityArrayNumber(arrName, source, index, target, index1, secondArr) {
        const nepaliNumTrans = this.engNepNumberPipe.transform(
            String(this.section2SecurityForm.get([String(arrName), index, String(secondArr), index1, String(source)]).value));
        this.section2SecurityForm.get([String(arrName), index, String(secondArr), index1 , String(target)]).patchValue(nepaliNumTrans);
        this.section2SecurityForm.get(
            [String(arrName), index, String(secondArr), index1, String(source + 'CT')]
        ).patchValue(nepaliNumTrans);
    }

    setFormArray(formData) {
        const formArray = this.section2SecurityForm.get('securityDetails') as FormArray;
        formData.forEach((val, index) => {
            if (!ObjectUtil.isEmpty(val.securityOwnersDistrict)) {
                this.getMunicipalityByDistrict(val.securityOwnersDistrict.id, null , index);
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
                    /* FOR TRANSLATED FIELDS */
                    collateralShareTrans: [val.collateralShareTrans],
                    insuranceRequiredTrans: [val.insuranceRequiredTrans],
                    nameOfBorrowingClientTrans: [val.nameOfBorrowingClientTrans],
                    securityOwnersNameTrans: [val.securityOwnersNameTrans],
                    securityOwnersDistrictTrans: [val.securityOwnersDistrictTrans],
                    securityOwnersMunicipalityOrVdcTrans: [val.securityOwnersMunicipalityOrVdcTrans],
                    securityOwnersMunicipalityTrans: [val.securityOwnersMunicipalityTrans],
                    /* FOR CT VALUES */
                    nameOfBorrowingClientCT: [val.nameOfBorrowingClientCT],
                    collateralShareCT: [val.collateralShareCT],
                    insuranceRequiredCT: [val.insuranceRequiredCT],
                    securityOwnersNameCT: [val.securityOwnersNameCT],
                    securityOwnersDistrictCT: [val.securityOwnersDistrictCT],
                    securityOwnersMunicipalityOrVdcCT: [val.securityOwnersMunicipalityOrVdcCT],
                    securityOwnersMunicipalityCT: [val.securityOwnersMunicipalityCT],

                    /* FOR PERSONAL GUARANTEE CONDITIONAL */
                    personalGuaranteeToBeUsed: [val.personalGuaranteeToBeUsed],
                    personalGuaranteeToBeUsedTrans: [val.personalGuaranteeToBeUsedTrans],
                    personalGuaranteeToBeUsedCT: [val.personalGuaranteeToBeUsedCT],

                    /* FOR CORPORATE GUARANTEE */
                    corporateGuarantee: [val.corporateGuarantee],
                    corporateGuaranteeTrans: [val.corporateGuaranteeTrans],
                    corporateGuaranteeCT: [val.corporateGuaranteeCT],

                    /* FOR CROSS GUARANTEE CONTENTS */
                    crossGuarantee: [val.crossGuarantee],
                    crossGuaranteeTrans: [val.crossGuaranteeTrans],
                    crossGuaranteeCT: [val.crossGuaranteeCT],

                    /* FOR SHARE PLEDGE FIELDS */
                    sharePledgeToBeUsed: [val.sharePledgeToBeUsed],
                    nameOfCompany: [val.nameOfCompany],
                    numberOfShare: [val.numberOfShare],
                    nameOfShareHolder: [val.nameOfShareHolder],
                    shareHolderName: [val.shareHolderName],

                    /*Translation fields */
                    sharePledgeToBeUsedTrans: [val.sharePledgeToBeUsedTrans],
                    nameOfCompanyTrans: [val.nameOfCompanyTrans],
                    numberOfShareTrans: [val.numberOfShareTrans],
                    nameOfShareHolderTrans: [val.nameOfShareHolderTrans],
                    shareHolderNameTrans: [val.shareHolderNameTrans],

                    /* for CT value */
                    sharePledgeToBeUsedCT: [val.sharePledgeToBeUsedCT],
                    nameOfCompanyCT: [val.nameOfCompanyCT],
                    numberOfShareCT: [val.numberOfShareCT],
                    nameOfShareHolderCT: [val.nameOfShareHolderCT],
                    shareHolderNameCT: [val.shareHolderNameCT],

                    mortgageType: [val.mortgageType],
                    mortgageTypeTrans: [val.mortgageTypeTrans],
                    mortgageTypeCT: [val.mortgageTypeCT],
                    propertyDetails: this.formBuilder.array([]),
                })
            );
            this.setPropertyDetails(val.propertyDetails, index);
        });
    }

    setPropertyDetails(data, i) {
        const propertyFormArray = this.section2SecurityForm.get(['securityDetails', i, 'propertyDetails']) as FormArray;
        data.forEach(propertyData => {
            propertyFormArray.push(
                this.formBuilder.group({
                    securityOwnersWardNo: [propertyData.securityOwnersWardNo],
                    securityOwnersKittaNo: [propertyData.securityOwnersKittaNo],
                    securityOwnersLandArea: [propertyData.securityOwnersLandArea],
                    securityOwnersSheetNo: [propertyData.securityOwnersSheetNo],
                    /* For Translated Value */
                    securityOwnersWardNoTrans: [propertyData.securityOwnersWardNoTrans],
                    securityOwnersKittaNoTrans: [propertyData.securityOwnersKittaNoTrans],
                    securityOwnersLandAreaTrans: [propertyData.securityOwnersLandAreaTrans],
                    securityOwnersSheetNoTrans: [propertyData.securityOwnersSheetNoTrans],
                    /* For CT values */
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

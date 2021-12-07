import {Component, OnInit} from '@angular/core';
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
    collateralShare = [{value: 'YES'}, {value: 'NO'}];
    multiContents = [{value: 'NEW'}, {value: 'EXISTING'}];
    isInsuranceRequired = false;
    selectedValue;

    constructor(private formBuilder: FormBuilder,
                private engNepNumberPipe: EngToNepaliNumberPipe,
                private translateService: SbTranslateService,
                private addressService: AddressService) {
    }

    ngOnInit() {
        this.buildForm();
        this.getAllProvince();
        this.getAllDistrict();
    }

    buildForm() {
        this.section2SecurityForm = this.formBuilder.group({
            securityType: [undefined],
            securityDetails: this.formBuilder.array([]),
        });
        /* FOR DEFAULT FORM*/
        this.addMoreSecurityDetails();
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
            securityOwnersWardNo: [undefined],
            securityOwnersKittaNo: [undefined],
            securityOwnersLandArea: [undefined],
            securityOwnersSheetNo: [undefined],
            /* FOR TRANSLATED FIELDS */
            collateralShareTrans: [undefined],
            insuranceRequiredTrans: [false],
            nameOfBorrowingClientTrans: [undefined],
            securityOwnersNameTrans: [undefined],
            securityOwnersDistrictTrans: [undefined],
            securityOwnersMunicipalityOrVdcTrans: [undefined],
            securityOwnersMunicipalityTrans: [undefined],
            securityOwnersWardNoTrans: [undefined],
            securityOwnersKittaNoTrans: [undefined],
            securityOwnersLandAreaTrans: [undefined],
            securityOwnersSheetNoTrans: [undefined],
            /* FOR CT VALUES */
            nameOfBorrowingClientCT: [undefined],
            collateralShareCT: [undefined],
            insuranceRequiredCT: [false],
            securityOwnersNameCT: [undefined],
            securityOwnersDistrictCT: [undefined],
            securityOwnersMunicipalityOrVdcCT: [undefined],
            securityOwnersMunicipalityCT: [undefined],
            securityOwnersWardNoCT: [undefined],
            securityOwnersKittaNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],

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

}

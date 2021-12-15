import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../../../../../@core/service/sbtranslate.service';
import {District} from '../../../../../../../../../admin/modal/district';
import {AddressService} from '../../../../../../../../../../@core/service/baseservice/address.service';
import {ObjectUtil} from '../../../../../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-section1-sme-security',
    templateUrl: './section1-sme-security.component.html',
    styleUrls: ['./section1-sme-security.component.scss']
})
export class Section1SmeSecurityComponent implements OnInit {
    section1SecurityForm: FormGroup;
    securityFormTranslate: FormGroup;
    holderDepositorTranslate: FormGroup;
    tempForm: FormGroup;
    allDistrictList = [];
    provinceList = [];
    municipalityListForSecurities = [];
    securityType = [{key: 'LAND', value: 'Land'},
        {key: 'LAND_AND_BUILDING', value: 'Land And Building'},
        {key: 'HYPOTHECATION', value: 'Hypothecation'},
        {key: 'ASSIGNMENT', value: 'Assignment'},
        {key: 'PARIPASSU', value: 'Paripassu'},
        {key: 'LIEN AGAINST FD', value: 'Lien Against FD'},
        {key: 'LIEN AGAINST DEPOSIT ACCOUNT', value: 'Lien Against Deposit Account'},
        {key: 'LIEN AGAINST DEBENTURE', value: 'Lien Against Debenture'},
        {key: 'VEHICLE_REGISTRATION', value: 'Vehicle Registration'},
        {key: 'GENERAL_COUNTER_GUARANTEE', value: 'General Counter Guarantee'}
    ];
    mortgageType = [
        {value: 'New'},
        {value: 'Existing'},
        {value: 'Enhancement'}
    ];
    collateralShare = [{value: 'YES'}, {value: 'NO'}];
    hypoContents = [{value: 'For Trading Unit'}, {value: 'For Manufacturing Case'}];
    multiContents = [{value: 'NEW'}, {value: 'EXISTING'}];
    isInsuranceRequired = false;
    selectedValue;
    isNabil = false;
    isOther = false;
    tempValue;

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
        this.section1SecurityForm = this.formBuilder.group({
            // securityType: [undefined],
            securityDetails: this.formBuilder.array([]),
        });
        /* FOR DEFAULT FORM*/
        this.addMoreSecurityDetails();
    }

    get formControls() {
        return this.section1SecurityForm.controls;
    }

    addMoreSecurityDetails() {
        (this.section1SecurityForm.get('securityDetails') as FormArray).push(this.setSecurityDetailsArr());
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
            /*securityOwnersWardNo: [undefined],
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
            /*securityOwnersWardNoCT: [undefined],
            securityOwnersKittaNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],*/

            /* FOR HYPOTHECATION CONDITION*/
            hypothecationPurpose: [undefined],
            hypothecationPurposeTrans: [undefined],
            hypothecationPurposeCT: [undefined],

            /* FOR ASSIGNMENT TO BE USED CONDITION */
            assignmentToBeUsed: [undefined],
            assignmentToBeUsedTrans: [undefined],
            assignmentToBeUsedCT: [undefined],

            /* FOR PARIPASSU CONDITION */
            paripassuContents: [undefined],
            nameOfMemberBank: [undefined],
            paripassuContentsTrans: [undefined],
            nameOfMemberBankTrans: [undefined],
            paripassuContentsCT: [undefined],
            nameOfMemberBankCT: [undefined],

            /* FOR LIEN AGAINST FD CONDITIONS */
            lienFDContents: [undefined],
            lienFDContentsTrans: [undefined],
            lienFDContentsCT: [undefined],
            letterOfSetOffFD: [undefined],
            letterOfSetOffFDTrans: [undefined],
            letterOfSetOffFDCT: [undefined],
            holdingBank: [undefined],
            nameOfHoldingBank: [undefined],
            FdAmountInFigure: [undefined],
            holdingBankTrans: [undefined],
            nameOfHoldingBankTrans: [undefined],
            FdAmountInFigureTrans: [undefined],
            holdingBankCT: [undefined],
            nameOfHoldingBankCT: [undefined],
            FdAmountInFigureCT: [undefined],
            nameOfFDHolder: [undefined],
            nameOfFDHolderTrans: [undefined],
            nameOfFDHolderCT: [undefined],

            /* FOR LIEN AGAINST DEPOSIT ACCOUNT CONDITIONS */
            lienDepositAccountContents: [undefined],
            lienDepositAccountContentsTrans: [undefined],
            lienDepositAccountContentsCT: [undefined],
            letterOfSetOffDeposit: [undefined],
            letterOfSetOffDepositTrans: [undefined],
            letterOfSetOffDepositCT: [undefined],
            accountType: [undefined],
            accountNumber: [undefined],
            amountInFigure: [undefined],
            accountTypeTrans: [undefined],
            accountNumberTrans: [undefined],
            amountInFigureTrans: [undefined],
            accountTypeCT: [undefined],
            accountNumberCT: [undefined],
            amountInFigureCT: [undefined],
            nameOfDepositors: [undefined],
            nameOfDepositorsTrans: [undefined],
            nameOfDepositorsCT: [undefined],

            /* FOR LIEN AGAINST DEBENTURE CONDITIONS */
            lienDebentureContents: [undefined],
            lienDebentureContentsTrans: [undefined],
            lienDebentureContentsCT: [undefined],
            bondType: [undefined],
            bondTypeTrans: [undefined],
            bondTypeCT: [undefined],
            debentureAmountInFigure: [undefined],
            debentureAmountInFigureTrans: [undefined],
            debentureAmountInFigureCT: [undefined],
            nameOfDebentureHolder: [undefined],
            nameOfDebentureHolderTrans: [undefined],
            nameOfDebentureHolderCT: [undefined],

            /* FOR VEHICLE REGISTRATION */
            vehicleRegistration: [undefined],
            vehicleRegistrationTrans: [undefined],
            vehicleRegistrationCT: [undefined],

            /* FOR GENERAL COUNTER GUARANTEE */
            generalCounterGuarantee: [undefined],
            generalCounterGuaranteeTrans: [undefined],
            generalCounterGuaranteeCT: [undefined],

            mortgageType: [undefined],
            mortgageTypeTrans: [undefined],
            mortgageTypeCT: [undefined],

            /*fdHolderDetails: this.formBuilder.array([this.buildFDHolderDetailsArr()]),
            depositorDetails: this.formBuilder.array([this.buildDepositorDetailsArr()]),
            debentureDetails: this.formBuilder.array([this.buildDebentureDetailsArr()]),*/
            extraDetails: this.formBuilder.array([this.buildExtraDetailsArr()]),
        });
    }

    async onChangeTranslate(arrName, source, index, target) {
        this.securityFormTranslate = this.formBuilder.group({
            securityOwnersName: this.section1SecurityForm.get([String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translateService.translateForm(this.securityFormTranslate);
        this.section1SecurityForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
        this.section1SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
    }

    translateSecurityNumber(arrName, source, index, target) {
        const nepaliNumTrans = this.engNepNumberPipe.transform(
            String(this.section1SecurityForm.get([String(arrName), index, String(source)]).value));
        this.section1SecurityForm.get([String(arrName), index, String(target)]).patchValue(nepaliNumTrans);
        this.section1SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(nepaliNumTrans);
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
                    this.section1SecurityForm.get(['securityDetails', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
                }
            }
        );
    }

    setDefaultResponse(arrName, source, index, target) {
        this.section1SecurityForm.get([String(arrName), index, String(target)]).patchValue(
            this.section1SecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
        this.section1SecurityForm.get([String(arrName), index, String(source + 'CT')]).patchValue(
            this.section1SecurityForm.get([String(arrName), index, String(source)]).value.nepaliName);
    }

    clearSecurityMunType(controlName, index, formArrayName) {
        const tempVal = this.section1SecurityForm.get([formArrayName, index, 'securityOwnersMunicipalityOrVdc']).value;
        if (tempVal === 'VDC') {
            this.section1SecurityForm.get([formArrayName, index, controlName]).setValue(null);
        }
        this.setDefaultCTAndTransVal('securityOwnersMunicipalityOrVdc', false, 'securityDetails', index);
    }

    checkInsuranceRequired(data, index) {
        this.isInsuranceRequired = data;
        this.section1SecurityForm.get(['securityDetails', index, 'insuranceRequired']).patchValue(this.isInsuranceRequired);
        this.setDefaultCTAndTransVal('insuranceRequired', false, 'securityDetails', index);
    }


    selectedSecurity(data, index) {
        this.selectedValue = data;
        this.setDefaultCTAndTransVal('securityType', false, 'securityDetails', index);
    }

    removeSecurityDetails(i) {
        (this.section1SecurityForm.get('securityDetails') as FormArray).removeAt(i);
    }

    setDefaultCTAndTransVal(formControlName, options: boolean, formArrayName?, index?) {
        if (options) {
            const controlVal = !ObjectUtil.isEmpty(this.section1SecurityForm.get(formControlName).value) ?
                this.section1SecurityForm.get(formControlName).value : '';
            this.section1SecurityForm.get(String(formControlName + 'Trans')).patchValue(controlVal);
            this.section1SecurityForm.get(String(formControlName + 'CT')).patchValue(controlVal);
        } else {
            const sourceValue = !ObjectUtil.isEmpty(this.section1SecurityForm.get([formArrayName, index, formControlName]).value) ?
                this.section1SecurityForm.get([formArrayName, index, formControlName]).value : '';
            this.section1SecurityForm.get([String(formArrayName), index, String(formControlName + 'Trans')]).patchValue(sourceValue);
            this.section1SecurityForm.get([String(formArrayName), index, String(formControlName + 'CT')]).patchValue(sourceValue);
        }
    }

    changeHoldingBank(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isNabil = tempData === 'NABIL';
        this.isOther = tempData === 'OTHER';
    }


    addExtraDetails(i) {
        (this.section1SecurityForm.get(['securityDetails', i, 'extraDetails']) as FormArray).push(this.buildExtraDetailsArr());
    }

    removeExtraDetailsArr(i, secondIndex) {
        (this.section1SecurityForm.get(['securityDetails', i, 'extraDetails']) as FormArray).removeAt(secondIndex);
    }

    buildExtraDetailsArr() {
        return this.formBuilder.group({
            securityOwnersWardNo: [undefined],
            securityOwnersKittaNo: [undefined],
            securityOwnersLandArea: [undefined],
            securityOwnersSheetNo: [undefined],

            securityOwnersWardNoTrans: [undefined],
            securityOwnersKittaNoTrans: [undefined],
            securityOwnersLandAreaTrans: [undefined],
            securityOwnersSheetNoTrans: [undefined],
            securityOwnersWardNoCT: [undefined],
            securityOwnersKittaNoCT: [undefined],
            securityOwnersLandAreaCT: [undefined],
            securityOwnersSheetNoCT: [undefined],
        });
    }
}

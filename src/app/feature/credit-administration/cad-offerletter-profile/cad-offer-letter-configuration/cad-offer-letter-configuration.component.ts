import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerType} from '../../../customer/model/customerType';
import {DatePipe} from '@angular/common';
import {RelationshipNepali} from '../../../loan/model/relationshipListNepali';
import {Guarantor} from '../../../loan/model/guarantor';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {environment} from '../../../../../environments/environment';
import {Clients} from '../../../../../environments/Clients';
import {Province} from '../../../admin/modal/province';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {NepDataPersonal} from '../../model/nepDataPersonal';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {District} from '../../../admin/modal/district';
import {Collateral} from '../../../loan/model/collateral';
import {CollateralDetail} from '../../../loan/model/collateralDetail';

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})

export class CadOfferLetterConfigurationComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() collateralDetail: CollateralDetail;
    @Input() customer: Customer;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    guarantorList: Array<Guarantor>;
    collateralList: Array<Collateral>;
    userConfigForm: FormGroup;
    spinner = false;
    submitted = false;
    relationshipList = RelationshipNepali.enumObject();
    hideSaveBtn = false;
    client = environment.client;
    clientList = Clients;
    nepDataPersonal = new NepDataPersonal();
    branchList;
    province: Province = new Province();
    permanentProvinceList: Array<Province> = Array<Province>();
    temporaryProvinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    temporaryDistrictList: Array<District> = Array<District>();
    temporaryMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    allDistrict: Array<District> = Array<District>();
    nepData;

    constructor(private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                private addressService: AddressService,
                private branchService: BranchService,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>) {
    }

    ngOnInit() {
        this.getProvince();
        this.getAllDistrict();
        this.branchService.getAll().subscribe((res: any) => {
            this.branchList = res.detail;
        });

       this.addressService.getAllDistrict().subscribe((res: any) => {
           this.districtList = res.detail;
       });

        this.buildForm();
        this.patchAddressObject();
    }

    getProvince() {
        let provinces: Array<Province>;
        this.addressService.getProvince().subscribe((res: any) => {
            provinces = res.detail;
            this.permanentProvinceList = provinces;
            this.temporaryProvinceList = provinces;
        });
    }

    getDistricts(province: Province) {
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getMunicipalities(district: District) {
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
                this.municipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                this.municipalitiesList.forEach(municipality => {
                    if (!ObjectUtil.isEmpty(this.customer.municipalities) && municipality.id === this.customer.municipalities.id) {
                        this.userConfigForm.controls.municipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    getTemporaryDistricts(province: Province) {
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.temporaryDistrictList = response.detail;
                this.temporaryDistrictList.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getTemporaryMunicipalities(district: District) {
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.temporaryMunicipalitiesList = response.detail;
                this.temporaryMunicipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                this.temporaryMunicipalitiesList.forEach(municipality => {
                    if (!ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) &&
                        municipality.id === this.customer.temporaryMunicipalities.id) {
                        this.userConfigForm.controls.temporaryMunicipalities.setValue(municipality);
                    }
                });
            }
        );

    }

    private getAllDistrict() {
        this.addressService.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
            this.allDistrict.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            name: [undefined],
            nameInEnglish: [undefined],
            // gender: [undefined],
            gender: [this.checkIsIndividual() ? this.gender(this.customerInfo.gender) : undefined],
            fatherName: [undefined],
            grandFatherName: [undefined],
            grandMotherName: [undefined],
            motherName: [undefined],
            accountNo: [undefined],
            relationMedium: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [undefined],
            age: [undefined],
            permanentProvince: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipalities: [undefined],
            permanentMunType: [0],
            temporaryProvince: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipalities: [undefined],
            permanentWard: [undefined],
            customerEmail: [undefined],
            contactNumber: [undefined],
            temporaryWard: [undefined],
            temporaryMunType: [1],
            guarantorDetails: this.formBuilder.array([]),
            collateralDetails: this.formBuilder.array([]),
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDate: [undefined],
            companyName: [undefined],
            companyDistrict: [undefined],
            companyVdcMun: [undefined],
            companyWardNo: [undefined],
            ministryOfGovernmentOfNepal: [undefined],
            department: [undefined],
            companyRegistrarOfficeDistrict: [undefined],
            companyRegistrarOfficeVdcMun: [undefined],
            companyRegistrarOfficeWardNo: [undefined],
            nameOfRegisteringAct: [undefined],
            yearOfActEnactment: [undefined],
            registrationDate: [undefined],
            companyRegistrationNo: [undefined],
            taxPayerServiceOffice: [undefined],
            panRegistrationDate: [undefined],
            panNo: [undefined],
            representativePermanentDistrict: [undefined],
            representativePermanentMunType: [undefined],
            representativePermanentMunicipality: [undefined],
            representativePermanentWard: [undefined],
            representativeTemporaryDistrict: [undefined],
            representativeTemporaryMunType: [undefined],
            representativeTemporaryMunicipality: [undefined],
            representativeTemporaryWard: [undefined],
            representativeGrandFatherName: [undefined],
            representativeFatherName: [undefined],
            representativeHusbandWifeName: [undefined],
            borrowerAge: [undefined],
            representativeName: [undefined],
            representativeCitizenshipNo: [undefined],
            representativeCitizenshipIssueDate: [undefined],
            representativeCitizenshipIssuingAuthority: [undefined],
            branchName: [undefined],
            branchDistrict: [undefined],
            branchMunVdc: [undefined],
            branchWardNo: [undefined],
            branchTelNo: [undefined],
            branchFaxNo: [undefined],
            branchEmail: [undefined],
        });
    }

    ageCalculation(startDate) {
        startDate = this.datepipe.transform(startDate, 'MMMM d, y, h:mm:ss a z');
        const stDate = new Date(startDate);
        const endDate = new Date();
        let diff = (endDate.getTime() - stDate.getTime()) / 1000;
        diff = diff / (60 * 60 * 24);
        const yr = Math.abs(Math.round(diff / 365.25));
        return this.engToNepNumber.transform(yr.toString());
    }

    get basicInfoControls() {
        return this.userConfigForm.controls;
    }

    gender(val) {
        if (val === 'MALE') {
            return 1;
        } else {
            return 0;
        }
    }

    checkIsIndividual() {
        if (CustomerType.INDIVIDUAL === CustomerType[this.customerInfo.customerType]) {
            return true;
        }
        return false;
    }

    save() {
        this.submitted = true;

        if (this.userConfigForm.invalid) {
            return;
        }
        this.spinner = true;
        const data = JSON.stringify(this.userConfigForm.value);
        this.customerInfoService.updateNepaliConfigData(data, this.customerInfo.id).subscribe(res => {
            this.customerInfoData = res.detail;
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
            this.spinner = false;
            this.reloadPage();
            this.dialogRef.close(this.customerInfoData);
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
            console.log(error);
            this.spinner = false;
            this.dialogRef.close();
        });
    }

    closeModal() {
        this.dialogRef.close();
    }

    controlValidation(controlNames, addValidation) {
        controlNames.forEach(s => {
            if (addValidation) {
                this.userConfigForm.get(s).setValidators(Validators.required);
            } else {
                this.userConfigForm.get(s).clearValidators();
            }
            this.userConfigForm.get(s).updateValueAndValidity();
        });
    }

    addGuarantor() {
        (this.userConfigForm.get('guarantorDetails') as FormArray).push(this.addGuarantorField());
    }

    addCollateral() {
        (this.userConfigForm.get('collateralDetails') as FormArray).push(this.addCollateralField());
    }

    addGuarantorField() {
        return this.formBuilder.group({
            name: '',
            guarantorAge: '',
            issuedYear: '',
            issuedPlace: '',
            guarantorLegalDocumentAddress: '',
            relationship: '',
            citizenNumber: ''
        });
    }

    addCollateralField() {
        return this.formBuilder.group({
            collateralName: '',
            collateralFatherName: '',
            collateralGrandFatherName: '',
            collateralProvince: '',
            collateralDistrict: '',
            collateralMunVdc: '',
            collateralWardNo: '',
            collateralTemporaryProvince: '',
            collateralTemporaryDistrict: '',
            collateralTemporaryMunVdc: '',
            collateralTemporaryWardNo: '',
            plotNo: '',
            areaOfCollateral: '',
            seatNo: '',
            valuationDate: '',
            valuatorName: '',
            fairMarketValue: '',
            distressValue: '',
        });
    }

    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
    }

    removeAtIndexCollateral(i: any) {
        (this.userConfigForm.get('collateralDetails') as FormArray).removeAt(i);
    }

    onChangeTab(event) {
        this.hideSaveBtn = false;
        console.log(event.tabId);
        if (event.tabId === '2') {
            this.hideSaveBtn = true;
        }
    }

    setGuarantors(guarantorDetails: any) {
        const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.guarantors.guarantorList)) {
                const guarantorList = this.customerInfo.guarantors.guarantorList;
                this.guarantorList = guarantorList;
            }
        }

        guarantorDetails.forEach(value => {
            formArray.push(this.formBuilder.group({
                name: [value.name],
                guarantorAge: [value.guarantorAge],
                issuedYear: [value.issuedYear],
                issuedPlace: [value.issuedPlace],
                guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
                relationship: [value.relationship],
                citizenNumber: [value.citizenNumber]
            }));
        });
    }

    setCollaterals(collateralDetails: any) {
        const formArray = this.userConfigForm.get('collateralDetails') as FormArray;
        if (!ObjectUtil.isEmpty(this.customerInfo.collaterals)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.collaterals.collateralList)) {
                const collateralList = this.customerInfo.collaterals.collateralList;
                this.collateralList = collateralList;
            }
        }

        collateralDetails.forEach(value => {
            formArray.push(this.formBuilder.group({
                collateralName: [value.collateralName],
                collateralFatherName: [value.collateralFatherName],
                collateralGrandFatherName: [value.collateralGrandFatherName],
                collateralProvince: [value.collateralProvince],
                collateralDistrict: [value.collateralDistrict],
                collateralMunVdc: [value.collateralMunVdc],
                collateralWardNo: [value.collateralWardNo],
                collateralTemporaryProvince: [value.collateralTemporaryProvince],
                collateralTemporaryDistrict: [value.collateralTemporaryDistrict],
                collateralTemporaryMunVdc: [value.collateralTemporaryMunVdc],
                collateralTemporaryWardNo: [value.collateralTemporaryWardNo],
                plotNo: [value.plotNo],
                areaOfCollateral: [value.areaOfCollateral],
                seatNo: [value.seatNo],
                valuationDate: [value.valuationDate],
                valuatorName: [value.valuatorName],
                fairMarketValue: [value.fairMarketValue],
                distressValue: [value.distressValue],
            }));
        });
    }

    patchAddressObject(): void {
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
            this.userConfigForm.get('permanentProvince').patchValue(data.permanentProvince);
            this.getDistricts(data.permanentProvince);
            this.userConfigForm.get('permanentDistrict').patchValue(data.permanentDistrict);
            this.getMunicipalities(data.permanentDistrict);
            this.userConfigForm.get('permanentMunicipalities').patchValue(data.permanentMunicipalities);
            this.userConfigForm.get('temporaryProvince').patchValue(data.temporaryProvince);
            this.getTemporaryDistricts(data.temporaryProvince);
            this.userConfigForm.get('temporaryDistrict').patchValue(data.temporaryDistrict);
            this.getTemporaryMunicipalities(data.temporaryDistrict);
            this.userConfigForm.get('temporaryMunicipalities').patchValue(data.temporaryMunicipalities);
            this.setGuarantors(data.guarantorDetails);
            this.setCollaterals(data.collateralDetails);
        }
    }

    reloadPage() {
        window.location.reload();
    }

    getBranchDetails(event) {
        this.branchList.forEach(singleData => {
            if (event === singleData.nepaliName) {
                const branchWardNo = this.engToNepNumberPipe.transform(singleData.wardNumber);
                this.userConfigForm.get('branchWardNo').patchValue(branchWardNo);
                const branchDistrictName = singleData.district.nepaliName;
                this.userConfigForm.get('branchDistrict').patchValue(branchDistrictName);
                const branchMunVdcName = singleData.municipalityVdc.nepaliName;
                this.userConfigForm.get('branchMunVdc').patchValue(branchMunVdcName);
            }
        }
        );
    }
}

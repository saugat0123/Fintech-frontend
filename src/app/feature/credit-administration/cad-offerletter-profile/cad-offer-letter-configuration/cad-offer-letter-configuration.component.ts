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

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})

export class CadOfferLetterConfigurationComponent implements OnInit {

    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() customer: Customer;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    guarantorList: Array<Guarantor>;
    userConfigForm: FormGroup;
    spinner = false;
    submitted = false;
    relationshipList = RelationshipNepali.enumObject();
    hideSaveBtn = false;
    client = environment.client;
    clientList = Clients;
    nepDataPersonal = new NepDataPersonal();
    branchList;
    branchMunVdc;
    province: Province = new Province();
    provinceList: Array<Province> = Array<Province>();
    temporaryProvinceList: Array<Province> = Array<Province>();
    district: District = new District();
    districtList: Array<District> = Array<District>();
    municipality: MunicipalityVdc = new MunicipalityVdc();
    municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    temporaryDistrictList: Array<District> = Array<District>();
    temporaryMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
    allDistrict: Array<District> = Array<District>();
    guarantorPermanentProvinceList: Array<Province> = Array<Province>();
    guarantorTemporaryProvinceList: Array<Province> = Array<Province>();
    constructor(private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                private addressService: AddressService,
                private branchService: BranchService,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>) {
    }

    ngOnInit() {
        this.getProvince();
        this.getAllDistrict();
        // this.branchService.getAll().subscribe((res: any) => {
        //     this.branchList = res.detail;
        // });

        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
            this.setGuarantors(data.guarantorDetails);
        }
    }

    getProvince() {
        this.addressService.getProvince().subscribe((res: any) => {
            this.provinceList = res.detail;
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
            gender: [undefined],
            // gender: [this.checkIsIndividual() ? this.gender(this.customerInfo.gender) : undefined],
            fatherName: [undefined],
            grandFatherName: [undefined],
            grandMotherName: [undefined],
            motherName: [undefined],
            accountNo: [undefined],
            relationMedium: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [undefined],
            // citizenshipNo: [undefined],
            // age: [undefined],
            age: [undefined],
            // tslint:disable-next-line:max-line-length
            province: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.province) ? undefined : this.customer.province.nepaliName : undefined],
            // province: [undefined],
            // tslint:disable-next-line:max-line-length
            district: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.district) ? undefined : this.customer.district.nepaliName : undefined],
            // district: [undefined],
            // tslint:disable-next-line:max-line-length
            municipalities: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.municipalities) ? undefined : this.customer.municipalities.nepaliName : undefined],
            // municipalities: [undefined],
            permanentMunType: [0],
            // tslint:disable-next-line:max-line-length
            // temporaryProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryProvince) ? undefined : this.customer.temporaryProvince.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            // temporaryDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryDistrict) ? undefined : this.customer.temporaryDistrict.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            // temporaryMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) ? undefined : this.customer.temporaryMunicipalities.nepaliName : undefined],
            // permanentWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.wardNumber) : undefined],
            // temporaryWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.temporaryWardNumber) : undefined],
            // tslint:disable-next-line:max-line-length
            temporaryProvince: [undefined],
            // tslint:disable-next-line:max-line-length
            temporaryDistrict: [undefined],
            // tslint:disable-next-line:max-line-length
            temporaryMunicipalities: [undefined],
            wardNumber: [undefined],
            customerEmail: [undefined],
            contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, [Validators.required,
                Validators.max(9999999999), Validators.min(1000000000)]],
            temporaryWard: [undefined],
            temporaryMunType: [1],
            guarantorDetails: this.formBuilder.array([]),
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
            telNo: [undefined],
            faxNo: [undefined],
            email: [undefined],
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

    addGuarantorField() {
        return this.formBuilder.group({
            name: [undefined],
            guarantorAge: [undefined],
            issuedYear: [undefined],
            issuedPlace: [undefined],
            guarantorLegalDocumentAddress: [undefined],
            relationship: [undefined],
            citizenNumber: [undefined],
            guarantorMobileNumber: [undefined],
            guarantorEmailAddress: [undefined],
            guarantorGrandfatherName: [undefined],
            guarantorFatherName: [undefined],
            guarantorFatherInLawName: [undefined],
            guarantorSpouseName: [undefined],
            guarantorPermanentMunType: [0],
            guarantorPermanentProvince: [undefined],
            guarantorPermanentDistrict: [undefined],
            guarantorPermanentMunicipality: [undefined],
            guarantorPermanentWard: [undefined],
            guarantorTemporaryMunType: [1],
            guarantorTemporaryProvince: [undefined],
            guarantorTemporaryDistrict: [undefined],
            guarantorTemporaryMunicipality: [undefined],
            guarantorTemporaryWard: [undefined]
        });
    }

    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
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
                citizenNumber: [value.citizenNumber],
                guarantorMobileNumber: [value.guarantorMobileNumber],
                guarantorEmailAddress: [value.guarantorEmailAddress],
                guarantorGrandfatherName: [value.guarantorGrandfatherName],
                guarantorFatherName: [value.guarantorFatherName],
                guarantorFatherInLawName: [value.guarantorFatherInLawName],
                guarantorSpouseName: [value.guarantorSpouseName],
                guarantorPermanentMunType: [value.guarantorPermanentMunType],
                guarantorPermanentProvince: [value.guarantorPermanentProvince],
                guarantorPermanentDistrict: [value.guarantorPermanentDistrict],
                guarantorPermanentMunicipality: [value.guarantorPermanentMunicipality],
                guarantorPermanentWard: [value.guarantorPermanentWard],
                guarantorTemporaryMunType: [value.guarantorTemporaryMunType],
                guarantorTemporaryProvince: [value.guarantorTemporaryProvince],
                guarantorTemporaryDistrict: [value.guarantorTemporaryDistrict],
                temporaryMunicipality: [value.temporaryMunicipality],
                guarantorTemporaryWard: [value.guarantorTemporaryWard]
            }));
        });
    }

    reloadPage() {
        window.location.reload();
    }
}

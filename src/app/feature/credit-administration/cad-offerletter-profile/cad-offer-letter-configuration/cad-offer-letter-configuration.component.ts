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
    districtList;
    branchMunVdc;

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

    get configForm() {
        return this.userConfigForm.controls;
    }

    ngOnInit() {
        this.addressService.getAllDistrict().subscribe((res: any) => {
            this.districtList = res.detail;
        });

        this.branchService.getAll().subscribe((res: any) => {
            this.branchList = res.detail;
        });

        /*this.addressService.getMunicipalityVDCByDistrict().subscribe((res: any) => {
            this.branchMunVdc = res.detail;
        });*/

        this.buildForm();
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
            this.setGuarantors(data.guarantorDetails);
        }
    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            name: [undefined],
            nameInEnglish : [undefined],
            gender: [this.checkIsIndividual() ? this.gender(this.customerInfo.gender) : undefined],
            fatherName: [undefined],
            grandFatherName: [undefined],
            relationMedium: [undefined],
            husbandName: [undefined],
            fatherInLawName: [undefined],
            citizenshipNo: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customerInfo.idNumber) : undefined],
            age: [this.checkIsIndividual() ? this.ageCalculation(this.customer.dob) : undefined],
            // tslint:disable-next-line:max-line-length
            permanentProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.province) ? undefined : this.customer.province.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            permanentDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.district) ? undefined : this.customer.district.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            permanentMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.municipalities) ? undefined : this.customer.municipalities.nepaliName : undefined],
            permanentMunType: [0],
            // tslint:disable-next-line:max-line-length
            temporaryProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryProvince) ? undefined : this.customer.temporaryProvince.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            temporaryDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryDistrict) ? undefined : this.customer.temporaryDistrict.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            temporaryMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) ? undefined : this.customer.temporaryMunicipalities.nepaliName : undefined],
            permanentWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.wardNumber) : undefined],
            temporaryWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.temporaryWardNumber) : undefined],
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
            // tslint:disable-next-line:max-line-length
            guarantorPermanentProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.province) ? undefined : this.customer.province.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            guarantorPermanentDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.district) ? undefined : this.customer.district.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            guarantorPermanentMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.municipalities) ? undefined : this.customer.municipalities.nepaliName : undefined],
            guarantorPermanentWard:  [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.wardNumber) : undefined],
            guarantorTemporaryMunType: [1],
            // tslint:disable-next-line:max-line-length
            guarantorTemporaryProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryProvince) ? undefined : this.customer.temporaryProvince.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            guarantorTemporaryDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryDistrict) ? undefined : this.customer.temporaryDistrict.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            guarantorTemporaryMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) ? undefined : this.customer.temporaryMunicipalities.nepaliName : undefined],
            // tslint:disable-next-line:max-line-length
            guarantorTemporaryWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.temporaryWardNumber) : undefined]
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

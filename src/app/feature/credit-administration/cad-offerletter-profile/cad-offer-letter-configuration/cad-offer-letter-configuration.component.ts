import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
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
import {CollateralOwner} from '../../../loan/model/collateralOwner';
import {NepProposedAmountFormComponent} from './nep-proposed-amount-form/nep-proposed-amount-form.component';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {CustomerCadInfo} from '../../../loan/model/CustomerCadInfo';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

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
    onActionChangeSpinner = false;
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    guarantorList: Array<Guarantor>;
    collateralList: Array<Collateral>;
    collateralOwnerList: Array<CollateralOwner>;
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
    guarantorPermanentProvinceList: Array<Province> = Array<Province>();
    guarantorTemporaryProvinceList: Array<Province> = Array<Province>();
    guarantorPermanentDistrictList = [];
    guarantorTemporaryDistrictList = [];
    guarantorPerMunicipalitiesList = [];
    guarantorTemMunicipalitiesList = [];
    collateralOwnerPermanentProvinceList: Array<Province> = Array<Province>();
    collateralOwnerPermanentDistrictList = [];
    collateralOwnerPermanentMunicipalitiesList = [];
    nepData;
    collateralPermanentProvinceList: Array<Province> = Array<Province>();
    collateralTemporaryProvinceList: Array<Province> = Array<Province>();
    collateralPermanentDistrictList = [];
    collateralPermanentMunicipalitiesList = [];
    collateralTemporaryDistrictList = [];
    collateralTemporaryMunicipalitiesList = [];
    customerCadInfoData = new CustomerCadInfo();

    @ViewChild('loanDetails', {static: false})
    loanDetails: NepProposedAmountFormComponent;

    constructor(private formBuilder: FormBuilder,
                private customerInfoService: CustomerInfoService,
                private service: CreditAdministrationService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                protected ref: NbDialogRef<CadOfferLetterConfigurationComponent>,
                private addressService: AddressService,
                private router: RouterUtilsService,
                private branchService: BranchService,
                private modalService: NgbModal,
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
            this.guarantorPermanentProvinceList = provinces;
            this.guarantorTemporaryProvinceList = provinces;
            this.collateralOwnerPermanentProvinceList = provinces;
            this.collateralPermanentProvinceList = provinces;
            this.collateralTemporaryProvinceList = provinces;
        });
    }

    getDistricts(data, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.municipalitiesList = [];
                    this.basicInfoControls.permanentDistrict.patchValue(null);
                    this.basicInfoControls.permanentMunicipalities.patchValue(null);
                }
            }
        );
    }

    getMunicipalities(data, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalitiesList = response.detail;
                this.municipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.basicInfoControls.permanentMunicipalities.patchValue(null);
                }
            }
        );

    }

    getTemporaryDistricts(data, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.temporaryDistrictList = response.detail;
                this.temporaryDistrictList.sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.temporaryMunicipalitiesList = [];
                    this.basicInfoControls.temporaryDistrict.patchValue(null);
                    this.basicInfoControls.temporaryMunicipalities.patchValue(null);
                }
            }
        );
    }

    getTemporaryMunicipalities(data, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.temporaryMunicipalitiesList = response.detail;
                this.temporaryMunicipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.basicInfoControls.temporaryMunicipalities.patchValue(null);
                }
            }
        );

    }

    getCollateralOwnerDistricts(data, i, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.collateralOwnerPermanentDistrictList[i] = response.detail;
                this.collateralOwnerPermanentDistrictList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.collateralOwnerPermanentMunicipalitiesList[i] = [];
                    this.userConfigForm.get(['collateralOwnerDetails', i, 'collateralOwnerPermanentDistrict']).patchValue(null);
                    this.userConfigForm.get(['collateralOwnerDetails', i, 'collateralOwnerPermanentMunicipalities']).patchValue(null);
                }
            }
        );
    }

    getCollateralOwnerMunicipalities(data, i, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.collateralOwnerPermanentMunicipalitiesList[i] = response.detail;
                this.collateralOwnerPermanentMunicipalitiesList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.userConfigForm.get(['collateralOwnerDetails', i, 'collateralOwnerPermanentMunicipalities']).patchValue(null);
                }
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
            dob: [undefined],
            permanentProvince: [undefined],
            permanentDistrict: [undefined],
            permanentMunicipalities: [undefined],
            permanentMunType: [0],
            permanentWard: [undefined],
            permanentVdc: [undefined],
            permanentVdcWard: [undefined],
            temporaryProvince: [undefined],
            temporaryDistrict: [undefined],
            temporaryMunicipalities: [undefined],
            temporaryWard: [undefined],
            temporaryMunType: [1],
            temporaryVdc: [undefined],
            temporaryVdcWard: [undefined],
            customerEmail: [undefined],
            contactNumber: [undefined],
            guarantorDetails: this.formBuilder.array([]),
            collateralDetails: this.formBuilder.array([]),
            citizenshipIssueDistrict: [undefined],
            collateralOwnerDetails: this.formBuilder.array([]),
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
            branchNameInEnglish: [undefined],
            valuationDate: [undefined],
            valuatorName: [undefined],
            fairMarketValue: [undefined],
            distressValue: [undefined],
            loanDetails: [undefined],
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
        this.spinner = true;
        if (this.userConfigForm.invalid) {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while validating data!!!'));
            return;
        }
        if (this.loanDetails.nepForm.invalid) {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, 'Error while validating loan data!!!'));
            return;
        }
        this.loanDetails.getCadValue();
        this.customerCadInfoData.cadDocument = this.cadData;
        this.customerCadInfoData.customerInfo = JSON.stringify(this.userConfigForm.value);
            this.service.saveCadData(this.customerCadInfoData).subscribe(res => {
                this.customerInfoData = res.detail;
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
                this.spinner = false;
                this.router.reloadCadProfileRoute(this.cadData.id);
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
            guarantorName: [undefined],
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
            guarantorPermanentVdc: [undefined],
            guarantorPermanentVdcWard: [undefined],
            guarantorTemporaryMunType: [1],
            guarantorTemporaryProvince: [undefined],
            guarantorTemporaryDistrict: [undefined],
            guarantorTemporaryMunicipality: [undefined],
            guarantorTemporaryWard: [undefined],
            guarantorTemporaryVdc: [undefined],
            guarantorTemporaryVdcWard: [undefined]
        });
    }

    addCollateralField() {
        return this.formBuilder.group({
            collateralName: '',
            collateralFatherName: '',
            collateralGrandFatherName: '',
            collateralPermanentMunType: [0],
            collateralPermanentProvince: '',
            collateralPermanentDistrict: '',
            collateralPermanentMunVdc: '',
            collateralPermanentWardNo: '',
            collateralTemporaryMunType: [1],
            collateralTemporaryProvince: '',
            collateralTemporaryDistrict: '',
            collateralTemporaryMunVdc: '',
            collateralTemporaryWardNo: '',
            collateralDistrict: '',
            collateralMunVdcOriginal: '',
            collateralMunVdcChanged: '',
            plotNo: '',
            areaOfCollateral: '',
            seatNo: '',
            collateralWardNoOld: '',
            collateralProvinceNo: '',
            wardNoNew: '',
            toleNew: '',
            toleOld: '',
            plotNoOld: '',
            collateralType: '',
            collateralPermanentVdc: '',
            collateralPermanentVdcWard: '',
            collateralTemporaryVdc: '',
            collateralTemporaryVdcWard: '',
            dhitoBibaran: '',
            regNo: ''
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
        if (guarantorDetails.length === 0) {
            this.addGuarantor();
            return;
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.guarantors.guarantorList)) {
                const guarantorList = this.customerInfo.guarantors.guarantorList;
                this.guarantorList = guarantorList;
            }
        }

        guarantorDetails.forEach((value, i) => {
            formArray.push(this.formBuilder.group({
                guarantorName: [value.guarantorName],
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
                guarantorPermanentVdc: [value.guarantorPermanentVdc],
                guarantorPermanentVdcWard: [value.guarantorPermanentVdcWard],
                guarantorTemporaryMunType: [value.guarantorTemporaryMunType],
                guarantorTemporaryProvince: [value.guarantorTemporaryProvince],
                guarantorTemporaryDistrict: [value.guarantorTemporaryDistrict],
                guarantorTemporaryMunicipality: [value.guarantorTemporaryMunicipality],
                guarantorTemporaryWard: [value.guarantorTemporaryWard],
                guarantorTemporaryVdc : [value.guarantorTemporaryVdc],
                guarantorTemporaryVdcWard: [value.guarantorTemporaryVdcWard]
            }));
            this.getGuarantorDistricts(value.guarantorPermanentProvince, i);
            this.getGuarantorMunicipalities(value.guarantorPermanentDistrict, i);
            this.getGuarantorTemporaryDistricts(value.guarantorTemporaryProvince, i);
            this.getGuarantorTemporaryMunicipalities(value.guarantorTemporaryDistrict, i);
        });
    }

    getGuarantorDistricts(data, i, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.guarantorPermanentDistrictList[i] = response.detail;
                this.guarantorPermanentDistrictList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.guarantorPerMunicipalitiesList[i] = [];
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentDistrict']).patchValue(null);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipality']).patchValue(null);
                }
            }
        );
    }

    getGuarantorMunicipalities(data, i, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.guarantorPerMunicipalitiesList[i] = response.detail;
                this.guarantorPerMunicipalitiesList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipality']).patchValue(null);
                }
            }
        );
    }

    getGuarantorTemporaryDistricts(data, i, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.guarantorTemporaryDistrictList[i] = response.detail;
                this.guarantorTemporaryDistrictList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.guarantorTemMunicipalitiesList[i] = [];
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryDistrict']).patchValue(null);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipality']).patchValue(null);
                }
            }
        );
    }

    getGuarantorTemporaryMunicipalities(data, i, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.guarantorTemMunicipalitiesList[i] = response.detail;
                this.guarantorTemMunicipalitiesList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipality']).patchValue(null);
                }
            }
        );
    }

    setCollaterals(collateralDetails: any) {
        const formArray = this.userConfigForm.get('collateralDetails') as FormArray;
        if (collateralDetails.length === 0) {
            this.addCollateral();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.collaterals)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.collaterals.collateralList)) {
                const collateralList = this.customerInfo.collaterals.collateralList;
                this.collateralList = collateralList;
            }
        }

        collateralDetails.forEach((value, i) => {
            formArray.push(this.formBuilder.group({
                collateralName: [value.collateralName],
                collateralFatherName: [value.collateralFatherName],
                collateralGrandFatherName: [value.collateralGrandFatherName],
                collateralPermanentMunType: [value.collateralPermanentMunType],
                collateralPermanentProvince: [value.collateralPermanentProvince],
                collateralPermanentDistrict: [value.collateralPermanentDistrict],
                collateralPermanentMunVdc: [value.collateralPermanentMunVdc],
                collateralPermanentWardNo: [value.collateralPermanentWardNo],
                collateralTemporaryMunType: [value.collateralTemporaryMunType],
                collateralTemporaryProvince: [value.collateralTemporaryProvince],
                collateralTemporaryDistrict: [value.collateralTemporaryDistrict],
                collateralTemporaryMunVdc: [value.collateralTemporaryMunVdc],
                collateralTemporaryWardNo: [value.collateralTemporaryWardNo],
                collateralDistrict: [value.collateralDistrict],
                collateralMunVdcOriginal: [value.collateralMunVdcOriginal],
                collateralMunVdcChanged: [value.collateralMunVdcChanged],
                plotNo: [value.plotNo],
                areaOfCollateral: [value.areaOfCollateral],
                seatNo: [value.seatNo],
                collateralWardNoOld: [value.collateralWardNoOld],
                collateralProvinceNo: [value.collateralProvinceNo],
                wardNoNew: [value.wardNoNew],
                toleNew: [value.toleNew],
                toleOld: [value.toleOld],
                plotNoOld: [value.plotNoOld],
                collateralType: [value.collateralType],
                collateralPermanentVdc: [value.collateralPermanentVdc],
                collateralPermanentVdcWard: [value.collateralPermanentVdcWard],
                collateralTemporaryVdc: [value.collateralTemporaryVdc],
                collateralTemporaryVdcWard: [value.collateralTemporaryVdcWard],
                dhitoBibaran: [value.dhitoBibaran],
                regNo: [value.regNo]

            }));
            this.getCollateralDistricts(value.collateralPermanentProvince, i);
            this.getCollateralMunicipalities(value.collateralPermanentDistrict, i);
            this.getCollateralTemporaryDistricts(value.collateralTemporaryProvince, i);
            this.getCollateralTemporaryMunicipalities(value.collateralTemporaryDistrict, i);
        });
    }

    addCollateralOwner() {
        (this.userConfigForm.get('collateralOwnerDetails') as FormArray).push(this.addCollateralOwnerField());
    }

    addCollateralOwnerField() {
        return this.formBuilder.group({
            collateralOwnerName: '',
            collateralOwnerNameInEnglish: '',
            collateralOwnerDOB: '',
            collateralOwnerCitizenshipNo: '',
            collateralOwnerCitizenshipIssueDate: '',
            collateralOwnerCitizenshipIssueDistrict: '',
            collateralOwnerGender: '',
            collateralOwnerRelationMedium: '',
            collateralOwnerFatherName: '',
            collateralOwnerMotherName: '',
            collateralOwnerGrandFatherName: '',
            collateralOwnerGrandMotherName: '',
            collateralOwnerSpouse: '',
            collateralOwnerPermanentProvince: '',
            collateralOwnerPermanentDistrict: '',
            collateralOwnerPermanentMunicipalities: '',
            collateralOwnerPermanentWard: '',
            collateralOwnerMobileNo: '',
            collateralOwnerCodeNo: '',
            collateralOwnerPermanentVdc: '',
            collateralOwnerPermanentVdcWard: ''
        });
    }

    removeAtIndexCollateralOwner(i: any) {
        (this.userConfigForm.get('collateralOwnerDetails') as FormArray).removeAt(i);
    }

    setCollateralOwner(collateralOwnerDetails: any) {
        const formArray = this.userConfigForm.get('collateralOwnerDetails') as FormArray;
        if (collateralOwnerDetails.length === 0) {
            this.addCollateralOwner();
        }
        if (!ObjectUtil.isEmpty(this.customerInfo.collaterals)) {
            if (!ObjectUtil.isEmpty(this.customerInfo.collaterals.collateralOwnerList)) {
                const collateralOwnerList = this.customerInfo.collaterals.collateralOwnerList;
                this.collateralOwnerList = collateralOwnerList;
            }
        }
        collateralOwnerDetails.forEach((value, i) => {
            formArray.push(this.formBuilder.group({
                collateralOwnerName: [value.collateralOwnerName],
                collateralOwnerNameInEnglish: [value.collateralOwnerNameInEnglish],
                collateralOwnerDOB: [value.collateralOwnerDOB],
                collateralOwnerCitizenshipNo: [value.collateralOwnerCitizenshipNo],
                collateralOwnerCitizenshipIssueDate: [value.collateralOwnerCitizenshipIssueDate],
                collateralOwnerCitizenshipIssueDistrict: [value.collateralOwnerCitizenshipIssueDistrict],
                collateralOwnerGender: [value.collateralOwnerGender],
                collateralOwnerRelationMedium: [value.collateralOwnerRelationMedium],
                collateralOwnerFatherName: [value.collateralOwnerFatherName],
                collateralOwnerMotherName: [value.collateralOwnerMotherName],
                collateralOwnerGrandFatherName: [value.collateralOwnerGrandFatherName],
                collateralOwnerGrandMotherName: [value.collateralOwnerGrandMotherName],
                collateralOwnerSpouse: [value.collateralOwnerSpouse],
                collateralOwnerPermanentProvince: [value.collateralOwnerPermanentProvince],
                collateralOwnerPermanentDistrict: [value.collateralOwnerPermanentDistrict],
                collateralOwnerPermanentMunicipalities: [value.collateralOwnerPermanentMunicipalities],
                collateralOwnerPermanentWard: [value.collateralOwnerPermanentWard],
                collateralOwnerMobileNo: [value.collateralOwnerMobileNo],
                collateralOwnerCodeNo: [value.collateralOwnerCodeNo],
                collateralOwnerPermanentVdc: [value.collateralOwnerPermanentVdc],
                collateralOwnerPermanentVdcWard: [value.collateralOwnerPermanentVdcWard]
            }));
            this.getCollateralOwnerDistricts(value.collateralOwnerPermanentProvince, i);
            this.getCollateralOwnerMunicipalities(value.collateralOwnerPermanentDistrict, i);
        });
    }

    patchAddressObject(): void {
        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            console.log('data', data);
            this.userConfigForm.patchValue(data);
            this.setCollaterals(data.collateralDetails);
            this.setCollateralOwner(data.collateralOwnerDetails);
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
                    const branchNameInEnglish = singleData.name;
                    this.userConfigForm.get('branchNameInEnglish').patchValue(branchNameInEnglish);
                    const branchTelNo = this.engToNepNumberPipe.transform(singleData.landlineNumber);
                    this.userConfigForm.get('branchTelNo').patchValue(branchTelNo);
                    const branchEmail = singleData.email;
                    this.userConfigForm.get('branchEmail').patchValue(branchEmail);
                }
            }
        );
    }
    getCollateralDistricts(data, i, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.collateralPermanentDistrictList[i] = response.detail;
                this.collateralPermanentDistrictList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.collateralPermanentMunicipalitiesList[i] = [];
                    this.userConfigForm.get(['collateralDetails', i, 'collateralPermanentDistrict']).patchValue(null);
                    this.userConfigForm.get(['collateralDetails', i, 'collateralPermanentMunVdc']).patchValue(null);
                }
            }
        );
    }

    getCollateralMunicipalities(data, i, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.collateralPermanentMunicipalitiesList[i] = response.detail;
                this.collateralPermanentMunicipalitiesList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.userConfigForm.get(['collateralDetails', i, 'collateralPermanentMunVdc']).patchValue(null);
                }
            }
        );
    }
    getCollateralTemporaryDistricts(data, i, event?) {
        const province = new Province();
        province.id = event ? data : data.id;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.collateralTemporaryDistrictList[i] = response.detail;
                this.collateralTemporaryDistrictList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.collateralTemporaryMunicipalitiesList[i] = [];
                    this.userConfigForm.get(['collateralDetails', i, 'collateralTemporaryDistrict']).patchValue(null);
                    this.userConfigForm.get(['collateralDetails', i, 'collateralTemporaryMunVdc']).patchValue(null);
                }
            }
        );
    }

    getCollateralTemporaryMunicipalities(data, i, event?) {
        const district = new District();
        district.id = event ? data : data.id;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.collateralTemporaryMunicipalitiesList[i] = response.detail;
                this.collateralTemporaryMunicipalitiesList[i].sort((a, b) => a.name.localeCompare(b.name));
                if (event) {
                    this.userConfigForm.get(['collateralDetails', i, 'collateralTemporaryMunVdc']).patchValue(null);
                }
            }
        );
    }

    changeAction(template) {
        this.onClose();
        this.modalService.open(template);
    }

    onClose() {
        this.modalService.dismissAll();
    }

    close() {
        this.ref.close();
    }

}

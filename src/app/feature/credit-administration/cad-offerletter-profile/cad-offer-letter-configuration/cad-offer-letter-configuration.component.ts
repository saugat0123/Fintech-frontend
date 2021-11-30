import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerInfoService} from '../../../customer/service/customer-info.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {EngToNepaliNumberPipe} from '../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CustomerService} from '../../../customer/service/customer.service';
import {Customer} from '../../../admin/modal/customer';
import {CustomerType} from '../../../customer/model/customerType';
import {DatePipe, TitleCasePipe} from '@angular/common';
import {RelationshipNepali} from '../../../loan/model/relationshipListNepali';
import {Guarantor} from '../../../loan/model/guarantor';
import {GuarantorDetail} from '../../../loan/model/guarantor-detail';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {HttpClient} from '@angular/common/http';
import {SbTranslateService} from '../../../../@core/service/sbtranslate.service';
import {CadOneformService} from '../../service/cad-oneform.service';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {Branch} from '../../../admin/modal/branch';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {CompanyLocations} from '../../../admin/modal/companyLocations';
import {LoanType} from '../../../loan/model/loanType';
import {OneFormCustomerDto} from '../../model/one-form-customer-dto';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Attributes} from '../../../../@core/model/attributes';
import {LoanCreateComponent} from './loan-create/loan-create.component';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {CustomerSubType} from '../../../customer/model/customerSubType';
import {OneFormGuarantors} from '../../model/oneFormGuarantors';
import {CurrencyFormatterPipe} from '../../../../@core/pipe/currency-formatter.pipe';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

    @Input() customerType;
    @Input() customerSubType;
    @Input() jointCustomerNum: Number;
    @Input() institutionSubType;
    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() loanHolder: CustomerInfoData;
    @Input() oneFormCustomer: OneFormCustomerDto;
    // @Input() customer: Customer;
    @Output()
    customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
    @ViewChild('loan-create', {static: true}) loanCreateComponent: LoanCreateComponent;
    @Input() actionType;
    @Input()
    activeLoanTab = false;
    @Input()
    hideLoan = false;
    @Input()
    hideCustomer = false;
    loanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
    loanTypeList = LoanType;
    branchList: Array<Branch> = new Array<Branch>();
    guarantorList: Array<Guarantor>;
    userConfigForm: FormGroup;
    tempStoreGuarantorDetails = [];
    addressFromGroup: FormGroup;
    spinner = false;
    submitted = false;
    relationshipList = RelationshipNepali.enumObject();
    hideSaveBtn = false;
    clientType = CustomerType;
    clientSubType = CustomerSubType;
    translatedValues: any;
    addressTranslatedValue: any;
    jointCustomerAddressTranslatedValue: any;
    translatedData = {};
    customer: Customer = new Customer();
    customerId = undefined;
    attributes: Attributes = new Attributes();
    company: CompanyInfo = new CompanyInfo();
    companyLocations: CompanyLocations = new CompanyLocations();
    disableLoanFacility = true;
    // oneFormCustomer: OneFormCustomerDto = new OneFormCustomerDto();
    calendarType = CalendarType.AD;
    disableTemplateData = true;
    disableLoanTab = true;
    disableTemplateTab = true;
    responseData: any;
    disableSave = true;
    activeCustomerTab = true;
    activeTemplateDataTab = false;
    addressSameAsAbove = false;
    provinceList: Array<Province> = new Array<Province>();
    jointCustomerPermanentDistrictList = [];
    jointCustomerTemporaryDistrictList = [];
    jointCustomerPermanentMunicipalities = [];
    jointCustomerTemporaryMunicipalities = [];
    tempGuarantorProvinceList = [];
    districts: Array<District> = new Array<District>();
    tempGuarantorDistricts = [];
    municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    tempGuarantorMunicipalities = [];
    allDistrictList: Array<District> = new Array<District>();
    objectTranslateForm: FormGroup;
    objectValueTranslater;
    tempProvinceList: Array<Province> = new Array<Province>();
    tempDistricts: Array<District> = new Array<District>();
    tempMunicipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    dateTypeAD = false;
    dateTypeBS = false;
    dateOption = [{value: 'AD', label: 'AD'},
        {value: 'BS', label: 'BS'}];
    vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}, {value: 'Rural', label: 'Rural'}];
    translatedGuarantorDetails = [];
    translatedJointCustomerDetails = [];
    nepData;
    individualData;
    editedTranslatedValueForm: FormGroup;
    oneFormGuarantorsList: Array<OneFormGuarantors> = new Array<OneFormGuarantors>();
    guarantorProvienceList = [];
    guarantorDistrict = [];
    guarantorMunicipalities = [];
    ownerPermanentDistricts = [];
    ownerPermanentMunicipality = [];
    ownerTemporaryDistricts = [];
    ownerTemporaryMunicipality = [];
    institutionalActYear: any;
    headingSubType: any;
    detailOption: any;

    constructor(private formBuilder: FormBuilder,
                private titleCasePipe: TitleCasePipe,
                private loanConfigService: LoanConfigService,
                private branchService: BranchService,
                private customerInfoService: CustomerInfoService,
                private engToNepaliNumberPipe: EngToNepaliNumberPipe,
                private cadOneformService: CadOneformService,
                private customerService: CustomerService,
                private toastService: ToastService,
                private engToNepNumber: EngToNepaliNumberPipe,
                public datepipe: DatePipe,
                protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>,
                private http: HttpClient,
                private translateService: SbTranslateService,
                private addressService: AddressService,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private dialogService: NbDialogService,
                private modalService: NgbModal
    ) {
    }

    get configForm() {
        return this.userConfigForm.controls;
    }

    get form() {
        return this.userConfigForm.controls;
    }

    ngOnInit() {
        if (this.actionType !== 'Edit') {
            this.detailsOption(this.institutionSubType);
        } else if (!ObjectUtil.isEmpty(this.loanHolder)) {
            this.detailsOption(this.loanHolder.customerSubType);
        }
        if (this.actionType === 'Edit') {
            if (!ObjectUtil.isEmpty(this.loanHolder)) {
                this.headingSubType = this.loanHolder.customerSubType;
            } else {
                this.headingSubType = '';
            }
        } else if (this.customerType === CustomerType.INDIVIDUAL) {
            this.headingSubType = this.customerSubType;
        } else {
            this.headingSubType = this.institutionSubType;
        }
        console.log(this.institutionSubType);
        if (this.activeLoanTab) {
            this.responseData = this.loanHolder;
        }
        this.addressService.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.tempProvinceList = response.detail;
                this.tempGuarantorProvinceList = response.detail;
                this.guarantorProvienceList = response.detail;
            });

        if (!ObjectUtil.isEmpty(this.oneFormCustomer)) {
            this.getAllEditedDistrictAndMunicipalities();
            this.dateTypeAD = true;
        } else {
            this.oneFormCustomer = new OneFormCustomerDto();
        }

        this.addressService.getAllDistrict().subscribe((resp: any) => {
            this.allDistrictList = resp.detail;
        });
        this.buildForm();
        if (this.jointCustomerNum > 1) {
            for (let i = 1; i < this.jointCustomerNum; i++) {
                this.addJointCustomerDetails();
            }
        }


        if (!ObjectUtil.isEmpty(this.loanHolder.guarantors)) {
            this.setGuarantors(this.loanHolder.guarantors.guarantorList);
        } else {
            this.addGuarantor();
        }

        this.translateObjectValue();
        this.userConfigForm.get('clientType').patchValue(this.customerType);
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branchList = response.detail;
            this.branchList.sort((a, b) => a.name.localeCompare(b.name));
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });

        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer)) {
            this.nepData = (JSON.parse(this.loanHolder.nepData));
            if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
                this.individualData = (JSON.parse(this.oneFormCustomer.individualJsonData));
            }
        }


        this.patchValue();
        this.patchNepData();
        this.patchIndividualData();
        this.patchOwnerDetails();
        this.editedTransData();

        if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
            const data = JSON.parse(this.customerInfo.nepData);
            this.userConfigForm.patchValue(data);
            this.setGuarantors(data.guarantorDetails);
        }



    }

    buildForm() {
        this.userConfigForm = this.formBuilder.group({
            branch: [undefined],
            branchCT: [undefined, Validators.required],
            branchTrans: [undefined, Validators.required],
            clientType: [undefined],
            clientTypeCT: [undefined],
            clientTypeTrans: [undefined],
            institutionCustomerSubType: [undefined],
            institutionCustomerSubTypeCT: [undefined],
            institutionCustomerSubTypeTrans: [undefined],
            name: [undefined],
            nameCT: [undefined, Validators.required],
            nameTrans: [undefined, Validators.required],
            email: [undefined],
            emailCT: [undefined],
            emailTrans: [undefined],
            contactNo: [undefined],
            contactNoCT: [undefined, Validators.required],
            contactNoTrans: [undefined, Validators.required],
            panNo: [undefined],
            panNoCT: [undefined],
            panNoTrans: [undefined],
            registrationNo: [undefined],
            registrationNoCT: [undefined, Validators.required],
            registrationNoTrans: [undefined],
            registrationDate: [undefined],
            registrationDateCT: [undefined],
            registrationDateTrans: [undefined],
            registeredMunicipality: [undefined],
            registeredMunicipalityCT: [undefined],
            registeredMunicipalityTrans: [undefined, Validators.required],
            registeredMunType: [undefined],
            registeredMunTypeCT: [undefined],
            registeredMunTypeTrans: [undefined],
            registeredDistrict: [undefined],
            registeredDistrictCT: [undefined, Validators.required],
            registeredDistrictTrans: [undefined],
            registeredProvince: [undefined],
            registeredProvinceCT: [undefined, Validators.required],
            registeredProvinceTrans: [undefined],
            currentMunType: [undefined],
            currentMunTypeCT: [undefined],
            currentMunTypeTrans: [undefined],
            currentProvince: [undefined],
            currentProvinceCT: [undefined, Validators.required],
            currentProvinceTrans: [undefined],
            currentWard: [undefined],
            currentWardCT: [undefined, Validators.required],
            currentWardTrans: [undefined],
            currentDistrict: [undefined],
            currentDistrictCT: [undefined, Validators.required],
            currentDistrictTrans: [undefined],
            currentMunicipality: [undefined],
            currentMunicipalityCT: [undefined, Validators.required],
            currentMunicipalityTrans: [undefined],
            customerCode: [undefined],
            customerCodeCT: [undefined, Validators.required],
            customerCodeTrans: [undefined, Validators.required],
            gender: [undefined],
            genderCT: [undefined, Validators.required],
            genderTrans: [undefined, Validators.required],
            fatherName: [undefined],
            fatherNameCT: [undefined],
            fatherNameTrans: [undefined],
            grandFatherName: [undefined],
            grandFatherNameCT: [undefined],
            grandFatherNameTrans: [undefined],
            relationMedium: [undefined],
            relationMediumCT: [undefined],
            relationMediumTrans: [undefined],
            husbandName: [undefined],
            husbandNameCT: [undefined],
            husbandNameTrans: [undefined],
            fatherInLawName: [undefined],
            fatherInLawNameCT: [undefined],
            fatherInLawNameTrans: [undefined],
            citizenshipNo: [undefined],
            citizenshipNoCT: [undefined, Validators.required],
            citizenshipNoTrans: [undefined, Validators.required],
            dob: [undefined],
            dobCT: [undefined],
            dobTrans: [undefined],
            // tslint:disable-next-line:max-line-length
            permanentProvinceCT: [undefined, Validators.required],
            permanentProvinceTrans: [undefined, Validators.required],
            permanentProvince: [ObjectUtil.setUndefinedIfNull(this.oneFormCustomer.municipalities)],
            // tslint:disable-next-line:max-line-length
            permanentDistrict: [undefined],
            permanentDistrictCT: [undefined, Validators.required],
            permanentDistrictTrans: [undefined, Validators.required],
            // tslint:disable-next-line:max-line-length
            permanentMunicipality: [undefined],
            permanentMunicipalityCT: [undefined, Validators.required],
            permanentMunicipalityTrans: [undefined, Validators.required],
            permanentMunType: [0],
            permanentMunTypeCT: [0],
            permanentMunTypeTrans: [0],
            // tslint:disable-next-line:max-line-length
            temporaryProvince: [ObjectUtil.setUndefinedIfNull(this.oneFormCustomer.temporaryProvince)],
            temporaryProvinceCT: [undefined],
            temporaryProvinceTrans: [undefined, Validators.required],
            // tslint:disable-next-line:max-line-length
            temporaryDistrict: [undefined],
            temporaryDistrictCT: [undefined],
            temporaryDistrictTrans: [undefined, Validators.required],
            // tslint:disable-next-line:max-line-length
            temporaryMunicipality: [undefined],
            temporaryMunicipalityCT: [undefined],
            temporaryMunicipalityTrans: [undefined, Validators.required],
            permanentWard: [undefined],
            permanentWardCT: [undefined, Validators.required],
            permanentWardTrans: [undefined],
            temporaryWard: [undefined],
            temporaryWardCT: [undefined],
            temporaryWardTrans: [undefined],
            temporaryMunType: [1],
            temporaryMunTypeCT: [undefined],
            temporaryMunTypeTrans: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDistrictCT: [undefined, Validators.required],
            citizenshipIssueDistrictTrans: [undefined, Validators.required],
            citizenshipIssueDate: [undefined],
            citizenshipIssueDateCT: [undefined],
            citizenshipIssueDateTrans: [undefined],
            municipalityOrVdc: [undefined],
            municipalityOrVdcCT: [undefined],
            municipalityOrVdcTrans: [undefined],
            temporaryMunicipalityOrVdc: [undefined],
            temporaryMunicipalityOrVdcCT: [undefined],
            temporaryMunicipalityOrVdcTrans: [undefined],
            dobDateType: [undefined],
            dobDateTypeCT: [undefined],
            dobDateTypeTrans: [undefined],
            issuedDate: [undefined],
            issuedDateCT: [undefined],
            issuedDateTrans: [undefined],
            isSameRegisteredAndCurrentAddress: [undefined],
            isSameRegisteredAndCurrentAddressTrans: [undefined],
            isSameRegisteredAndCurrentAddressCT : [undefined],
            registrationDateOption: [undefined],
            registrationDateOptionTrans: [undefined],
            registrationDateOptionCT: [undefined],

            actName: [undefined],
            actNameCT: [undefined],
            actNameTrans: [undefined],
            actYear: [undefined],
            actYearCT: [undefined],
            actYearTrans: [undefined],
            radioActYearDate: [undefined],
            radioActYearDateTrans: [undefined],
            radioActYearDateCT: [undefined],
            authorizedBodyName: [undefined],
            authorizedBodyNameCT: [undefined],
            authorizedBodyNameTrans: [undefined],
            registeredWith: [undefined],
            registeredWithCT: [undefined],
            registeredWithTrans: [undefined],
            issuingDistrict: [undefined],
            issuingDistrictCT: [undefined],
            issuingDistrictTrans: [undefined],
            registeredStreetTole: [undefined],
            registeredStreetToleTrans: [undefined],
            registeredStreetToleCT: [undefined],
            currentStreetTole: [undefined],
            currentStreetToleTrans: [undefined],
            currentStreetToleCT: [undefined],
            jointCustomerDetails: this.formBuilder.array([]),
            guarantorDetails: this.formBuilder.array([]),
            ownerDetails: this.formBuilder.array([])
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

    saveCustomer() {

        console.log(this.userConfigForm.get('actYear').value);
        this.checkEditedValidationForIndividualJsonData();
        this.submitted = true;
        this.spinner = true;

        if (this.addressSameAsAbove) {
            this.clearValidationForTemporaryAddress();
        }
        if (this.customerType === 'INSTITUTION') {
            this.clearValidationForIndividualCustomer();
        }
        if (this.customerType === 'INDIVIDUAL') {
            this.clearValidationForInstitutionalCustomer();
        }
        const invalidControls = [];
        const controls = this.userConfigForm.controls;
        for (const name in controls) {
            if (name !== 'ownerDetails' && name !== 'guarantorDetails') {
                console.log(name, 'name');
                if (controls[name].invalid) {
                    invalidControls.push(this.titleCasePipe.transform(name).replace('ct', '').replace('trans', ''));
                }
            }
        }
        console.log('invalidControls', invalidControls);
        if (invalidControls.length > 0) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation. ' + invalidControls.filter((value, index, self) => self.indexOf(value) === index)
                .join(', ')));
            this.spinner = false;
            return;
        }
        const clientType = this.userConfigForm.get('clientType').value;
        if (this.customerType === 'INSTITUTION') {
           this.oneFormCustomer.companyJsonData = JSON.stringify(this.userConfigForm.get('ownerDetails').value);
        }
        this.oneFormCustomer.customerCode = this.userConfigForm.get('customerCode').value;
        this.oneFormCustomer.customerName = this.userConfigForm.get('name').value;
        this.oneFormCustomer.companyName = this.userConfigForm.get('name').value;
        this.oneFormCustomer.panNumber = this.userConfigForm.get('panNo').value;
        this.oneFormCustomer.email = this.userConfigForm.get('email').value;
        this.oneFormCustomer.registrationNumber = this.userConfigForm.get('registrationNo').value;
        this.oneFormCustomer.contactNumber = this.userConfigForm.get('contactNo').value;
        this.oneFormCustomer.gender = this.userConfigForm.get('gender').value;
        // this.oneFormCustomer.establishmentDate = this.userConfigForm.get('citizenshipIssueDate').value;
        if (this.loanHolder.customerType === CustomerType.INSTITUTION) {
            if (this.userConfigForm.get('registrationDateOption').value === 'AD') {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value);
            } else {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
            }
        }
        if (this.loanHolder.customerType === CustomerType.INSTITUTION && this.actionType === 'Edit') {
            // console.log(this.userConfigForm.get('registrationDate').value);
            // return;
            if (this.userConfigForm.get('registrationDateOption').value === 'AD') {
                console.log(this.userConfigForm.get('registrationDate').value);
                if (JSON.parse(this.loanHolder.nepData).registrationDateOption.en === 'BS') {
                    this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
                } else {
                    this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value);
                }
            } else {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
            }
        }
        const customer = {
            relationMedium: this.userConfigForm.get('relationMedium').value,
            husbandName: this.userConfigForm.get('husbandName').value,
            fatherInLawName: this.userConfigForm.get('fatherInLawName').value,
            grandFatherName: this.userConfigForm.get('grandFatherName').value,
            fatherName: this.userConfigForm.get('fatherName').value,
            municipalityOrVdc: this.userConfigForm.get('municipalityOrVdc').value,
            sameAddress: this.addressSameAsAbove,
            temporaryMunicipalityOrVdc: this.userConfigForm.get('temporaryMunicipalityOrVdc').value,
        };
        this.oneFormCustomer.individualJsonData = JSON.stringify(customer);
        this.oneFormCustomer.citizenshipNumber = this.userConfigForm.get('citizenshipNo').value;
        const dobDateType = this.userConfigForm.get('dobDateType').value;
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            if (dobDateType === 'AD') {
                this.oneFormCustomer.dob = this.userConfigForm.get('dob').value;
            } else {
                this.oneFormCustomer.dob = new Date(this.userConfigForm.get('dob').value.eDate);
            }
            const issuedDate = this.userConfigForm.get('issuedDate').value;
            if (issuedDate === 'AD') {
                this.oneFormCustomer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDate').value;
            } else {
                this.oneFormCustomer.citizenshipIssuedDate = new Date(this.userConfigForm.get('citizenshipIssueDate').value.eDate);
            }
        }
        this.oneFormCustomer.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssueDistrict').value;
        this.oneFormCustomer.province = this.userConfigForm.get('permanentProvince').value;
        this.oneFormCustomer.district = this.userConfigForm.get('permanentDistrict').value;
        this.oneFormCustomer.municipalities = this.userConfigForm.get('permanentMunicipality').value;
        this.oneFormCustomer.wardNumber = this.userConfigForm.get('permanentWard').value;
        this.oneFormCustomer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
        this.oneFormCustomer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
        this.oneFormCustomer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
        this.oneFormCustomer.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;
        this.oneFormCustomer.customerInfoId = ObjectUtil.isEmpty(this.loanHolder) ? null : this.loanHolder.id;
        if (this.customerSubType === CustomerSubType.JOINT) {
            // tslint:disable-next-line:no-shadowed-variable
            const jointInfoArr = [];
            jointInfoArr.push(this.oneFormCustomer);
            this.userConfigForm.get('jointCustomerDetails').value.forEach(jcd => {
                jointInfoArr.push(jcd);
            });
            this.oneFormCustomer.isJointCustomer = (this.customerSubType === CustomerSubType.JOINT) ? true : false;
            this.oneFormCustomer.jointInfo = JSON.stringify(jointInfoArr);
        }
        this.oneFormCustomer.customerSubType = this.customerType === CustomerType.INDIVIDUAL ? this.customerSubType : this.institutionSubType;
        // if (this.customerType === CustomerType.INSTITUTION && this.actionType === 'Edit'){
        //     // console.log(this.loanHolder,'log');
        //     // return;
        //     this.oneFormCustomer.customerSubType = this.instSubType(this.loanHolder.customerSubType);
        // }
        if (this.actionType === 'Edit' && this.customerType === CustomerType.INDIVIDUAL) {
            this.userConfigForm.patchValue({
                permanentProvinceCT: this.userConfigForm.get('permanentProvince').value.nepaliName,
                permanentDistrictCT: this.userConfigForm.get('permanentDistrict').value.nepaliName,
                // permanentMunicipalityCT: this.userConfigForm.get('permanentMunicipality').value.nepaliName,
                temporaryProvinceCT: this.userConfigForm.get('temporaryProvince').value.nepaliName,
                temporaryDistrictCT: this.userConfigForm.get('temporaryDistrict').value.nepaliName,
                // temporaryMunicipalityCT: this.userConfigForm.get('temporaryMunicipality').value.nepaliName,
            });

            if (this.addressSameAsAbove) {
                this.userConfigForm.patchValue({
                    temporaryMunicipalityCT: this.userConfigForm.get('permanentMunicipalityCT').value
                });
            }

        }



        Object.keys(this.userConfigForm.controls).forEach(key => {

            if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !this.userConfigForm.get(key).value) {
                return;
            }

            if (key === 'guarantorDetails' || key === 'jointCustomerDetails' || key === 'ownerDetails') {
                return;
            }

            this.attributes = new Attributes();
            if (this.actionType === 'Edit') {
                if (this.translatedValues === undefined) {

                    this.attributes.en = this.userConfigForm.get(key).value;
                    this.attributes.np = this.userConfigForm.get(key + 'CT').value;
                    this.attributes.ct = this.userConfigForm.get(key + 'CT').value;
                    this.translatedData[key] = this.attributes;

                    /**
                     * guarantor existing CT value patch
                     * @author Paribartan Kalathoki
                     */
                    this.setGuarantorsDetailsCTValueIfNotTranslated();
                    // end guarantor detault CT value patch

                } else {
                    this.attributes.en = this.userConfigForm.get(key).value;
                    this.attributes.np = this.translatedValues[key];
                    this.attributes.ct = this.userConfigForm.get(key + 'CT').value;
                    this.translatedData[key] = this.attributes;
                }
            } else {
                this.attributes.en = this.userConfigForm.get(key).value;
                this.attributes.np = this.translatedValues[key];
                this.attributes.ct = this.userConfigForm.get(key + 'CT').value;
                this.translatedData[key] = this.attributes;
            }


        });

        // to map guarantor nepData according to guarantor CT value
        this.setIndividualGuarantorNepData();

        this.setIndividualJointCustomerNepData();
        // to map individual joint customer nepData according to jointCustomer CT value

        this.userConfigForm.get('guarantorDetails').value.forEach((value, index) => {
            const issueDateType = this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value;
            if (issueDateType === 'AD') {
                this.userConfigForm.value.guarantorDetails[index].citizenIssuedDate = this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value;
            } else if (issueDateType === 'BS') {
                const issueDate = this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value.eDate;
                this.userConfigForm.value.guarantorDetails[index].citizenIssuedDate = new Date(issueDate);
            }
            // this.deleteCTAndTransContorls(index);
        });

        // this.translatedData['guarantorDetails'] = this.translatedGuarantorDetails;
        if (this.customerType === CustomerType.INDIVIDUAL && this.customerSubType === CustomerSubType.JOINT) {
            this.userConfigForm.get('jointCustomerDetails').value.forEach((value, index) => {
                this.deleteJointCustomerCTAndTransControls(index);
            });
        }
        const jointInfoArr = this.userConfigForm.get('jointCustomerDetails').value;
        jointInfoArr.push(this.oneFormCustomer);
        const data = {
            branch: this.userConfigForm.get('branch').value,
            customerType: clientType,
            customerSubType: (this.customerType === CustomerType.INDIVIDUAL) ? this.customerSubType : this.institutionSubType,
            customer: this.oneFormCustomer,
            guarantorDetails: this.userConfigForm.get('guarantorDetails').value,
            translatedData: this.translatedData
        };
        if (this.customerType === CustomerType.INSTITUTION && this.actionType === 'Edit') {
            data.customerSubType = this.instSubType(this.loanHolder.customerSubType);
        }
        data.guarantorDetails.forEach((value, index) => {
            const issueDateType = value.radioCitizenIssuedDate;
            if (issueDateType === 'BS') {
                const issueDate = value.citizenIssuedDate.eDate;
                data.guarantorDetails[index].citizenIssuedDate = new Date(issueDate);
            }
        });
        this.cadOneformService.saveCustomer(data).subscribe(res => {
            this.spinner = false;
            if (this.hideLoan === true) {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Edited Customer'));
                this.closeModal();
                return;
            }
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer'));
            this.customerId = res.detail.customerInfoId;
            this.responseData = res.detail;
            this.activeCustomerTab = false;
            this.activeLoanTab = true;
            this.activeTemplateDataTab = false;
        }, res => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
            this.spinner = false;
            // this.userConfigForm.get('guarantorDetails').patchValue(this.tempStoreGuarantorDetails);
        });
    }

    /**
     * set guarators details data
     * @author Paribartan Kalathoki
     */
    setGuarantorsDetailsCTValueIfNotTranslated() {
        let allGuarantorsList = [];
        allGuarantorsList = this.loanHolder.guarantors.guarantorList;

        if (allGuarantorsList.length === 0) {
            return;
        }

        allGuarantorsList.forEach((value, index) => {
            let nepData: any;
            nepData = JSON.parse(value.nepData);

            nepData.guarantorName ? nepData.guarantorName.ct = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.ct = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).value : '';

            nepData.relationship ? nepData.relationship.ct = this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.ct = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).value : '';
            nepData.gender ? nepData.gender.ct = this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).value : '';
            nepData.fatherName ? nepData.fatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).value : '';

            nepData.permanentDistrict ? nepData.permanentDistrict.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value : '';
            nepData.gurantedAmount ? nepData.gurantedAmount.ct = this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountCT']).value : '';

            nepData.permanentMunicipality ? nepData.permanentMunicipality.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value : '';
            nepData.permanentWard ? nepData.permanentWard.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value : '';

            nepData.temporaryDistrict ? nepData.temporaryDistrict.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value : '';
            nepData.adharCardIssuedFrom ? nepData.adharCardIssuedFrom.ct = this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromCT']).value : '';
            nepData.permanentStreetTole ? nepData.permanentStreetTole.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).value : '';
            nepData.temporaryStreetTole ? nepData.temporaryStreetTole.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).value : '';
            // nepData.guarantorNationality ? nepData.guarantorNationality = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value : '';
            nepData.embassyNo ? nepData.embassyNo.ct = this.userConfigForm.get(['guarantorDetails', index, 'embassyNoCT']).value : '';
            nepData.embassyIssuedFrom ? nepData.embassyIssuedFrom.ct = this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromCT']).value : '';
            nepData.passportNo ? nepData.passportNo.ct = this.userConfigForm.get(['guarantorDetails', index, 'passportNoCT']).value : '';
            nepData.passportIssuedFrom ? nepData.passportIssuedFrom.ct = this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFromCT']).value : '';
            nepData.adharCardNo ? nepData.adharCardNo.ct = this.userConfigForm.get(['guarantorDetails', index, 'adharCardNoCT']).value : '';
            nepData.adharCardIssuedFrom ? nepData.adharCardIssuedFrom.ct = this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromCT']).value : '';
            nepData.otherGuarantorPassportNo ? nepData.otherGuarantorPassportNo.ct = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoCT']).value : '';
            nepData.otherGuarantorPassportIssuedFrom ? nepData.otherGuarantorPassportIssuedFrom.ct = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFromCT']).value : '';
            nepData.otherGuarantorPassportIssuedDateOption ? nepData.otherGuarantorPassportIssuedDateOption = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateOption']).value : '';
            nepData.otherGuarantorPassportValidityDateOption ? nepData.otherGuarantorPassportValidityDateOption = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateOption']).value : '';
            nepData.indianGuarantorDetailOption ? nepData.indianGuarantorDetailOption = this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value : '';
            // set guarantor nepData values based on index in guarantorDetails form
            this.userConfigForm.get(['guarantorDetails', index, 'nepData']).patchValue(JSON.stringify(nepData));
        });
    }

    /**
     * set individual guarantor nepData Details
     * @author Paribartan Kalathoki
     */

    setIndividualGuarantorNepData() {
        const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        if (formArray.value.length === 0) {
            return;
        }

        formArray.value.forEach((value, index) => {
            let nepData: any;
            nepData = JSON.parse(value.nepData);
            console.log(nepData);

            nepData.guarantorName ? nepData.guarantorName.ct = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.ct = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).value : '';

            nepData.relationship ? nepData.relationship.ct = this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.ct = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).value : '';
            nepData.gender ? nepData.gender.ct = this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).value : '';
            nepData.fatherName ? nepData.fatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).value : '';

            nepData.permanentDistrict ? nepData.permanentDistrict.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value : '';
            nepData.gurantedAmount ? nepData.gurantedAmount.ct = this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountCT']).value : '';

            nepData.permanentMunicipality ? nepData.permanentMunicipality.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value : '';
            nepData.permanentWard ? nepData.permanentWard.ct = this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value : '';

            nepData.temporaryDistrict ? nepData.temporaryDistrict.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.ct = this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value : '';
            // english value
            nepData.guarantorName ? nepData.guarantorName.en = this.userConfigForm.get(['guarantorDetails', index, 'guarantorName']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.en = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value : '';

            nepData.relationship ? nepData.relationship.en = this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.en = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumber']).value : '';
            nepData.gender ? nepData.gender.en = this.userConfigForm.get(['guarantorDetails', index, 'gender']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.en = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherName']).value : '';
            nepData.fatherName ? nepData.fatherName.en = this.userConfigForm.get(['guarantorDetails', index, 'fatherName']).value : '';

            nepData.permanentDistrict ? nepData.permanentDistrict.en = this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.en = this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value : '';
            nepData.gurantedAmount ? nepData.gurantedAmount.en = this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmount']).value : '';

            nepData.permanentMunicipality ? nepData.permanentMunicipality.en = this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value : '';
            nepData.permanentWard ? nepData.permanentWard.en = this.userConfigForm.get(['guarantorDetails', index, 'permanentWard']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.en = this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value : '';

            nepData.temporaryDistrict ? nepData.temporaryDistrict.en = this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.en = this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.en = this.userConfigForm.get(['guarantorDetails', index, 'temporaryWard']).value : '';

            nepData.guarantorPermanentMunicipalityOrVdc ? nepData.guarantorPermanentMunicipalityOrVdc.en = this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value : '';
            nepData.guarantorTemporaryMunicipalityOrVdc ? nepData.guarantorTemporaryMunicipalityOrVdc.en = this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value : '';
            nepData.guarantorNationality ? nepData.guarantorNationality =  this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value : '';

            //test-------

            if(this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Passport' && this.actionType === 'Edit' &&
            this.customerType === CustomerType.INSTITUTION){
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                }
                nepData['passportNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportNoCT']).value,
                }
                nepData['passportIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDateCT']).value,
                }
                nepData['passportValidityDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDateCT']).value,
                }
                nepData['passportIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFromCT']).value,
                }
            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Adhar Card' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                }
                nepData['adharCardNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNoCT']).value,
                }
                nepData['adharCardIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDateCT']).value,
                }
                nepData['adharCardIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromCT']).value,
                }

            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Embassy Certificate' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                }
                nepData['embassyNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoCT']).value,
                }
                nepData['embassyIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateCT']).value,
                }
                nepData['embassyIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromCT']).value,
                }

            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Embassy Certificate' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                }
                nepData['embassyNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoCT']).value,
                }
                nepData['embassyIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateCT']).value,
                }
                nepData['embassyIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromCT']).value,
                }

            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value === 'Other' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                nepData['otherGuarantorPassportNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoCT']).value,
                }
                nepData['otherGuarantorPassportIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateCT']).value,
                }
                nepData['otherGuarantorPassportValidityDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateCT']).value,
                }
                nepData['otherGuarantorPassportIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFromCT']).value,
                }


            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value === 'Nepali' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                    nepData['otherGuarantorPassportNo'] = {
                        en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNo']).value,
                        np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoTrans']).value,
                        ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoCT']).value,
                    }
                nepData['permanentProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value,
                }
                nepData['permanentDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value,
                }
                nepData['permanentMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value,
                }
                nepData['permanentWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value,
                }


                nepData['temporaryProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value,
                }
                nepData['temporaryDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value,
                }
                nepData['temporaryMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value,
                }
                nepData['temporaryWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value,
                }

                nepData['isSameTemporaryAndPermanent'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanent']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentCT']).value,
                }

                nepData['permanentStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).value,
                }

                nepData['temporaryStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).value,
                }

                nepData['guarantorPermanentMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                }

                nepData['guarantorTemporaryMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                }



            }


            if(this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value === 'Foreign' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['guarantorForeignAddressOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionCT']).value,
                }
                nepData['guarantorOtherAddress'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddress']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressCT']).value,
                }

            }

            if(this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value === 'Local' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION){
                nepData['guarantorForeignAddressOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionCT']).value,
                }
                nepData['permanentProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value,
                }
                nepData['permanentDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value,
                }
                nepData['permanentMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value,
                }
                nepData['permanentWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value,
                }


                nepData['temporaryProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value,
                }
                nepData['temporaryDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value,
                }
                nepData['temporaryMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value,
                }
                nepData['temporaryWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value,
                }

                nepData['isSameTemporaryAndPermanent'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanent']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentCT']).value,
                }

                nepData['permanentStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).value,
                }

                nepData['temporaryStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).value,
                }

                nepData['guarantorPermanentMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                }

                nepData['guarantorTemporaryMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                }

            }

            //test----end

            // translated data
            nepData.guarantorName ? nepData.guarantorName.np = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.np = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).value : '';

            nepData.relationship ? nepData.relationship.np = this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.np = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberTrans']).value : '';
            nepData.gender ? nepData.gender.np = this.userConfigForm.get(['guarantorDetails', index, 'genderTrans']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.np = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).value : '';
            nepData.fatherName ? nepData.fatherName.np = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).value : '';

            nepData.permanentDistrict ? nepData.permanentDistrict.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value : '';
            nepData.gurantedAmount ? nepData.gurantedAmount.np = this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).value : '';

            nepData.permanentMunicipality ? nepData.permanentMunicipality.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value : '';
            nepData.permanentWard ? nepData.permanentWard.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value : '';

            nepData.temporaryDistrict ? nepData.temporaryDistrict.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value : '';


            // set guarantor nepData values based on index in guarantorDetails form
            this.userConfigForm.get(['guarantorDetails', index, 'nepData']).patchValue(JSON.stringify(nepData));
        });
    }

    // end guarantor details data patch

    closeModal() {
        this.dialogRef.close();
    }

    addJointCustomerDetails() {
        (this.userConfigForm.get('jointCustomerDetails') as FormArray).push(
            this.formBuilder.group({
                branch: [undefined],
                branchTrans: [undefined],
                branchCT: [undefined],
                // clientType: [undefined],
                // clientTypeTrans: [undefined],
                // clientTypeCT: [undefined],
                name: [undefined],
                nameTrans: [undefined],
                nameCT: [undefined],
                email: [undefined],
                emailTrans: [undefined],
                emailCT: [undefined],
                contactNo: [undefined],
                contactNoTrans: [undefined],
                contactNoCT: [undefined],
                panNo: [undefined],
                panNoTrans: [undefined],
                panNoCT: [undefined],
                customerCode: [undefined],
                customerCodeTrans: [undefined],
                customerCodeCT: [undefined],

                gender: [undefined],
                genderTrans: [undefined],
                genderCT: [undefined],
                fatherName: [undefined],
                fatherNameTrans: [undefined],
                fatherNameCT: [undefined],
                grandFatherName: [undefined],
                grandFatherNameTrans: [undefined],
                grandFatherNameCT: [undefined],
                relationMedium: [undefined],
                relationMediumTrans: [undefined],
                relationMediumCT: [undefined],
                husbandName: [undefined],
                husbandNameTrans: [undefined],
                husbandNameCT: [undefined],
                fatherInLawName: [undefined],
                fatherInLawNameTrans: [undefined],
                fatherInLawNameCT: [undefined],
                citizenNumber: [undefined],
                citizenNumberTrans: [undefined],
                citizenNumberCT: [undefined],
                dob: [undefined],
                dobTrans: [undefined],
                dobCT: [undefined],
                // tslint:disable-next-line:max-line-length
                permanentProvinceCT: [undefined],
                permanentProvince: [undefined],
                permanentProvinceTrans: [undefined],
                // tslint:disable-next-line:max-line-length
                permanentDistrict: [undefined],
                permanentDistrictTrans: [undefined],
                permanentDistrictCT: [undefined],
                // tslint:disable-next-line:max-line-length
                permanentMunicipality: [undefined],
                permanentMunicipalityTrans: [undefined],
                permanentMunicipalityCT: [undefined],
                permanentMunType: [0],
                permanentMunTypeTrans: [0],
                permanentMunTypeCT: [0],
                // tslint:disable-next-line:max-line-length
                temporaryProvince: [undefined],
                temporaryProvinceTrans: [undefined],
                temporaryProvinceCT: [undefined],
                // tslint:disable-next-line:max-line-length
                temporaryDistrict: [undefined],
                temporaryDistrictTrans: [undefined],
                temporaryDistrictCT: [undefined],
                // tslint:disable-next-line:max-line-length
                temporaryMunicipality: [undefined],
                temporaryMunicipalityTrans: [undefined],
                temporaryMunicipalityCT: [undefined],
                permanentWard: [undefined],
                permanentWardTrans: [undefined],
                permanentWardCT: [undefined, Validators.required],
                temporaryWard: [undefined],
                temporaryWardTrans: [undefined],
                temporaryWardCT: [undefined],
                temporaryMunType: [1],
                temporaryMunTypeTrans: [1],
                temporaryMunTypeCT: [undefined],
                citizenshipIssueDistrict: [undefined],
                citizenshipIssueDistrictTrans: [undefined],
                citizenshipIssueDistrictCT: [undefined],
                citizenshipIssueDate: [undefined],
                citizenshipIssueDateTrans: [undefined],
                citizenshipIssueDateCT: [undefined],
                municipalityOrVdc: [undefined],
                municipalityOrVdcTrans: [undefined],
                municipalityOrVdcCT: [undefined],
                temporaryMunicipalityOrVdc: [undefined],
                temporaryMunicipalityOrVdcTrans: [undefined],
                temporaryMunicipalityOrVdcCT: [undefined],
                dobDateType: [undefined],
                dobDateTypeTrans: [undefined],
                dobDateTypeCT: [undefined],
                issuedDate: [undefined],
                issuedDateTrans: [undefined],
                issuedDateCT: [undefined],

                isSameTemporaryAndPermanent: [false],
                isSameTemporaryAndPermanentCT: [undefined],
                isSameTemporaryAndPermanentTrans: [undefined],

                nepData: [undefined],
            }));
    }

    setJointCustomerDetails(jointCustomerDetails: any) {
        if (ObjectUtil.isEmpty(jointCustomerDetails)) {
            this.addJointCustomerDetails();
            return;
        }
        const formArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;

        jointCustomerDetails.forEach(value => {
            formArray.push(this.formBuilder.group({
                branch: [value.branch ? value.branch : undefined],
                branchTrans: [value.branchTrans ? value.branchTrans : undefined],
                branchCT: [value.branchCT ? value.branchCT : undefined],
                clientType: [value.clientType ? value.clientType : undefined],
                clientTypeTrans: [value.clientTypeTrans ? value.clientTypeTrans : undefined],
                clientTypeCT: [value.clientTypeCT ? value.clientTypeCT : undefined],
                name: [value.name ? value.name : undefined],
                nameTrans: [value.nameTrans ? value.nameTrans : undefined],
                nameCT: [value.nameCT ? value.nameCT : undefined],
                email: [value.email ? value.email : undefined],
                emailTrans: [value.emailTrans ? value.emailTrans : undefined],
                emailCT: [value.emailCT ? value.emailCT : undefined],
                // contactNo: [value.contactNo ? value.contactNo : undefined],
                // contactNoTrans: [value.contactNoTrans ? value.contactNoTrans : undefined],
                // contactNoCT: [value.contactNoCT ? value.contactNoCT : undefined],
                // panNo: [value.panNo ? value.panNo : undefined],
                // panNoTrans: [value.panNoTrans ? value.panNoTrans : undefined],
                // panNoCT: [value.panNoCT ? value.panNoCT : undefined],
                customerCode: [value.customerCode ? value.customerCode : undefined],
                customerCodeTrans: [value.customerCodeTrans ? value.customerCodeTrans : undefined],
                customerCodeCT: [value.customerCodeCT ? value.customerCodeCT : undefined],

                gender: [value.gender ? value.gender : undefined],
                genderTrans: [value.genderTrans ? value.genderTrans : undefined],
                genderCT: [value.genderCT ? value.genderCT : undefined],
                fatherName: [value.fatherName ? value.fatherName : undefined],
                fatherNameTrans: [value.fatherNameTrans ? value.fatherNameTrans : undefined],
                fatherNameCT: [value.fatherNameCT ? value.fatherNameCT : undefined],
                grandFatherName: [value.grandFatherName ? value.grandFatherName : undefined],
                grandFatherNameTrans: [value.grandFatherNameTrans ? value.grandFatherNameTrans : undefined],
                grandFatherNameCT: [value.grandFatherNameCT ? value.grandFatherNameCT : undefined],
                relationMedium: [value.relationMedium ? value.relationMedium : undefined],
                relationMediumTrans: [value.relationMediumTrans ? value.relationMediumTrans : undefined],
                relationMediumCT: [value.relationMediumCT ? value.relationMediumCT : undefined],
                husbandName: [value.husbandName ? value.husbandName : undefined],
                husbandNameTrans: [value.husbandNameTrans ? value.husbandNameTrans : undefined],
                husbandNameCT: [value.husbandNameCT ? value.husbandNameCT : undefined],
                fatherInLawName: [value.fatherInLawName ? value.fatherInLawName : undefined],
                fatherInLawNameTrans: [value.fatherInLawNameTrans ? value.fatherInLawNameTrans : undefined],
                fatherInLawNameCT: [value.fatherInLawNameCT ? value.fatherInLawNameCT : undefined],
                citizenshipNo: [value.citizenshipNo ? value.citizenshipNo : undefined],
                citizenshipNoTrans: [value.citizenshipNoTrans ? value.citizenshipNoTrans : undefined],
                citizenshipNoCT: [value.citizenshipNoCT ? value.citizenshipNoCT : undefined],
                dob: [value.dob ? value.dob : undefined],
                dobTrans: [value.dobTrans ? value.dobTrans : undefined],
                dobCT: [value.dobCT ? value.dobCT : undefined],
                // tslint:disable-next-line:max-line-length
                // Trans tslint:disable-nextTrans-line:maxTrans-line-length
                permanentProvinceCT: [value.permanentProvinceCT ? value.permanentProvinceCT : undefined],
                permanentProvince: [value.permanentProvince ? value.permanentProvince : undefined],
                // tslint:disable-next-line:max-line-length
                permanentDistrict: [value.permanentDistrict ? value.permanentDistrict : undefined],
                permanentDistrictTrans: [value.permanentDistrictTrans ? value.permanentDistrictTrans : undefined],
                permanentDistrictCT: [value.permanentDistrictCT ? value.permanentDistrictCT : undefined],
                // tslint:disable-next-line:max-line-length
                permanentMunicipality: [value.permanentMunicipality ? value.permanentMunicipality : undefined],
                permanentMunicipalityTrans: [value.permanentMunicipalityTrans ? value.permanentMunicipalityTrans : undefined],
                permanentMunicipalityCT: [value.permanentMunicipalityCT ? value.permanentMunicipalityCT : undefined],
                permanentMunType: [0],
                permanentMunTypeTrans: [0],
                permanentMunTypeCT: [0],
                // tslint:disable-next-line:max-line-length
                temporaryProvince: [value.temporaryProvince ? value.temporaryProvince : undefined],
                temporaryProvinceTrans: [value.temporaryProvinceTrans ? value.temporaryProvinceTrans : undefined],
                temporaryProvinceCT: [value.temporaryProvinceCT ? value.temporaryProvinceCT : undefined],
                // tslint:disable-next-line:max-line-length
                temporaryDistrict: [value.temporaryDistrict ? value.temporaryDistrict : undefined],
                temporaryDistrictTrans: [value.temporaryDistrictTrans ? value.temporaryDistrictTrans : undefined],
                temporaryDistrictCT: [value.temporaryDistrictCT ? value.temporaryDistrictCT : undefined],
                // tslint:disable-next-line:max-line-length
                temporaryMunicipality: [value.temporaryMunicipality ? value.temporaryMunicipality : undefined],
                temporaryMunicipalityTrans: [value.temporaryMunicipalityTrans ? value.temporaryMunicipalityTrans : undefined],
                temporaryMunicipalityCT: [value.temporaryMunicipalityCT ? value.temporaryMunicipalityCT : undefined],
                permanentWard: [value.permanentWard ? value.permanentWard : undefined],
                permanentWardTrans: [value.permanentWardTrans ? value.permanentWardTrans : undefined],
                permanentWardCT: [value.permanentWardCT ? value.permanentWardCT : undefined],
                temporaryWard: [value.temporaryWard ? value.temporaryWard : undefined],
                temporaryWardTrans: [value.temporaryWardTrans ? value.temporaryWardTrans : undefined],
                temporaryWardCT: [value.temporaryWardCT ? value.temporaryWardCT : undefined],
                temporaryMunType: [1],
                temporaryMunTypeTrans: [1],
                temporaryMunTypeCT: [value.temporaryMunTypeCT ? value.temporaryMunTypeCT : undefined],
                citizenshipIssueDistrict: [value.citizenshipIssueDistrict ? value.citizenshipIssueDistrict : undefined],
                citizenshipIssueDistrictTrans: [value.citizenshipIssueDistrictTrans ? value.citizenshipIssueDistrictTrans : undefined],
                citizenshipIssueDistrictCT: [value.citizenshipIssueDistrictCT ? value.citizenshipIssueDistrictCT : undefined],
                citizenshipIssueDate: [value.citizenshipIssueDate ? value.citizenshipIssueDate : undefined],
                citizenshipIssueDateTrans: [value.citizenshipIssueDateTrans ? value.citizenshipIssueDateTrans : undefined],
                citizenshipIssueDateCT: [value.citizenshipIssueDateCT ? value.citizenshipIssueDateCT : undefined],
                municipalityOrVdc: [value.municipalityOrVdc ? value.municipalityOrVdc : undefined],
                municipalityOrVdcTrans: [value.municipalityOrVdcTrans ? value.municipalityOrVdcTrans : undefined],
                municipalityOrVdcCT: [value.municipalityOrVdcCT ? value.municipalityOrVdcCT : undefined],
                temporaryMunicipalityOrVdc: [value.temporaryMunicipalityOrVdc ? value.temporaryMunicipalityOrVdc : undefined],
                temporaryMunicipalityOrVdcTrans: [value.temporaryMunicipalityOrVdcTrans ? value.temporaryMunicipalityOrVdcTrans : undefined],
                temporaryMunicipalityOrVdcCT: [value.temporaryMunicipalityOrVdcCT ? value.temporaryMunicipalityOrVdcCT : undefined],
                dobDateType: [value.dobDateType ? value.dobDateType : undefined],
                dobDateTypeTrans: [value.dobDateTypeTrans ? value.dobDateTypeTrans : undefined],
                dobDateTypeCT: [value.dobDateTypeCT ? value.dobDateTypeCT : undefined],
                issuedDate: [value.issuedDate ? value.issuedDate : undefined],
                issuedDateTrans: [value.issuedDateTrans ? value.issuedDateTrans : undefined],
                issuedDateCT: [value.issuedDateCT ? value.issuedDateCT : undefined],

                isSameTemporaryAndPermanent: [false],
                isSameTemporaryAndPermanentCT: [undefined],
                isSameTemporaryAndPermanentTrans: [undefined],

                nepData: [undefined]
            }));
        });
    }

    removeJointCustomerDetails(i: any) {
        (this.userConfigForm.get('jointCustomerDetails') as FormArray).removeAt(i);
        this.translatedJointCustomerDetails.splice(i, 1);
    }


    addGuarantor() {
        (this.userConfigForm.get('guarantorDetails') as FormArray).push(this.addGuarantorField());
    }

    addGuarantorField() {
        return this.formBuilder.group({
            guarantorName: '',
            guarantorNameTrans: '',
            guarantorNameCT: '',
            issuedPlace: '',
            issuedPlaceTrans: '',
            issuedPlaceCT: '',
            guarantorPermanentMunicipalityOrVdc: '',
            guarantorPermanentMunicipalityOrVdcTrans: '',
            guarantorPermanentMunicipalityOrVdcCT: '',
            guarantorTemporaryMunicipalityOrVdc: '',
            guarantorTemporaryMunicipalityOrVdcTrans: '',
            guarantorTemporaryMunicipalityOrVdcCT: '',
            relationship: '',
            relationshipCT: '',
            relationshipTrans: [undefined],
            citizenNumber: '',
            citizenNumberTrans: [undefined],
            citizenNumberCT: '',
            genderCT: '',
            gender: '',
            genderTrans: [undefined],
            relationMediumCT: [undefined],
            relationMedium: [undefined],
            husbandNameCT: [undefined],
            husbandName: [undefined],
            husbandNameTrans: [undefined],
            fatherInLawNameCT: [undefined],
            fatherInLawName: [undefined],
            fatherInLawNameTrans: [undefined],
            grandFatherNameCT: [undefined],
            grandFatherName: [undefined],
            grandFatherNameTrans: [undefined],
            fatherNameCT: [undefined],
            fatherName: [undefined],
            fatherNameTrans: [undefined],
            radioCitizenIssuedDate: [undefined],
            radioCitizenIssuedDateTrans: [undefined],
            radioCitizenIssuedDateCT: [undefined],

            gurantedAmount: [undefined],
            gurantedAmountCT: [undefined],
            gurantedAmountTrans: [undefined],
            permanentProvince: [undefined],
            permanentProvinceCT: [undefined],
            permanentProvinceTrans: [undefined],
            permanentDistrict: [undefined],
            permanentDistrictCT: [undefined],
            permanentDistrictTrans: [undefined],
            permanentMunicipality: [undefined],
            permanentMunicipalityCT: [undefined],
            permanentMunicipalityTrans: [undefined],
            permanentWard: [undefined],
            permanentWardCT: [undefined],
            permanentWardTrans: [undefined],

            temporaryProvince: [undefined],
            temporaryProvinceCT: [undefined],
            temporaryProvinceTrans: [undefined],
            temporaryDistrict: [undefined],
            temporaryDistrictCT: [undefined],
            temporaryDistrictTrans: [undefined],
            temporaryMunicipality: [undefined],
            temporaryMunicipalityCT: [undefined],
            temporaryMunicipalityTrans: [undefined],
            temporaryWard: [undefined],
            temporaryWardCT: [undefined],
            temporaryWardTrans: [undefined],

            isSameTemporaryAndPermanent: [false],
            isSameTemporaryAndPermanentCT: [undefined],
            isSameTemporaryAndPermanentTrans: [undefined],
            citizenIssuedDate: [undefined],
            citizenIssuedDateTrans: [undefined],
            citizenIssuedDateCT: [undefined],


            // only for Institutional customer
            permanentStreetTole: [undefined],
            permanentStreetToleTrans: [undefined],
            permanentStreetToleCT: [undefined],
            temporaryStreetTole: [undefined],
            temporaryStreetToleTrans: [undefined],
            temporaryStreetToleCT: [undefined],

            guarantorNationality: [undefined],
            guarantorNationalityTrans: [undefined],
            guarantorNationalityCT : [undefined],

            // for indian guarantor
            // embassy details
            embassyNo: [undefined],
            embassyNoTrans: [undefined],
            embassyNoCT: [undefined],
            embassyIssuedDate: [undefined],
            embassyIssuedDateTrans: [undefined],
            embassyIssuedDateCT: [undefined],
            embassyIssuedFrom: [undefined],
            embassyIssuedFromTrans: [undefined],
            embassyIssuedFromCT: [undefined],

            //passport detail
            passportNo: [undefined],
            passportNoTrans: [undefined],
            passportNoCT: [undefined],
            passportIssuedDate: [undefined],
            passportIssuedDateTrans: [undefined],
            passportIssuedDateCT: [undefined],
            passportValidityDate: [undefined],
            passportValidityDateTrans: [undefined],
            passportValidityDateCT: [undefined],
            passportIssuedFrom: [undefined],
            passportIssuedFromTrans: [undefined],
            passportIssuedFromCT: [undefined],

            //adhar card detail
            adharCardNo: [undefined],
            adharCardNoTrans: [undefined],
            adharCardNoCT: [undefined],
            adharCardIssuedDate: [undefined],
            adharCardIssuedDateTrans: [undefined],
            adharCardIssuedDateCT: [undefined],
            adharCardIssuedFrom: [undefined],
            adharCardIssuedFromTrans: [undefined],
            adharCardIssuedFromCT: [undefined],


            otherGuarantorPassportNo: [undefined],
            otherGuarantorPassportNoTrans: [undefined],
            otherGuarantorPassportNoCT: [undefined],
            otherGuarantorPassportIssuedDate: [undefined],
            otherGuarantorPassportIssuedDateTrans: [undefined],
            otherGuarantorPassportIssuedDateCT: [undefined],
            otherGuarantorPassportValidityDate: [undefined],
            otherGuarantorPassportValidityDateTrans: [undefined],
            otherGuarantorPassportValidityDateCT: [undefined],
            otherGuarantorPassportIssuedFrom: [undefined],
            otherGuarantorPassportIssuedFromTrans: [undefined],
            otherGuarantorPassportIssuedFromCT: [undefined],


            otherGuarantorPassportIssuedDateOption: [undefined],
            otherGuarantorPassportIssuedDateOptionTrans: [undefined],
            otherGuarantorPassportIssuedDateOptionCT: [undefined],
            otherGuarantorPassportValidityDateOption: [undefined],
            otherGuarantorPassportValidityDateOptionCT: [undefined],
            otherGuarantorPassportValidityDateOptionTrans: [undefined],

            //Guarantors flag

            // guarantorNationalityOption: [undefined],
            // guarantorNationalityOptionTrans: [undefined],
            // guarantorNationalityOptionCT: [undefined],
            indianGuarantorDetailOption: [undefined],
            indianGuarantorDetailOptionTrans: [undefined],
            indianGuarantorDetailOptionCT: [undefined],

            // Guarantors flag--ends

            guarantorForeignAddressOption: [undefined],
            guarantorForeignAddressOptionTrans: [undefined],
            guarantorForeignAddressOptionCT : [undefined],

            guarantorOtherAddress: [undefined],
            guarantorOtherAddressTrans: [undefined],
            guarantorOtherAddressCT: [undefined],

            // only for Institutional customer--ends

            nepData: [undefined],

        });
    }


    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
        this.translatedGuarantorDetails.splice(i, 1);
    }

    removeOwnerDetailAtIndex(i: any) {
        (this.userConfigForm.get('ownerDetails') as FormArray).removeAt(i);
    }



    onChangeTab(event) {
        this.hideSaveBtn = false;

    }

    setGuarantors(guarantorDetails: any) {
        const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        // if (!ObjectUtil.isEmpty(this.loanHolder.guarantors)) {
        //   if (!ObjectUtil.isEmpty(this.loanHolder.guarantors.guarantorList)) {
        //     const guarantorList = this.loanHolder.guarantors.guarantorList;
        //     this.guarantorList = guarantorList;
        //   }
        // }
        guarantorDetails.forEach((value, i) => {
            this.getGuarantorDistrictsById(ObjectUtil.isEmpty(value.province) ? null : value.province.id, null, i);
            this.getGuarantorMunicipalitiesById(ObjectUtil.isEmpty(value.district) ? null : value.district.id, null, i);
            this.getGuarantorTempDistrictsById(ObjectUtil.isEmpty(value.provinceTemporary) ? null : value.provinceTemporary.id, null, i);
            this.getGuarantorTempMunicipalitiesById(ObjectUtil.isEmpty(value.districtTemporary) ? null : value.districtTemporary.id, null, i);
            const nepaData = JSON.parse(value.nepData);

            let citizenIssuedDate: any;
            if (!ObjectUtil.isEmpty(nepaData.radioCitizenIssuedDate) && nepaData.radioCitizenIssuedDate.en === 'BS') {
                citizenIssuedDate = nepaData.citizenIssuedDate.en.eDate;
            } else {
                if (!ObjectUtil.isEmpty(nepaData.radioCitizenIssuedDate)) {
                    citizenIssuedDate = nepaData.citizenIssuedDate.en;
                } else {
                    citizenIssuedDate = undefined;
                }
            }


            formArray.push(this.formBuilder.group({
                guarantorName: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.en],
                guarantorNameTrans: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.np],
                guarantorNameCT: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.ct],
                citizenNumberTrans: [ObjectUtil.isEmpty(nepaData.citizenNumber) ? undefined : nepaData.citizenNumber.np],
                issuedPlace: [ObjectUtil.isEmpty(nepaData.issuedPlace) ? undefined : nepaData.issuedPlace.en],
                issuedPlaceTrans: [ObjectUtil.isEmpty(nepaData.issuedPlace) ? undefined : nepaData.issuedPlace.np],
                issuedPlaceCT: [ObjectUtil.isEmpty(nepaData.issuedPlace) ? undefined : nepaData.issuedPlace.ct],
                genderCT: [ObjectUtil.isEmpty(nepaData.gender) ? undefined : nepaData.gender.ct],
                gender: [ObjectUtil.isEmpty(nepaData.gender) ? undefined : nepaData.gender.en],
                genderTrans: [ObjectUtil.isEmpty(nepaData.gender) ? undefined : nepaData.gender.np],
                relationMediumCT: [ObjectUtil.isEmpty(nepaData.relationMedium) ? undefined : nepaData.relationMedium.ct],
                relationMedium: [ObjectUtil.isEmpty(nepaData.relationMedium) ? undefined : nepaData.relationMedium.en],
                husbandNameCT: [ObjectUtil.isEmpty(nepaData.husbandName) ? undefined : nepaData.husbandName.ct],
                husbandName: [ObjectUtil.isEmpty(nepaData.husbandName) ? undefined : nepaData.husbandName.en],
                husbandNameTrans: [ObjectUtil.isEmpty(nepaData.husbandName) ? undefined : nepaData.husbandName.np],

                fatherInLawNameCT: [ObjectUtil.isEmpty(nepaData.fatherInLawName) ? undefined : nepaData.fatherInLawName.ct],
                fatherInLawName: [ObjectUtil.isEmpty(nepaData.fatherInLawName) ? undefined : nepaData.fatherInLawName.en],
                fatherInLawNameTrans: [ObjectUtil.isEmpty(nepaData.fatherInLawName) ? undefined : nepaData.fatherInLawName.np],

                grandFatherNameCT: [ObjectUtil.isEmpty(nepaData.grandFatherName) ? undefined : nepaData.grandFatherName.ct],
                grandFatherName: [ObjectUtil.isEmpty(nepaData.grandFatherName) ? undefined : nepaData.grandFatherName.en],
                grandFatherNameTrans: [ObjectUtil.isEmpty(nepaData.grandFatherName) ? undefined : nepaData.grandFatherName.np],

                fatherNameCT: [ObjectUtil.isEmpty(nepaData.fatherName) ? undefined : nepaData.fatherName.ct],
                fatherName: [!ObjectUtil.isEmpty(nepaData.fatherName) ? nepaData.fatherName.en : undefined],
                fatherNameTrans: [ObjectUtil.isEmpty(nepaData.fatherName) ? undefined : nepaData.fatherName.np],

                relationship: [ObjectUtil.isEmpty(nepaData.relationship) ? undefined : nepaData.relationship.en],
                relationshipCT: [ObjectUtil.isEmpty(nepaData.relationship) ? undefined : nepaData.relationship.ct],
                relationshipTrans: [ObjectUtil.isEmpty(nepaData.relationship) ? undefined : nepaData.relationship.np],
                citizenNumber: [value.citizenNumber],
                citizenNumberCT: [ObjectUtil.isEmpty(nepaData.citizenNumber) ? undefined : nepaData.citizenNumber.ct],
                gurantedAmount: [ObjectUtil.isEmpty(nepaData.gurantedAmount) ? undefined : nepaData.gurantedAmount.en],
                gurantedAmountCT: [ObjectUtil.isEmpty(nepaData.gurantedAmount) ? undefined : nepaData.gurantedAmount.ct],
                gurantedAmountTrans: [ObjectUtil.isEmpty(nepaData.gurantedAmount) ? undefined : nepaData.gurantedAmount.ct],

                permanentProvince: [ObjectUtil.isEmpty(value.province) ? undefined : value.province],
                permanentProvinceCT: [ObjectUtil.isEmpty(nepaData.permanentProvince) ? undefined : nepaData.permanentProvince.ct],
                permanentProvinceTrans: [ObjectUtil.isEmpty(nepaData.permanentProvince) ? undefined : nepaData.permanentProvince.en.nepaliName],
                permanentDistrict: [ObjectUtil.isEmpty(value.district) ? undefined : value.district],
                permanentDistrictCT: [ObjectUtil.isEmpty(nepaData.permanentDistrict) ? undefined : nepaData.permanentDistrict.ct],
                permanentDistrictTrans: [ObjectUtil.isEmpty(nepaData.permanentDistrict) ? undefined : nepaData.permanentDistrict.en.nepaliName],
                permanentMunicipality: [ObjectUtil.isEmpty(nepaData.permanentMunicipality) ? undefined : nepaData.permanentMunicipality.en],
                permanentMunicipalityCT: [ObjectUtil.isEmpty(nepaData.permanentMunicipality) ? undefined : nepaData.permanentMunicipality.ct],
                permanentMunicipalityTrans: [ObjectUtil.isEmpty(nepaData.permanentMunicipality) ? undefined : nepaData.permanentMunicipality.en.nepaliName],
                permanentWard: [ObjectUtil.isEmpty(nepaData.permanentWard) ? undefined : nepaData.permanentWard.en],
                permanentWardCT: [ObjectUtil.isEmpty(nepaData.permanentWard) ? undefined : nepaData.permanentWard.ct],
                permanentWardTrans: [ObjectUtil.isEmpty(nepaData.permanentWard) ? undefined : nepaData.permanentWard.np],

                temporaryProvince: [ObjectUtil.isEmpty(value.provinceTemporary) ? undefined : value.provinceTemporary],
                temporaryProvinceCT: [ObjectUtil.isEmpty(nepaData.temporaryProvince) ? undefined : nepaData.temporaryProvince.ct],
                temporaryProvinceTrans: [ObjectUtil.isEmpty(nepaData.temporaryProvince) ? undefined : nepaData.temporaryProvince.en.nepaliName],
                temporaryDistrict: [ObjectUtil.isEmpty(value.districtTemporary) ? undefined : value.districtTemporary],
                temporaryDistrictCT: [ObjectUtil.isEmpty(nepaData.temporaryDistrict) ? undefined : nepaData.temporaryDistrict.ct],
                temporaryDistrictTrans: [ObjectUtil.isEmpty(nepaData.temporaryDistrict) ? undefined : nepaData.temporaryDistrict.en.nepaliName],
                temporaryMunicipality: [ObjectUtil.isEmpty(value.municipalitiesTemporary) ? undefined : value.municipalitiesTemporary],
                temporaryMunicipalityCT: [ObjectUtil.isEmpty(nepaData.temporaryMunicipality) ? undefined : nepaData.temporaryMunicipality.ct],
                temporaryMunicipalityTrans: [ObjectUtil.isEmpty(nepaData.temporaryMunicipality) ? undefined : nepaData.temporaryMunicipality.en.nepaliName],
                temporaryWard: [ObjectUtil.isEmpty(nepaData.temporaryWard) ? undefined : nepaData.temporaryWard.en],
                temporaryWardCT: [ObjectUtil.isEmpty(nepaData.temporaryWard) ? undefined : nepaData.temporaryWard.ct],
                temporaryWardTrans: [ObjectUtil.isEmpty(nepaData.temporaryWard) ? undefined : nepaData.temporaryWard.np],
                isSameTemporaryAndPermanent: [ObjectUtil.isEmpty(value.isSameTemporaryAndPermanent) ? undefined : value.isSameTemporaryAndPermanent],
                isSameTemporaryAndPermanentCT: [undefined],
                isSameTemporaryAndPermanentTrans: [undefined],
                guarantorPermanentMunicipalityOrVdc: [ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorPermanentMunicipalityOrVdc.en],
                nepData: [value.nepData],
                guarantorTemporaryMunicipalityOrVdc: [ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorTemporaryMunicipalityOrVdc.en],
                radioCitizenIssuedDate: ['AD'],
                citizenIssuedDate: citizenIssuedDate,
                guarantorPermanentMunicipalityOrVdcCT: [ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorPermanentMunicipalityOrVdc.np],
                guarantorTemporaryMunicipalityOrVdcCT: [ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorTemporaryMunicipalityOrVdc.np],
                permanentStreetTole: [ObjectUtil.isEmpty(nepaData.permanentStreetTole) ?
                    undefined : nepaData.permanentStreetTole.en],
                permanentStreetToleTrans: [ObjectUtil.isEmpty(nepaData.permanentStreetTole) ?
                    undefined : nepaData.permanentStreetTole.np],
                permanentStreetToleCT: [ObjectUtil.isEmpty(nepaData.permanentStreetTole) ?
                    undefined : nepaData.permanentStreetTole.ct],
                temporaryStreetTole: [ObjectUtil.isEmpty(nepaData.temporaryStreetTole) ?
                    undefined : nepaData.temporaryStreetTole.en],
                temporaryStreetToleTrans: [ObjectUtil.isEmpty(nepaData.temporaryStreetTole) ?
                    undefined : nepaData.temporaryStreetTole.np],
                temporaryStreetToleCT: [ObjectUtil.isEmpty(nepaData.temporaryStreetTole) ?
                    undefined : nepaData.temporaryStreetTole.ct],
                guarantorNationality: [ObjectUtil.isEmpty(nepaData.guarantorNationality) ?
                    undefined : nepaData.guarantorNationality],
                guarantorNationalityTrans:ObjectUtil.isEmpty(nepaData.guarantorNationality) ?
                    undefined : nepaData.guarantorNationality.np,
                guarantorNationalityCT : ObjectUtil.isEmpty(nepaData.guarantorNationality) ?
                    undefined : nepaData.guarantorNationality.ct,

                // for indian guarantor
                // embassy details
                embassyNo: ObjectUtil.isEmpty(nepaData.embassyNo) ?
                    undefined : nepaData.embassyNo.en,
                embassyNoTrans: ObjectUtil.isEmpty(nepaData.embassyNo) ?
                    undefined : nepaData.embassyNo.np,
                embassyNoCT: ObjectUtil.isEmpty(nepaData.embassyNo) ?
                    undefined : nepaData.embassyNo.ct,
                embassyIssuedDate: ObjectUtil.isEmpty(nepaData.embassyIssuedDate) ?
                    undefined : nepaData.embassyIssuedDate.en,
                embassyIssuedDateTrans:  ObjectUtil.isEmpty(nepaData.embassyIssuedDate) ?
                    undefined : nepaData.embassyIssuedDate.np,
                embassyIssuedDateCT:  ObjectUtil.isEmpty(nepaData.embassyIssuedDate) ?
                    undefined : nepaData.embassyIssuedDate.ct,
                embassyIssuedFrom:  ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) ?
                    undefined : nepaData.embassyIssuedFrom.en,
                embassyIssuedFromTrans:ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) ?
                    undefined : nepaData.embassyIssuedFrom.np,
                embassyIssuedFromCT: ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) ?
                    undefined : nepaData.embassyIssuedFrom.ct,

                //passport detail
                passportNo:  ObjectUtil.isEmpty(nepaData.passportNo) ?
                    undefined : nepaData.passportNo.en,
                passportNoTrans:  ObjectUtil.isEmpty(nepaData.passportNo) ?
                    undefined : nepaData.passportNo.np,
                passportNoCT:  ObjectUtil.isEmpty(nepaData.passportNo) ?
                    undefined : nepaData.passportNo.ct,
                passportIssuedDate: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.en,
                passportIssuedDateTrans: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.np,
                passportIssuedDateCT: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.ct,
                passportValidityDate: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.en,
                passportValidityDateTrans: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.np,
                passportValidityDateCT: ObjectUtil.isEmpty(nepaData.passportIssuedDate) ?
                    undefined : nepaData.passportIssuedDate.ct,
                passportIssuedFrom: ObjectUtil.isEmpty(nepaData.passportIssuedFrom) ?
                    undefined : nepaData.passportIssuedFrom.en,
                passportIssuedFromTrans: ObjectUtil.isEmpty(nepaData.passportIssuedFrom) ?
                    undefined : nepaData.passportIssuedFrom.np,
                passportIssuedFromCT: ObjectUtil.isEmpty(nepaData.passportIssuedFrom) ?
                    undefined : nepaData.passportIssuedFrom.ct,

                //adhar card detail
                adharCardNo: ObjectUtil.isEmpty(nepaData.adharCardNo) ?
                    undefined : nepaData.adharCardNo.en,
                adharCardNoTrans: ObjectUtil.isEmpty(nepaData.adharCardNo) ?
                    undefined : nepaData.adharCardNo.np,
                adharCardNoCT: ObjectUtil.isEmpty(nepaData.adharCardNo) ?
                    undefined : nepaData.adharCardNo.ct,
                adharCardIssuedDate: ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) ?
                    undefined : nepaData.adharCardIssuedDate.en,
                adharCardIssuedDateTrans: ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) ?
                    undefined : nepaData.adharCardIssuedDate.np,
                adharCardIssuedDateCT:  ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) ?
                    undefined : nepaData.adharCardIssuedDate.ct,
                adharCardIssuedFrom: ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) ?
                    undefined : nepaData.adharCardIssuedFrom.en,
                adharCardIssuedFromTrans: ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) ?
                    undefined : nepaData.adharCardIssuedFrom.np,
                adharCardIssuedFromCT:ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) ?
                    undefined : nepaData.adharCardIssuedFrom.ct,


                otherGuarantorPassportNo:  ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) ?
                    undefined : nepaData.otherGuarantorPassportNo.en,
                otherGuarantorPassportNoTrans:  ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) ?
                    undefined : nepaData.otherGuarantorPassportNo.np,
                otherGuarantorPassportNoCT: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) ?
                    undefined : nepaData.otherGuarantorPassportNo.ct,
                otherGuarantorPassportIssuedDate: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) ?
                    undefined : nepaData.otherGuarantorPassportIssuedDate.en,
                otherGuarantorPassportIssuedDateTrans:ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) ?
                    undefined : nepaData.otherGuarantorPassportIssuedDate.np,
                otherGuarantorPassportIssuedDateCT: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) ?
                    undefined : nepaData.otherGuarantorPassportIssuedDate.ct,
                otherGuarantorPassportValidityDate: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) ?
                    undefined : nepaData.otherGuarantorPassportValidityDate.en,
                otherGuarantorPassportValidityDateTrans: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) ?
                    undefined : nepaData.otherGuarantorPassportValidityDate.np,
                otherGuarantorPassportValidityDateCT:  ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) ?
                    undefined : nepaData.otherGuarantorPassportValidityDate.ct,
                otherGuarantorPassportIssuedFrom:  ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) ?
                    undefined : nepaData.otherGuarantorPassportIssuedFrom.en,
                otherGuarantorPassportIssuedFromTrans: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) ?
                    undefined : nepaData.otherGuarantorPassportIssuedFrom.np,
                otherGuarantorPassportIssuedFromCT: ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) ?
                    undefined : nepaData.otherGuarantorPassportIssuedFrom.ct,


                otherGuarantorPassportIssuedDateOption: ['AD'],
                otherGuarantorPassportIssuedDateOptionTrans: [undefined],
                otherGuarantorPassportIssuedDateOptionCT: [undefined],
                otherGuarantorPassportValidityDateOption: ['AD'],
                otherGuarantorPassportValidityDateOptionCT: [undefined],
                otherGuarantorPassportValidityDateOptionTrans: [undefined],

                //Guarantors flag

                // guarantorNationalityOption:  ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.en,
                // guarantorNationalityOptionTrans: ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.np,
                // guarantorNationalityOptionCT: ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.ct,
                indianGuarantorDetailOption:  ObjectUtil.isEmpty(nepaData.indianGuarantorDetailOption) ?
                    undefined : nepaData.indianGuarantorDetailOption.en,
                indianGuarantorDetailOptionTrans:  undefined,
                indianGuarantorDetailOptionCT:  undefined,


                guarantorForeignAddressOption: ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) ?
                    undefined : nepaData.guarantorForeignAddressOption.en,
                guarantorForeignAddressOptionTrans:ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) ?
                    undefined : nepaData.guarantorForeignAddressOption.np,
                guarantorForeignAddressOptionCT : ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) ?
                    undefined : nepaData.guarantorForeignAddressOption.ct,

                guarantorOtherAddress: ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) ?
                    undefined : nepaData.guarantorOtherAddress.en,
                guarantorOtherAddressTrans:ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) ?
                    undefined : nepaData.guarantorOtherAddress.np,
                guarantorOtherAddressCT:ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) ?
                    undefined : nepaData.guarantorOtherAddress.ct,

                radioCitizenIssuedDateCT: [undefined],
                citizenIssuedDateCT: [undefined],
                id: [value.id],

            }));
        });

        console.log(this.userConfigForm.get('guarantorDetails').value);
    }


    refreshPage() {
        window.location.reload();
    }

    async translate() {
        this.spinner = true;
        this.translatedValues = await this.translateService.translateForm(this.userConfigForm);
        this.userConfigForm.patchValue({
            actNameCT: this.translatedValues.actName ? this.translatedValues.actName : '',
            actNameTrans: this.translatedValues.actName ? this.translatedValues.actName : '',
            // actYearCT: ObjectUtil.isEmpty(this.userConfigForm.get('actYear').value) ? undefined :
            //    this.userConfigForm.get('actYear').value,
            // actYearTrans: ObjectUtil.isEmpty(this.userConfigForm.get('actYear').value) ? undefined :
            //     this.userConfigForm.get('actYear').value,
            radioActYearDate: ObjectUtil.isEmpty(this.userConfigForm.get('radioActYearDate').value) ? undefined :
                this.userConfigForm.get('radioActYearDate').value,
            authorizedBodyNameCT: this.translatedValues.authorizedBodyName ? this.translatedValues.authorizedBodyName : '',
            authorizedBodyNameTrans: this.translatedValues.authorizedBodyName ? this.translatedValues.authorizedBodyName : '',
            registeredWithCT: this.translatedValues.registeredWith ? this.translatedValues.registeredWith : '',
            registeredWithTrans: this.translatedValues.registeredWith ? this.translatedValues.registeredWith : '',
            issuingDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('issuingDistrict').value) ? undefined :
                this.userConfigForm.get('issuingDistrict').value.nepaliName,
            issuingDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get('issuingDistrict').value) ? undefined :
                this.userConfigForm.get('issuingDistrict').value.nepaliName,
            registeredStreetToleTrans: this.translatedValues.registeredStreetTole ? this.translatedValues.registeredStreetTole : '',
            registeredStreetToleCT: this.translatedValues.registeredStreetTole ? this.translatedValues.registeredStreetTole : '',
            currentStreetToleTrans: this.translatedValues.currentStreetTole ? this.translatedValues.currentStreetTole : '',
            currentStreetToleCT: this.translatedValues.currentStreetTole ? this.translatedValues.currentStreetTole : '',

        });
        this.spinner = false;
        this.objectTranslateForm.patchValue({
            branch: ObjectUtil.isEmpty(this.userConfigForm.get('branch').value) ? null :
                this.userConfigForm.get('branch').value.name,
            branchCT: ObjectUtil.isEmpty(this.userConfigForm.get('branchCT').value) ? null :
                this.userConfigForm.get('branchCT').value.name,
            cspermanentProvince: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvince').value) ? null :
                this.userConfigForm.get('permanentProvince').value.name,
            permanentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvinceCT').value) ? null :
                this.userConfigForm.get('permanentProvinceCT').value.name,
            cspermanentDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrict').value) ? null :
                this.userConfigForm.get('permanentDistrict').value.name,
            permanentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrictCT').value) ? null :
                this.userConfigForm.get('permanentDistrictCT').value.name,
            cspermanentMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ? null :
                this.userConfigForm.get('permanentMunicipality').value.name,
            permanentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipalityCT').value) ? null :
                this.userConfigForm.get('permanentMunicipalityCT').value.name,
            cstemporaryProvince: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ? null :
                this.userConfigForm.get('temporaryProvince').value.name,
            temporaryProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvinceCT').value) ? null :
                this.userConfigForm.get('temporaryProvinceCT').value.name,
            cstemporaryDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ? null :
                this.userConfigForm.get('temporaryDistrict').value.name,
            temporaryDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrictCT').value) ? null :
                this.userConfigForm.get('temporaryDistrictCT').value.name,
            cstemporaryMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ? null :
                this.userConfigForm.get('temporaryMunicipality').value.name,
            temporaryMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipalityCT').value) ? null :
                this.userConfigForm.get('temporaryMunicipalityCT').value.name,
            citizenshipIssueDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ? null :
                this.userConfigForm.get('citizenshipIssueDistrict').value,
            citizenshipIssueDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrictCT').value) ? null :
                this.userConfigForm.get('citizenshipIssueDistrictCT').value.name,
            registeredProvince: ObjectUtil.isEmpty(this.userConfigForm.get('registeredProvince').value) ? null :
                this.userConfigForm.get('registeredProvince').value.name,
            registeredDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('registeredDistrict').value) ? null :
                this.userConfigForm.get('registeredDistrict').value.name,
            registeredMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('registeredMunicipality').value) ? null :
                this.userConfigForm.get('registeredMunicipality').value.name,
            currentProvince: ObjectUtil.isEmpty(this.userConfigForm.get('currentProvince').value) ? null :
                this.userConfigForm.get('currentProvince').value.name,
            currentDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('currentDistrict').value) ? null :
                this.userConfigForm.get('currentDistrict').value.name,
            currentMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('currentMunicipality').value) ? null :
                this.userConfigForm.get('currentMunicipality').value.name,
        });
        this.objectValueTranslater = await this.translateService.translateForm(this.objectTranslateForm);
        if (this.customerType === CustomerType.INSTITUTION) {
            this.setInstitutionCTValue();
        }
        this.setCustomerCTData();
        this.setCustomerTransData();
        this.patchCorrectData();


        this.setNepaliData();
        this.disableSave = false;
    }

    async translateJointCustomerData(index) {
        const allJointCustomers = this.userConfigForm.get('jointCustomerDetails').value as FormArray;
        if (allJointCustomers.length > 0) {
            let jointCustomerDetails: any = [];
            jointCustomerDetails = await this.translateService.translateForm(this.userConfigForm, 'jointCustomerDetails', index);

            this.userConfigForm.get(['jointCustomerDetails', index, 'branchTrans']).patchValue(jointCustomerDetails.branch ? jointCustomerDetails.branch : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'branchCT']).patchValue(jointCustomerDetails.branch ? jointCustomerDetails.branch : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'nameTrans']).patchValue(jointCustomerDetails.name ? jointCustomerDetails.name : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'nameCT']).patchValue(jointCustomerDetails.name ? jointCustomerDetails.name : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'emailTrans']).patchValue(jointCustomerDetails.email ? jointCustomerDetails.email : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'emailCT']).patchValue(jointCustomerDetails.email ? jointCustomerDetails.email : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'contactNoTrans']).patchValue(jointCustomerDetails.contactNo ? jointCustomerDetails.contactNo : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'contactNoCT']).patchValue(jointCustomerDetails.contactNo ? jointCustomerDetails.contactNo : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'panNoTrans']).patchValue(jointCustomerDetails.panNo ? jointCustomerDetails.panNo : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'panNoCT']).patchValue(jointCustomerDetails.panNo ? jointCustomerDetails.panNo : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'customerCodeTrans']).patchValue(jointCustomerDetails.customerCode ? jointCustomerDetails.customerCode : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'customerCodeCT']).patchValue(jointCustomerDetails.customerCode ? jointCustomerDetails.customerCode : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'genderTrans']).patchValue(jointCustomerDetails.gender ? jointCustomerDetails.gender : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'genderCT']).patchValue(jointCustomerDetails.gender ? jointCustomerDetails.gender : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameTrans']).patchValue(jointCustomerDetails.fatherName ? jointCustomerDetails.fatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameCT']).patchValue(jointCustomerDetails.fatherName ? jointCustomerDetails.fatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameTrans']).patchValue(jointCustomerDetails.grandFatherName ? jointCustomerDetails.grandFatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameCT']).patchValue(jointCustomerDetails.grandFatherName ? jointCustomerDetails.grandFatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'relationMediumTrans']).patchValue(jointCustomerDetails.relationMedium ? jointCustomerDetails.relationMedium : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'relationMediumCT']).patchValue(jointCustomerDetails.relationMedium ? jointCustomerDetails.relationMedium : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameTrans']).patchValue(jointCustomerDetails.husbandName ? jointCustomerDetails.husbandName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameCT']).patchValue(jointCustomerDetails.husbandName ? jointCustomerDetails.husbandName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameTrans']).patchValue(jointCustomerDetails.fatherInLawName ? jointCustomerDetails.fatherInLawName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameCT']).patchValue(jointCustomerDetails.fatherInLawName ? jointCustomerDetails.fatherInLawName : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipNoTrans']).patchValue(jointCustomerDetails.citizenshipNo ? jointCustomerDetails.citizenshipNo : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipNoTrans']).setCT(jointCustomerDetails.citizenshipNo ? jointCustomerDetails.citizenshipNo : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'dobTrans']).patchValue(jointCustomerDetails.dob ? jointCustomerDetails.dob : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'dobCT']).patchValue(jointCustomerDetails.dob ? jointCustomerDetails.dob : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrictTrans']).patchValue(this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrict']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrict']).value.name : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrictCT']).patchValue(this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrict']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrict']).value.name : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDateTrans']).patchValue(jointCustomerDetails.citizenshipIssueDate ? jointCustomerDetails.citizenshipIssueDate : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDateCT']).patchValue(jointCustomerDetails.citizenshipIssueDate ? jointCustomerDetails.citizenshipIssueDate : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'municipalityOrVdcTrans']).patchValue(jointCustomerDetails.municipalityOrVdc ? jointCustomerDetails.municipalityOrVdc : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'municipalityOrVdcCT']).patchValue(jointCustomerDetails.municipalityOrVdc ? jointCustomerDetails.municipalityOrVdc : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'dobDateTypeTrans']).patchValue(jointCustomerDetails.dobDateType ? jointCustomerDetails.dobDateType : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'dobDateTypeCT']).patchValue(jointCustomerDetails.dobDateType ? jointCustomerDetails.dobDateType : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'issuedDateTrans']).patchValue(jointCustomerDetails.issuedDate ? jointCustomerDetails.issuedDate : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'issuedDateCT']).patchValue(jointCustomerDetails.issuedDate ? jointCustomerDetails.issuedDate : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenNumberTrans']).patchValue(jointCustomerDetails.citizenNumber ? jointCustomerDetails.citizenNumber : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'citizenNumberCT']).patchValue(jointCustomerDetails.citizenNumber ? jointCustomerDetails.citizenNumber : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'issuedPlaceTrans']).patchValue(jointCustomerDetails.issuedPlace ? jointCustomerDetails.issuedPlace : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'issuedPlaceTrans']).setCT(jointCustomerDetails.issuedPlace ? jointCustomerDetails.issuedPlace : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'genderTrans']).patchValue(jointCustomerDetails.gender ? jointCustomerDetails.gender : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'genderCT']).patchValue(jointCustomerDetails.gender ? jointCustomerDetails.gender : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameTrans']).patchValue(jointCustomerDetails.husbandName ? jointCustomerDetails.husbandName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameCT']).patchValue(jointCustomerDetails.husbandName ? jointCustomerDetails.husbandName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameTrans']).patchValue(jointCustomerDetails.fatherInLawName ? jointCustomerDetails.fatherInLawName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameCT']).patchValue(jointCustomerDetails.fatherInLawName ? jointCustomerDetails.fatherInLawName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameTrans']).patchValue(jointCustomerDetails.grandFatherName ? jointCustomerDetails.grandFatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameCT']).patchValue(jointCustomerDetails.grandFatherName ? jointCustomerDetails.grandFatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameTrans']).patchValue(jointCustomerDetails.fatherName ? jointCustomerDetails.fatherName : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameCT']).patchValue(jointCustomerDetails.fatherName ? jointCustomerDetails.fatherName : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'gurantedAmountTrans']).patchValue(jointCustomerDetails.gurantedAmount ? jointCustomerDetails.gurantedAmount : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'gurantedAmountTrans']).setCT(jointCustomerDetails.gurantedAmount ? jointCustomerDetails.gurantedAmount : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'permanentWardTrans']).patchValue(jointCustomerDetails.permanentWard ? jointCustomerDetails.permanentWard : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'permanentWardCT']).patchValue(jointCustomerDetails.permanentWard ? jointCustomerDetails.permanentWard : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryWardTrans']).patchValue(jointCustomerDetails.temporaryWard ? jointCustomerDetails.temporaryWard : '');
            // this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryWardCT']).patchValue(jointCustomerDetails.temporaryWard ? jointCustomerDetails.temporaryWard : '');

            this.addressFromGroup = this.formBuilder.group({
                permanentProvince: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvince']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvince']).value.name : '',
                permanentDistrict: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrict']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrict']).value.name : '',
                permanentMunicipality: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipality']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipality']).value.name : '',
                temporaryProvince: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvince']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvince']).value.name : '',
                temporaryDistrict: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrict']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrict']).value.name : '',
                temporaryMunicipality: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipality']).value ? this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipality']).value.name : '',
            });

            this.jointCustomerAddressTranslatedValue = await this.translateService.translateForm(this.addressFromGroup);

            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvinceCT']).patchValue(this.jointCustomerAddressTranslatedValue.permanentProvince ? this.jointCustomerAddressTranslatedValue.permanentProvince : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvinceTrans']).patchValue(this.jointCustomerAddressTranslatedValue.permanentProvince ? this.jointCustomerAddressTranslatedValue.permanentProvince : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrictCT']).patchValue(this.jointCustomerAddressTranslatedValue.permanentDistrict ? this.jointCustomerAddressTranslatedValue.permanentDistrict : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrictTrans']).patchValue(this.jointCustomerAddressTranslatedValue.permanentDistrict ? this.jointCustomerAddressTranslatedValue.permanentDistrict : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipalityCT']).patchValue(this.jointCustomerAddressTranslatedValue.permanentMunicipality ? this.jointCustomerAddressTranslatedValue.permanentMunicipality : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipalityTrans']).patchValue(this.jointCustomerAddressTranslatedValue.permanentMunicipality ? this.jointCustomerAddressTranslatedValue.permanentMunicipality : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvinceCT']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryProvince ? this.jointCustomerAddressTranslatedValue.temporaryProvince : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvinceTrans']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryProvince ? this.jointCustomerAddressTranslatedValue.temporaryProvince : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrictCT']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryDistrict ? this.jointCustomerAddressTranslatedValue.temporaryDistrict : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrictTrans']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryDistrict ? this.jointCustomerAddressTranslatedValue.temporaryDistrict : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipalityCT']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryMunicipality ? this.jointCustomerAddressTranslatedValue.temporaryMunicipality : '');
            this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipalityTrans']).patchValue(this.jointCustomerAddressTranslatedValue.temporaryMunicipality ? this.jointCustomerAddressTranslatedValue.temporaryMunicipality : '');

            // translate jointCustomerDetails
            const formArrayDataArrays: FormArray = this.userConfigForm.get(`jointCustomerDetails`) as FormArray;
            let a: any;
            a = formArrayDataArrays.controls;
            const newArr = {};
            // for (let i = 0; i < a.length; i++) {
            const individualData = a[index] as FormGroup;
            Object.keys(individualData.controls).forEach(key => {
                if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value
                    || key.indexOf('id') > -1 || key.indexOf('nepData') > -1) {
                    return;
                }
                this.attributes = new Attributes();
                this.attributes.en = individualData.get(key).value;
                this.attributes.np = jointCustomerDetails[key];
                this.attributes.ct = individualData.get(key + 'CT').value;
                newArr[key] = this.attributes;
            });
            this.translatedJointCustomerDetails[index] = newArr;

            this.userConfigForm.get(['jointCustomerDetails', index, 'nepData']).patchValue(JSON.stringify(newArr));

        }
    }


    /**
     * set individual guarantor nepData Details
     * @author Paribartan Kalathoki
     */
    setIndividualJointCustomerNepData() {
        const formArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;
        if (formArray.value.length === 0) {
            return;
        }
        formArray.value.forEach((value, index) => {
            if (index === 0) {
                return;
            }

            let nepData: any;
            nepData = JSON.parse(value.nepData);
            nepData.branch ? nepData.branch.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'branchCT']).value : '';
            nepData.name ? nepData.name.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'nameCT']).value : '';
            nepData.email ? nepData.email.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'emailCT']).value : '';
            nepData.contactNo ? nepData.contactNo.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'contactNoCT']).value : '';
            nepData.panNo ? nepData.panNo.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'panNoCT']).value : '';
            nepData.customerCode ? nepData.customerCode.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'customerCodeCT']).value : '';
            nepData.gender ? nepData.gender.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'genderCT']).value : '';
            nepData.fatherName ? nepData.fatherName.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameCT']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameCT']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'citizenNumberCT']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvinceCT']).value : '';
            nepData.permanentDistrict ? nepData.permanentDistrict.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrictCT']).value : '';
            nepData.permanentMunicipality ? nepData.permanentMunicipality.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipalityCT']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvinceCT']).value : '';
            nepData.temporaryDistrict ? nepData.temporaryDistrict.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrictCT']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipalityCT']).value : '';
            nepData.permanentWard ? nepData.permanentWard.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'permanentWardCT']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryWardCT']).value : '';
            nepData.citizenshipIssueDistrict ? nepData.citizenshipIssueDistrict.ct = this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrictCT']).value : '';

            // set joint customer nepData values based on index in jointCustomerDetails form
            this.userConfigForm.get(['jointCustomerDetails', index, 'nepData']).patchValue(JSON.stringify(nepData));
        });
    }

    async translateGuarantorData(index) {
        this.spinner = true;
        const alluarantors = this.userConfigForm.get('guarantorDetails').value as FormArray;
        if (alluarantors.length > 0) {
            let guarantorsDetails: any = [];
            guarantorsDetails = await this.translateService.translateForm(this.userConfigForm, 'guarantorDetails', index);
            console.log(guarantorsDetails);
            this.spinner = false;
            this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).patchValue(guarantorsDetails.guarantorName ? guarantorsDetails.guarantorName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).patchValue(guarantorsDetails.guarantorName ? guarantorsDetails.guarantorName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberTrans']).patchValue(guarantorsDetails.citizenNumber ? guarantorsDetails.citizenNumber : '');
            this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).patchValue(guarantorsDetails.citizenNumber ? guarantorsDetails.citizenNumber : '');
            this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value : '');
            this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value : '');
            this.userConfigForm.get(['guarantorDetails', index, 'genderTrans']).patchValue(guarantorsDetails.gender ? guarantorsDetails.gender : '');
            this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).patchValue(guarantorsDetails.gender ? guarantorsDetails.gender : '');
            this.userConfigForm.get(['guarantorDetails', index, 'husbandNameCT']).patchValue(guarantorsDetails.husbandName ? guarantorsDetails.husbandName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameCT']).patchValue(guarantorsDetails.fatherInLawName ? guarantorsDetails.fatherInLawName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).patchValue(guarantorsDetails.grandFatherName ? guarantorsDetails.grandFatherName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).patchValue(guarantorsDetails.fatherName ? guarantorsDetails.fatherName : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountCT']).patchValue(guarantorsDetails.gurantedAmount ? guarantorsDetails.gurantedAmount : '');

            this.userConfigForm.get(['guarantorDetails', index, 'husbandNameTrans']).patchValue(guarantorsDetails.husbandName ? guarantorsDetails.husbandName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameTrans']).patchValue(guarantorsDetails.fatherInLawName ? guarantorsDetails.fatherInLawName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).patchValue(guarantorsDetails.grandFatherName ? guarantorsDetails.grandFatherName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).patchValue(guarantorsDetails.fatherName ? guarantorsDetails.fatherName : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).patchValue(guarantorsDetails.gurantedAmount ? guarantorsDetails.gurantedAmount : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).patchValue(guarantorsDetails.permanentWard ? guarantorsDetails.permanentWard : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).patchValue(guarantorsDetails.permanentWard ? guarantorsDetails.permanentWard : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).patchValue(guarantorsDetails.temporaryWard ? guarantorsDetails.temporaryWard : '');
            // this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).patchValue(guarantorsDetails.temporaryWard ? guarantorsDetails.temporaryWard : '');
            this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).patchValue(this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value
                ? this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value : '');
            this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).patchValue(this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value
                ? this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleTrans']).patchValue(guarantorsDetails.permanentStreetTole ?
                guarantorsDetails.permanentStreetTole : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).patchValue(guarantorsDetails.permanentStreetTole ?
                guarantorsDetails.permanentStreetTole : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleTrans']).patchValue(guarantorsDetails.temporaryStreetTole ?
                guarantorsDetails.temporaryStreetTole : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).patchValue(guarantorsDetails.temporaryStreetTole ?
                guarantorsDetails.temporaryStreetTole : '');

            this.userConfigForm.get(['guarantorDetails', index]).patchValue({
                guarantorNationalityTrans: guarantorsDetails.guarantorNationality ?
                    guarantorsDetails.guarantorNationality : '',
                guarantorNationalityCT : guarantorsDetails.guarantorNationality ?
                    guarantorsDetails.guarantorNationality : '',

                // for indian guarantor
                // embassy details
                embassyNoTrans:  guarantorsDetails.embassyNo ?
                    guarantorsDetails.embassyNo : '',
                embassyNoCT: guarantorsDetails.embassyNo ?
                    guarantorsDetails.embassyNo : '',
                embassyIssuedDateTrans: guarantorsDetails.embassyIssuedDate ?
                    guarantorsDetails.embassyIssuedDate : '',
                embassyIssuedDateCT: guarantorsDetails.embassyIssuedDate ?
                    guarantorsDetails.embassyIssuedDate : '',
                embassyIssuedFromTrans: guarantorsDetails.embassyIssuedFrom ?
                    guarantorsDetails.embassyIssuedFrom : '',
                embassyIssuedFromCT: guarantorsDetails.embassyIssuedFrom ?
                    guarantorsDetails.embassyIssuedFrom : '',

                //passport detail
                passportNoTrans: guarantorsDetails.passportNo ?
                    guarantorsDetails.passportNo : '',
                passportNoCT:  guarantorsDetails.passportNo ?
                    guarantorsDetails.passportNo : '',
                passportIssuedDateTrans:  guarantorsDetails.passportIssuedDate ?
                    guarantorsDetails.passportIssuedDate : '',
                passportIssuedDateCT:  guarantorsDetails.passportIssuedDate ?
                    guarantorsDetails.passportIssuedDate : '',
                passportValidityDateTrans:  guarantorsDetails.passportValidityDate ?
                    guarantorsDetails.passportValidityDate : '',
                passportValidityDateCT: guarantorsDetails.passportValidityDate ?
                    guarantorsDetails.passportValidityDate : '',
                passportIssuedFromTrans: guarantorsDetails.passportIssuedFrom ?
                    guarantorsDetails.passportIssuedFrom : '',
                passportIssuedFromCT: guarantorsDetails.passportIssuedFrom ?
                    guarantorsDetails.passportIssuedFrom : '',

                //adhar card detail
                adharCardNoTrans: guarantorsDetails.adharCardNo ?
                    guarantorsDetails.adharCardNo : '',
                adharCardNoCT: guarantorsDetails.adharCardNo ?
                    guarantorsDetails.adharCardNo : '',
                adharCardIssuedDateTrans: guarantorsDetails.adharCardIssuedDate ?
                    guarantorsDetails.adharCardIssuedDate : '',
                adharCardIssuedDateCT: guarantorsDetails.adharCardIssuedDate ?
                    guarantorsDetails.adharCardIssuedDate : '',
                adharCardIssuedFromTrans: guarantorsDetails.adharCardIssuedFrom ?
                    guarantorsDetails.adharCardIssuedFrom : '',
                adharCardIssuedFromCT: guarantorsDetails.adharCardIssuedFrom ?
                    guarantorsDetails.adharCardIssuedFrom : '',

                indianGuarantorDetailOptionTrans: guarantorsDetails.indianGuarantorDetailOption ?
                    guarantorsDetails.indianGuarantorDetailOption : '',
                indianGuarantorDetailOptionCT: guarantorsDetails.indianGuarantorDetailOption ?
                    guarantorsDetails.indianGuarantorDetailOption : '',

                otherGuarantorPassportNoTrans: guarantorsDetails.otherGuarantorPassportNo ?
                    guarantorsDetails.otherGuarantorPassportNo : '',
                otherGuarantorPassportNoCT: guarantorsDetails.otherGuarantorPassportNo ?
                    guarantorsDetails.otherGuarantorPassportNo : '',
                otherGuarantorPassportIssuedDateTrans: guarantorsDetails.otherGuarantorPassportIssuedDate ?
                    guarantorsDetails.otherGuarantorPassportIssuedDate : '',
                otherGuarantorPassportIssuedDateCT: guarantorsDetails.otherGuarantorPassportIssuedDate ?
                    guarantorsDetails.otherGuarantorPassportIssuedDate : '',
                otherGuarantorPassportValidityDateTrans: guarantorsDetails.otherGuarantorPassportValidityDate ?
                    guarantorsDetails.otherGuarantorPassportValidityDate : '',
                otherGuarantorPassportValidityDateCT: guarantorsDetails.otherGuarantorPassportValidityDate ?
                    guarantorsDetails.otherGuarantorPassportValidityDate : '',
                otherGuarantorPassportIssuedFromTrans: guarantorsDetails.otherGuarantorPassportIssuedFrom ?
                    guarantorsDetails.otherGuarantorPassportIssuedFrom : '',
                otherGuarantorPassportIssuedFromCT: guarantorsDetails.otherGuarantorPassportIssuedFrom ?
                    guarantorsDetails.otherGuarantorPassportIssuedFrom : '',


                otherGuarantorPassportIssuedDateOptionTrans: guarantorsDetails.otherGuarantorPassportIssuedDateOption ?
                    guarantorsDetails.otherGuarantorPassportIssuedDateOption : '',
                otherGuarantorPassportIssuedDateOptionCT: guarantorsDetails.otherGuarantorPassportIssuedDateOption ?
                    guarantorsDetails.otherGuarantorPassportIssuedDateOption : '',
                otherGuarantorPassportValidityDateOptionCT: guarantorsDetails.otherGuarantorPassportValidityDateOption ?
                    guarantorsDetails.otherGuarantorPassportValidityDateOption : '',
                otherGuarantorPassportValidityDateOptionTrans: guarantorsDetails.otherGuarantorPassportValidityDateOption ?
                    guarantorsDetails.otherGuarantorPassportValidityDateOption : '',



                guarantorForeignAddressOptionTrans:guarantorsDetails.guarantorForeignAddressOption ?
                    guarantorsDetails.guarantorForeignAddressOption : '',
                guarantorForeignAddressOptionCT :guarantorsDetails.guarantorForeignAddressOption ?
                    guarantorsDetails.guarantorForeignAddressOption : '',

                guarantorOtherAddress: guarantorsDetails.guarantorOtherAddress ?
                    guarantorsDetails.guarantorOtherAddress : '',
                guarantorOtherAddressTrans:  guarantorsDetails.guarantorOtherAddress ?
                    guarantorsDetails.guarantorOtherAddress : '',
                guarantorOtherAddressCT:  guarantorsDetails.guarantorOtherAddress ?
                    guarantorsDetails.guarantorOtherAddress : '',

                //Guarantors flag


                // guarantorNationalityOptionTrans: guarantorsDetails.guarantorNationalityOption ?
                //     guarantorsDetails.guarantorNationalityOption : '',
                // guarantorNationalityOptionCT: guarantorsDetails.guarantorNationalityOption ?
                //     guarantorsDetails.guarantorNationalityOption : '',


            });


            this.addressFromGroup = this.formBuilder.group({
                permanentProvince: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value ? this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value.name : '',
                permanentDistrict: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value ? this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value.name : '',
                permanentMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value ? this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value.name : '',
                temporaryProvince: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value ? this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value.name : '',
                temporaryDistrict: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value ? this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value.name : '',
                temporaryMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value ? this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value.name : '',
            });

            // translate temp/permanent address and patch accordingly
            this.addressTranslatedValue = await this.translateService.translateForm(this.addressFromGroup);
            this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value.nepaliName : '');

            this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value.nepaliName : '');
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).patchValue(
                this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value.nepaliName : '');


            // translate guarantorsDetails
            const formArrayDataArrays: FormArray = this.userConfigForm.get(`guarantorDetails`) as FormArray;
            let a: any;
            a = formArrayDataArrays.controls;
            const newArr = {};
            // for (let i = 0; i < a.length; i++) {
            const individualData = a[index] as FormGroup;
            Object.keys(individualData.controls).forEach(key => {
                console.log(key);
                if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value
                    || key.indexOf('id') > -1 || key.indexOf('nepData') > -1) {
                    return;
                }

                // if(this.actionType === 'Edit'){
                //  if( key.indexOf('citizenIssuedDate') > -1
                //  || key.indexOf('guarantorPermanentMunicipalityOrVdc') > -1 || key.indexOf('guarantorTemporaryMunicipalityOrVdc') > -1
                //  || key.indexOf('radioCitizenIssuedDate') > -1){
                //    return;
                //   }
                // }

                this.attributes = new Attributes();
                this.attributes.en = individualData.get(key).value;
                this.attributes.np = guarantorsDetails[key];
                this.attributes.ct = individualData.get(key + 'CT').value;
                newArr[key] = this.attributes;
            });
            console.log(newArr, 'checkGua');
            this.translatedGuarantorDetails[index] = newArr;
            // this.deleteCTAndTransContorls(index);
            this.userConfigForm.get(['guarantorDetails', index, 'nepData']).setValue(JSON.stringify(newArr));
            console.log(this.userConfigForm.get(['guarantorDetails', index, 'nepData']).value ,'testValue');
            // end guarantorDetails
        }
    }

    // deleteCTAndTransContorls from form controls
    deleteJointCustomerCTAndTransControls(index) {
        const formArrayDataArrays: FormArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;
        let a: any;
        a = formArrayDataArrays.controls;
        const individualData = a[index] as FormGroup;
        Object.keys(individualData.controls).forEach(key => {
            if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || key.indexOf('MunicipalityOrVdc') > -1) {
                individualData.removeControl(key);
            }
        });
    }

    // deleteCTAndTransContorls from form controls
    deleteCTAndTransContorls(index) {
        const formArrayDataArrays: FormArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        let a: any;
        a = formArrayDataArrays.controls;
        const individualData = a[index] as FormGroup;
        Object.keys(individualData.controls).forEach(key => {
            if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1) {
                individualData.removeControl(key);
            }
        });
    }

    getCadApprovedData(data) {
        this.cadData = data.customerApprovedLoanCadDocumentation;
        this.activeCustomerTab = false;
        this.activeLoanTab = false;
        this.activeTemplateDataTab = true;
    }

    sameAsPermanent(event) {
        if (event.target.checked === true) {
            this.addressSameAsAbove = true;
            this.userConfigForm.patchValue({
                temporaryProvince: this.userConfigForm.get('permanentProvince').value,
                temporaryDistrict: this.userConfigForm.get('permanentDistrict').value,
                temporaryMunicipality: this.userConfigForm.get('permanentMunicipality').value,
                temporaryWard: this.userConfigForm.get('permanentWard').value,
                temporaryMunicipalityOrVdc: this.userConfigForm.get('municipalityOrVdc').value
            });
        } else {
            this.addressSameAsAbove = false;
            this.userConfigForm.patchValue({
                temporaryProvince: undefined,
                temporaryProvinceTrans: undefined,
                temporaryProvinceCT: undefined,
                temporaryDistrict: undefined,
                temporaryDistrictTrans: undefined,
                temporaryDistrictCT: undefined,
                temporaryMunicipality: undefined,
                temporaryMunicipalityTrans: undefined,
                temporaryMunicipalityCT: undefined,
                temporaryWard: undefined,
                temporaryWardTrans: undefined,
                temporaryWardCT: undefined,
                tempMunicipalitiesOrVdc: undefined,
                tempMunicipalitiesOrVdcTrans: undefined,
                tempMunicipalitiesOrVdcCT: undefined,
            });
        }
    }

    getDistrictsById(provinceId: number, event) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districts = response.detail;
                this.districts.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    // get permanent district/municipalities for joint customer
    getJointCustomerPermanentDistrictsById(provinceId: number, event, index) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.jointCustomerPermanentDistrictList[index] = response.detail;
                this.jointCustomerPermanentDistrictList[index].sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrict']).patchValue(null);
                }
            }
        );
    }

    // get temporary district/municipalities for joint customer
    getJointCustomerTemporaryDistrictsById(provinceId: number, event, index) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.jointCustomerTemporaryDistrictList[index] = response.detail;
                this.jointCustomerTemporaryDistrictList[index].sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrict']).patchValue(null);
                }
            }
        );
    }

// for permanent
    getJointCustomerPermanentMunicipalitiesById(districtId: number, event, index) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.jointCustomerPermanentMunicipalities[index] = response.detail;
                this.jointCustomerPermanentMunicipalities[index].sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipality']).patchValue(null);
                }
            }
        );
    }

    // for temporary
    getJointCustomerTemporaryMunicipalitiesById(districtId: number, event, index) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.jointCustomerTemporaryMunicipalities[index] = response.detail;
                this.jointCustomerTemporaryMunicipalities[index].sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipality']).patchValue(null);
                }
            }
        );
    }

    setJointCustomerAddressSameAsPermanent(event, i, val) {
        if (event.target.checked === true) {
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryProvince']).patchValue(this.userConfigForm.get(['jointCustomerDetails', i, 'permanentProvince']).value);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryDistrict']).patchValue(this.userConfigForm.get(['jointCustomerDetails', i, 'permanentDistrict']).value);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryMunicipality']).patchValue(this.userConfigForm.get(['jointCustomerDetails', i, 'permanentMunicipality']).value);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryWard']).patchValue(this.userConfigForm.get(['jointCustomerDetails', i, 'permanentWard']).value);
        } else {
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryProvince']).patchValue(null);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryDistrict']).patchValue(null);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryMunicipality']).patchValue(null);
            this.userConfigForm.get(['jointCustomerDetails', i, 'temporaryWard']).patchValue(null);
        }
    }

    // get district/municipalities for guarantors
    getGuarantorDistrictsById(provinceId: number, event?, index?) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.guarantorDistrict[index] = response.detail;
                this.guarantorDistrict[index].sort((a, b) => a.name.localeCompare(b.name));
                // if (event !== null) {
                //   this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).patchValue(null);
                // }
            }
        );
    }

    getGuarantorMunicipalitiesById(districtId: number, event, index) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.guarantorMunicipalities[index] = response.detail;
                this.guarantorMunicipalities[index].sort((a, b) => a.name.localeCompare(b.name));
                // if (event !== null) {
                //   this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).patchValue(null);
                // }
            }
        );
    }

    // get district/municipalities for guarantors
    getGuarantorTempDistrictsById(provinceId: number, event, index) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.tempGuarantorDistricts[index] = response.detail;
                this.tempGuarantorDistricts[index].sort((a, b) => a.name.localeCompare(b.name));
                // if (event !== null) {
                //   this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).patchValue(null);
                // }
            }
        );
    }

    getGuarantorTempMunicipalitiesById(districtId: number, event, index) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.tempGuarantorMunicipalities[index] = response.detail;
                this.tempGuarantorMunicipalities[index].sort((a, b) => a.name.localeCompare(b.name));
                // if (event !== null) {
                //   this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).patchValue(null);
                // }
            }
        );
    }

    setGuarantorAddressSameAsPermanent(event, i) {
        if (event.target.checked === true) {
            this.getGuarantorTempDistrictsById(ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).value) ? null :
                this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).value.id, null, i);
            this.getGuarantorTempMunicipalitiesById(ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).value) ?
                null : this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).value.id, null, i);

            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipality']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdc']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipalityOrVdc']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentWard']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardCT']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentWardCT']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetTole']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetTole']).value);

        } else {
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdc']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardCT']).patchValue(null);

            // Clear Trans Value:
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdcTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardTrans']).patchValue(null);

            // Clear CT Value:
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdcCT']).patchValue(null);
        }
    }

    getAllEditedDistrictAndMunicipalities() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            if (this.oneFormCustomer.province !== null) {
                const province = new Province();
                province.id = this.oneFormCustomer.province.id;
                this.addressService.getDistrictByProvince(province).subscribe(
                    (response: any) => {
                        this.districts = response.detail;
                        this.districts.sort((a, b) => a.name.localeCompare(b.name));
                    }
                );
            }

            if (this.oneFormCustomer.district !== null) {
                const district = new District();
                district.id = this.oneFormCustomer.district.id;
                this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                    (response: any) => {
                        this.municipalities = response.detail;
                        this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
                        // if (event !== null) {
                        //   this.userConfigForm.get('permanentMunicipality').patchValue(null);
                        // }
                    }
                );
            }

            if (this.oneFormCustomer.temporaryProvince !== null) {
                const province = new Province();
                province.id = this.oneFormCustomer.temporaryProvince.id;
                this.addressService.getDistrictByProvince(province).subscribe(
                    (response: any) => {
                        this.tempDistricts = response.detail;
                        this.tempDistricts.sort((a, b) => a.name.localeCompare(b.name));
                    }
                );
            }

            if (this.oneFormCustomer.temporaryDistrict !== null) {
                const district = new District();
                district.id = this.oneFormCustomer.temporaryDistrict.id;
                this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                    (response: any) => {
                        this.tempMunicipalities = response.detail;
                        this.tempMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
                        // if (event !== null) {
                        //   this.userConfigForm.get('temporaryMunicipality').patchValue(null);
                        // }
                    }
                );
            }
        }
    }

    getTempDistrictsById(provinceId: number, event) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.tempDistricts = response.detail;
                this.tempDistricts.sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getMunicipalitiesById(districtId: number, event) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalities = response.detail;
                this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get('permanentMunicipality').patchValue(null);
                }
            }
        );
    }

    getTempMunicipalitiesById(districtId: number, event) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.tempMunicipalities = response.detail;
                this.tempMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
                if (event !== null) {
                    this.userConfigForm.get('temporaryMunicipality').patchValue(null);
                }
            }
        );
    }

    translateObjectValue() {
        this.objectTranslateForm = this.formBuilder.group({
            branch: [undefined],
            branchCT: [undefined],
            cspermanentProvince: [undefined],
            permanentProvinceCT: [undefined],
            cspermanentDistrict: [undefined],
            permanentDistrictCT: [undefined],
            cspermanentMunicipality: [undefined],
            permanentMunicipalityCT: [undefined],
            cstemporaryProvince: [undefined],
            temporaryProvinceCT: [undefined],
            cstemporaryDistrict: [undefined],
            temporaryDistrictCT: [undefined],
            cstemporaryMunicipality: [undefined],
            temporaryMunicipalityCT: [undefined],
            citizenshipIssueDistrict: [undefined],
            citizenshipIssueDistrictCT: [undefined],
            registeredProvince: [undefined],
            registeredDistrict: [undefined],
            registeredMunicipality: [undefined],
            currentProvince: [undefined],
            currentDistrict: [undefined],
            currentMunicipality: [undefined]

        });
    }

    selectDateType(event) {
        if (event === 'BS') {
            this.dateTypeBS = true;
            this.dateTypeAD = false;
        }
        if (event === 'AD') {
            this.dateTypeBS = false;
            this.dateTypeAD = true;
        }
    }

    checkboxVal(event, formControlName) {
        const checkVal = event.target.checked;
        this[formControlName + 'Check'] = checkVal;
        if (!checkVal) {
            this.clearForm(formControlName + 'CT');
        }
    }

    clearForm(controlName) {
        this.userConfigForm.get(controlName).setValue(null);
    }

    patchValue(): void {

        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            this.userConfigForm.get('issuedDate').patchValue(JSON.parse(this.loanHolder.nepData).issuedDate.en);
            this.userConfigForm.get('citizenshipIssueDate').patchValue(JSON.parse(this.loanHolder.nepData).citizenshipIssueDate.en);
            this.userConfigForm.get('dobDateType').patchValue(JSON.parse(this.loanHolder.nepData).dobDateType.en);
            this.userConfigForm.get('issuedDate').patchValue(JSON.parse(this.loanHolder.nepData).issuedDate.en);
            this.userConfigForm.get('permanentMunType').patchValue(ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).permanentMunType)
                ? undefined : JSON.parse(this.loanHolder.nepData).permanentMunType.en);
            this.addressSameAsAbove = JSON.parse(this.oneFormCustomer.individualJsonData).sameAddress;
            this.userConfigForm.get('dob').patchValue(JSON.parse(this.loanHolder.nepData).dob.en);
            this.userConfigForm.get('citizenshipIssueDate').patchValue(JSON.parse(this.loanHolder.nepData).citizenshipIssueDate.en);
            this.userConfigForm.get('relationMedium').patchValue(Number(JSON.parse(this.oneFormCustomer.individualJsonData).relationMedium));
            this.userConfigForm.get('municipalityOrVdc').patchValue(JSON.parse(this.oneFormCustomer.individualJsonData).municipalityOrVdc);
            this.userConfigForm.get('temporaryMunicipalityOrVdc').patchValue(JSON.parse(this.oneFormCustomer.individualJsonData).temporaryMunicipalityOrVdc);
        }


        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer)) {
            if (this.loanHolder.customerType === CustomerType.INSTITUTION) {
                this.getDistrictsById(JSON.parse(this.loanHolder.nepData).registeredProvince.en.id, null);
                this.getMunicipalitiesById(JSON.parse(this.loanHolder.nepData).registeredDistrict.en.id, null);
                this.getTempDistrictsById(JSON.parse(this.loanHolder.nepData).currentProvince.en.id, null);
                this.getTempMunicipalitiesById(JSON.parse(this.loanHolder.nepData).currentDistrict.en.id, null);
            }
            this.userConfigForm.patchValue({
                branch: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ? this.loanHolder.branch :
                    this.loanHolder.branch,
                gender: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.gender,
                customerCode: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.customerCode,
                name: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ?
                    this.oneFormCustomer.customerName : this.oneFormCustomer.companyName,
                email: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.email,
                contactNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ?
                    this.oneFormCustomer.contactNumber : this.oneFormCustomer.contactNum,
                panNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.panNumber,
                citizenshipNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.citizenshipNumber,
                permanentProvince: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.province,
                permanentDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.district,
                permanentMunicipality: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.municipalities,
                temporaryProvince: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryProvince,
                temporaryDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryDistrict,
                temporaryMunicipality: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryMunicipalities,
                permanentWard: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ?
                    this.oneFormCustomer.wardNumber : JSON.parse(this.loanHolder.nepData).permanentWard.en,
                temporaryWard: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryWardNumber,
                citizenshipIssueDistrict: ObjectUtil.isEmpty(this.nepData) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ?
                    this.nepData.citizenshipIssueDistrict.ct : undefined,
                registrationNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    this.oneFormCustomer.registrationNumber : undefined,
                registeredMunType: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunType) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunType.en : undefined,
                registeredProvince: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredProvince) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredProvince.en : undefined,
                registeredProvinceCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredProvince) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredProvince.en.nepaliName : undefined,
                registeredDistrict: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en : undefined,
                registeredDistrictCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en.nepaliName : undefined,
                registeredDistrictTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en.nepaliName : undefined,
                registeredMunicipality: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en : undefined,
                registeredMunicipalityCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en.nepaliName : undefined,
                registeredMunicipalityTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en.nepaliName : undefined,
                currentMunType: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunType) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunType.en : undefined,
                currentProvince: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en : undefined,
                currentProvinceTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en.nepaliName : undefined,
                currentProvinceCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en.nepaliName : undefined,
                currentDistrict: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en : undefined,
                currentDistrictTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en.nepaliName : undefined,
                currentDistrictCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en.nepaliName : undefined,
                currentMunicipality: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en : undefined,
                currentMunicipalityCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en.nepaliName : undefined,
                currentMunicipalityTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en.nepaliName : undefined,
                currentWard: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentWard.en : undefined,
                currentWardTrans: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentWard.np : undefined,
                currentWardCT: ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentWard.np : undefined,
            });

            if (this.addressSameAsAbove) {
                this.userConfigForm.patchValue({
                    temporaryProvince: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.province,
                    temporaryDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.district,
                    temporaryMunicipality: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.municipalities,
                    temporaryMunicipalityOrVdc: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined :
                        JSON.parse(this.oneFormCustomer.individualJsonData).municipalityOrVdc
                });
            }

            console.log(this.userConfigForm.value);

        }
    }

    patchNepData() {

        // "radioActYearDate": {
        //     "en": "BS"
        // },
        // "actYear": {
        //     "en": {
        //         "eDate": "2019-04-22T19:00:00.000Z",
        //             "nDate": "बैशाख १0, २0७६"
        //     }
        // },

        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer)) {
            const nepData = (JSON.parse(this.loanHolder.nepData));
            // if (this.customerType === CustomerType.INSTITUTION && !ObjectUtil.isEmpty(nepData.radioActYearDate) && this.actionType === 'Edit') {
            //     if (nepData.radioActYearDate.en === 'AD') {
            //         this.institutionalActYear = nepData.actYear.en;
            //     } else if (nepData.radioActYearDate.en === 'BS') {
            //         this.institutionalActYear = nepData.actYear.en;
            //     } else {
            //         this.institutionalActYear = undefined;
            //     }
            // }
            let registrationDate: any;
            if (this.customerType === CustomerType.INSTITUTION) {
                if (this.nepData.registrationDateOption.en === 'BS') {
                    registrationDate = this.nepData.registrationDate.en;
                } else {
                    registrationDate = this.oneFormCustomer.establishmentDate;
                }
            }
            console.log(this.institutionalActYear);
            this.userConfigForm.patchValue({
                panNo: ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.en,
                branchCT: ObjectUtil.isEmpty(nepData.branch) ? undefined : nepData.branch.ct,
                customerCodeCT: ObjectUtil.isEmpty(nepData.customerCode) ? undefined : nepData.customerCode.ct,
                nameCT: ObjectUtil.isEmpty(nepData.name) ? undefined : nepData.name.np,
                emailCT: ObjectUtil.isEmpty(nepData.email) ? undefined : nepData.email.np,
                contactNoCT: ObjectUtil.isEmpty(nepData.contactNo) ? undefined : nepData.contactNo.ct,
                panNoCT: ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.ct,
                actName: ObjectUtil.isEmpty(nepData.actName) ? undefined : nepData.actName.en,
                actNameCT : ObjectUtil.isEmpty(nepData.actName) ? undefined : nepData.actName.ct,
                actNameTrans : ObjectUtil.isEmpty(nepData.actName) ? undefined : nepData.actName.np,
                authorizedBodyName: ObjectUtil.isEmpty(nepData.authorizedBodyName) ? undefined : nepData.authorizedBodyName.en,
                authorizedBodyNameCT: ObjectUtil.isEmpty(nepData.authorizedBodyName) ? undefined : nepData.authorizedBodyName.ct,
                authorizedBodyNameTrans: ObjectUtil.isEmpty(nepData.authorizedBodyName) ? undefined : nepData.authorizedBodyName.np,
                issuingDistrict: ObjectUtil.isEmpty(nepData.issuingDistrict) ? undefined : nepData.issuingDistrict.en,
                issuingDistrictCT: ObjectUtil.isEmpty(nepData.issuingDistrict) ? undefined : nepData.issuingDistrict.ct,
                issuingDistrictTrans: ObjectUtil.isEmpty(nepData.issuingDistrict) ? undefined : nepData.issuingDistrict.ct,
                registeredWith: ObjectUtil.isEmpty(nepData.registeredWith) ? undefined : nepData.registeredWith.en,
                registeredWithCT: ObjectUtil.isEmpty(nepData.registeredWith) ? undefined : nepData.registeredWith.ct,
                registeredWithTrans: ObjectUtil.isEmpty(nepData.registeredWith) ? undefined : nepData.registeredWith.np,
                registeredStreetTole: ObjectUtil.isEmpty(nepData.registeredStreetTole) ? undefined : nepData.registeredStreetTole.en,
                registeredStreetToleTrans: ObjectUtil.isEmpty(nepData.registeredStreetTole) ? undefined : nepData.registeredStreetTole.np,
                registeredStreetToleCT: ObjectUtil.isEmpty(nepData.registeredStreetTole) ? undefined : nepData.registeredStreetTole.ct,
                currentStreetTole: ObjectUtil.isEmpty(nepData.currentStreetTole) ? undefined : nepData.currentStreetTole.en,
                currentStreetToleTrans: ObjectUtil.isEmpty(nepData.currentStreetTole) ? undefined : nepData.currentStreetTole.np,
                currentStreetToleCT: ObjectUtil.isEmpty(nepData.currentStreetTole) ? undefined : nepData.currentStreetTole.ct,
                radioActYearDate: 'AD',
                actYear: ObjectUtil.isEmpty(nepData.actYear) ? undefined : nepData.actYear.en.eDate ? nepData.actYear.en.eDate : nepData.actYear.en,
                citizenshipNoCT: ObjectUtil.isEmpty(nepData.citizenshipNumber) ? undefined : nepData.citizenshipNumber.np,
                genderCT: ObjectUtil.isEmpty(nepData.gender) ? undefined : nepData.gender.np,
                permanentProvinceCT: ObjectUtil.isEmpty(nepData.permanentProvince) ? undefined : nepData.permanentProvince.np,
                permanentDistrictCT: ObjectUtil.isEmpty(nepData.permanentDistrict) ? undefined : nepData.permanentDistrict.np,
                registrationDateOption: ObjectUtil.isEmpty(nepData.registrationDateOption) ? undefined : 'AD',
                registrationDate: ObjectUtil.isEmpty(nepData.registrationDate) ? undefined : nepData.registrationDate.en.eDate ?
                    nepData.registrationDate.en.eDate : nepData.registrationDate.en,
                registrationDateTrans:  ObjectUtil.isEmpty(this.userConfigForm.get('registrationDate').value) ? undefined : this.userConfigForm.get('registrationDate').value,
                registrationDateCT:  ObjectUtil.isEmpty(this.userConfigForm.get('registrationDate').value) ? undefined : this.userConfigForm.get('registrationDate').value,
                // permanentMunicipality: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,
                temporaryProvinceCT: ObjectUtil.isEmpty(nepData.temporaryProvince) ? undefined : nepData.temporaryProvince.np,
                temporaryDistrictCT: ObjectUtil.isEmpty(nepData.temporaryDistrict) ? undefined : nepData.temporaryDistrict.np,
                temporaryMunicipalityCT: ObjectUtil.isEmpty(nepData.temporaryMunicipality) ? undefined : nepData.temporaryMunicipality.ct,
                permanentMunicipalityCT: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.ct,
                permanentWardCT: ObjectUtil.isEmpty(nepData.permanentWard) ? undefined : nepData.permanentWard.np,
                temporaryWardCT: ObjectUtil.isEmpty(nepData.temporaryWard) ? undefined : nepData.temporaryWard.np,
                citizenshipIssueDateCT: ObjectUtil.isEmpty(nepData.citizenshipIssueDate) ? undefined : nepData.citizenshipIssueDate.np,
                // dobCT: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,
                // citizenshipIssueDistrictCT: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,
                registrationNoCT: ObjectUtil.isEmpty(nepData.registrationNo) ? undefined :
                    this.loanHolder.customerType === CustomerType.INSTITUTION ?
                        nepData.registrationNo.ct : undefined
            });
        }
    }

    patchIndividualData() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            const memberData = JSON.parse(this.oneFormCustomer.individualJsonData);
            this.userConfigForm.patchValue({
                fatherName: ObjectUtil.isEmpty(memberData.fatherName) ? undefined : memberData.fatherName,
                grandFatherName: ObjectUtil.isEmpty(memberData.grandFatherName) ? undefined : memberData.grandFatherName,
                husbandName: ObjectUtil.isEmpty(memberData.husbandName) ? undefined : memberData.husbandName,
                fatherInLawName: ObjectUtil.isEmpty(memberData.fatherInLawName) ? undefined : memberData.fatherInLawName,
            });
        }
    }

    loanDetailsSuccess() {
        this.activeCustomerTab = false;
        this.activeLoanTab = true;
        this.activeTemplateDataTab = false;
    }

    patchCorrectData() {
        this.userConfigForm.patchValue({
            nameCT: this.translatedValues.name,
            emailCT: this.translatedValues.email,
            // contactNoCT: this.translatedValues.contactNo,
            // panNoCT: this.translatedValues.panNo,
            genderCT: this.translatedValues.gender,
            fatherNameCT: this.translatedValues.fatherName,
            grandFatherNameCT: this.translatedValues.grandFatherName,
            husbandNameCT: this.translatedValues.husbandName,
            fatherInLawNameCT: this.translatedValues.fatherInLawName,
            citizenshipNoCT: this.translatedValues.citizenshipNo,


        });
    }

    async editedTranslateValues() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            this.editedTranslatedValueForm = this.formBuilder.group({
                branch: [undefined],
                name: [undefined],
                contactNo: [undefined],
                gender: [undefined],
                relationMedium: [undefined],
                husbandName: [undefined],
                fatherInLawName: [undefined],
                grandFatherName: [undefined],
                fatherName: [undefined],
                citizenshipNo: [undefined],
                citizenshipIssueDistrict: [undefined],
                panNo: [undefined],
                permanentProvince: [undefined],
                permanentDistrict: [undefined],
                permanentMunicipality: [undefined],
                permanentWard: [undefined],
                temporaryProvince: [undefined],
                temporaryDistrict: [undefined],
                temporaryMunicipality: [undefined],
                temporaryWard: [undefined]
            });

            this.editedTranslatedValueForm.patchValue({
                branch: this.nepData.branch.np,
                name: ObjectUtil.setUndefinedIfNull(this.nepData.name.np),
                // contactNo: ObjectUtil.setUndefinedIfNull(this.nepData.contactNo.np),
                gender: ObjectUtil.setUndefinedIfNull(this.nepData.gender.np),
                relationMedium: ObjectUtil.isEmpty(this.nepData.relationMedium) ? undefined : this.nepData.relationMedium.np,
                husbandName: ObjectUtil.isEmpty(this.nepData.husbandName) ? undefined : this.nepData.husbandName.np,
                fatherInLawName: ObjectUtil.isEmpty(this.nepData.fatherInLawName) ? undefined : this.nepData.fatherInLawName.np,
                grandFatherName: ObjectUtil.isEmpty(this.nepData.grandFatherName) ? undefined : this.nepData.grandFatherName.np,
                fatherName: ObjectUtil.setUndefinedIfNull(this.nepData.fatherName.np),
                citizenshipNo: ObjectUtil.setUndefinedIfNull(this.nepData.citizenshipNo.np),
                citizenshipIssueDistrict: ObjectUtil.setUndefinedIfNull(this.nepData.citizenshipIssueDistrict.np),
                // panNo: ObjectUtil.setUndefinedIfNull(this.nepData.panNo.np),
                permanentProvince: ObjectUtil.setUndefinedIfNull(this.nepData.permanentProvince.np),
                permanentDistrict: ObjectUtil.setUndefinedIfNull(this.nepData.permanentDistrict.np),
                permanentMunicipality: ObjectUtil.setUndefinedIfNull(this.nepData.permanentMunicipality.np),
                permanentWard: ObjectUtil.setUndefinedIfNull(this.nepData.permanentWard.np),
                temporaryProvince: ObjectUtil.setUndefinedIfNull(this.nepData.temporaryProvince.np),
                temporaryDistrict: ObjectUtil.setUndefinedIfNull(this.nepData.temporaryDistrict.np),
                temporaryMunicipality: ObjectUtil.setUndefinedIfNull(this.nepData.temporaryMunicipality.np),
                temporaryWard: ObjectUtil.setUndefinedIfNull(this.nepData.temporaryWard.np),
            });

            this.objectValueTranslater = await this.translateService.translateForm(this.editedTranslatedValueForm);
            this.translatedValues = await this.translateService.translateForm(this.editedTranslatedValueForm);
        }

    }

    setInstitutionCTValue(): void {
        this.userConfigForm.patchValue({
            currentProvinceCT: this.userConfigForm.get('currentProvince').value.nepaliName,
            currentDistrictCT: this.userConfigForm.get('currentDistrict').value.nepaliName,
            currentMunicipalityCT: this.userConfigForm.get('currentMunicipality').value.nepaliName,
            registeredProvinceCT: this.userConfigForm.get('registeredProvince').value.nepaliName,
            registeredDistrictCT: this.userConfigForm.get('registeredDistrict').value.nepaliName,
            registeredMunicipalityCT: this.userConfigForm.get('registeredMunicipality').value.nepaliName,
        });
    }

    addGuarantors(): void {
        const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
        const guarantor = new OneFormGuarantors();
        guarantor.issuedPlace = formArray.get('issuedPlace').value;
        guarantor.guarantorName = formArray.get('guarantorName').value;
        this.oneFormGuarantorsList.push(guarantor);
    }

    translateNumber(source) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.userConfigForm.get(source).value.toString());
        this.userConfigForm.get(source + 'Trans').patchValue(wordLabelVar);
        this.userConfigForm.get(source + 'CT').patchValue(wordLabelVar);
    }

    async autoTrans(fieldName: any, index) {
        const allOwnerData = this.userConfigForm.get('ownerDetails') as FormArray;
        if (allOwnerData.length > 0) {
            let ownerTranslatedData: any = [];
            ownerTranslatedData = await this.translateService.translateForm(this.userConfigForm, 'ownerDetails', index);
            console.log(ownerTranslatedData[fieldName]);
            this.userConfigForm.get(['ownerDetails', index, fieldName + 'Trans']).patchValue(ownerTranslatedData[fieldName] ? ownerTranslatedData[fieldName] : '');
            this.userConfigForm.get(['ownerDetails', index, fieldName + 'CT']).patchValue(ownerTranslatedData[fieldName] ? ownerTranslatedData[fieldName] : '');
        }

    }

    translateJointCustomerSectionNumberField(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(String(this.userConfigForm.get([String(arrName), index, String(source)]).value));
        this.userConfigForm.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.userConfigForm.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
    }

    translateNumberInFA(source, i) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(this.userConfigForm.get(['guarantorDetails', i, source]).value.toString()));
        this.userConfigForm.get(['guarantorDetails', i, source + 'Trans']).patchValue(wordLabelVar);
        this.userConfigForm.get(['guarantorDetails', i, source + 'CT']).patchValue(wordLabelVar);
    }

    setNepaliData() {
        this.userConfigForm.patchValue({
            branchCT: ObjectUtil.isEmpty(this.userConfigForm.get('branch').value) ? undefined : this.userConfigForm.get('branch').value.nepaliName,
            branchTrans: ObjectUtil.isEmpty(this.userConfigForm.get('branch').value) ? undefined : this.userConfigForm.get('branch').value.nepaliName,
            permanentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvince').value) ? undefined : this.userConfigForm.get('permanentProvince').value.nepaliName,
            permanentProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvince').value) ? undefined : this.userConfigForm.get('permanentProvince').value.nepaliName,

            permanentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrict').value) ?
                undefined : this.userConfigForm.get('permanentDistrict').value.nepaliName,
            permanentDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrict').value) ?
                undefined : this.userConfigForm.get('permanentDistrict').value.nepaliName,
            permanentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ?
                undefined : this.userConfigForm.get('permanentMunicipality').value.nepaliName,
            permanentMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ?
                undefined : this.userConfigForm.get('permanentMunicipality').value.nepaliName,
            temporaryProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ?
                undefined : this.userConfigForm.get('temporaryProvince').value.nepaliName,
            temporaryProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ?
                undefined : this.userConfigForm.get('temporaryProvince').value.nepaliName,
            temporaryDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ?
                undefined : this.userConfigForm.get('temporaryDistrict').value.nepaliName,
            temporaryDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ?
                undefined : this.userConfigForm.get('temporaryDistrict').value.nepaliName,
            temporaryMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ?
                undefined : this.userConfigForm.get('temporaryMunicipality').value.nepaliName,
            temporaryMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ?
                undefined : this.userConfigForm.get('temporaryMunicipality').value.nepaliName,
            citizenshipIssueDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ?
                undefined : this.userConfigForm.get('citizenshipIssueDistrict').value,
            citizenshipIssueDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ?
                undefined : this.userConfigForm.get('citizenshipIssueDistrict').value
        });
    }

    checkEditedValidationForIndividualJsonData() {
        if (this.actionType === 'Edit') {
            if (this.userConfigForm.get('fatherNameCT').value === null) {
                this.userConfigForm.get('fatherNameCT').patchValue(ObjectUtil.isEmpty(this.nepData.fatherName) ? undefined : this.nepData.fatherName.ct);
            }

            if (this.userConfigForm.get('husbandNameCT').value === null) {
                this.userConfigForm.get('husbandNameCT').patchValue(ObjectUtil.isEmpty(this.nepData.husbandName) ? undefined : this.nepData.husbandName.ct);
            }
            if (this.userConfigForm.get('fatherInLawNameCT').value === null) {
                this.userConfigForm.get('fatherInLawNameCT').patchValue(ObjectUtil.isEmpty(this.nepData.fatherInLawName) ? undefined : this.nepData.fatherInLawName.ct);
            }
            if (this.userConfigForm.get('grandFatherNameCT').value === null) {
                this.userConfigForm.get('grandFatherNameCT').patchValue(ObjectUtil.isEmpty(this.nepData.grandFatherName) ? undefined : this.nepData.grandFatherName.ct);
            }
        }
    }

    private setCustomerTransData(): void {
        this.userConfigForm.get('clientTypeTrans').patchValue(this.translatedValues.clientType);
        this.userConfigForm.get('nameTrans').patchValue(this.translatedValues.name);
        this.userConfigForm.get('emailTrans').patchValue(this.translatedValues.email);
        // this.userConfigForm.get('contactNoTrans').patchValue(this.translatedValues.contactNo);
        // this.userConfigForm.get('panNoTrans').patchValue(this.translatedValues.panNo);
        this.userConfigForm.get('registrationNoTrans').patchValue(ObjectUtil.isEmpty(this.translatedValues.registrationNo) ? undefined :
            this.translatedValues.registrationNo);
        this.userConfigForm.get('registrationDateTrans').patchValue(ObjectUtil.isEmpty(this.translatedValues.registrationDate) ? undefined :
            this.translatedValues.registrationDate);
        this.userConfigForm.get('registeredMunicipalityTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('registeredMunicipality').value) ? undefined :
            this.userConfigForm.get('registeredMunicipality').value.nepaliName);
        this.userConfigForm.get('registeredMunTypeTrans').patchValue(ObjectUtil.isEmpty(this.translatedValues.registeredMunType) ? undefined :
            this.translatedValues.registeredMunType);
        this.userConfigForm.get('registeredDistrictTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('registeredDistrict').value) ? undefined :
            this.userConfigForm.get('registeredDistrict').value.nepaliName);
        this.userConfigForm.get('registeredProvinceTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('registeredProvince').value) ? undefined :
            this.userConfigForm.get('registeredProvince').value.nepaliName);
        this.userConfigForm.get('currentMunTypeTrans').patchValue(ObjectUtil.isEmpty(this.translatedValues.currentMunType) ? undefined :
            this.translatedValues.currentMunType);
        this.userConfigForm.get('currentProvinceTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('currentProvince').value) ? undefined :
            this.userConfigForm.get('currentProvince').value.nepaliName);
        this.userConfigForm.get('currentWardTrans').patchValue(ObjectUtil.isEmpty(this.translatedValues.currentWard) ? undefined :
            this.translatedValues.currentWard);
        this.userConfigForm.get('currentDistrictTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('currentDistrict').value) ? undefined :
            this.userConfigForm.get('currentDistrict').value.nepaliName);
        this.userConfigForm.get('currentMunicipalityTrans').patchValue(ObjectUtil.isEmpty(this.userConfigForm.get('currentMunicipality').value) ? undefined :
            this.userConfigForm.get('currentMunicipality').value.nepaliName);
        this.userConfigForm.get('customerCodeTrans').patchValue(this.translatedValues.customerCode);
        this.userConfigForm.get('genderTrans').patchValue(this.translatedValues.gender);
        this.userConfigForm.get('fatherNameTrans').patchValue(this.translatedValues.fatherName);
        this.userConfigForm.get('grandFatherNameTrans').patchValue(this.translatedValues.grandFatherName);
        this.userConfigForm.get('relationMediumTrans').patchValue(this.translatedValues.relationMedium);
        this.userConfigForm.get('husbandNameTrans').patchValue(this.translatedValues.husbandName);
        this.userConfigForm.get('fatherInLawNameTrans').patchValue(this.translatedValues.fatherInLawName);
        this.userConfigForm.get('citizenshipNoTrans').patchValue(this.translatedValues.citizenshipNo);
        this.userConfigForm.get('dobTrans').patchValue(this.translatedValues.dob);
        this.userConfigForm.get('permanentProvinceTrans').patchValue(this.translatedValues.permanentProvince);
        this.userConfigForm.get('permanentDistrictTrans').patchValue(this.translatedValues.permanentDistrict);
        this.userConfigForm.get('permanentMunicipalityTrans').patchValue(this.translatedValues.permanentMunicipality);
        this.userConfigForm.get('permanentMunTypeTrans').patchValue(this.translatedValues.permanentMunType);
        this.userConfigForm.get('temporaryProvinceTrans').patchValue(this.translatedValues.temporaryProvince);
        this.userConfigForm.get('temporaryDistrictTrans').patchValue(this.translatedValues.temporaryDistrict);
        this.userConfigForm.get('temporaryMunicipalityTrans').patchValue(this.translatedValues.temporaryMunicipality);
        // this.userConfigForm.get('permanentWardTrans').patchValue(this.translatedValues.permanentWard);
        // this.userConfigForm.get('temporaryWardTrans').patchValue(this.translatedValues.temporaryWard);
        this.userConfigForm.get('temporaryMunTypeTrans').patchValue(this.translatedValues.temporaryMunType);
        this.userConfigForm.get('citizenshipIssueDistrictTrans').patchValue(this.translatedValues.citizenshipIssueDistrict);
        this.userConfigForm.get('citizenshipIssueDateTrans').patchValue(this.translatedValues.citizenshipIssueDate);
        this.userConfigForm.get('municipalityOrVdcTrans').patchValue(this.translatedValues.municipalityOrVdc);
        this.userConfigForm.get('temporaryMunicipalityOrVdcTrans').patchValue(this.translatedValues.temporaryMunicipalityOrVdc);
        this.userConfigForm.get('dobDateTypeTrans').patchValue(this.translatedValues.dobDateType);
        this.userConfigForm.get('issuedDateTrans').patchValue(this.translatedValues.issuedDate);
    }

    private setCustomerCTData(): void {
        this.userConfigForm.get('customerCodeCT').patchValue(this.translatedValues.customerCode);
        this.userConfigForm.get('nameCT').patchValue(this.translatedValues.name);
        // this.userConfigForm.get('contactNoCT').patchValue(this.translatedValues.contactNo);
        this.userConfigForm.get('genderCT').patchValue(this.translatedValues.gender);
        this.userConfigForm.get('relationMediumCT').patchValue(this.translatedValues.relationMedium);
        this.userConfigForm.get('husbandNameCT').patchValue(this.translatedValues.husbandName);
        this.userConfigForm.get('fatherInLawNameCT').patchValue(this.translatedValues.fatherInLawName);
        this.userConfigForm.get('grandFatherNameCT').patchValue(this.translatedValues.grandFatherName);
        this.userConfigForm.get('fatherNameCT').patchValue(this.translatedValues.fatherName);
        this.userConfigForm.get('citizenshipNoCT').patchValue(this.translatedValues.citizenshipNo);
        // this.userConfigForm.get('citizenshipIssueDistrictCT').patchValue(this.objectValueTranslater.citizenshipIssueDistrict);
        // this.userConfigForm.get('panNoCT').patchValue(this.translatedValues.panNo);
        //  this.userConfigForm.get('permanentWardCT').patchValue(this.translatedValues.permanentWard);
        // this.userConfigForm.get('temporaryWardCT').patchValue(this.translatedValues.temporaryWard);

    }

    private clearValidationForTemporaryAddress(): void {
        this.userConfigForm.get('temporaryProvinceCT').clearValidators();
        this.userConfigForm.get('temporaryProvinceCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryDistrictCT').clearValidators();
        this.userConfigForm.get('temporaryDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryMunicipalityCT').clearValidators();
        this.userConfigForm.get('temporaryWardCT').updateValueAndValidity();
    }

    private clearValidationForIndividualCustomer(): void {
        this.userConfigForm.get('genderCT').clearValidators();
        this.userConfigForm.get('genderCT').updateValueAndValidity();
        this.userConfigForm.get('genderTrans').clearValidators();
        this.userConfigForm.get('genderTrans').updateValueAndValidity();
        this.userConfigForm.get('citizenshipNoCT').clearValidators();
        this.userConfigForm.get('citizenshipNoCT').updateValueAndValidity();
        this.userConfigForm.get('citizenshipNoTrans').clearValidators();
        this.userConfigForm.get('citizenshipNoTrans').updateValueAndValidity();
        this.userConfigForm.get('permanentProvinceCT').clearValidators();
        this.userConfigForm.get('permanentProvinceCT').updateValueAndValidity();
        this.userConfigForm.get('permanentProvinceTrans').clearValidators();
        this.userConfigForm.get('permanentProvinceTrans').updateValueAndValidity();
        this.userConfigForm.get('permanentDistrictCT').clearValidators();
        this.userConfigForm.get('permanentDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('permanentDistrictTrans').clearValidators();
        this.userConfigForm.get('permanentDistrictTrans').updateValueAndValidity();
        this.userConfigForm.get('permanentMunicipalityCT').clearValidators();
        this.userConfigForm.get('permanentMunicipalityCT').updateValueAndValidity();
        this.userConfigForm.get('permanentMunicipalityTrans').clearValidators();
        this.userConfigForm.get('permanentMunicipalityTrans').updateValueAndValidity();
        this.userConfigForm.get('temporaryProvinceCT').clearValidators();
        this.userConfigForm.get('temporaryProvinceCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryProvinceTrans').clearValidators();
        this.userConfigForm.get('temporaryProvinceTrans').updateValueAndValidity();
        this.userConfigForm.get('temporaryDistrictCT').clearValidators();
        this.userConfigForm.get('temporaryDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryDistrictTrans').clearValidators();
        this.userConfigForm.get('temporaryDistrictTrans').updateValueAndValidity();
        this.userConfigForm.get('temporaryMunicipalityCT').clearValidators();
        this.userConfigForm.get('temporaryMunicipalityCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryMunicipalityTrans').clearValidators();
        this.userConfigForm.get('temporaryMunicipalityTrans').updateValueAndValidity();
        this.userConfigForm.get('temporaryWardCT').clearValidators();
        this.userConfigForm.get('temporaryWardCT').updateValueAndValidity();
        this.userConfigForm.get('temporaryWardTrans').clearValidators();
        this.userConfigForm.get('temporaryWardTrans').updateValueAndValidity();
        this.userConfigForm.get('citizenshipIssueDistrictCT').clearValidators();
        this.userConfigForm.get('citizenshipIssueDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('citizenshipIssueDistrictTrans').clearValidators();
        this.userConfigForm.get('citizenshipIssueDistrictTrans').updateValueAndValidity();
    }

    private clearValidationForInstitutionalCustomer(): void {
        this.userConfigForm.get('registrationNoCT').clearValidators();
        this.userConfigForm.get('registrationNoCT').updateValueAndValidity();
        this.userConfigForm.get('registeredMunTypeCT').clearValidators();
        this.userConfigForm.get('registeredMunTypeCT').updateValueAndValidity();
        this.userConfigForm.get('registeredProvinceCT').clearValidators();
        this.userConfigForm.get('registeredProvinceCT').updateValueAndValidity();
        this.userConfigForm.get('registeredDistrictCT').clearValidators();
        this.userConfigForm.get('registeredDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('registeredMunicipalityTrans').clearValidators();
        this.userConfigForm.get('registeredMunicipalityTrans').updateValueAndValidity();
        this.userConfigForm.get('permanentWardCT').clearValidators();
        this.userConfigForm.get('permanentWardCT').updateValueAndValidity();
        this.userConfigForm.get('currentMunTypeCT').clearValidators();
        this.userConfigForm.get('currentMunTypeCT').updateValueAndValidity();
        this.userConfigForm.get('currentProvinceCT').clearValidators();
        this.userConfigForm.get('currentProvinceCT').updateValueAndValidity();
        this.userConfigForm.get('currentDistrictCT').clearValidators();
        this.userConfigForm.get('currentDistrictCT').updateValueAndValidity();
        this.userConfigForm.get('currentMunicipalityCT').clearValidators();
        this.userConfigForm.get('currentMunicipalityCT').updateValueAndValidity();
        this.userConfigForm.get('currentWardCT').clearValidators();
        this.userConfigForm.get('currentWardCT').updateValueAndValidity();
    }

    private editedTransData(): void {
        this.userConfigForm.get('citizenshipNoCT').patchValue(
            ObjectUtil.isEmpty(this.nepData.citizenshipNo) ? undefined : this.nepData.citizenshipNo.ct);
        this.userConfigForm.get('citizenshipIssueDistrictCT').patchValue(
            ObjectUtil.isEmpty(this.nepData.citizenshipIssueDistrict) ? undefined : this.nepData.citizenshipIssueDistrict.ct
        );
        // this.userConfigForm.get('permanentMunicipalityCT').patchValue(
        //     ObjectUtil.isEmpty(this.nepData.temporaryMunicipality) ? undefined : this.nepData.temporaryMunicipality.en.nepaliName
        // );
        this.userConfigForm.get('branchTrans').patchValue(ObjectUtil.isEmpty(this.nepData.branch) ? undefined : this.nepData.branch.en.nepaliName);
        this.userConfigForm.get('nameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.name) ? undefined : this.nepData.name.np);
        this.userConfigForm.get('emailTrans').patchValue(ObjectUtil.isEmpty(this.nepData.email) ? undefined : this.nepData.email.np);
        this.userConfigForm.get('contactNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.contactNo) ? undefined : this.nepData.contactNo.ct);
        this.userConfigForm.get('panNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.panNo) ? undefined : this.nepData.panNo.np);
        this.userConfigForm.get('customerCodeTrans').patchValue(ObjectUtil.isEmpty(this.nepData.customerCode) ? undefined : this.nepData.customerCode.ct);
        this.userConfigForm.get('genderTrans').patchValue(ObjectUtil.isEmpty(this.nepData.gender) ? undefined : this.nepData.gender.np);
        this.userConfigForm.get('fatherNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.fatherName) ? undefined : this.nepData.fatherName.ct);
        this.userConfigForm.get('grandFatherNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.grandFatherName) ? undefined : this.nepData.grandFatherName.ct);
        this.userConfigForm.get('relationMediumTrans').patchValue(ObjectUtil.isEmpty(this.nepData.relationMedium) ? undefined : this.nepData.relationMedium.np);
        this.userConfigForm.get('husbandNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.husbandName) ? undefined : this.nepData.husbandName.np);
        this.userConfigForm.get('fatherInLawNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.fatherInLawName) ? undefined : this.nepData.fatherInLawName.np);
        this.userConfigForm.get('citizenshipNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.citizenshipNo) ? undefined : this.nepData.citizenshipNo.np);
        this.userConfigForm.get('permanentProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentProvince) ? undefined : this.nepData.permanentProvince.en.nepaliName);
        this.userConfigForm.get('permanentDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentDistrict) ? undefined : this.nepData.permanentDistrict.en.nepaliName);
        this.userConfigForm.get('permanentMunicipalityTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentMunicipality) ? undefined : this.nepData.permanentMunicipality.en.nepaliName);
        this.userConfigForm.get('temporaryProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryProvince) ? undefined : this.nepData.temporaryProvince.en.nepaliName);
        this.userConfigForm.get('temporaryDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryDistrict) ? undefined : this.nepData.temporaryDistrict.en.nepaliName);
        this.userConfigForm.get('temporaryMunicipalityTrans').patchValue(
            ObjectUtil.isEmpty(this.nepData.temporaryMunicipality) ? undefined : this.nepData.temporaryMunicipality.en.nepaliName);
        this.userConfigForm.get('permanentWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentWard) ? undefined : this.nepData.permanentWard.np);
        this.userConfigForm.get('temporaryWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryWard) ? undefined : this.nepData.temporaryWard.np);
        this.userConfigForm.get('citizenshipIssueDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.citizenshipIssueDistrict) ? undefined : this.nepData.citizenshipIssueDistrict.ct);
        this.userConfigForm.get('registrationNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.registrationNo) ? undefined :
            this.loanHolder.customerType === CustomerType.INSTITUTION ?
                this.nepData.registrationNo.ct : undefined),
            this.userConfigForm.get('registeredProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.registeredProvince) ? undefined :
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    this.nepData.registeredProvince.en.nepaliName : undefined);
            // this.userConfigForm.get('registeredWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentWard) ? undefined :
            //     this.loanHolder.customerType === CustomerType.INSTITUTION ?
            //         this.nepData.permanentWard.ct : undefined);

    }


    addOwnerDetailsField() {
        return this.formBuilder.group({
            ownerName: [undefined],
            ownerNameTrans: [undefined],
            ownerNameCT: [undefined],
            ownerDob: [undefined],
            ownerDobTrans: [undefined],
            ownerDobCT: [undefined],
            ownerEmail: [undefined],
            ownerEmailTrans: [undefined],
            ownerEmailCT: [undefined],
            ownerContactNo: [undefined],
            ownerContactNoTrans: [undefined],
            ownerContactNoCT: [undefined],
            ownerGender: [undefined],
            ownerGenderTrans: [undefined],
            ownerGenderCT: [undefined],
            ownerMaritalStatus: [undefined],
            ownerMaritalStatusTrans: [undefined],
            ownerMaritalStatusCT: [undefined],
            ownerCitizenshipNo: [undefined],
            ownerCitizenshipNoTrans: [undefined],
            ownerCitizenshipNoCT: [undefined],
            ownerCitizenshipIssuedDistrict: [undefined],
            ownerCitizenshipIssuedDistrictTrans: [undefined],
            ownerCitizenshipIssuedDistrictCT: [undefined],
            ownerCitizenshipIssuedDate: [undefined],
            ownerCitizenshipIssuedDateTrans: [undefined],
            ownerCitizenshipIssuedDateCT: [undefined],
            radioOwnerCitizenshipIssuedDate: [undefined],
            radioOwnerCitizenshipIssuedDateTrans: [undefined],
            radioOwnerCitizenshipIssuedDateCT: [undefined],
            ownerPanNo: [undefined],
            ownerPanNoTrans: [undefined],
            ownerPanNoCT: [undefined],
            ownerSharePercentage: [undefined],
            ownerSharePercentageTrans: [undefined],
            ownerSharePercentageCT: [undefined],
            radioOwnerDob: [undefined],
            radioOwnerDobTrans: [undefined],
            radioOwnerDobCT: [undefined],
            nepData: [undefined],

            // Relations Details

            ownerFatherName: [undefined],
            ownerFatherNameCT: [undefined],
            ownerFatherNameTrans: [undefined],
            ownerGrandFatherName: [undefined],
            ownerGrandFatherNameTrans: [undefined],
            ownerGrandFatherNameCT: [undefined],
            ownerFatherInLawName: [undefined],
            ownerFatherInLawNameTrans: [undefined],
            ownerFatherInLawNameCT: [undefined],
            ownerHusbandName: [undefined],
            ownerHusbandNameTrans: [undefined],
            ownerHusbandNameCT: [undefined],
            ownerRelationMedium: [undefined],
            ownerRelationMediumTrans: [undefined],
            ownerRelationMediumCT: [undefined],
            ownerDobDateType: [undefined],
            ownerDobDateTypeTrans: [undefined],
            ownerDobDateTypeCT: [undefined],


            //    address Details
            // for permanent
            ownerPermanentProvince: [undefined],
            ownerPermanentProvinceTrans: [undefined],
            ownerPermanentProvinceCT: [undefined],
            ownerPermanentDistrict: [undefined],
            ownerPermanentDistrictTrans: [undefined],
            ownerPermanentDistrictCT: [undefined],
            ownerPermanentMunicipality: [undefined],
            ownerPermanentMunicipalityTrans: [undefined],
            ownerPermanentMunicipalityCT: [undefined],
            ownerPermanentWardNo: [undefined],
            ownerPermanentWardNoTrans: [undefined],
            ownerPermanentWardNoCT: [undefined],
            ownerPermanentStreetTole: [undefined],
            ownerPermanentStreetToleTrans: [undefined],
            ownerPermanentStreetToleCT: [undefined],

            //    for temporary

            ownerTemporaryProvince: [undefined],
            ownerTemporaryProvinceTrans: [undefined],
            ownerTemporaryProvinceCT: [undefined],
            ownerTemporaryDistrict: [undefined],
            ownerTemporaryDistrictTrans: [undefined],
            ownerTemporaryDistrictCT: [undefined],
            ownerTemporaryMunicipality: [undefined],
            ownerTemporaryMunicipalityTrans: [undefined],
            ownerTemporaryMunicipalityCT: [undefined],
            ownerTemporaryWardNo: [undefined],
            ownerTemporaryWardNoTrans: [undefined],
            ownerTemporaryWardNoCT: [undefined],
            ownerTemporaryStreetTole: [undefined],
            ownerTemporaryStreetToleTrans: [undefined],
            ownerTemporaryStreetToleCT: [undefined],
            ownerOtherAddress: [undefined],
            ownerOtherAddressTrans: [undefined],
            ownerOtherAddressCT : [undefined],


            // address flag

            ownerPermanentAddressRadio: [undefined],
            ownerPermanentAddressRadioTrans: [undefined],
            ownerPermanentAddressRadioCT: [undefined],
            ownerTemporaryAddressRadio: [undefined],
            ownerTemporaryAddressRadioTrans: [undefined],
            ownerTemporaryAddressRadioCT: [undefined],

            isSameTemporaryAndPermanent: [undefined],
            foreignAddressOption: [undefined],
            foreignAddressOptionTrans: [undefined],
            foreignAddressOptionCT : [undefined],


            //    Nationality-Indian

            //    Embassy Certificate

            ownerNationality: [undefined],
            ownerNationalityTrans: [undefined],
            ownerNationalityCT: [undefined],
            indianOwnerDetailOption: [undefined],
            indianOwnerDetailOptionTrans: [undefined],
            indianOwnerDetailOptionCT: [undefined],
            indianEmbassyNo: [undefined],
            indianEmbassyNoTrans: [undefined],
            indianEmbassyNoCT: [undefined],
            indianEmbassyIssuedDate: [undefined],
            indianEmbassyIssuedDateTrans: [undefined],
            indianEmbassyIssuedDateCT: [undefined],
            indianEmbassyIssuedFrom: [undefined],
            indianEmbassyIssuedFromTrans: [undefined],
            indianEmbassyIssuedFromCT: [undefined],
            indianEmbassyIssuedDateOption: [undefined],
            indianEmbassyIssuedDateOptionTrans: [undefined],
            indianEmbassyIssuedDateOptionCT: [undefined],

            // Passport

            indianOwnerPassportNo: [undefined],
            indianOwnerPassportNoTrans: [undefined],
            indianOwnerPassportNoCT: [undefined],
            indianOwnerPassportIssuedDate: [undefined],
            indianOwnerPassportIssuedDateTrans: [undefined],
            indianOwnerPassportIssuedDateCT: [undefined],
            indianOwnerPassportIssuedDateOption: [undefined],
            indianOwnerPassportIssuedDateOptionTrans: [undefined],
            indianOwnerPassportIssuedDateOptionCT: [undefined],
            indianOwnerPassportValidityDate: [undefined],
            indianOwnerPassportValidityDateTrans: [undefined],
            indianOwnerPassportValidityDateCT: [undefined],
            indianOwnerPassportValidityDateOption: [undefined],
            indianOwnerPassportValidityDateOptionTrans: [undefined],
            indianOwnerPassportValidityDateOptionCT: [undefined],
            indianOwnerPassportIssuedFrom: [undefined],
            indianOwnerPassportIssuedFromTrans: [undefined],
            indianOwnerPassportIssuedFromCT: [undefined],

            // Adhar Card

            indianOwnerAdharCardNo: [undefined],
            indianOwnerAdharCardNoTrans: [undefined],
            indianOwnerAdharCardNoCT: [undefined],
            indianOwnerAdharCardIssuedDate: [undefined],
            indianOwnerAdharCardIssuedDateTrans: [undefined],
            indianOwnerAdharCardIssuedDateCT: [undefined],
            indianOwnerAdharCardIssuedDateOption: [undefined],
            indianOwnerAdharCardIssuedDateOptionTrans: [undefined],
            indianOwnerAdharCardIssuedDateOptionCT: [undefined],
            indianOwnerAdharCardIssuedFrom: [undefined],
            indianOwnerAdharCardIssuedFromTrans: [undefined],
            indianOwnerAdharCardIssuedFromCT: [undefined],

            //    for other than indian

            otherOwnerPassportNo: [undefined],
            otherOwnerPassportNoTrans: [undefined],
            otherOwnerPassportNoCT: [undefined],
            otherOwnerPassportIssuedDate: [undefined],
            otherOwnerPassportIssuedDateTrans: [undefined],
            otherOwnerPassportIssuedDateCT: [undefined],
            otherOwnerPassportIssuedDateOption: [undefined],
            otherOwnerPassportIssuedDateOptionTrans: [undefined],
            otherOwnerPassportIssuedDateOptionCT: [undefined],
            otherOwnerPassportValidityDate: [undefined],
            otherOwnerPassportValidityDateTrans: [undefined],
            otherOwnerPassportValidityDateCT: [undefined],
            otherOwnerPassportValidityDateOption: [undefined],
            otherOwnerPassportValidityDateOptionTrans: [undefined],
            otherOwnerPassportValidityDateOptionCT: [undefined],
            otherOwnerPassportIssuedFrom: [undefined],
            otherOwnerPassportIssuedFromTrans: [undefined],
            otherOwnerPassportIssuedFromCT: [undefined],


        });
    }

    patchOwnerDetails() {
        if (this.customerType === CustomerType.INSTITUTION) {
            console.log(this.oneFormCustomer, 'oneForm');
            const nepData = JSON.parse(this.oneFormCustomer.companyJsonData);
            console.log(nepData);
            console.log(JSON.parse(this.oneFormCustomer.companyJsonData));
            const ownerDetailControl = this.userConfigForm.get('ownerDetails') as FormArray;
           nepData.forEach((data, index) => {
               this.getDistrictsByIdForOwner(data.ownerPermanentProvince ? data.ownerPermanentProvince.id : null , null, index);
               this.getMunicipalitiesByIdForOwner(data.ownerPermanentDistrict ? data.ownerPermanentDistrict.id : null, null , index);
               this.getDistrictsByIdForOwnerTemp(data.ownerTemporaryProvince ? data.ownerTemporaryProvince.id : null , null, index);
               this.getMunicipalitiesByIdForOwnerTemp(data.ownerTemporaryDistrict ? data.ownerTemporaryDistrict.id : null, null , index);
               // console.log(data, index);

               ownerDetailControl.push(
                   this.formBuilder.group({
                       ownerName : data.ownerName ? data.ownerName : '' ,
                       ownerNameTrans : data.ownerNameTrans ? data.ownerNameTrans : '' ,
                       ownerNameCT : data.ownerNameCT ? data.ownerNameCT : '' ,
                       ownerDob: ObjectUtil.isEmpty(data.ownerDob) ? undefined : data.ownerDobCT.eDate ? data.ownerDobCT.eDate : data.ownerDobCT ,
                       ownerDobTrans : data.ownerDobTrans ? data.ownerDobTrans : '' ,
                       ownerDobCT : data.ownerDobCT ? data.ownerDobCT : '' ,
                       ownerEmail : data.ownerEmail ? data.ownerEmail : '' ,
                       ownerEmailTrans : data.ownerEmailTrans ? data.ownerEmailTrans : '' ,
                       ownerEmailCT : data.ownerEmailCT ? data.ownerEmailCT : '' ,
                       ownerContactNo : data.ownerContactNo ? data.ownerContactNo : '' ,
                       ownerContactNoTrans : data.ownerContactNoTrans ? data.ownerContactNoTrans : '' ,
                       ownerContactNoCT : data.ownerContactNoCT ? data.ownerContactNoCT : '' ,
                       ownerGender : data.ownerGender ? data.ownerGender : '' ,
                       ownerGenderTrans : data.ownerGenderTrans ? data.ownerGenderTrans : '' ,
                       ownerGenderCT : data.ownerGenderCT ? data.ownerGenderCT : '' ,
                       ownerMaritalStatus : data.ownerMaritalStatus ? data.ownerMaritalStatus : '' ,
                       ownerMaritalStatusTrans : data.ownerMaritalStatusTrans ? data.ownerMaritalStatusTrans : '' ,
                       ownerMaritalStatusCT : data.ownerMaritalStatusCT ? data.ownerMaritalStatusCT : '' ,
                       ownerCitizenshipNo : data.ownerCitizenshipNo ? data.ownerCitizenshipNo : '' ,
                       ownerCitizenshipNoTrans : data.ownerCitizenshipNoTrans ? data.ownerCitizenshipNoTrans : '' ,
                       ownerCitizenshipNoCT : data.ownerCitizenshipNoCT ? data.ownerCitizenshipNoCT : '' ,
                       ownerCitizenshipIssuedDistrict : data.ownerCitizenshipIssuedDistrict ? data.ownerCitizenshipIssuedDistrict : '' ,
                       ownerCitizenshipIssuedDistrictTrans : data.ownerCitizenshipIssuedDistrictTrans ? data.ownerCitizenshipIssuedDistrictTrans : '' ,
                       ownerCitizenshipIssuedDistrictCT : data.ownerCitizenshipIssuedDistrictCT ? data.ownerCitizenshipIssuedDistrictCT : '' ,
                       ownerCitizenshipIssuedDate : data.ownerCitizenshipIssuedDate ? data.ownerCitizenshipIssuedDate : '' ,
                       ownerCitizenshipIssuedDateTrans : data.ownerCitizenshipIssuedDateTrans ? data.ownerCitizenshipIssuedDateTrans : '' ,
                       ownerCitizenshipIssuedDateCT : data.ownerCitizenshipIssuedDateCT ? data.ownerCitizenshipIssuedDateCT : '' ,
                       radioOwnerCitizenshipIssuedDate : data.radioOwnerCitizenshipIssuedDate ? data.radioOwnerCitizenshipIssuedDate : '' ,
                       radioOwnerCitizenshipIssuedDateTrans : data.radioOwnerCitizenshipIssuedDateTrans ? data.radioOwnerCitizenshipIssuedDateTrans : '' ,
                       radioOwnerCitizenshipIssuedDateCT : data.radioOwnerCitizenshipIssuedDateCT ? data.radioOwnerCitizenshipIssuedDateCT : '' ,
                       ownerPanNo : data.ownerPanNo ? data.ownerPanNo : '' ,
                       ownerPanNoTrans : data.ownerPanNoTrans ? data.ownerPanNoTrans : '' ,
                       ownerPanNoCT : data.ownerPanNoCT ? data.ownerPanNoCT : '' ,
                       ownerSharePercentage : data.ownerSharePercentage ? data.ownerSharePercentage : '' ,
                       ownerSharePercentageTrans : data.ownerSharePercentageTrans ? data.ownerSharePercentageTrans : '' ,
                       ownerSharePercentageCT : data.ownerSharePercentageCT ? data.ownerSharePercentageCT : '' ,
                       radioOwnerDob : 'AD' ,
                       radioOwnerDobTrans : data.radioOwnerDobTrans ? data.radioOwnerDobTrans : '' ,
                       radioOwnerDobCT : data.radioOwnerDobCT ? data.radioOwnerDobCT : '' ,
                       nepData : data.nepData ? data.nepData : '' ,
                       foreignAddressOption: data.foreignAddressOption ? data.foreignAddressOption : '' ,
                       foreignAddressOptionTrans: data.foreignAddressOptionTrans ? data.foreignAddressOptionTrans : '' ,
                       foreignAddressOptionCT : data.foreignAddressOptionCT ? data.foreignAddressOptionCT : '' ,
                       ownerOtherAddress:  data.ownerOtherAddress ? data.ownerOtherAddress : '' ,
                       ownerOtherAddressTrans:  data.ownerOtherAddressTrans ? data.ownerOtherAddressTrans : '' ,
                       ownerOtherAddressCT :  data.ownerOtherAddressCT ? data.ownerOtherAddressCT : '' ,

                       // Relations Details

                       ownerFatherName : data.ownerFatherName ? data.ownerFatherName : '' ,
                       ownerFatherNameCT : data.ownerFatherNameCT ? data.ownerFatherNameCT : '' ,
                       ownerFatherNameTrans : data.ownerFatherNameTrans ? data.ownerFatherNameTrans : '' ,
                       ownerGrandFatherName : data.ownerGrandFatherName ? data.ownerGrandFatherName : '' ,
                       ownerGrandFatherNameTrans : data.ownerGrandFatherNameTrans ? data.ownerGrandFatherNameTrans : '' ,
                       ownerGrandFatherNameCT : data.ownerGrandFatherNameCT ? data.ownerGrandFatherNameCT : '' ,
                       ownerFatherInLawName : data.ownerFatherInLawName ? data.ownerFatherInLawName : '' ,
                       ownerFatherInLawNameTrans : data.ownerFatherInLawNameTrans ? data.ownerFatherInLawNameTrans : '' ,
                       ownerFatherInLawNameCT : data.ownerFatherInLawNameCT ? data.ownerFatherInLawNameCT : '' ,
                       ownerHusbandName : data.ownerHusbandName ? data.ownerHusbandName : '' ,
                       ownerHusbandNameTrans : data.ownerHusbandNameTrans ? data.ownerHusbandNameTrans : '' ,
                       ownerHusbandNameCT : data.ownerHusbandNameCT ? data.ownerHusbandNameCT : '' ,
                       ownerRelationMedium : data.ownerRelationMedium ? data.ownerRelationMedium : '' ,
                       ownerRelationMediumTrans : data.ownerRelationMediumTrans ? data.ownerRelationMediumTrans : '' ,
                       ownerRelationMediumCT : data.ownerRelationMediumCT ? data.ownerRelationMediumCT : '' ,
                       ownerDobDateType : data.ownerDobDateType ? 'AD' : '' ,
                       ownerDobDateTypeTrans : data.ownerDobDateTypeTrans ? data.ownerDobDateTypeTrans : '' ,
                       ownerDobDateTypeCT : data.ownerDobDateTypeCT ? data.ownerDobDateTypeCT : '' ,


                       //    address Details
                       // for permanent
                       ownerPermanentProvince : data.ownerPermanentProvince ? data.ownerPermanentProvince : '' ,
                       ownerPermanentProvinceTrans : data.ownerPermanentProvinceTrans ? data.ownerPermanentProvinceTrans : '' ,
                       ownerPermanentProvinceCT : data.ownerPermanentProvinceCT ? data.ownerPermanentProvinceCT : '' ,
                       ownerPermanentDistrict : data.ownerPermanentDistrict ? data.ownerPermanentDistrict : '' ,
                       ownerPermanentDistrictTrans : data.ownerPermanentDistrictTrans ? data.ownerPermanentDistrictTrans : '' ,
                       ownerPermanentDistrictCT : data.ownerPermanentDistrictCT ? data.ownerPermanentDistrictCT : '' ,
                       ownerPermanentMunicipality : data.ownerPermanentMunicipality ? data.ownerPermanentMunicipality : '' ,
                       ownerPermanentMunicipalityTrans : data.ownerPermanentMunicipalityTrans ? data.ownerPermanentMunicipalityTrans : '' ,
                       ownerPermanentMunicipalityCT : data.ownerPermanentMunicipalityCT ? data.ownerPermanentMunicipalityCT : '' ,
                       ownerPermanentWardNo : data.ownerPermanentWardNo ? data.ownerPermanentWardNo : '' ,
                       ownerPermanentWardNoTrans : data.ownerPermanentWardNoTrans ? data.ownerPermanentWardNoTrans : '' ,
                       ownerPermanentWardNoCT : data.ownerPermanentWardNoCT ? data.ownerPermanentWardNoCT : '' ,
                       ownerPermanentStreetTole : data.ownerPermanentStreetTole ? data.ownerPermanentStreetTole : '' ,
                       ownerPermanentStreetToleTrans : data.ownerPermanentStreetToleTrans ? data.ownerPermanentStreetToleTrans : '' ,
                       ownerPermanentStreetToleCT : data.ownerPermanentStreetToleCT ? data.ownerPermanentStreetToleCT : '' ,

                       //    for temporary

                       ownerTemporaryProvince : data.ownerTemporaryProvince ? data.ownerTemporaryProvince : '' ,
                       ownerTemporaryProvinceTrans : data.ownerTemporaryProvinceTrans ? data.ownerTemporaryProvinceTrans : '' ,
                       ownerTemporaryProvinceCT : data.ownerTemporaryProvinceCT ? data.ownerTemporaryProvinceCT : '' ,
                       ownerTemporaryDistrict : data.ownerTemporaryDistrict ? data.ownerTemporaryDistrict : '' ,
                       ownerTemporaryDistrictTrans : data.ownerTemporaryDistrictTrans ? data.ownerTemporaryDistrictTrans : '' ,
                       ownerTemporaryDistrictCT : data.ownerTemporaryDistrictCT ? data.ownerTemporaryDistrictCT : '' ,
                       ownerTemporaryMunicipality : data.ownerTemporaryMunicipality ? data.ownerTemporaryMunicipality : '' ,
                       ownerTemporaryMunicipalityTrans : data.ownerTemporaryMunicipalityTrans ? data.ownerTemporaryMunicipalityTrans : '' ,
                       ownerTemporaryMunicipalityCT : data.ownerTemporaryMunicipalityCT ? data.ownerTemporaryMunicipalityCT : '' ,
                       ownerTemporaryWardNo : data.ownerTemporaryWardNo ? data.ownerTemporaryWardNo : '' ,
                       ownerTemporaryWardNoTrans : data.ownerTemporaryWardNoTrans ? data.ownerTemporaryWardNoTrans : '' ,
                       ownerTemporaryWardNoCT : data.ownerTemporaryWardNoCT ? data.ownerTemporaryWardNoCT : '' ,
                       ownerTemporaryStreetTole : data.ownerTemporaryStreetTole ? data.ownerTemporaryStreetTole : '' ,
                       ownerTemporaryStreetToleTrans : data.ownerTemporaryStreetToleTrans ? data.ownerTemporaryStreetToleTrans : '' ,
                       ownerTemporaryStreetToleCT : data.ownerTemporaryStreetToleCT ? data.ownerTemporaryStreetToleCT : '' ,

                       // address flag

                       ownerPermanentAddressRadio : data.ownerPermanentAddressRadio ? data.ownerPermanentAddressRadio : '' ,
                       ownerPermanentAddressRadioTrans : data.ownerPermanentAddressRadioTrans ? data.ownerPermanentAddressRadioTrans : '' ,
                       ownerPermanentAddressRadioCT : data.ownerPermanentAddressRadioCT ? data.ownerPermanentAddressRadioCT : '' ,
                       ownerTemporaryAddressRadio : data.ownerTemporaryAddressRadio ? data.ownerTemporaryAddressRadio  : '' ,
                       ownerTemporaryAddressRadioTrans : data.ownerTemporaryAddressRadioTrans ? data.ownerTemporaryAddressRadioTrans : '' ,
                       ownerTemporaryAddressRadioCT : data.ownerTemporaryAddressRadioCT ? data.ownerTemporaryAddressRadioCT : '' ,

                       isSameTemporaryAndPermanent : data.isSameTemporaryAndPermanent ? data.isSameTemporaryAndPermanent : '' ,

                       //    Nationality-Indian

                       //    Embassy Certificate

                       ownerNationality : data.ownerNationality ? data.ownerNationality : '' ,
                       ownerNationalityTrans : data.ownerNationalityTrans ? data.ownerNationalityTrans : '' ,
                       ownerNationalityCT : data.ownerNationalityCT ? data.ownerNationalityCT : '' ,
                       indianOwnerDetailOption : data.indianOwnerDetailOption ? data.indianOwnerDetailOption : '' ,
                       indianOwnerDetailOptionTrans : data.indianOwnerDetailOptionTrans ? data.indianOwnerDetailOptionTrans : '' ,
                       indianOwnerDetailOptionCT : data.indianOwnerDetailOptionCT ? data.indianOwnerDetailOptionCT : '' ,
                       indianEmbassyNo : data.indianEmbassyNo ? data.indianEmbassyNo : '' ,
                       indianEmbassyNoTrans : data.indianEmbassyNoTrans ? data.indianEmbassyNoTrans : '' ,
                       indianEmbassyNoCT : data.indianEmbassyNoCT ? data.indianEmbassyNoCT : '' ,
                       indianEmbassyIssuedDate : data.indianEmbassyIssuedDate ? data.indianEmbassyIssuedDate : '' ,
                       indianEmbassyIssuedDateTrans : data.indianEmbassyIssuedDateTrans ? data.indianEmbassyIssuedDateTrans : '' ,
                       indianEmbassyIssuedDateCT : data.indianEmbassyIssuedDateCT ? data.indianEmbassyIssuedDateCT : '' ,
                       indianEmbassyIssuedFrom : data.indianEmbassyIssuedFrom ? data.indianEmbassyIssuedFrom : '' ,
                       indianEmbassyIssuedFromTrans : data.indianEmbassyIssuedFromTrans ? data.indianEmbassyIssuedFromTrans : '' ,
                       indianEmbassyIssuedFromCT : data.indianEmbassyIssuedFromCT ? data.indianEmbassyIssuedFromCT : '' ,
                       indianEmbassyIssuedDateOption : data.indianEmbassyIssuedDateOption ? data.indianEmbassyIssuedDateOption : '' ,
                       indianEmbassyIssuedDateOptionTrans : data.indianEmbassyIssuedDateOptionTrans ? data.indianEmbassyIssuedDateOptionTrans : '' ,
                       indianEmbassyIssuedDateOptionCT : data.indianEmbassyIssuedDateOptionCT ? data.indianEmbassyIssuedDateOptionCT : '' ,

                       // Passport

                       indianOwnerPassportNo : data.indianOwnerPassportNo ? data.indianOwnerPassportNo : '' ,
                       indianOwnerPassportNoTrans : data.indianOwnerPassportNoTrans ? data.indianOwnerPassportNoTrans : '' ,
                       indianOwnerPassportNoCT : data.indianOwnerPassportNoCT ? data.indianOwnerPassportNoCT : '' ,
                       indianOwnerPassportIssuedDate : data.indianOwnerPassportIssuedDate ? data.indianOwnerPassportIssuedDate : '' ,
                       indianOwnerPassportIssuedDateTrans : data.indianOwnerPassportIssuedDateTrans ? data.indianOwnerPassportIssuedDateTrans : '' ,
                       indianOwnerPassportIssuedDateCT : data.indianOwnerPassportIssuedDateCT ? data.indianOwnerPassportIssuedDateCT : '' ,
                       indianOwnerPassportIssuedDateOption : data.indianOwnerPassportIssuedDateOption ? data.indianOwnerPassportIssuedDateOption : '' ,
                       indianOwnerPassportIssuedDateOptionTrans : data.indianOwnerPassportIssuedDateOption ? data.indianOwnerPassportIssuedDateOption : '' ,
                       indianOwnerPassportIssuedDateOptionCT : data.indianOwnerPassportIssuedDateOptionCT ? data.indianOwnerPassportIssuedDateOptionCT : '' ,
                       indianOwnerPassportValidityDate : data.indianOwnerPassportValidityDate ? data.indianOwnerPassportValidityDate : '' ,
                       indianOwnerPassportValidityDateTrans : data.indianOwnerPassportValidityDateTrans ? data.indianOwnerPassportValidityDateTrans : '' ,
                       indianOwnerPassportValidityDateCT : data.indianOwnerPassportValidityDateCT ? data.indianOwnerPassportValidityDateCT : '' ,
                       indianOwnerPassportValidityDateOption : data.indianOwnerPassportValidityDateOption ? data.indianOwnerPassportValidityDateOption : '' ,
                       indianOwnerPassportValidityDateOptionTrans : data.indianOwnerPassportValidityDateOptionTrans ? data.indianOwnerPassportValidityDateOptionTrans : '' ,
                       indianOwnerPassportValidityDateOptionCT : data.indianOwnerPassportValidityDateOptionCT ? data.indianOwnerPassportValidityDateOptionCT : '' ,
                       indianOwnerPassportIssuedFrom : data.indianOwnerPassportIssuedFrom ? data.indianOwnerPassportIssuedFrom : '' ,
                       indianOwnerPassportIssuedFromTrans : data.indianOwnerPassportIssuedFromTrans ? data.indianOwnerPassportIssuedFromTrans : '' ,
                       indianOwnerPassportIssuedFromCT : data.indianOwnerPassportIssuedFromCT ? data.indianOwnerPassportIssuedFromCT : '' ,

                       // Adhar Card

                       indianOwnerAdharCardNo : data.indianOwnerAdharCardNo ? data.indianOwnerAdharCardNo : '' ,
                       indianOwnerAdharCardNoTrans : data.indianOwnerAdharCardNoTrans ? data.indianOwnerAdharCardNoTrans : '' ,
                       indianOwnerAdharCardNoCT : data.indianOwnerAdharCardNoCT ? data.indianOwnerAdharCardNoCT : '' ,
                       indianOwnerAdharCardIssuedDate : data.indianOwnerAdharCardIssuedDate ? data.indianOwnerAdharCardIssuedDate : '' ,
                       indianOwnerAdharCardIssuedDateTrans : data.indianOwnerAdharCardIssuedDateTrans ? data.indianOwnerAdharCardIssuedDateTrans : '' ,
                       indianOwnerAdharCardIssuedDateCT : data.indianOwnerAdharCardIssuedDateCT ? data.indianOwnerAdharCardIssuedDateCT : '' ,
                       indianOwnerAdharCardIssuedDateOption : data.indianOwnerAdharCardIssuedDateOption ? data.indianOwnerAdharCardIssuedDateOption : '' ,
                       indianOwnerAdharCardIssuedDateOptionTrans : data.indianOwnerAdharCardIssuedDateOptionTrans ? data.indianOwnerAdharCardIssuedDateOptionTrans : '' ,
                       indianOwnerAdharCardIssuedDateOptionCT : data.indianOwnerAdharCardIssuedDateOptionCT ? data.indianOwnerAdharCardIssuedDateOptionCT : '' ,
                       indianOwnerAdharCardIssuedFrom : data.indianOwnerAdharCardIssuedFrom ? data.indianOwnerAdharCardIssuedFrom : '' ,
                       indianOwnerAdharCardIssuedFromTrans : data.indianOwnerAdharCardIssuedFromTrans ? data.indianOwnerAdharCardIssuedFromTrans : '' ,
                       indianOwnerAdharCardIssuedFromCT : data.indianOwnerAdharCardIssuedFromCT ? data.indianOwnerAdharCardIssuedFromCT : '' ,

                       //    for other than indian

                       otherOwnerPassportNo : data.otherOwnerPassportNo ? data.otherOwnerPassportNo : '' ,
                       otherOwnerPassportNoTrans : data.otherOwnerPassportNoTrans ? data.otherOwnerPassportNoTrans : '' ,
                       otherOwnerPassportNoCT : data.otherOwnerPassportNoCT ? data.otherOwnerPassportNoCT : '' ,
                       otherOwnerPassportIssuedDate : data.otherOwnerPassportIssuedDate ? data.iotherOwnerPassportIssuedDate : '' ,
                       otherOwnerPassportIssuedDateTrans : data.otherOwnerPassportIssuedDateTrans ? data.otherOwnerPassportIssuedDateTrans : '' ,
                       otherOwnerPassportIssuedDateCT : data.otherOwnerPassportIssuedDateCT ? data.otherOwnerPassportIssuedDateCT : '' ,
                       otherOwnerPassportIssuedDateOption : data.otherOwnerPassportIssuedDateOption ? data.otherOwnerPassportIssuedDateOption : '' ,
                       otherOwnerPassportIssuedDateOptionTrans : data.otherOwnerPassportIssuedDateOptionTrans ? data.otherOwnerPassportIssuedDateOptionTrans : '' ,
                       otherOwnerPassportIssuedDateOptionCT : data.otherOwnerPassportIssuedDateOptionCT ? data.otherOwnerPassportIssuedDateOptionCT : '' ,
                       otherOwnerPassportValidityDate : data.otherOwnerPassportValidityDate ? data.otherOwnerPassportValidityDate : '' ,
                       otherOwnerPassportValidityDateTrans : data.otherOwnerPassportValidityDateTrans ? data.otherOwnerPassportValidityDateTrans : '' ,
                       otherOwnerPassportValidityDateCT : data.otherOwnerPassportValidityDateCT ? data.otherOwnerPassportValidityDateCT : '' ,
                       otherOwnerPassportValidityDateOption : data.otherOwnerPassportValidityDateOption ? data.otherOwnerPassportValidityDateOption : '' ,
                       otherOwnerPassportValidityDateOptionTrans : data.otherOwnerPassportValidityDateOptionTrans ? data.otherOwnerPassportValidityDateOptionTrans : '' ,
                       otherOwnerPassportValidityDateOptionCT : data.otherOwnerPassportValidityDateOptionCT ? data.otherOwnerPassportValidityDateOptionCT : '' ,
                       otherOwnerPassportIssuedFrom : data.otherOwnerPassportIssuedFrom ? data.otherOwnerPassportIssuedFrom : '' ,
                       otherOwnerPassportIssuedFromTrans : data.otherOwnerPassportIssuedFromTrans ? data.otherOwnerPassportIssuedFromTrans : '' ,
                       otherOwnerPassportIssuedFromCT : data.otherOwnerPassportIssuedFromCT ? data.otherOwnerPassportIssuedFromCT : '' ,
                   })
               );
           });
        }

    }


    addOwnerDetails() {
        (this.userConfigForm.get('ownerDetails') as FormArray).push(this.addOwnerDetailsField());
    }

    getDistrictsByIdForOwner(provinceId: number, event, i: any) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.ownerPermanentDistricts[i] = response.detail;
                this.ownerPermanentDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getMunicipalitiesByIdForOwner(districtId: number, event, i: any) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.ownerPermanentMunicipality[i] = response.detail;
                this.ownerPermanentMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getDistrictsByIdForOwnerTemp(provinceId: number, event, i: any) {
        const province = new Province();
        province.id = provinceId;
        this.addressService.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.ownerTemporaryDistricts[i] = response.detail;
                this.ownerTemporaryDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    getMunicipalitiesByIdForOwnerTemp(districtId: number, event, i: any) {
        const district = new District();
        district.id = districtId;
        this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.ownerTemporaryMunicipality[i] = response.detail;
                this.ownerTemporaryMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
            }
        );
    }

    async translateOwnerData(i: any) {
        // console.log(this.userConfigForm.get(['ownerDetails',i,'ownerDob']).value);
        // return;
        const allOwnerData = this.userConfigForm.get('ownerDetails') as FormArray;
        if (allOwnerData.length > 0) {
            let ownerTranslatedData: any = [];
            this.spinner = true;
            ownerTranslatedData = await this.translateService.translateForm(this.userConfigForm, 'ownerDetails', i);


            // patch translated value
            this.userConfigForm.get(['ownerDetails', i]).patchValue({
                ownerNameTrans: ownerTranslatedData.ownerName ? ownerTranslatedData.ownerName : '',
                ownerNameCT: ownerTranslatedData.ownerName ? ownerTranslatedData.ownerName : '',
                ownerDobTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerDob']).value,
                ownerDobCT: this.userConfigForm.get(['ownerDetails', i, 'ownerDob']).value,
                ownerEmailTrans: ownerTranslatedData.ownerEmail ? ownerTranslatedData.ownerEmail : '',
                ownerEmailCT: ownerTranslatedData.ownerEmail ? ownerTranslatedData.ownerEmail : '',
                ownerContactNoTrans: ownerTranslatedData.ownerContactNo ? ownerTranslatedData.ownerContactNo : '',
                ownerContactNoCT: ownerTranslatedData.ownerContactNo ? ownerTranslatedData.ownerContactNo : '',
                ownerGenderTrans: ownerTranslatedData.ownerGender ? ownerTranslatedData.ownerGender : '',
                ownerGenderCT: ownerTranslatedData.ownerGender ? ownerTranslatedData.ownerGender : '',
                ownerMaritalStatusTrans: ownerTranslatedData.ownerMaritalStatus ? ownerTranslatedData.ownerMaritalStatus : '',
                ownerMaritalStatusCT: ownerTranslatedData.ownerMaritalStatus ? ownerTranslatedData.ownerMaritalStatus : '',
                ownerCitizenshipNoTrans: ownerTranslatedData.ownerCitizenshipNo ? ownerTranslatedData.ownerCitizenshipNo : '',
                ownerCitizenshipNoCT: ownerTranslatedData.ownerCitizenshipNo ? ownerTranslatedData.ownerCitizenshipNo : '',
                ownerCitizenshipIssuedDistrictTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDistrict']).value,
                ownerCitizenshipIssuedDistrictCT: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDistrict']).value,
                ownerCitizenshipIssuedDateTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDate']).value,
                ownerCitizenshipIssuedDateCT: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDate']).value,
                radioOwnerCitizenshipIssuedDateTrans: ownerTranslatedData.radioOwnerCitizenshipIssuedDate ? ownerTranslatedData.radioOwnerCitizenshipIssuedDate : '',
                radioOwnerCitizenshipIssuedDateCT: ownerTranslatedData.radioOwnerCitizenshipIssuedDate ? ownerTranslatedData.radioOwnerCitizenshipIssuedDate : '',
                ownerPanNoTrans: ownerTranslatedData.ownerPanNo ? ownerTranslatedData.ownerPanNo : '',
                ownerPanNoCT: ownerTranslatedData.ownerPanNo ? ownerTranslatedData.ownerPanNo : '',
                ownerSharePercentageTrans: ownerTranslatedData.ownerSharePercentage ? ownerTranslatedData.ownerSharePercentage : '',
                ownerSharePercentageCT: ownerTranslatedData.ownerSharePercentage ? ownerTranslatedData.ownerSharePercentage : '',
                radioOwnerDobTrans: ownerTranslatedData.radioOwnerDob ? ownerTranslatedData.radioOwnerDob : '',
                radioOwnerDobCT: ownerTranslatedData.radioOwnerDob ? ownerTranslatedData.radioOwnerDob : '',
                foreignAddressOptionTrans: ownerTranslatedData.foreignAddressOption ? ownerTranslatedData.foreignAddressOption : '' ,
                foreignAddressOptionCT : ownerTranslatedData.foreignAddressOption ? ownerTranslatedData.foreignAddressOption : '' ,
                ownerOtherAddressTrans:  ownerTranslatedData.ownerOtherAddress ? ownerTranslatedData.ownerOtherAddress : '' ,
                ownerOtherAddressCT :  ownerTranslatedData.ownerOtherAddress ? ownerTranslatedData.ownerOtherAddress : '' ,

                // Relations Details

                ownerFatherNameCT: ownerTranslatedData.ownerFatherName ? ownerTranslatedData.ownerFatherName : '',
                ownerFatherNameTrans: ownerTranslatedData.ownerFatherName ? ownerTranslatedData.ownerFatherName : '',
                ownerGrandFatherNameTrans: ownerTranslatedData.ownerGrandFatherName ? ownerTranslatedData.ownerGrandFatherName : '',
                ownerGrandFatherNameCT: ownerTranslatedData.ownerGrandFatherName ? ownerTranslatedData.ownerGrandFatherName : '',
                ownerFatherInLawNameTrans: ownerTranslatedData.ownerFatherInLawName ? ownerTranslatedData.ownerFatherInLawName : '',
                ownerFatherInLawNameCT: ownerTranslatedData.ownerFatherInLawName ? ownerTranslatedData.ownerFatherInLawName : '',
                ownerHusbandNameTrans: ownerTranslatedData.ownerHusbandName ? ownerTranslatedData.ownerHusbandName : '',
                ownerHusbandNameCT: ownerTranslatedData.ownerHusbandName ? ownerTranslatedData.ownerHusbandName : '',
                ownerRelationMediumTrans: ownerTranslatedData.ownerRelationMedium ? ownerTranslatedData.ownerRelationMedium : '',
                ownerRelationMediumCT: ownerTranslatedData.ownerRelationMedium ? ownerTranslatedData.ownerRelationMedium : '',
                ownerDobDateTypeTrans: ownerTranslatedData.ownerDobDateType ? ownerTranslatedData.ownerDobDateType : '',
                ownerDobDateTypeCT: ownerTranslatedData.ownerDobDateType ? ownerTranslatedData.ownerDobDateType : '',


                //    address Details
                // for permanent
                ownerPermanentProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value.nepaliName,
                ownerPermanentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value.nepaliName,
                ownerPermanentDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value) ?
                    undefined : this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value.nepaliName,
                ownerPermanentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value) ?
                    undefined : this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value.nepaliName,
                ownerPermanentMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipality']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipality']).value.nepaliName,
                ownerPermanentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipality']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipality']).value.nepaliName,
                ownerPermanentWardNoTrans: ownerTranslatedData.ownerPermanentWardNo ? ownerTranslatedData.ownerPermanentWardNo : '',
                ownerPermanentWardNoCT: ownerTranslatedData.ownerPermanentWardNo ? ownerTranslatedData.ownerPermanentWardNo : '',
                ownerPermanentStreetToleTrans: ownerTranslatedData.ownerPermanentStreetTole ? ownerTranslatedData.ownerPermanentStreetTole : '',
                ownerPermanentStreetToleCT: ownerTranslatedData.ownerPermanentStreetTole ? ownerTranslatedData.ownerPermanentStreetTole : '',

                //    for temporary

                ownerTemporaryProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryProvince']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryProvince']).value.nepaliName,
                ownerTemporaryProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryProvince']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryProvince']).value.nepaliName,
                ownerTemporaryDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryDistrict']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryDistrict']).value.nepaliName,
                ownerTemporaryDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryDistrict']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryDistrict']).value.nepaliName,
                ownerTemporaryMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryMunicipality']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryMunicipality']).value.nepaliName,
                ownerTemporaryMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryMunicipality']).value) ? undefined :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryMunicipality']).value.nepaliName,

                ownerTemporaryWardNoTrans: ownerTranslatedData.ownerTemporaryWardNo ? ownerTranslatedData.ownerTemporaryWardNo : '',
                ownerTemporaryWardNoCT: ownerTranslatedData.ownerTemporaryWardNo ? ownerTranslatedData.ownerTemporaryWardNo : '',
                ownerTemporaryStreetToleTrans: ownerTranslatedData.ownerTemporaryStreetTole ? ownerTranslatedData.ownerTemporaryStreetTole : '',
                ownerTemporaryStreetToleCT: ownerTranslatedData.ownerTemporaryStreetTole ? ownerTranslatedData.ownerTemporaryStreetTole : '',

                // address flag

                ownerPermanentAddressRadioTrans: ownerTranslatedData.ownerPermanentAddressRadio ? ownerTranslatedData.ownerPermanentAddressRadio : '',
                ownerPermanentAddressRadioCT: ownerTranslatedData.ownerPermanentAddressRadio ? ownerTranslatedData.ownerPermanentAddressRadio : '',
                ownerTemporaryAddressRadioTrans: ownerTranslatedData.ownerTemporaryAddressRadio ? ownerTranslatedData.ownerTemporaryAddressRadio : '',
                ownerTemporaryAddressRadioCT: ownerTranslatedData.ownerTemporaryAddressRadio ? ownerTranslatedData.ownerTemporaryAddressRadio : '',
                // isSameTemporaryAndPermanent : ownerTranslatedData.isSameTemporaryAndPermanent ? ownerTranslatedData.isSameTemporaryAndPermanent : ''],

                //    Nationality-Indian

                //    Embassy Certificate

                ownerNationalityTrans: ownerTranslatedData.ownerNationality ? ownerTranslatedData.ownerNationality : '',
                ownerNationalityCT: ownerTranslatedData.ownerNationality ? ownerTranslatedData.ownerNationality : '',
                indianOwnerDetailOptionTrans: ownerTranslatedData.indianOwnerDetailOption ? ownerTranslatedData.indianOwnerDetailOption : '',
                indianOwnerDetailOptionCT: ownerTranslatedData.indianOwnerDetailOption ? ownerTranslatedData.indianOwnerDetailOption : '',
                indianEmbassyNoTrans: ownerTranslatedData.indianEmbassyNo ? ownerTranslatedData.indianEmbassyNo : '',
                indianEmbassyNoCT: ownerTranslatedData.indianEmbassyNo ? ownerTranslatedData.indianEmbassyNo : '',
                indianEmbassyIssuedDateTrans: this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedDate']).value,
                indianEmbassyIssuedDateCT: this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedDate']).value,
                indianEmbassyIssuedFromTrans: ownerTranslatedData.indianEmbassyIssuedFrom ? ownerTranslatedData.indianEmbassyIssuedFrom : '',
                indianEmbassyIssuedFromCT: ownerTranslatedData.indianEmbassyIssuedFrom ? ownerTranslatedData.indianEmbassyIssuedFrom : '',
                indianEmbassyIssuedDateOptionTrans: ownerTranslatedData.indianEmbassyIssuedDateOption ? ownerTranslatedData.indianEmbassyIssuedDateOption : '',
                indianEmbassyIssuedDateOptionCT: ownerTranslatedData.indianEmbassyIssuedDateOption ? ownerTranslatedData.indianEmbassyIssuedDateOption : '',

                // Passport

                indianOwnerPassportNoTrans: ownerTranslatedData.indianOwnerPassportNo ? ownerTranslatedData.indianOwnerPassportNo : '',
                indianOwnerPassportNoCT: ownerTranslatedData.indianOwnerPassportNo ? ownerTranslatedData.indianOwnerPassportNo : '',
                indianOwnerPassportIssuedDateTrans: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedDate']).value,
                indianOwnerPassportIssuedDateCT: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedDate']).value,
                indianOwnerPassportIssuedDateOptionTrans: ownerTranslatedData.indianOwnerPassportIssuedDateOption ? ownerTranslatedData.indianOwnerPassportIssuedDateOption : '',
                indianOwnerPassportIssuedDateOptionCT: ownerTranslatedData.indianOwnerPassportIssuedDateOption ? ownerTranslatedData.indianOwnerPassportIssuedDateOption : '',
                indianOwnerPassportValidityDateTrans: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportValidityDate']).value,
                indianOwnerPassportValidityDateCT: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportValidityDate']).value,
                indianOwnerPassportValidityDateOptionTrans: ownerTranslatedData.indianOwnerPassportValidityDateOption ? ownerTranslatedData.indianOwnerPassportValidityDateOption : '',
                indianOwnerPassportValidityDateOptionCT: ownerTranslatedData.indianOwnerPassportValidityDateOption ? ownerTranslatedData.indianOwnerPassportValidityDateOption : '',
                indianOwnerPassportIssuedFromTrans: ownerTranslatedData.indianOwnerPassportIssuedFrom ? ownerTranslatedData.indianOwnerPassportIssuedFrom : '',
                indianOwnerPassportIssuedFromCT: ownerTranslatedData.indianOwnerPassportIssuedFrom ? ownerTranslatedData.indianOwnerPassportIssuedFrom : '',

                // Adhar Card

                indianOwnerAdharCardNoTrans: ownerTranslatedData.indianOwnerAdharCardNo ? ownerTranslatedData.indianOwnerAdharCardNo : '',
                indianOwnerAdharCardNoCT: ownerTranslatedData.indianOwnerAdharCardNo ? ownerTranslatedData.indianOwnerAdharCardNo : '',
                indianOwnerAdharCardIssuedDateTrans: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedDate']).value,
                indianOwnerAdharCardIssuedDateCT: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedDate']).value,
                indianOwnerAdharCardIssuedDateOptionTrans: ownerTranslatedData.indianOwnerAdharCardIssuedDateOption ? ownerTranslatedData.indianOwnerAdharCardIssuedDateOption : '',
                indianOwnerAdharCardIssuedDateOptionCT: ownerTranslatedData.indianOwnerAdharCardIssuedDateOption ? ownerTranslatedData.indianOwnerAdharCardIssuedDateOption : '',
                indianOwnerAdharCardIssuedFromTrans: ownerTranslatedData.indianOwnerAdharCardIssuedFrom ? ownerTranslatedData.indianOwnerAdharCardIssuedFrom : '',
                indianOwnerAdharCardIssuedFromCT: ownerTranslatedData.indianOwnerAdharCardIssuedFrom ? ownerTranslatedData.indianOwnerAdharCardIssuedFrom : '',

                //    for other than indian

                otherOwnerPassportNoTrans: ownerTranslatedData.otherOwnerPassportNo ? ownerTranslatedData.otherOwnerPassportNo : '',
                otherOwnerPassportNoCT: ownerTranslatedData.otherOwnerPassportNo ? ownerTranslatedData.otherOwnerPassportNo : '',
                otherOwnerPassportIssuedDateTrans: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDate']).value,
                otherOwnerPassportIssuedDateCT: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDate']).value,
                otherOwnerPassportIssuedDateOptionTrans: ownerTranslatedData.otherOwnerPassportIssuedDateOption ? ownerTranslatedData.otherOwnerPassportIssuedDateOption : '',
                otherOwnerPassportIssuedDateOptionCT: ownerTranslatedData.otherOwnerPassportIssuedDateOption ? ownerTranslatedData.otherOwnerPassportIssuedDateOption : '',
                otherOwnerPassportValidityDateTrans: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDate']).value,
                otherOwnerPassportValidityDateCT: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDate']).value,
                otherOwnerPassportValidityDateOptionTrans: ownerTranslatedData.otherOwnerPassportValidityDateOption ? ownerTranslatedData.otherOwnerPassportValidityDateOption : '',
                otherOwnerPassportValidityDateOptionCT: ownerTranslatedData.otherOwnerPassportValidityDateOption ? ownerTranslatedData.otherOwnerPassportValidityDateOption : '',
                otherOwnerPassportIssuedFromTrans: ownerTranslatedData.otherOwnerPassportIssuedFrom ? ownerTranslatedData.otherOwnerPassportIssuedFrom : '',
                otherOwnerPassportIssuedFromCT: ownerTranslatedData.otherOwnerPassportIssuedFrom ? ownerTranslatedData.otherOwnerPassportIssuedFrom : '',

            });
            this.spinner = false;
        }

    }

    instSubType(subType: any): string {
        switch (subType) {
            case 'PRIVATE_PUBLIC':
               return  'Private Public';
            case 'PROPRIETORSHIP':
               return  'Proprietorship';
            case 'PARTNERSHIP':
               return  'Partnership';
        }
    }
    detailsOption(subType: any): void {
        switch (subType) {
            case 'Private Public':
              this.detailOption = `Share Holder's Detail & Authorized Person`;
              break;
            case 'PRIVATE_PUBLIC':
                this.detailOption = `Share Holder's Detail & Authorized Person`;
                break;
            case 'Proprietorship':
                this.detailOption = `Proprietor's Detail`;
                break;
            case 'PROPRIETORSHIP':
                this.detailOption = `Proprietor's Detail`;
                break;
            case 'Partnership':
                this.detailOption = `Partner's Detail`;
                break;
            case 'PARTNERSHIP':
                this.detailOption = `Partner's Detail`;
                break;
            default:
                this.detailOption = undefined;
        }
    }

    setOwnerAddressSameAsPermanent(event, i) {
            if (event.target.checked === true) {
                this.getDistrictsByIdForOwnerTemp(ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value) ? null :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value.id, null, i);
                this.getMunicipalitiesByIdForOwnerTemp(ObjectUtil.isEmpty(this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value) ? null :
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value.id, null , i);

                this.userConfigForm.get(['ownerDetails', i]).patchValue({
                    //    for temporary
                    ownerTemporaryProvince: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvince']).value,
                    ownerTemporaryProvinceTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvinceTrans']).value,
                    ownerTemporaryProvinceCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentProvinceCT']).value,
                    ownerTemporaryDistrict: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrict']).value,
                    ownerTemporaryDistrictTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrictTrans']).value,
                    ownerTemporaryDistrictCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentDistrictCT']).value,
                    ownerTemporaryMunicipality: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipality']).value,
                    ownerTemporaryMunicipalityTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipalityTrans']).value,
                    ownerTemporaryMunicipalityCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentMunicipalityCT']).value,
                    ownerTemporaryWardNo: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentWardNo']).value,
                    ownerTemporaryWardNoTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentWardNoTrans']).value,
                    ownerTemporaryWardNoCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentWardNoCT']).value,
                    ownerTemporaryStreetTole: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentStreetTole']).value,
                    ownerTemporaryStreetToleTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentStreetToleTrans']).value,
                    ownerTemporaryStreetToleCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentStreetToleCT']).value,
                    ownerTemporaryAddressRadio: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentAddressRadio']).value,
                    ownerTemporaryAddressRadioTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentAddressRadioTrans']).value,
                    ownerTemporaryAddressRadioCT: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentAddressRadioCT']).value,

                });
            }
    }

    translateOwnerDetailSectionNumberField(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(String(this.userConfigForm.get([String(arrName), index, String(source)]).value));
        this.userConfigForm.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.userConfigForm.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
    }

    setRegisteredAddressSameAsCurrent(event, i) {
            if (event.target.checked === true) {
                this.userConfigForm.patchValue({
                    currentMunType: this.userConfigForm.get('registeredMunType').value,
                    currentMunTypeCT: this.userConfigForm.get('registeredMunTypeCT').value,
                    currentMunTypeTrans: this.userConfigForm.get('registeredMunTypeTrans').value,
                    currentProvince: this.userConfigForm.get('registeredProvince').value,
                    currentProvinceCT: this.userConfigForm.get('registeredProvinceCT').value,
                    currentProvinceTrans: this.userConfigForm.get('registeredProvinceTrans').value,
                    currentWard: this.userConfigForm.get('permanentWard').value,
                    currentWardCT: this.userConfigForm.get('permanentWardCT').value,
                    currentWardTrans: this.userConfigForm.get('permanentWardTrans').value,
                    currentDistrict: this.userConfigForm.get('registeredDistrict').value,
                    currentDistrictCT: this.userConfigForm.get('registeredDistrictCT').value,
                    currentDistrictTrans: this.userConfigForm.get('registeredDistrictTrans').value,
                    currentMunicipality: this.userConfigForm.get('registeredMunicipality').value,
                    currentMunicipalityCT: this.userConfigForm.get('registeredMunicipalityCT').value,
                    currentMunicipalityTrans: this.userConfigForm.get('registeredMunicipalityTrans').value,
                    currentStreetTole: this.userConfigForm.get('registeredStreetTole').value,
                    currentStreetToleTrans: this.userConfigForm.get('registeredStreetToleTrans').value,
                    currentStreetToleCT: this.userConfigForm.get('registeredStreetToleCT').value,
                });
            }
    }

    setActDateValue() {

        console.log(this.userConfigForm.get('actYear').value);
        console.log('ok');
    }

    openCloseTemplate(template) {
        this.modalService.open(template);
    }

    dismiss(template) {
        this.modalService.dismissAll();
    }

    decline(template) {
        this.modalService.dismissAll();
    }

    accept() {
        this.modalService.dismissAll();
        this.dialogRef.close();
    }

}

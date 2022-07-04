/* tslint:disable:max-line-length no-unused-expression */
import {Component, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewChecked, ChangeDetectorRef} from '@angular/core';
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
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-cad-offer-letter-configuration',
    templateUrl: './cad-offer-letter-configuration.component.html',
    styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit, AfterViewChecked {

    @Input() customerType;
    @Input() customerSubType;
    @Input() jointCustomerNum: Number;
    @Input() institutionSubType;
    @Input() customerInfo: CustomerInfoData;
    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    @Input() guarantorDetail: GuarantorDetail;
    @Input() loanHolder: CustomerInfoData;
    @Input() oneFormCustomer: OneFormCustomerDto;
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
    saveDisable = false;
    ownerPermanentDistricts = [];
    ownerPermanentMunicipality = [];
    ownerTemporaryDistricts = [];
    ownerTemporaryMunicipality = [];
    guarantorRegisteredProvienceList = [];
    guarantorRegisteredDistricts = [];
    guarantorRegisteredMunicipality = [];
    guarantorCurrentProvienceList = [];
    guarantorCurrentMunicipality = [];
    guarantorCurrentDistricts = [];
    institutionalActYear: any;
    headingSubType: any;
    detailOption: any;
    translatedFormGroup: FormGroup;
    guarantorTranslatedFormGroup: FormGroup;
    shareHolderArray: Array<any> = new Array<any>();
    jointCustomerArray: Array<any> = new Array<any>();
    custId: any;
    fetchedCustomerDetails: any;

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
                private modalService: NgbModal,
                private readonly changeDetectorRef: ChangeDetectorRef,
                private spinnerService: NgxSpinnerService
    ) {
    }

    ngAfterViewChecked(): void {
        if (!this.changeDetectorRef['destroyed']) {
            this.changeDetectorRef.detectChanges();
        }
    }

    get configForm() {
        return this.userConfigForm.controls;
    }

    get form() {
        return this.userConfigForm.controls;
    }

    ngOnInit() {
        this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
            this.branchList = response.detail;
            this.branchList.sort((a, b) => a.name.localeCompare(b.name));
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
        });
        if (this.actionType !== 'Edit') {
            this.detailsOption(this.institutionSubType);
        } else if (!ObjectUtil.isEmpty(this.loanHolder)) {
            this.detailsOption(this.loanHolder.customerSubType);
        }
        if (this.actionType === 'Edit') {
            if (!ObjectUtil.isEmpty(this.loanHolder)) {
                this.headingSubType = CustomerSubType[this.loanHolder.customerSubType];
            } else {
                this.headingSubType = '';
            }
        } else if (this.customerType === CustomerType.INDIVIDUAL) {
            this.headingSubType = this.customerSubType;
        } else {
            this.headingSubType = this.institutionSubType;
        }
        if (this.activeLoanTab) {
            this.responseData = this.loanHolder;
        }
        this.addressService.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.tempProvinceList = response.detail;
                this.tempGuarantorProvinceList = response.detail;
                this.guarantorProvienceList = response.detail;
                this.guarantorRegisteredProvienceList = response.detail;
                this.guarantorCurrentProvienceList = response.detail;
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
        if (!ObjectUtil.isEmpty(this.oneFormCustomer) &&
        !ObjectUtil.isEmpty(this.oneFormCustomer.jointInfo)) {
            let tempJson = [];
            tempJson = JSON.parse(this.oneFormCustomer.jointInfo);
            if (tempJson.length > 1) {
                for (let i = 1; i < tempJson.length; i ++) {
                    this.jointCustomerArray.push(tempJson[i]);
                }
            }
            if (!ObjectUtil.isEmpty(this.jointCustomerArray)) {
                this.setJointCustomerDetails(this.jointCustomerArray);
            }
        }


        if (!ObjectUtil.isEmpty(this.loanHolder.guarantors) && !ObjectUtil.isEmpty(this.loanHolder.guarantors.guarantorList)) {
            this.setGuarantors(this.loanHolder.guarantors.guarantorList);
        } else {
            this.addGuarantor();
        }

        this.translateObjectValue();
        this.userConfigForm.get('clientType').patchValue(this.customerType);

        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer)) {
            if (!ObjectUtil.isEmpty(this.loanHolder.nepData)) {
                this.nepData = (JSON.parse(this.loanHolder.nepData));
            }
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
            registrationDateNepali: [undefined],
            registrationDateNepaliCT: [undefined],
            registrationDateNepaliTrans: [undefined],
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
            dobNepali: [undefined],
            dobNepaliTrans: [undefined],
            dobNepaliCT: [undefined],
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
            citizenshipIssueDateNepali: [undefined],
            citizenshipIssueDateNepaliCT: [undefined],
            citizenshipIssueDateNepaliTrans: [undefined],
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
                if (controls[name].invalid) {
                    invalidControls.push(this.titleCasePipe.transform(name).replace('ct', '').replace('trans', ''));
                }
            }
        }
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
        /*if (this.loanHolder.customerType === CustomerType.INSTITUTION) {
            if (this.userConfigForm.get('registrationDateOption').value === 'AD') {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value);
            } else {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
            }
        }
        if (this.loanHolder.customerType === CustomerType.INSTITUTION && this.actionType === 'Edit') {
            if (this.userConfigForm.get('registrationDateOption').value === 'AD') {
                if (JSON.parse(this.loanHolder.nepData).registrationDateOption.en === 'BS') {
                    this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
                } else {
                    this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value);
                }
            } else {
                this.oneFormCustomer.establishmentDate = new Date(this.userConfigForm.get('registrationDate').value.eDate);
            }
        }*/
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
                this.oneFormCustomer.dob = this.userConfigForm.get('dob').value ? this.userConfigForm.get('dob').value : undefined;
            } else {
                this.oneFormCustomer.dob = this.userConfigForm.get('dobNepali').value &&
                this.userConfigForm.get('dobNepali').value.eDate ? new Date(this.userConfigForm.get('dobNepali').value.eDate) : undefined;
            }
            const issuedDate = this.userConfigForm.get('issuedDate').value;
            if (issuedDate === 'AD') {
                this.oneFormCustomer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDate').value ? this.userConfigForm.get('citizenshipIssueDate').value : undefined;
            } else {
                this.oneFormCustomer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDateNepali').value &&
                    this.userConfigForm.get('citizenshipIssueDateNepali').value.eDate ? new Date(this.userConfigForm.get('citizenshipIssueDateNepali').value.eDate) : undefined;
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
                    // this.setGuarantorsDetailsCTValueIfNotTranslated();
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

        if (this.customerSubType === CustomerSubType.JOINT) {
            this.setIndividualJointCustomerNepData();
        }
        // to map individual joint customer nepData according to jointCustomer CT value

        this.userConfigForm.get('guarantorDetails').value.forEach((value, index) => {
            const issueDateType = this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value ?
                this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value : '';
            if (issueDateType === 'AD') {
                this.userConfigForm.value.guarantorDetails[index].citizenIssuedDate = this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value : '';
            } else if (issueDateType === 'BS') {
                const issueDate = !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value.eDate) ?
                    this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value.eDate : '';
                this.userConfigForm.value.guarantorDetails[index].citizenIssuedDateNepali = issueDate;
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
       /* data.guarantorDetails.forEach((value, index) => {
            const issueDateType = value.radioCitizenIssuedDate;
            if (issueDateType === 'BS') {
                const issueDate = value.citizenIssuedDate.eDate;
                data.guarantorDetails[index].citizenIssuedDate = new Date(issueDate);
            }
        });*/
        this.cadOneformService.saveCustomer(data).subscribe(res => {
            this.spinner = false;
            if (this.hideLoan === true) {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Edited Customer'));
                this.closeModal();
                return;
            }
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer'));
            this.saveDisable = false;
            this.customerId = res.detail.customerInfoId;
            this.responseData = res.detail;
            this.activeCustomerTab = false;
            this.activeLoanTab = true;
            this.activeTemplateDataTab = false;
        }, res => {
            this.spinner = false;
            this.saveDisable = false;
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
            nepData.relationMedium ? nepData.relationMedium.ct = this.userConfigForm.get(['guarantorDetails', index, 'relationMediumCT']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.ct = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).value : '';
            nepData.gender ? nepData.gender.ct = this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).value : '';
            nepData.fatherName ? nepData.fatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).value : '';
            nepData.husbandName ? nepData.husbandName.ct = this.userConfigForm.get(['guarantorDetails', index, 'husbandNameCT']).value : '';
            nepData.fatherInLawName ? nepData.fatherInLawName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameCT']).value : '';

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

            nepData.guarantorName ? nepData.guarantorName.ct = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.ct = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).value : '';

            nepData.relationship ? nepData.relationship.ct = this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).value : '';
            nepData.relationMedium ? nepData.relationMedium.ct = this.userConfigForm.get(['guarantorDetails', index, 'relationMediumCT']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.ct = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).value : '';
            nepData.gender ? nepData.gender.ct = this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).value : '';
            nepData.fatherName ? nepData.fatherName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).value : '';
            nepData.husbandName ? nepData.husbandName.ct = this.userConfigForm.get(['guarantorDetails', index, 'husbandNameCT']).value : '';
            nepData.fatherInLawName ? nepData.fatherInLawName.ct = this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameCT']).value : '';

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
            nepData.relationMedium ? nepData.relationMedium.en = this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.en = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumber']).value : '';
            nepData.gender ? nepData.gender.en = this.userConfigForm.get(['guarantorDetails', index, 'gender']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.en = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherName']).value : '';
            nepData.fatherName ? nepData.fatherName.en = this.userConfigForm.get(['guarantorDetails', index, 'fatherName']).value : '';
            nepData.husbandName ? nepData.husbandName.en = this.userConfigForm.get(['guarantorDetails', index, 'husbandName']).value : '';
            nepData.fatherInLawName ? nepData.fatherInLawName.en = this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawName']).value : '';

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
            nepData.radioCitizenIssuedDate ? nepData.radioCitizenIssuedDate =  this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value : '';

            // test-------

            if (this.actionType === 'Edit' && this.customerType === CustomerType.INDIVIDUAL) {
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                    nepData['radioCitizenIssuedDate'] = this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value,
                    nepData['citizenIssuedDateNepali'] = {
                        en: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value,
                        np: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepaliTrans']).value,
                        ct: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepaliCT']).value,
                    };
                nepData['citizenIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Passport' && this.actionType === 'Edit' &&
            this.customerType === CustomerType.INSTITUTION) {
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                };
                nepData['passportNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportNoCT']).value,
                };
                nepData['passportIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDateCT']).value,
                };
                nepData['passportValidityDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDateCT']).value,
                };
                nepData['passportIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFromCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Adhar Card' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                };
                nepData['adharCardNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNoCT']).value,
                };
                nepData['adharCardIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDateCT']).value,
                };
                nepData['adharCardIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFromCT']).value,
                };

            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorType'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTypeTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTypeCT']).value,
                };

            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'authorizedPersonName']).value && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['authorizedPersonName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'authorizedPersonName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'authorizedPersonNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'authorizedPersonNameCT']).value,
                };

            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Embassy Certificate' &&
                this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION) {
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                };
                nepData['embassyNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoCT']).value,
                };
                nepData['embassyIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateCT']).value,
                };
                nepData['embassyIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value === 'Embassy Certificate' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['indianGuarantorDetailOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOptionCT']).value,
                };
                nepData['embassyNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyNoCT']).value,
                };
                nepData['embassyIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDateCT']).value,
                };
                nepData['embassyIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFromCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value === 'Other' &&
                this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                nepData['otherGuarantorPassportIssuedDateOption'] = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateOption']).value,
                nepData['otherGuarantorPassportValidityDateOption'] = this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateOption']).value,
                nepData['otherGuarantorPassportNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoCT']).value,
                };
                nepData['otherGuarantorPassportIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateCT']).value,
                };
                nepData['otherGuarantorPassportValidityDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateCT']).value,
                };
                nepData['otherGuarantorPassportIssuedFrom'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFrom']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFromTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedFromCT']).value,
                };
                nepData['otherGuarantorPassportIssuedDateNepali'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepali']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepaliTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepaliCT']).value,
                };
                nepData['otherGuarantorPassportValidityDateNepali'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepali']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepaliTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepaliCT']).value,
                };
            }

            if (this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION) {
                nepData['authorizedDobDateType'] = this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobDateType']).value,
                    nepData['authorizedDobNepali'] = {
                        en: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepali']).value,
                        np: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepaliTrans']).value,
                        ct: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepaliCT']).value,
                    };
                nepData['authorizedDob'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDob']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobCT']).value,
                };
                nepData['gender'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'gender']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'gender']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'gender']).value,
                };
                nepData['guarantorMaritalStatus'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatus']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusCT']).value,
                };
                nepData['relationMedium'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'relationMediumTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'relationMediumCT']).value,
                };
                nepData['husbandName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'husbandName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'husbandNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'husbandNameCT']).value,
                };
                nepData['fatherInLawName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameCT']).value,
                };
                nepData['grandFatherName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'grandFatherName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).value,
                };
                nepData['fatherName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'fatherName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value === 'Nepali' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                nepData['radioCitizenIssuedDate'] = this.userConfigForm.get(['guarantorDetails', index, 'radioCitizenIssuedDate']).value,
                nepData['citizenIssuedDateNepali'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepaliTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepaliCT']).value,
                };
                nepData['citizenIssuedDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateCT']).value,
                };
                nepData['otherGuarantorPassportNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNoCT']).value,
                };
                nepData['permanentProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value,
                };
                nepData['permanentDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value,
                };
                nepData['permanentMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value,
                };
                nepData['permanentWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value,
                };

                nepData['temporaryProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value,
                };
                nepData['temporaryDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value,
                };
                nepData['temporaryMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value,
                };
                nepData['temporaryWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value,
                };

                nepData['isSameTemporaryAndPermanent'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanent']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentCT']).value,
                };

                nepData['permanentStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).value,
                };

                nepData['temporaryStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).value,
                };

                nepData['guarantorPermanentMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                };

                nepData['guarantorTemporaryMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                };
                // guarantorIssuedDistrict: [undefined],
                //     guarantorIssuedDistrictTrans: [undefined],
                //     guarantorIssuedDistrictCT: [undefined],
                //     guarantorPanNo: [undefined],
                //     guarantorPanNoTrans: [undefined],
                //     guarantorPanNoCT: [undefined],
            }

            if (this.customerType === CustomerType.INSTITUTION && this.actionType === 'Edit') {
                nepData['guarantorIssuedDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrictCT']).value,
                };

                nepData['guarantorPanNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPanNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPanNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPanNoCT']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value === 'Foreign' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorForeignAddressOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionCT']).value,
                };
                nepData['guarantorOtherAddress'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddress']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressCT']).value,
                };

            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTemp']).value === 'Foreign' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorForeignAddressOptionTemp'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTemp']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTempTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTempCT']).value,
                };
                nepData['guarantorOtherAddressTemp'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTemp']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTempTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTempCT']).value,
                };

            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guaranteeProviderName']).value &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guaranteeProviderName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guaranteeProviderName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guaranteeProviderNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guaranteeProviderNameCT']).value,
                };
            }
            if (this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorName']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorName']).value : '',
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).value : '',
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).value : '',
                };
                nepData['relationship'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'relationship']).value : '',
                    np: this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).value : '',
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).value : '',
                };
                nepData['issuedPlace'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'issuedPlace']).value : '',
                    np: this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).value : '',
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).value ?
                        this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).value : '',
                };
                nepData['guarantorNationality'] = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value : '';
                nepData['detailsEntered'] = this.userConfigForm.get(['guarantorDetails', index, 'detailsEntered']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'detailsEntered']).value : '';
                nepData['detailsFrom'] = this.userConfigForm.get(['guarantorDetails', index, 'detailsFrom']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'detailsFrom']).value : '';
            }
            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value === 'Local' &&
                this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorForeignAddressOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionCT']).value,
                };
                nepData['permanentProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceCT']).value,
                };
                nepData['permanentDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictCT']).value,
                };
                nepData['permanentMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityCT']).value,
                };
                nepData['permanentWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).value,
                };

                nepData['isSameTemporaryAndPermanent'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanent']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentCT']).value,
                };

                nepData['permanentStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetToleCT']).value,
                };

                nepData['guarantorPermanentMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPermanentMunicipalityOrVdc']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTemp']).value === 'Local' &&
                this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorForeignAddressOptionTemp'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTemp']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTempTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOptionTempCT']).value,
                };
                nepData['temporaryProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceCT']).value,
                };
                nepData['temporaryDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictCT']).value,
                };
                nepData['temporaryMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityCT']).value,
                };
                nepData['temporaryWard'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWard']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).value,
                };

                nepData['isSameTemporaryAndPermanent'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanent']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameTemporaryAndPermanentCT']).value,
                };

                nepData['temporaryStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetToleCT']).value,
                };

                nepData['guarantorTemporaryMunicipalityOrVdc'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorTemporaryMunicipalityOrVdc']).value,
                };
            }

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value === 'Corporate Guarantor' ||
                this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value === 'Cross Guarantor' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorActName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActNameCT']).value,
                };

                nepData['guarantorActYear'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearCT']).value,
                };

                nepData['guarantorActYearOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearOptionCT']).value,
                };

                nepData['guarantorAuthorizedBodyName'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorAuthorizedBodyName']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorAuthorizedBodyNameTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorAuthorizedBodyNameCT']).value,
                };

                nepData['guarantorRegisteredWith'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWith']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWithTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWithCT']).value,
                };

                nepData['guarantorRegistrationNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationNoCT']).value,
                };

                nepData['guarantorRegistrationDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateCT']).value,
                };

                nepData['guarantorRegistrationDateNepali'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepali']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepaliTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepaliCT']).value,
                };

                nepData['guarantorRegistrationDateOption'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateOption']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateOptionTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateOptionCT']).value,
                };
            }

            /*if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateOption']).value === 'AD' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION && nepData.guarantorRegistrationDateOption.ct === 'BS') {
                nepData['guarantorRegistrationDate'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value.eDate,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value.nDate,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value.nDate,
                };
            }*/

            if (this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearOption']).value === 'AD' && this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION && nepData.guarantorActYearOption.ct === 'BS' &&
                this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value !== 'Personal Guarantor') {
                nepData['guarantorActYear'] = {
                    en: !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value) &&
                        !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.eDate) ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.eDate : '',
                    np: !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value) &&
                    !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.nDate) ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.nDate : '',
                    ct: !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value) &&
                    !ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.nDate) ?
                        this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value.nDate : '',
                };
            }

            if (this.actionType === 'Edit' && this.customerType === CustomerType.INSTITUTION &&
                this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value === 'Personal Guarantor') {
                nepData['guarantorMaritalStatus'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatus']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusCT']).value,
                };
            }

            if (this.actionType === 'Edit' &&
                this.customerType === CustomerType.INSTITUTION) {
                nepData['guarantorRegisteredType'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredType']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeCT']).value,
                };

                nepData['guarantorRegisteredProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvinceCT']).value,
                };

                nepData['guarantorRegisteredDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictCT']).value,
                };

                nepData['guarantorRegisteredMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityCT']).value,
                };

                nepData['guarantorRegisteredWardNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoCT']).value,
                };

                nepData['guarantorRegisteredStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleCT']).value,
                };

                nepData['guarantorCurrentType'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentType']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentTypeTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentTypeCT']).value,
                };

                nepData['guarantorCurrentProvince'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvince']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvinceTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvinceCT']).value,
                };

                nepData['guarantorCurrentDistrict'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrict']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrictTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrictCT']).value,
                };

                nepData['guarantorCurrentMunicipality'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipality']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipalityTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipalityCT']).value,
                };

                nepData['guarantorCurrentWardNo'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentWardNo']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentWardNoTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentWardNoCT']).value,
                };

                nepData['guarantorCurrentStreetTole'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentStreetTole']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentStreetToleTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentStreetToleCT']).value,
                };

                nepData['isSameGuarantorRegisteredAndCurrentAddress'] = {
                    en: this.userConfigForm.get(['guarantorDetails', index, 'isSameGuarantorRegisteredAndCurrentAddress']).value,
                    np: this.userConfigForm.get(['guarantorDetails', index, 'isSameGuarantorRegisteredAndCurrentAddressTrans']).value,
                    ct: this.userConfigForm.get(['guarantorDetails', index, 'isSameGuarantorRegisteredAndCurrentAddressCT']).value,
                };



            }
            // test----end

            // translated data
            nepData.guarantorName ? nepData.guarantorName.np = this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).value : '';
            nepData.issuedPlace ? nepData.issuedPlace.np = this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).value : '';

            nepData.relationship ? nepData.relationship.np = this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).value : '';
            nepData.relationMedium ? nepData.relationMedium.np = this.userConfigForm.get(['guarantorDetails', index, 'relationMediumTrans']).value : '';
            nepData.citizenNumber ? nepData.citizenNumber.np = this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberTrans']).value : '';
            nepData.gender ? nepData.gender.np = this.userConfigForm.get(['guarantorDetails', index, 'genderTrans']).value : '';
            nepData.grandFatherName ? nepData.grandFatherName.np = this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).value : '';
            nepData.fatherName ? nepData.fatherName.np = this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).value : '';
            nepData.husbandName ? nepData.husbandName.np = this.userConfigForm.get(['guarantorDetails', index, 'husbandNameTrans']).value : '';
            nepData.fatherInLawName ? nepData.fatherInLawName.np = this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameTrans']).value : '';

            nepData.permanentDistrict ? nepData.permanentDistrict.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrictTrans']).value : '';
            nepData.permanentProvince ? nepData.permanentProvince.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentProvinceTrans']).value : '';
            nepData.gurantedAmount ? nepData.gurantedAmount.np = this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).value : '';

            nepData.permanentMunicipality ? nepData.permanentMunicipality.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipalityTrans']).value : '';
            nepData.permanentWard ? nepData.permanentWard.np = this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).value : '';
            nepData.temporaryProvince ? nepData.temporaryProvince.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvinceTrans']).value : '';

            nepData.temporaryDistrict ? nepData.temporaryDistrict.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrictTrans']).value : '';
            nepData.temporaryMunicipality ? nepData.temporaryMunicipality.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipalityTrans']).value : '';
            nepData.temporaryWard ? nepData.temporaryWard.np = this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).value : '';

            nepData.guarantorMaritalStatus ? nepData.guarantorMaritalStatus.np = this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusTrans']).value : '';


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
            relationMediumTrans: [undefined],
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
            citizenIssuedDateNepali: [undefined],
            citizenIssuedDateNepaliTrans: [undefined],
            citizenIssuedDateNepaliCT: [undefined],
            authorizedDobDateType: [undefined],
            authorizedDobDateTypeTrans: [undefined],
            authorizedDobDateTypeCT: [undefined],
            authorizedDobNepali: [undefined],
            authorizedDobNepaliTrans: [undefined],
            authorizedDobNepaliCT: [undefined],
            authorizedDob: [undefined],
            authorizedDobTrans: [undefined],
            authorizedDobCT: [undefined],

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

            // passport detail
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

            // adhar card detail
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
            otherGuarantorPassportIssuedDateNepali: [undefined],
            otherGuarantorPassportIssuedDateNepaliTrans: [undefined],
            otherGuarantorPassportIssuedDateNepaliCT: [undefined],
            otherGuarantorPassportValidityDateNepali: [undefined],
            otherGuarantorPassportValidityDateNepaliTrans: [undefined],
            otherGuarantorPassportValidityDateNepaliCT: [undefined],

            otherGuarantorPassportIssuedDateOption: [undefined],
            otherGuarantorPassportIssuedDateOptionTrans: [undefined],
            otherGuarantorPassportIssuedDateOptionCT: [undefined],
            otherGuarantorPassportValidityDateOption: [undefined],
            otherGuarantorPassportValidityDateOptionCT: [undefined],
            otherGuarantorPassportValidityDateOptionTrans: [undefined],

            // Guarantors flag

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

            guarantorForeignAddressOptionTemp: [undefined],
            guarantorForeignAddressOptionTempTrans: [undefined],
            guarantorForeignAddressOptionTempCT : [undefined],

            guarantorOtherAddress: [undefined],
            guarantorOtherAddressTrans: [undefined],
            guarantorOtherAddressCT: [undefined],

            guarantorOtherAddressTemp: [undefined],
            guarantorOtherAddressTempTrans: [undefined],
            guarantorOtherAddressTempCT: [undefined],

            // only for Institutional customer--ends

            guarantorType: [undefined],
            guarantorTypeTrans: [undefined],
            guarantorTypeCT: [undefined],
            authorizedPersonName: [undefined],
            authorizedPersonNameTrans: [undefined],
            authorizedPersonNameCT: [undefined],
            guaranteeProviderName: [undefined],
            guaranteeProviderNameTrans: [undefined],
            guaranteeProviderNameCT: [undefined],

            // Only for corporate and cross guarantor

            guarantorActName: [undefined],
            guarantorActNameTrans: [undefined],
            guarantorActNameCT: [undefined],
            guarantorActYear: [undefined],
            guarantorActYearTrans: [undefined],
            guarantorActYearCT: [undefined],
            guarantorActYearOption: [undefined],
            guarantorActYearOptionTrans: [undefined],
            guarantorActYearOptionCT: [undefined],
            guarantorAuthorizedBodyName: [undefined],
            guarantorAuthorizedBodyNameTrans: [undefined],
            guarantorAuthorizedBodyNameCT: [undefined],
            guarantorRegisteredWith: [undefined],
            guarantorRegisteredWithTrans: [undefined],
            guarantorRegisteredWithCT: [undefined],
            guarantorRegistrationNo: [undefined],
            guarantorRegistrationNoTrans: [undefined],
            guarantorRegistrationNoCT: [undefined],
            guarantorRegistrationDate: [undefined],
            guarantorRegistrationDateTrans: [undefined],
            guarantorRegistrationDateCT: [undefined],
            guarantorRegistrationDateOption: [undefined],
            guarantorRegistrationDateOptionTrans: [undefined],
            guarantorRegistrationDateOptionCT: [undefined],
            guarantorRegistrationDateNepali: [undefined],
            guarantorRegistrationDateNepaliTrans: [undefined],
            guarantorRegistrationDateNepaliCT: [undefined],

            guarantorIssuedDistrict: [undefined],
            guarantorIssuedDistrictTrans: [undefined],
            guarantorIssuedDistrictCT: [undefined],
            guarantorPanNo: [undefined],
            guarantorPanNoTrans: [undefined],
            guarantorPanNoCT: [undefined],

            // Registered Address

            guarantorRegisteredType: [undefined],
            guarantorRegisteredTypeTrans: [undefined],
            guarantorRegisteredTypeCT: [undefined],

            guarantorRegisteredProvince: [undefined],
            guarantorRegisteredProvinceTrans: [undefined],
            guarantorRegisteredProvinceCT: [undefined],

            guarantorRegisteredDistrict: [undefined],
            guarantorRegisteredDistrictTrans: [undefined],
            guarantorRegisteredDistrictCT: [undefined],

            guarantorRegisteredMunicipality: [undefined],
            guarantorRegisteredMunicipalityTrans: [undefined],
            guarantorRegisteredMunicipalityCT: [undefined],
            guarantorRegisteredWardNo: [undefined],
            guarantorRegisteredWardNoTrans: [undefined],
            guarantorRegisteredWardNoCT: [undefined],
            guarantorRegisteredStreetTole: [undefined],
            guarantorRegisteredStreetToleTrans: [undefined],
            guarantorRegisteredStreetToleCT: [undefined],

            // Current Address

            guarantorCurrentType: [undefined],
            guarantorCurrentTypeTrans: [undefined],
            guarantorCurrentTypeCT: [undefined],

            guarantorCurrentProvince: [undefined],
            guarantorCurrentProvinceTrans: [undefined],
            guarantorCurrentProvinceCT: [undefined],

            guarantorCurrentDistrict: [undefined],
            guarantorCurrentDistrictTrans: [undefined],
            guarantorCurrentDistrictCT: [undefined],

            guarantorCurrentMunicipality: [undefined],
            guarantorCurrentMunicipalityTrans: [undefined],
            guarantorCurrentMunicipalityCT: [undefined],
            guarantorCurrentWardNo: [undefined],
            guarantorCurrentWardNoTrans: [undefined],
            guarantorCurrentWardNoCT: [undefined],
            guarantorCurrentStreetTole: [undefined],
            guarantorCurrentStreetToleTrans: [undefined],
            guarantorCurrentStreetToleCT: [undefined],

            isSameGuarantorRegisteredAndCurrentAddress: [undefined],
            isSameGuarantorRegisteredAndCurrentAddressTrans: [undefined],
            isSameGuarantorRegisteredAndCurrentAddressCT: [undefined],

            guarantorMaritalStatus: [undefined],
            guarantorMaritalStatusCT: [undefined],
            guarantorMaritalStatusTrans: [undefined],

            detailsEntered: [undefined],
            detailsFrom: [undefined],

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

            /*let citizenIssuedDate: any;
            if (!ObjectUtil.isEmpty(nepaData.radioCitizenIssuedDate) && nepaData.radioCitizenIssuedDate.en === 'BS') {
                citizenIssuedDate = nepaData.citizenIssuedDate.en.eDate;
            } else {
                if (!ObjectUtil.isEmpty(nepaData.radioCitizenIssuedDate)) {
                    citizenIssuedDate = nepaData.citizenIssuedDate.en;
                } else {
                    citizenIssuedDate = undefined;
                }
            }*/

            if (!ObjectUtil.isEmpty(nepaData.guarantorType)) {
                if (nepaData.guarantorType.en !== 'Personal Guarantor') {
                    this.getDistrictsByIdForCurrentGuarantorAddress(ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince) ? null :
                        nepaData.guarantorCurrentProvince.en.id, null, i);
                    this.getMunicipalitiesByIdForCurrentGuarantorAddress(ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict) ? null :
                        nepaData.guarantorCurrentDistrict.en.id, null, i);
                    this.getDistrictsByIdForRegisteredGuarantorAddress(ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince) ? null :
                        nepaData.guarantorRegisteredProvince.en.id, null, i);
                    this.getMunicipalitiesByIdForRegisteredGuarantorAddress(ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict) ? null :
                        nepaData.guarantorRegisteredDistrict.en.id, null, i);
                }
            }

            formArray.push(this.formBuilder.group({
                guarantorName: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.en],
                guarantorNameTrans: [(!ObjectUtil.isEmpty(nepaData.guarantorName) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorName.np)) ? nepaData.guarantorName.np : undefined],
                guarantorNameCT: [(!ObjectUtil.isEmpty(nepaData.guarantorName) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorName.ct)) ? nepaData.guarantorName.ct : undefined],
                citizenNumberTrans: [(!ObjectUtil.isEmpty(nepaData.citizenNumber) &&
                    !ObjectUtil.isEmpty(nepaData.citizenNumber.np)) ? nepaData.citizenNumber.np : undefined],
                issuedPlace: [(!ObjectUtil.isEmpty(nepaData.issuedPlace) &&
                    !ObjectUtil.isEmpty(nepaData.issuedPlace.en)) ? nepaData.issuedPlace.en : undefined],
                issuedPlaceTrans: [(!ObjectUtil.isEmpty(nepaData.issuedPlace) &&
                    !ObjectUtil.isEmpty(nepaData.issuedPlace.np)) ? nepaData.issuedPlace.np : undefined],
                issuedPlaceCT: [(!ObjectUtil.isEmpty(nepaData.issuedPlace) &&
                    !ObjectUtil.isEmpty(nepaData.issuedPlace.ct)) ? nepaData.issuedPlace.ct : undefined],
                genderCT: [(!ObjectUtil.isEmpty(nepaData.gender) &&
                    !ObjectUtil.isEmpty(nepaData.gender.ct)) ? nepaData.gender.ct : undefined],
                gender: [(!ObjectUtil.isEmpty(nepaData.gender) &&
                    !ObjectUtil.isEmpty(nepaData.gender.en)) ? nepaData.gender.en : undefined],
                genderTrans: [(!ObjectUtil.isEmpty(nepaData.gender) &&
                    !ObjectUtil.isEmpty(nepaData.gender.np)) ? nepaData.gender.np : undefined],
                relationMediumCT: [(!ObjectUtil.isEmpty(nepaData.relationMedium) &&
                    !ObjectUtil.isEmpty(nepaData.relationMedium.ct)) ? nepaData.relationMedium.ct : undefined],
                relationMedium: [(!ObjectUtil.isEmpty(nepaData.relationMedium) &&
                    !ObjectUtil.isEmpty(nepaData.relationMedium.en)) ? nepaData.relationMedium.en : undefined],
                relationMediumTrans: [(!ObjectUtil.isEmpty(nepaData.relationMedium) &&
                    !ObjectUtil.isEmpty(nepaData.relationMedium.np)) ? nepaData.relationMedium.np : undefined],
                husbandNameCT: [(!ObjectUtil.isEmpty(nepaData.husbandName) &&
                    !ObjectUtil.isEmpty(nepaData.husbandName.ct)) ? nepaData.husbandName.ct : undefined],
                husbandName: [(!ObjectUtil.isEmpty(nepaData.husbandName) &&
                    !ObjectUtil.isEmpty(nepaData.husbandName.en)) ? nepaData.husbandName.en : undefined],
                husbandNameTrans: [(!ObjectUtil.isEmpty(nepaData.husbandName) &&
                    !ObjectUtil.isEmpty(nepaData.husbandName.np)) ? nepaData.husbandName.np : undefined],

                fatherInLawNameCT: [(!ObjectUtil.isEmpty(nepaData.fatherInLawName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherInLawName.ct)) ? nepaData.fatherInLawName.ct : undefined],
                fatherInLawName: [(!ObjectUtil.isEmpty(nepaData.fatherInLawName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherInLawName.en)) ? nepaData.fatherInLawName.en : undefined],
                fatherInLawNameTrans: [(!ObjectUtil.isEmpty(nepaData.fatherInLawName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherInLawName.np)) ? nepaData.fatherInLawName.np : undefined],

                grandFatherNameCT: [(!ObjectUtil.isEmpty(nepaData.grandFatherName) &&
                    !ObjectUtil.isEmpty(nepaData.grandFatherName.ct)) ? nepaData.grandFatherName.ct : undefined],
                grandFatherName: [(!ObjectUtil.isEmpty(nepaData.grandFatherName) &&
                    !ObjectUtil.isEmpty(nepaData.grandFatherName.en)) ? nepaData.grandFatherName.en : undefined],
                grandFatherNameTrans: [(!ObjectUtil.isEmpty(nepaData.grandFatherName) &&
                    !ObjectUtil.isEmpty(nepaData.grandFatherName.np)) ? nepaData.grandFatherName.np : undefined],

                fatherNameCT: [(!ObjectUtil.isEmpty(nepaData.fatherName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherName.ct)) ? nepaData.fatherName.ct : undefined],
                fatherName: [(!ObjectUtil.isEmpty(nepaData.fatherName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherName.en)) ? nepaData.fatherName.en : undefined],
                fatherNameTrans: [(!ObjectUtil.isEmpty(nepaData.fatherName) &&
                    !ObjectUtil.isEmpty(nepaData.fatherName.np)) ? nepaData.fatherName.np : undefined],

                relationship: [(!ObjectUtil.isEmpty(nepaData.relationship) &&
                    !ObjectUtil.isEmpty(nepaData.relationship.en)) ? nepaData.relationship.en : undefined],
                relationshipCT: [(!ObjectUtil.isEmpty(nepaData.relationship) &&
                    !ObjectUtil.isEmpty(nepaData.relationship.ct)) ? nepaData.relationship.ct : undefined],
                relationshipTrans: [(!ObjectUtil.isEmpty(nepaData.relationship) &&
                    !ObjectUtil.isEmpty(nepaData.relationship.np)) ? nepaData.relationship.np : undefined],
                citizenNumber: [value.citizenNumber ? value.citizenNumber : undefined],
                citizenNumberCT: [(!ObjectUtil.isEmpty(nepaData.citizenNumber) &&
                    !ObjectUtil.isEmpty(nepaData.citizenNumber.ct)) ? nepaData.citizenNumber.ct : undefined],
                gurantedAmount: [(!ObjectUtil.isEmpty(nepaData.gurantedAmount) &&
                    !ObjectUtil.isEmpty(nepaData.gurantedAmount.en)) ? nepaData.gurantedAmount.en : undefined],
                gurantedAmountCT: [(!ObjectUtil.isEmpty(nepaData.gurantedAmount) &&
                    !ObjectUtil.isEmpty(nepaData.gurantedAmount.ct)) ? nepaData.gurantedAmount.ct : undefined],
                gurantedAmountTrans: [(!ObjectUtil.isEmpty(nepaData.gurantedAmount) &&
                    !ObjectUtil.isEmpty(nepaData.gurantedAmount.ct)) ? nepaData.gurantedAmount.ct : undefined],

                permanentProvince: [!ObjectUtil.isEmpty(value.province) ? value.province : undefined],
                permanentProvinceCT: [(!ObjectUtil.isEmpty(nepaData.permanentProvince) &&
                    !ObjectUtil.isEmpty(nepaData.permanentProvince.ct)) ? nepaData.permanentProvince.ct : undefined],
                permanentProvinceTrans: [(!ObjectUtil.isEmpty(nepaData.permanentProvince) &&
                    !ObjectUtil.isEmpty(nepaData.permanentProvince.en) &&
                    !ObjectUtil.isEmpty(nepaData.permanentProvince.en.nepaliName)) ? nepaData.permanentProvince.en.nepaliName : undefined],
                permanentDistrict: [ObjectUtil.isEmpty(value.district) ? undefined : value.district],
                permanentDistrictCT: [(!ObjectUtil.isEmpty(nepaData.permanentDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.permanentDistrict.ct)) ? nepaData.permanentDistrict.ct : undefined],
                permanentDistrictTrans: [(!ObjectUtil.isEmpty(nepaData.permanentDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.permanentDistrict.en) &&
                    !ObjectUtil.isEmpty(nepaData.permanentDistrict.en.nepaliName)) ? nepaData.permanentDistrict.en.nepaliName : undefined],
                permanentMunicipality: [(!ObjectUtil.isEmpty(nepaData.permanentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.permanentMunicipality.en)) ? nepaData.permanentMunicipality.en : undefined],
                permanentMunicipalityCT: [(!ObjectUtil.isEmpty(nepaData.permanentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.permanentMunicipality.ct)) ? nepaData.permanentMunicipality.ct : undefined],
                permanentMunicipalityTrans: [(!ObjectUtil.isEmpty(nepaData.permanentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.permanentMunicipality.en) &&
                    !ObjectUtil.isEmpty(nepaData.permanentMunicipality.en.nepaliName)) ?
                    nepaData.permanentMunicipality.en.nepaliName : undefined],
                permanentWard: [(!ObjectUtil.isEmpty(nepaData.permanentWard) &&
                    !ObjectUtil.isEmpty(nepaData.permanentWard.en)) ? nepaData.permanentWard.en : undefined],
                permanentWardCT: [(!ObjectUtil.isEmpty(nepaData.permanentWard) &&
                    !ObjectUtil.isEmpty(nepaData.permanentWard.ct)) ? nepaData.permanentWard.ct : undefined],
                permanentWardTrans: [(!ObjectUtil.isEmpty(nepaData.permanentWard) &&
                    !ObjectUtil.isEmpty(nepaData.permanentWard.np)) ? nepaData.permanentWard.np : undefined],

                temporaryProvince: [!ObjectUtil.isEmpty(value.provinceTemporary) ? value.provinceTemporary : undefined],
                temporaryProvinceCT: [(!ObjectUtil.isEmpty(nepaData.temporaryProvince) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryProvince.ct)) ? nepaData.temporaryProvince.ct : undefined],
                temporaryProvinceTrans: [(!ObjectUtil.isEmpty(nepaData.temporaryProvince) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryProvince.en) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryProvince.en.nepaliName)) ? nepaData.temporaryProvince.en.nepaliName : undefined],
                temporaryDistrict: [ObjectUtil.isEmpty(value.districtTemporary) ? undefined : value.districtTemporary],
                temporaryDistrictCT: [(!ObjectUtil.isEmpty(nepaData.temporaryDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryDistrict.ct)) ? nepaData.temporaryDistrict.ct : undefined],
                temporaryDistrictTrans: [(!ObjectUtil.isEmpty(nepaData.temporaryDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryDistrict.en) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryDistrict.en.nepaliName)) ? nepaData.temporaryDistrict.en.nepaliName : undefined],
                temporaryMunicipality: [ObjectUtil.isEmpty(value.municipalitiesTemporary) ? undefined : value.municipalitiesTemporary],
                temporaryMunicipalityCT: [(!ObjectUtil.isEmpty(nepaData.temporaryMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryMunicipality.ct)) ? nepaData.temporaryMunicipality.ct : undefined],
                temporaryMunicipalityTrans: [(!ObjectUtil.isEmpty(nepaData.temporaryMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryMunicipality.en) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryMunicipality.en.nepaliName)) ?
                    nepaData.temporaryMunicipality.en.nepaliName : undefined],
                temporaryWard: [(!ObjectUtil.isEmpty(nepaData.temporaryWard) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryWard.en)) ? nepaData.temporaryWard.en : undefined],
                temporaryWardCT: [(!ObjectUtil.isEmpty(nepaData.temporaryWard) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryWard.ct)) ? nepaData.temporaryWard.ct : undefined],
                temporaryWardTrans: [(!ObjectUtil.isEmpty(nepaData.temporaryWard) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryWard.np)) ? nepaData.temporaryWard.np : undefined],
                isSameTemporaryAndPermanent: (!ObjectUtil.isEmpty(nepaData.isSameTemporaryAndPermanent) &&
                !ObjectUtil.isEmpty(nepaData.isSameTemporaryAndPermanent.en)) ?
                    nepaData.isSameTemporaryAndPermanent.en : undefined,
                isSameTemporaryAndPermanentCT: [undefined],
                isSameTemporaryAndPermanentTrans: [undefined],
                guarantorPermanentMunicipalityOrVdc: [(!ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc.en)) ?
                    nepaData.guarantorPermanentMunicipalityOrVdc.en : undefined],
                nepData: [value.nepData],
                guarantorTemporaryMunicipalityOrVdc: [(!ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc.en)) ?
                    nepaData.guarantorTemporaryMunicipalityOrVdc.en : undefined],
                radioCitizenIssuedDate: nepaData.radioCitizenIssuedDate ? nepaData.radioCitizenIssuedDate : '',
                citizenIssuedDate: !ObjectUtil.isEmpty(nepaData.citizenIssuedDate) ? new Date(nepaData.citizenIssuedDate.en) : '',
                citizenIssuedDateTrans: !ObjectUtil.isEmpty(nepaData.citizenIssuedDate) ? nepaData.citizenIssuedDate.en : '',
                citizenIssuedDateCT: !ObjectUtil.isEmpty(nepaData.citizenIssuedDate) ? nepaData.citizenIssuedDate.en : '',

                citizenIssuedDateNepali: !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali) &&
                !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali.en) ?
                    nepaData.citizenIssuedDateNepali.en : '',
                citizenIssuedDateNepaliTrans: !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali) &&
                !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali.en) ? nepaData.citizenIssuedDateNepali.en : '',
                citizenIssuedDateNepaliCT: !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali) &&
                !ObjectUtil.isEmpty(nepaData.citizenIssuedDateNepali.en) ? nepaData.citizenIssuedDateNepali.en : '',

                // DOB
                authorizedDobDateType: nepaData.authorizedDobDateType ? nepaData.authorizedDobDateType : '',
                authorizedDob: !ObjectUtil.isEmpty(nepaData.authorizedDob) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDob.en) ? new Date(nepaData.authorizedDob.en) : '',
                authorizedDobTrans: !ObjectUtil.isEmpty(nepaData.authorizedDob) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDob.en) ? nepaData.authorizedDob.en : '',
                authorizedDobCT: !ObjectUtil.isEmpty(nepaData.authorizedDob) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDob.en) ? nepaData.authorizedDob.en : '',

                authorizedDobNepali: !ObjectUtil.isEmpty(nepaData.authorizedDobNepali) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDobNepali.en) ?
                    nepaData.authorizedDobNepali.en : '',
                authorizedDobNepaliTrans: !ObjectUtil.isEmpty(nepaData.authorizedDobNepali) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDobNepali.en) ? nepaData.authorizedDobNepali.en : '',
                authorizedDobNepaliCT: !ObjectUtil.isEmpty(nepaData.authorizedDobNepali) &&
                !ObjectUtil.isEmpty(nepaData.authorizedDobNepali.en) ? nepaData.authorizedDobNepali.en : '',

                guarantorPermanentMunicipalityOrVdcCT: [(!ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc.np)) ?
                    nepaData.guarantorPermanentMunicipalityOrVdc.np : undefined],
                guarantorTemporaryMunicipalityOrVdcCT: [(!ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc.np)) ?
                    nepaData.guarantorTemporaryMunicipalityOrVdc.np : undefined],
                permanentStreetTole: [(!ObjectUtil.isEmpty(nepaData.permanentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.permanentStreetTole.en)) ?
                    nepaData.permanentStreetTole.en : undefined],
                permanentStreetToleTrans: [(!ObjectUtil.isEmpty(nepaData.permanentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.permanentStreetTole.np)) ?
                    nepaData.permanentStreetTole.np : undefined],
                permanentStreetToleCT: [(!ObjectUtil.isEmpty(nepaData.permanentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.permanentStreetTole.ct)) ?
                    nepaData.permanentStreetTole.ct : undefined],
                temporaryStreetTole: [(!ObjectUtil.isEmpty(nepaData.temporaryStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryStreetTole.en)) ?
                    nepaData.temporaryStreetTole.en : undefined],
                temporaryStreetToleTrans: [(!ObjectUtil.isEmpty(nepaData.temporaryStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryStreetTole.np)) ?
                    nepaData.temporaryStreetTole.np : undefined],
                temporaryStreetToleCT: [(!ObjectUtil.isEmpty(nepaData.temporaryStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.temporaryStreetTole.ct)) ?
                    nepaData.temporaryStreetTole.ct : undefined],
                guarantorNationality: [!ObjectUtil.isEmpty(nepaData.guarantorNationality) ?
                    nepaData.guarantorNationality : undefined],
                guarantorNationalityTrans: (!ObjectUtil.isEmpty(nepaData.guarantorNationality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorNationality.np)) ?
                    nepaData.guarantorNationality.np : undefined,
                guarantorNationalityCT: (!ObjectUtil.isEmpty(nepaData.guarantorNationality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorNationality.ct)) ?
                    nepaData.guarantorNationality.ct : undefined,

                // for indian guarantor
                // embassy details
                embassyNo: (!ObjectUtil.isEmpty(nepaData.embassyNo) &&
                    !ObjectUtil.isEmpty(nepaData.embassyNo.en)) ?
                    nepaData.embassyNo.en : undefined,
                embassyNoTrans: (!ObjectUtil.isEmpty(nepaData.embassyNo) &&
                    !ObjectUtil.isEmpty(nepaData.embassyNo.np)) ?
                    nepaData.embassyNo.np : undefined,
                embassyNoCT: (!ObjectUtil.isEmpty(nepaData.embassyNo) &&
                    !ObjectUtil.isEmpty(nepaData.embassyNo.ct)) ?
                    nepaData.embassyNo.ct : undefined,
                embassyIssuedDate: (!ObjectUtil.isEmpty(nepaData.embassyIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedDate.en)) ?
                    new Date(nepaData.embassyIssuedDate.en) : undefined,
                embassyIssuedDateTrans: (!ObjectUtil.isEmpty(nepaData.embassyIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedDate.np)) ?
                    nepaData.embassyIssuedDate.np : undefined,
                embassyIssuedDateCT: (!ObjectUtil.isEmpty(nepaData.embassyIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedDate.ct)) ?
                    nepaData.embassyIssuedDate.ct : undefined,
                embassyIssuedFrom: (!ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedFrom.en)) ?
                    nepaData.embassyIssuedFrom.en : undefined,
                embassyIssuedFromTrans: (!ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedFrom.np)) ?
                    nepaData.embassyIssuedFrom.np : undefined,
                embassyIssuedFromCT: (!ObjectUtil.isEmpty(nepaData.embassyIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.embassyIssuedFrom.ct)) ?
                    nepaData.embassyIssuedFrom.ct : undefined,

                // passport detail
                passportNo: (!ObjectUtil.isEmpty(nepaData.passportNo) &&
                    !ObjectUtil.isEmpty(nepaData.passportNo.en)) ?
                    nepaData.passportNo.en : undefined,
                passportNoTrans: (!ObjectUtil.isEmpty(nepaData.passportNo) &&
                    !ObjectUtil.isEmpty(nepaData.passportNo.np)) ?
                    nepaData.passportNo.np : undefined,
                passportNoCT: (!ObjectUtil.isEmpty(nepaData.passportNo) &&
                    !ObjectUtil.isEmpty(nepaData.passportNo.ct)) ?
                    nepaData.passportNo.ct : undefined,
                passportIssuedDate: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.en)) ?
                    new Date(nepaData.passportIssuedDate.en) : undefined,
                passportIssuedDateTrans: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.np)) ?
                    nepaData.passportIssuedDate.np : undefined,
                passportIssuedDateCT: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.ct)) ?
                    nepaData.passportIssuedDate.ct : undefined,
                passportValidityDate: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.en)) ?
                    new Date(nepaData.passportIssuedDate.en) : undefined,
                passportValidityDateTrans: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.np)) ?
                    nepaData.passportIssuedDate.np : undefined,
                passportValidityDateCT: (!ObjectUtil.isEmpty(nepaData.passportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedDate.ct)) ?
                    nepaData.passportIssuedDate.ct : undefined,
                passportIssuedFrom: (!ObjectUtil.isEmpty(nepaData.passportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedFrom.en)) ?
                    nepaData.passportIssuedFrom.en : undefined,
                passportIssuedFromTrans: (!ObjectUtil.isEmpty(nepaData.passportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedFrom.np)) ?
                    nepaData.passportIssuedFrom.np : undefined,
                passportIssuedFromCT: (!ObjectUtil.isEmpty(nepaData.passportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.passportIssuedFrom.ct)) ?
                    nepaData.passportIssuedFrom.ct : undefined,

                // adhar card detail
                adharCardNo: (!ObjectUtil.isEmpty(nepaData.adharCardNo) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardNo.en)) ?
                    nepaData.adharCardNo.en : undefined,
                adharCardNoTrans: (!ObjectUtil.isEmpty(nepaData.adharCardNo) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardNo.np)) ?
                    nepaData.adharCardNo.np : undefined,
                adharCardNoCT: (!ObjectUtil.isEmpty(nepaData.adharCardNo) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardNo.ct)) ?
                    nepaData.adharCardNo.ct : undefined,
                adharCardIssuedDate: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedDate.en)) ?
                    new Date(nepaData.adharCardIssuedDate.en) : undefined,
                adharCardIssuedDateTrans: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedDate.np)) ?
                    nepaData.adharCardIssuedDate.np : undefined,
                adharCardIssuedDateCT: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedDate.ct)) ?
                    nepaData.adharCardIssuedDate.ct : undefined,
                adharCardIssuedFrom: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom.en)) ?
                    nepaData.adharCardIssuedFrom.en : undefined,
                adharCardIssuedFromTrans: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom.np)) ?
                    nepaData.adharCardIssuedFrom.np : undefined,
                adharCardIssuedFromCT: (!ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.adharCardIssuedFrom.ct)) ?
                    nepaData.adharCardIssuedFrom.ct : undefined,


                otherGuarantorPassportNo: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo.en)) ?
                    nepaData.otherGuarantorPassportNo.en : undefined,
                otherGuarantorPassportNoTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo.np)) ?
                    nepaData.otherGuarantorPassportNo.np : undefined,
                otherGuarantorPassportNoCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportNo.ct)) ?
                    nepaData.otherGuarantorPassportNo.ct : undefined,
                otherGuarantorPassportIssuedDate: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate.en)) ?
                    new Date(nepaData.otherGuarantorPassportIssuedDate.en) : undefined,
                otherGuarantorPassportIssuedDateTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate.np)) ?
                    nepaData.otherGuarantorPassportIssuedDate.np : undefined,
                otherGuarantorPassportIssuedDateCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDate.ct)) ?
                    nepaData.otherGuarantorPassportIssuedDate.ct : undefined,
                otherGuarantorPassportValidityDate: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate.en)) ?
                    new Date(nepaData.otherGuarantorPassportValidityDate.en) : undefined,
                otherGuarantorPassportValidityDateTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate.np)) ?
                    nepaData.otherGuarantorPassportValidityDate.np : undefined,
                otherGuarantorPassportValidityDateCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDate.ct)) ?
                    nepaData.otherGuarantorPassportValidityDate.ct : undefined,
                otherGuarantorPassportIssuedFrom: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom.en)) ?
                    nepaData.otherGuarantorPassportIssuedFrom.en : undefined,
                otherGuarantorPassportIssuedFromTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom.np)) ?
                    nepaData.otherGuarantorPassportIssuedFrom.np : undefined,
                otherGuarantorPassportIssuedFromCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedFrom.ct)) ?
                    nepaData.otherGuarantorPassportIssuedFrom.ct : undefined,
                otherGuarantorPassportIssuedDateNepali: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali.en)) ?
                    nepaData.otherGuarantorPassportIssuedDateNepali.en : undefined,
                otherGuarantorPassportIssuedDateNepaliTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali.np)) ?
                    nepaData.otherGuarantorPassportIssuedDateNepali.np : undefined,
                otherGuarantorPassportIssuedDateNepaliCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportIssuedDateNepali.ct)) ?
                    nepaData.otherGuarantorPassportIssuedDateNepali.ct : undefined,
                otherGuarantorPassportValidityDateNepali: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali.en)) ?
                    nepaData.otherGuarantorPassportValidityDateNepali.en : undefined,
                otherGuarantorPassportValidityDateNepaliTrans: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali.np)) ?
                    nepaData.otherGuarantorPassportValidityDateNepali.np : undefined,
                otherGuarantorPassportValidityDateNepaliCT: (!ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.otherGuarantorPassportValidityDateNepali.ct)) ?
                    nepaData.otherGuarantorPassportValidityDateNepali.ct : undefined,

                otherGuarantorPassportIssuedDateOption: nepaData.otherGuarantorPassportIssuedDateOption ?
                    nepaData.otherGuarantorPassportIssuedDateOption : '',
                otherGuarantorPassportIssuedDateOptionTrans: [undefined],
                otherGuarantorPassportIssuedDateOptionCT: [undefined],
                otherGuarantorPassportValidityDateOption: nepaData.otherGuarantorPassportValidityDateOption ?
                    nepaData.otherGuarantorPassportValidityDateOption : '',
                otherGuarantorPassportValidityDateOptionCT: [undefined],
                otherGuarantorPassportValidityDateOptionTrans: [undefined],

                // Guarantors flag

                // guarantorNationalityOption:  ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.en,
                // guarantorNationalityOptionTrans: ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.np,
                // guarantorNationalityOptionCT: ObjectUtil.isEmpty(nepaData.guarantorNationalityOption) ?
                //     undefined : nepaData.guarantorNationalityOption.ct,
                indianGuarantorDetailOption: (!ObjectUtil.isEmpty(nepaData.indianGuarantorDetailOption) &&
                !ObjectUtil.isEmpty(nepaData.indianGuarantorDetailOption.en)) ?
                    nepaData.indianGuarantorDetailOption.en : undefined,
                indianGuarantorDetailOptionTrans: undefined,
                indianGuarantorDetailOptionCT: undefined,

                guarantorForeignAddressOption: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption.en)) ?
                    nepaData.guarantorForeignAddressOption.en : undefined,
                guarantorForeignAddressOptionTrans: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption.np)) ?
                    nepaData.guarantorForeignAddressOption.np : undefined,
                guarantorForeignAddressOptionCT: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption.ct)) ?
                    nepaData.guarantorForeignAddressOption.ct : undefined,

                guarantorForeignAddressOptionTemp: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOptionTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOptionTemp.en)) ?
                    nepaData.guarantorForeignAddressOptionTemp.en : undefined,
                guarantorForeignAddressOptionTempTrans: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOptionTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOptionTemp.np)) ?
                    nepaData.guarantorForeignAddressOptionTemp.np : undefined,
                guarantorForeignAddressOptionTempCT: (!ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOptionTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorForeignAddressOption.ct)) ?
                    nepaData.guarantorForeignAddressOption.ct : undefined,

                guarantorOtherAddress: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddress.en)) ?
                    nepaData.guarantorOtherAddress.en : undefined,
                guarantorOtherAddressTrans: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddress.np)) ?
                    nepaData.guarantorOtherAddress.np : undefined,
                guarantorOtherAddressCT: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddress) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddress.ct)) ?
                    nepaData.guarantorOtherAddress.ct : undefined,

                guarantorOtherAddressTemp: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp.en)) ?
                    nepaData.guarantorOtherAddressTemp.en : undefined,
                guarantorOtherAddressTempTrans: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp.np)) ?
                    nepaData.guarantorOtherAddressTemp.np : undefined,
                guarantorOtherAddressTempCT: (!ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorOtherAddressTemp.ct)) ?
                    nepaData.guarantorOtherAddressTemp.ct : undefined,

                guarantorType: (!ObjectUtil.isEmpty(nepaData.guarantorType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorType.en)) ?
                    nepaData.guarantorType.en : undefined,
                guarantorTypeTrans: (!ObjectUtil.isEmpty(nepaData.guarantorType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorType.np)) ?
                    nepaData.guarantorType.np : undefined,
                guarantorTypeCT: (!ObjectUtil.isEmpty(nepaData.guarantorType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorType.ct)) ?
                    nepaData.guarantorType.ct : undefined,
                authorizedPersonName: (!ObjectUtil.isEmpty(nepaData.authorizedPersonName) &&
                    !ObjectUtil.isEmpty(nepaData.authorizedPersonName.en)) ?
                    nepaData.authorizedPersonName.en : undefined,
                authorizedPersonNameTrans: (!ObjectUtil.isEmpty(nepaData.authorizedPersonName) &&
                    !ObjectUtil.isEmpty(nepaData.authorizedPersonName.np)) ?
                    nepaData.authorizedPersonName.np : undefined,
                authorizedPersonNameCT: (!ObjectUtil.isEmpty(nepaData.authorizedPersonName) &&
                    !ObjectUtil.isEmpty(nepaData.authorizedPersonName.ct)) ?
                    nepaData.authorizedPersonName.ct : undefined,
                guaranteeProviderName: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.en)) ?
                    nepaData.guaranteeProviderName.en : undefined,
                guaranteeProviderNameTrans: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.np)) ?
                    nepaData.guaranteeProviderName.np : undefined,
                guaranteeProviderNameCT: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.ct)) ?
                    nepaData.guaranteeProviderName.ct : undefined,

                guarantorActName: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.en)) ?
                    nepaData.guaranteeProviderName.en : undefined,
                guarantorActNameTrans: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.ct)) ?
                    nepaData.guaranteeProviderName.ct : undefined,
                guarantorActNameCT: (!ObjectUtil.isEmpty(nepaData.guaranteeProviderName) &&
                    !ObjectUtil.isEmpty(nepaData.guaranteeProviderName.ct)) ?
                    nepaData.guaranteeProviderName.ct : undefined,
                guarantorActYear: (!ObjectUtil.isEmpty(nepaData.guarantorActYear) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYear.en)) ?
                    nepaData.guarantorActYear.en : undefined,
                guarantorActYearTrans: (!ObjectUtil.isEmpty(nepaData.guarantorActYear) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYear.en)) ?
                    nepaData.guarantorActYear.en : undefined,
                guarantorActYearCT: (!ObjectUtil.isEmpty(nepaData.guarantorActYear) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYear.en)) ?
                    nepaData.guarantorActYear.en : undefined,
                guarantorActYearOption: (!ObjectUtil.isEmpty(nepaData.guarantorActYearOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYearOption.en)) ?
                    nepaData.guarantorActYearOption.en : undefined,
                guarantorActYearOptionTrans: (!ObjectUtil.isEmpty(nepaData.guarantorActYearOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYearOption.en)) ?
                    nepaData.guarantorActYearOption.en : undefined,
                guarantorActYearOptionCT: (!ObjectUtil.isEmpty(nepaData.guarantorActYearOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorActYearOption.en)) ?
                    nepaData.guarantorActYearOption.en : undefined,
                guarantorAuthorizedBodyName: (!ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName.en)) ?
                    nepaData.guarantorAuthorizedBodyName.en : undefined,
                guarantorAuthorizedBodyNameTrans: (!ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName.np)) ?
                    nepaData.guarantorAuthorizedBodyName.np : undefined,
                guarantorAuthorizedBodyNameCT: (!ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorAuthorizedBodyName.ct)) ?
                    nepaData.guarantorAuthorizedBodyName.ct : undefined,
                guarantorRegisteredWith: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith.en)) ?
                    nepaData.guarantorRegisteredWith.en : undefined,
                guarantorRegisteredWithTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith.np)) ?
                    nepaData.guarantorRegisteredWith.np : undefined,
                guarantorRegisteredWithCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWith.ct)) ?
                    nepaData.guarantorRegisteredWith.ct : undefined,
                guarantorRegistrationNo: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo.en)) ?
                    nepaData.guarantorRegistrationNo.en : undefined,
                guarantorRegistrationNoTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo.np)) ?
                    nepaData.guarantorRegistrationNo.np : undefined,
                guarantorRegistrationNoCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationNo.ct)) ?
                    nepaData.guarantorRegistrationNo.ct : undefined,
                guarantorRegistrationDate: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate.en)) ?
                    new Date(nepaData.guarantorRegistrationDate.en) : undefined,
                guarantorRegistrationDateTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate.en)) ?
                    nepaData.guarantorRegistrationDate.en : undefined,
                guarantorRegistrationDateCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDate.en)) ?
                    nepaData.guarantorRegistrationDate.en : undefined,
                guarantorRegistrationDateNepali: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali.en)) ?
                    nepaData.guarantorRegistrationDateNepali.en : undefined,
                guarantorRegistrationDateNepaliTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali.en)) ?
                    nepaData.guarantorRegistrationDateNepali.en : undefined,
                guarantorRegistrationDateNepaliCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateNepali.en)) ?
                    nepaData.guarantorRegistrationDateNepali.en : undefined,
                guarantorRegistrationDateOption: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption.en)) ?
                    nepaData.guarantorRegistrationDateOption.en : undefined,
                guarantorRegistrationDateOptionTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption.en)) ?
                    nepaData.guarantorRegistrationDateOption.en : undefined,
                guarantorRegistrationDateOptionCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegistrationDateOption.en)) ?
                    nepaData.guarantorRegistrationDateOption.en : undefined,

                guarantorIssuedDistrict: (!ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict.en)) ?
                    nepaData.guarantorIssuedDistrict.en : undefined,
                guarantorIssuedDistrictTrans: (!ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict.ct)) ?
                    nepaData.guarantorIssuedDistrict.ct : undefined,
                guarantorIssuedDistrictCT: (!ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorIssuedDistrict.ct)) ?
                    nepaData.guarantorIssuedDistrict.ct : undefined,
                guarantorPanNo: (!ObjectUtil.isEmpty(nepaData.guarantorPanNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorPanNo.en)) ?
                    nepaData.guarantorPanNo.en : undefined,
                guarantorPanNoTrans: (!ObjectUtil.isEmpty(nepaData.guarantorPanNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorPanNo.ct)) ?
                    nepaData.guarantorPanNo.ct : undefined,
                guarantorPanNoCT: (!ObjectUtil.isEmpty(nepaData.guarantorPanNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorPanNo.ct)) ?
                    nepaData.guarantorPanNo.ct : undefined,

                guarantorRegisteredType: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredType.en)) ?
                    nepaData.guarantorRegisteredType.en : undefined,
                guarantorRegisteredTypeTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredType.np)) ?
                    nepaData.guarantorRegisteredType.np : undefined,
                guarantorRegisteredTypeCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredType.ct)) ?
                    nepaData.guarantorRegisteredType.ct : undefined,

                guarantorRegisteredProvince: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince.en)) ?
                    nepaData.guarantorRegisteredProvince.en : undefined,
                guarantorRegisteredProvinceTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince.ct)) ?
                    nepaData.guarantorRegisteredProvince.ct : undefined,
                guarantorRegisteredProvinceCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredProvince.ct)) ?
                    nepaData.guarantorRegisteredProvince.ct : undefined,

                guarantorRegisteredDistrict: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict.en)) ?
                    nepaData.guarantorRegisteredDistrict.en : undefined,
                guarantorRegisteredDistrictTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict.ct)) ?
                    nepaData.guarantorRegisteredDistrict.ct : undefined,
                guarantorRegisteredDistrictCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredDistrict.ct)) ?
                    nepaData.guarantorRegisteredDistrict.ct : undefined,

                guarantorRegisteredMunicipality: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality.en)) ?
                    nepaData.guarantorRegisteredMunicipality.en : undefined,
                guarantorRegisteredMunicipalityTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality.ct)) ?
                    nepaData.guarantorRegisteredMunicipality.ct : undefined,
                guarantorRegisteredMunicipalityCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredMunicipality.ct)) ?
                    nepaData.guarantorRegisteredMunicipality.ct : undefined,
                guarantorRegisteredWardNo: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo.en)) ?
                    nepaData.guarantorRegisteredWardNo.en : undefined,
                guarantorRegisteredWardNoTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo.np)) ?
                    nepaData.guarantorRegisteredWardNo.np : undefined,
                guarantorRegisteredWardNoCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredWardNo.ct)) ?
                    nepaData.guarantorRegisteredWardNo.ct : undefined,
                guarantorRegisteredStreetTole: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole.en)) ?
                    nepaData.guarantorRegisteredStreetTole.en : undefined,
                guarantorRegisteredStreetToleTrans: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole.np)) ?
                    nepaData.guarantorRegisteredStreetTole.np : undefined,
                guarantorRegisteredStreetToleCT: (!ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorRegisteredStreetTole.ct)) ?
                    nepaData.guarantorRegisteredStreetTole.ct : undefined,

                // Current Address

                guarantorCurrentType: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentType.en)) ?
                    nepaData.guarantorCurrentType.en : undefined,
                guarantorCurrentTypeTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentType.np)) ?
                    nepaData.guarantorCurrentType.np : undefined,
                guarantorCurrentTypeCT:  (!ObjectUtil.isEmpty(nepaData.guarantorCurrentType) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentType.ct)) ?
                    nepaData.guarantorCurrentType.ct : undefined,

                guarantorCurrentProvince: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince.en)) ?
                    nepaData.guarantorCurrentProvince.en : undefined,
                guarantorCurrentProvinceTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince.ct)) ?
                    nepaData.guarantorCurrentProvince.ct : undefined,
                guarantorCurrentProvinceCT: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentProvince.ct)) ?
                    nepaData.guarantorCurrentProvince.ct : undefined,

                guarantorCurrentDistrict: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict.en)) ?
                    nepaData.guarantorCurrentDistrict.en : undefined,
                guarantorCurrentDistrictTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict.ct)) ?
                    nepaData.guarantorCurrentDistrict.ct : undefined,
                guarantorCurrentDistrictCT: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentDistrict.ct)) ?
                    nepaData.guarantorCurrentDistrict.ct : undefined,

                guarantorCurrentMunicipality: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality.en)) ?
                    nepaData.guarantorCurrentMunicipality.en : undefined,
                guarantorCurrentMunicipalityTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality.ct)) ?
                    nepaData.guarantorCurrentMunicipality.ct : undefined,
                guarantorCurrentMunicipalityCT: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentMunicipality.ct)) ?
                    nepaData.guarantorCurrentMunicipality.ct : undefined,
                guarantorCurrentWardNo: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo.en)) ?
                    nepaData.guarantorCurrentWardNo.en : undefined,
                guarantorCurrentWardNoTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo.np)) ?
                    nepaData.guarantorCurrentWardNo.np : undefined,
                guarantorCurrentWardNoCT: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentWardNo.ct)) ?
                    nepaData.guarantorCurrentWardNo.ct : undefined,
                guarantorCurrentStreetTole: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole.en)) ?
                    nepaData.guarantorCurrentStreetTole.en : undefined,
                guarantorCurrentStreetToleTrans: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole.np)) ?
                    nepaData.guarantorCurrentStreetTole.np : undefined,
                guarantorCurrentStreetToleCT: (!ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorCurrentStreetTole.ct)) ?
                    nepaData.guarantorCurrentStreetTole.ct : undefined,

                isSameGuarantorRegisteredAndCurrentAddress: (!ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress) &&
                    !ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress.en)) ?
                    nepaData.isSameGuarantorRegisteredAndCurrentAddress.en : undefined,
                isSameGuarantorRegisteredAndCurrentAddressTrans: (!ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress) &&
                    !ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress.en)) ?
                    nepaData.isSameGuarantorRegisteredAndCurrentAddress.en : undefined,
                isSameGuarantorRegisteredAndCurrentAddressCT:  (!ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress) &&
                    !ObjectUtil.isEmpty(nepaData.isSameGuarantorRegisteredAndCurrentAddress.en)) ?
                    nepaData.isSameGuarantorRegisteredAndCurrentAddress.en : undefined,

                guarantorMaritalStatus: [(!ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus) &&
                !ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus.en)) ? nepaData.guarantorMaritalStatus.en : undefined],
                guarantorMaritalStatusTrans: [(!ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus.np)) ? nepaData.guarantorMaritalStatus.np : undefined],
                guarantorMaritalStatusCT: [(!ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus) &&
                    !ObjectUtil.isEmpty(nepaData.guarantorMaritalStatus.ct)) ? nepaData.guarantorMaritalStatus.ct : undefined],

                radioCitizenIssuedDateCT: [undefined],
                // citizenIssuedDateCT: [undefined],
                id: [value.id],
                detailsEntered: [!ObjectUtil.isEmpty(nepaData.detailsEntered) ? nepaData.detailsEntered : undefined],
                detailsFrom: [!ObjectUtil.isEmpty(nepaData.detailsFrom) ? nepaData.detailsFrom : undefined],
            }));
        });
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
            if (ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmount']).value)) {
                this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmount']).patchValue("0");
            }
            let guarantorsDetails: any = [];
            this.guarantorTranslatedFormGroup = this.formBuilder.group({
                gurantedAmount: this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmount']).value,
                guarantorName: this.userConfigForm.get(['guarantorDetails', index, 'guarantorName']).value,
                citizenNumber: this.userConfigForm.get(['guarantorDetails', index, 'citizenNumber']).value,
                gender: this.userConfigForm.get(['guarantorDetails', index, 'gender']).value,
                guarantorMaritalStatus: this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatus']).value,
                husbandName: this.userConfigForm.get(['guarantorDetails', index, 'husbandName']).value,
                fatherInLawName: this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawName']).value,
                grandFatherName: this.userConfigForm.get(['guarantorDetails', index, 'grandFatherName']).value,
                fatherName: this.userConfigForm.get(['guarantorDetails', index, 'fatherName']).value,
                permanentStreetTole: this.userConfigForm.get(['guarantorDetails', index, 'permanentStreetTole']).value,
                temporaryStreetTole: this.userConfigForm.get(['guarantorDetails', index, 'temporaryStreetTole']).value,
                guarantorNationality: this.userConfigForm.get(['guarantorDetails', index, 'guarantorNationality']).value,
                embassyNo: this.userConfigForm.get(['guarantorDetails', index, 'embassyNo']).value,
                embassyIssuedFrom: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedFrom']).value,
                passportNo: this.userConfigForm.get(['guarantorDetails', index, 'passportNo']).value,
                passportIssuedFrom: this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedFrom']).value,
                adharCardNo: this.userConfigForm.get(['guarantorDetails', index, 'adharCardNo']).value,
                adharCardIssuedFrom: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedFrom']).value,
                indianGuarantorDetailOption: this.userConfigForm.get(['guarantorDetails', index, 'indianGuarantorDetailOption']).value,
                otherGuarantorPassportNo: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportNo']).value,
                otherGuarantorPassportIssuedFrom: this.userConfigForm.get(
                    ['guarantorDetails', index, 'otherGuarantorPassportIssuedFrom']).value,
                otherGuarantorPassportIssuedDateOption: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateOption']).value,
                otherGuarantorPassportValidityDateOption: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateOption']).value,
                guarantorForeignAddressOption: this.userConfigForm.get(['guarantorDetails', index, 'guarantorForeignAddressOption']).value,
                guarantorForeignAddressOptionTemp: this.userConfigForm.get(
                    ['guarantorDetails', index, 'guarantorForeignAddressOptionTemp']).value,
                guarantorOtherAddress: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddress']).value,
                guarantorOtherAddressTemp: this.userConfigForm.get(['guarantorDetails', index, 'guarantorOtherAddressTemp']).value,
                guarantorType: this.userConfigForm.get(['guarantorDetails', index, 'guarantorType']).value,
                guaranteeProviderName: this.userConfigForm.get(['guarantorDetails', index, 'guaranteeProviderName']).value,
                authorizedPersonName: this.userConfigForm.get(['guarantorDetails', index, 'authorizedPersonName']).value,
                guarantorActName: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActName']).value,
                guarantorActYear: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYear']).value,
                guarantorActYearOption: this.userConfigForm.get(['guarantorDetails', index, 'guarantorActYearOption']).value,
                guarantorAuthorizedBodyName: this.userConfigForm.get(['guarantorDetails', index, 'guarantorAuthorizedBodyName']).value,
                guarantorRegisteredWith: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWith']).value,
                guarantorRegistrationNo: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationNo']).value,
                guarantorRegistrationDateOption: this.userConfigForm.get(
                    ['guarantorDetails', index, 'guarantorRegistrationDateOption']).value,
                guarantorPanNo: this.userConfigForm.get(['guarantorDetails', index, 'guarantorPanNo']).value,
                guarantorRegisteredType: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredType']).value,
                guarantorRegisteredWardNo: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNo']).value,
                guarantorRegisteredStreetTole: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetTole']).value,
                guarantorCurrentType: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentType']).value,
                guarantorCurrentWardNo: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentWardNo']).value,
                guarantorCurrentStreetTole: this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentStreetTole']).value,
            });
            // guarantorsDetails = await this.translateService.translateForm(this.userConfigForm, 'guarantorDetails', index);
            guarantorsDetails = await this.translateService.translateForm(this.guarantorTranslatedFormGroup);
            this.spinner = false;
            if (this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmount']).value === 0) {
                this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).patchValue(guarantorsDetails.gurantedAmount ? guarantorsDetails.gurantedAmount : '');
                this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountCT']).patchValue(guarantorsDetails.gurantedAmount ? guarantorsDetails.gurantedAmount : '');
            }
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
            this.userConfigForm.get(['guarantorDetails', index, 'guarantorMaritalStatusCT']).patchValue(guarantorsDetails.guarantorMaritalStatus ? guarantorsDetails.guarantorMaritalStatus : '');
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
            this.userConfigForm.get(['guarantorDetails', index, 'relationMediumTrans']).patchValue(this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value
                ? this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value : '');
            this.userConfigForm.get(['guarantorDetails', index, 'relationMediumCT']).patchValue(this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value
                ? this.userConfigForm.get(['guarantorDetails', index, 'relationMedium']).value : '');
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
                citizenIssuedDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value,
                citizenIssuedDateCT: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDate']).value,
                citizenIssuedDateNepaliTrans: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value,
                citizenIssuedDateNepaliCT: this.userConfigForm.get(['guarantorDetails', index, 'citizenIssuedDateNepali']).value,

                // DOB
                authorizedDobTrans: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDob']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'authorizedDob']).value : '',
                authorizedDobCT: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDob']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'authorizedDob']).value : '',
                authorizedDobNepaliTrans: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepali']).value : '',
                authorizedDobNepaliCT: this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'authorizedDobNepali']).value : '',

                // for indian guarantor
                // embassy details
                embassyNoTrans:  guarantorsDetails.embassyNo ?
                    guarantorsDetails.embassyNo : '',
                embassyNoCT: guarantorsDetails.embassyNo ?
                    guarantorsDetails.embassyNo : '',
                embassyIssuedDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value : '',
                embassyIssuedDateCT: this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'embassyIssuedDate']).value : '',
                embassyIssuedFromTrans: guarantorsDetails.embassyIssuedFrom ?
                    guarantorsDetails.embassyIssuedFrom : '',
                embassyIssuedFromCT: guarantorsDetails.embassyIssuedFrom ?
                    guarantorsDetails.embassyIssuedFrom : '',

                // passport detail
                passportNoTrans: guarantorsDetails.passportNo ?
                    guarantorsDetails.passportNo : '',
                passportNoCT:  guarantorsDetails.passportNo ?
                    guarantorsDetails.passportNo : '',
                passportIssuedDateTrans:  this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value : '',
                passportIssuedDateCT:  this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'passportIssuedDate']).value : '',
                passportValidityDateTrans:  this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value : '',
                passportValidityDateCT: this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'passportValidityDate']).value : '',
                passportIssuedFromTrans: guarantorsDetails.passportIssuedFrom ?
                    guarantorsDetails.passportIssuedFrom : '',
                passportIssuedFromCT: guarantorsDetails.passportIssuedFrom ?
                    guarantorsDetails.passportIssuedFrom : '',

                // adhar card detail
                adharCardNoTrans: guarantorsDetails.adharCardNo ?
                    guarantorsDetails.adharCardNo : '',
                adharCardNoCT: guarantorsDetails.adharCardNo ?
                    guarantorsDetails.adharCardNo : '',
                adharCardIssuedDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value : '',
                adharCardIssuedDateCT: this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'adharCardIssuedDate']).value : '',
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
                otherGuarantorPassportIssuedDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value : '',
                otherGuarantorPassportIssuedDateCT: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDate']).value : '',
                otherGuarantorPassportValidityDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value : '',
                otherGuarantorPassportValidityDateCT: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDate']).value : '',
                otherGuarantorPassportIssuedFromTrans: guarantorsDetails.otherGuarantorPassportIssuedFrom ?
                    guarantorsDetails.otherGuarantorPassportIssuedFrom : '',
                otherGuarantorPassportIssuedFromCT: guarantorsDetails.otherGuarantorPassportIssuedFrom ?
                    guarantorsDetails.otherGuarantorPassportIssuedFrom : '',
                otherGuarantorPassportIssuedDateNepaliTrans: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepali']).value : '',
                otherGuarantorPassportIssuedDateNepaliCT: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportIssuedDateNepali']).value : '',
                otherGuarantorPassportValidityDateNepaliTrans: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepali']).value : '',
                otherGuarantorPassportValidityDateNepaliCT: this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'otherGuarantorPassportValidityDateNepali']).value : '',

                otherGuarantorPassportIssuedDateOptionTrans: guarantorsDetails.otherGuarantorPassportIssuedDateOption ?
                    guarantorsDetails.otherGuarantorPassportIssuedDateOption : '',
                otherGuarantorPassportIssuedDateOptionCT: guarantorsDetails.otherGuarantorPassportIssuedDateOption ?
                    guarantorsDetails.otherGuarantorPassportIssuedDateOption : '',
                otherGuarantorPassportValidityDateOptionCT: guarantorsDetails.otherGuarantorPassportValidityDateOption ?
                    guarantorsDetails.otherGuarantorPassportValidityDateOption : '',
                otherGuarantorPassportValidityDateOptionTrans: guarantorsDetails.otherGuarantorPassportValidityDateOption ?
                    guarantorsDetails.otherGuarantorPassportValidityDateOption : '',

                guarantorForeignAddressOptionTrans: guarantorsDetails.guarantorForeignAddressOption ?
                    guarantorsDetails.guarantorForeignAddressOption : '',
                guarantorForeignAddressOptionCT : guarantorsDetails.guarantorForeignAddressOption ?
                    guarantorsDetails.guarantorForeignAddressOption : '',

                guarantorForeignAddressOptionTempTrans: guarantorsDetails.guarantorForeignAddressOptionTemp ?
                    guarantorsDetails.guarantorForeignAddressOptionTemp : '',
                guarantorForeignAddressOptionTempCT : guarantorsDetails.guarantorForeignAddressOptionTemp ?
                    guarantorsDetails.guarantorForeignAddressOptionTemp : '',

                guarantorOtherAddressTrans:  guarantorsDetails.guarantorOtherAddress ?
                    guarantorsDetails.guarantorOtherAddress : '',
                guarantorOtherAddressCT:  guarantorsDetails.guarantorOtherAddress ?
                    guarantorsDetails.guarantorOtherAddress : '',

                guarantorOtherAddressTempTrans: guarantorsDetails.guarantorOtherAddressTemp ?
                    guarantorsDetails.guarantorOtherAddressTemp : '',
                guarantorOtherAddressTempCT: guarantorsDetails.guarantorOtherAddressTemp ?
                    guarantorsDetails.guarantorOtherAddressTemp : '',

                guarantorTypeTrans: guarantorsDetails.guarantorType ?
                    guarantorsDetails.guarantorType : '',
                guarantorTypeCT: guarantorsDetails.guarantorType ?
                    guarantorsDetails.guarantorType : '',

                guaranteeProviderNameTrans: guarantorsDetails.guaranteeProviderName ?
                    guarantorsDetails.guaranteeProviderName : '',
                guaranteeProviderNameCT: guarantorsDetails.guaranteeProviderName ?
                    guarantorsDetails.guaranteeProviderName : '',

                authorizedPersonNameTrans:  guarantorsDetails.authorizedPersonName ?
                    guarantorsDetails.authorizedPersonName : '',
                authorizedPersonNameCT:  guarantorsDetails.authorizedPersonName ?
                    guarantorsDetails.authorizedPersonName : '',

                guarantorActNameTrans: guarantorsDetails.guarantorActName ?
                    guarantorsDetails.guarantorActName : '',
                guarantorActNameCT: guarantorsDetails.guarantorActName ?
                    guarantorsDetails.guarantorActName : '',
                guarantorActYearTrans: guarantorsDetails.guarantorActYear ?
                    guarantorsDetails.guarantorActYear : '',
                guarantorActYearCT: guarantorsDetails.guarantorActYear ?
                    guarantorsDetails.guarantorActYear : '',
                guarantorActYearOptionTrans: guarantorsDetails.guarantorActYearOption ?
                    guarantorsDetails.guarantorActYearOption : '',
                guarantorActYearOptionCT: guarantorsDetails.guarantorActYearOption ?
                    guarantorsDetails.guarantorActYearOption : '',
                guarantorAuthorizedBodyNameTrans: guarantorsDetails.guarantorAuthorizedBodyName ?
                    guarantorsDetails.guarantorAuthorizedBodyName : '',
                guarantorAuthorizedBodyNameCT: guarantorsDetails.guarantorAuthorizedBodyName ?
                    guarantorsDetails.guarantorAuthorizedBodyName : '',
                guarantorRegisteredWithTrans: guarantorsDetails.guarantorRegisteredWith ?
                    guarantorsDetails.guarantorRegisteredWith : '',
                guarantorRegisteredWithCT: guarantorsDetails.guarantorRegisteredWith ?
                    guarantorsDetails.guarantorRegisteredWith : '',
                guarantorRegistrationNoTrans: guarantorsDetails.guarantorRegistrationNo ?
                    guarantorsDetails.guarantorRegistrationNo : '',
                guarantorRegistrationNoCT: guarantorsDetails.guarantorRegistrationNo ?
                    guarantorsDetails.guarantorRegistrationNo : '',
                guarantorRegistrationDateTrans: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value : '',
                guarantorRegistrationDateCT: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDate']).value : '',
                guarantorRegistrationDateNepaliTrans: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepali']).value : '',
                guarantorRegistrationDateNepaliCT: this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepali']).value ?
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegistrationDateNepali']).value : '',
                guarantorRegistrationDateOptionTrans: guarantorsDetails.guarantorRegistrationDateOption ?
                    guarantorsDetails.guarantorRegistrationDateOption : '',
                guarantorRegistrationDateOptionCT: guarantorsDetails.guarantorRegistrationDateOption ?
                    guarantorsDetails.guarantorRegistrationDateOption : '',

                guarantorIssuedDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrict']).value) ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrict']).value.nepaliName,
                guarantorIssuedDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrict']).value) ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorIssuedDistrict']).value.nepaliName,
                guarantorPanNoTrans: guarantorsDetails.guarantorPanNo ?
                    guarantorsDetails.guarantorPanNo : '',
                guarantorPanNoCT: guarantorsDetails.guarantorPanNo ?
                    guarantorsDetails.guarantorPanNo : '',

                guarantorRegisteredTypeTrans: guarantorsDetails.guarantorRegisteredType ?
                    guarantorsDetails.guarantorRegisteredType : '',
                guarantorRegisteredTypeCT: guarantorsDetails.guarantorRegisteredType ?
                    guarantorsDetails.guarantorRegisteredType : '',

                guarantorRegisteredProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value.nepaliName,
                guarantorRegisteredProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value.nepaliName,

                guarantorRegisteredDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value.nepaliName,
                guarantorRegisteredDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value.nepaliName,

                guarantorRegisteredMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value.nepaliName,
                guarantorRegisteredMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value.nepaliName,
                guarantorRegisteredWardNoTrans: guarantorsDetails.guarantorRegisteredWardNo ?
                    guarantorsDetails.guarantorRegisteredWardNo : '',
                guarantorRegisteredWardNoCT: guarantorsDetails.guarantorRegisteredWardNo ?
                    guarantorsDetails.guarantorRegisteredWardNo : '',
                guarantorRegisteredStreetToleTrans: guarantorsDetails.guarantorRegisteredStreetTole ?
                    guarantorsDetails.guarantorRegisteredStreetTole : '',
                guarantorRegisteredStreetToleCT: guarantorsDetails.guarantorRegisteredStreetTole ?
                    guarantorsDetails.guarantorRegisteredStreetTole : '',

                // Current Address
                guarantorCurrentTypeTrans: guarantorsDetails.guarantorCurrentType ?
                    guarantorsDetails.guarantorCurrentType : '',
                guarantorCurrentTypeCT: guarantorsDetails.guarantorCurrentType ?
                    guarantorsDetails.guarantorCurrentType : '',

                guarantorCurrentProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvince']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvince']).value.nepaliName,
                guarantorCurrentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvince']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvince']).value.nepaliName,

                guarantorCurrentDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrict']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrict']).value.nepaliName,
                guarantorCurrentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrict']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentDistrict']).value.nepaliName,

                guarantorCurrentMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipality']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipality']).value.nepaliName,
                guarantorCurrentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipality']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentMunicipality']).value.nepaliName,
                guarantorCurrentWardNoTrans: guarantorsDetails.guarantorCurrentWardNo ?
                    guarantorsDetails.guarantorCurrentWardNo : '',
                guarantorCurrentWardNoCT: guarantorsDetails.guarantorCurrentWardNo ?
                    guarantorsDetails.guarantorCurrentWardNo : '',
                guarantorCurrentStreetToleTrans: guarantorsDetails.guarantorCurrentStreetTole ?
                    guarantorsDetails.guarantorCurrentStreetTole : '',
                guarantorCurrentStreetToleCT: guarantorsDetails.guarantorCurrentStreetTole ?
                    guarantorsDetails.guarantorCurrentStreetTole : '',

                guarantorMaritalStatusCT: guarantorsDetails.guarantorMaritalStatus ? guarantorsDetails.guarantorMaritalStatus : '',
                guarantorMaritalStatusTrans: guarantorsDetails.guarantorMaritalStatus ? guarantorsDetails.guarantorMaritalStatus : '',

                // Guarantors flag

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
                if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value
                    || key.indexOf('id') > -1 || key.indexOf('nepData') > -1 || key === 'authorizedDobDateType' || key === 'detailsEntered' ||
                    key === 'detailsFrom') {
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
            this.translatedGuarantorDetails[index] = newArr;
            // this.deleteCTAndTransContorls(index);
            this.userConfigForm.get(['guarantorDetails', index, 'nepData']).setValue(JSON.stringify(newArr));
            // end guarantorDetails
            if (index === 0) {
                this.saveDisable = true;
            }
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
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.districts = response.detail;
                    this.districts.sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    // get permanent district/municipalities for joint customer
    getJointCustomerPermanentDistrictsById(provinceId: number, event, index) {
        if (!ObjectUtil.isEmpty(provinceId)) {
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
    }

    // get temporary district/municipalities for joint customer
    getJointCustomerTemporaryDistrictsById(provinceId: number, event, index) {
        if (!ObjectUtil.isEmpty(provinceId)) {
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
    }

// for permanent
    getJointCustomerPermanentMunicipalitiesById(districtId: number, event, index) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
    }

    // for temporary
    getJointCustomerTemporaryMunicipalitiesById(districtId: number, event, index) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
        if (!ObjectUtil.isEmpty(provinceId)) {
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
    }

    getGuarantorMunicipalitiesById(districtId: number, event, index) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
    }

    // get district/municipalities for guarantors
    getGuarantorTempDistrictsById(provinceId: number, event, index) {
        if (!ObjectUtil.isEmpty(provinceId)) {
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
    }

    getGuarantorTempMunicipalitiesById(districtId: number, event, index) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetTole']).patchValue(null);

            // Clear Trans Value:
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityTrans']).patchValue(null);
            // this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdcTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardTrans']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleTrans']).patchValue(null);

            // Clear CT Value:
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdcCT']).patchValue(null);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleCT']).patchValue(null);
        }
    }

    getAllEditedDistrictAndMunicipalities() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            if (this.oneFormCustomer.province !== null && this.oneFormCustomer.province.id !== null) {
                const province = new Province();
                province.id = this.oneFormCustomer.province.id;
                this.addressService.getDistrictByProvince(province).subscribe(
                    (response: any) => {
                        this.districts = response.detail;
                        this.districts.sort((a, b) => a.name.localeCompare(b.name));
                    }
                );
            }

            if (this.oneFormCustomer.district !== null && this.oneFormCustomer.district.id !== null) {
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

            if (this.oneFormCustomer.temporaryProvince !== null && this.oneFormCustomer.temporaryProvince.id !== null) {
                const province = new Province();
                province.id = this.oneFormCustomer.temporaryProvince.id;
                this.addressService.getDistrictByProvince(province).subscribe(
                    (response: any) => {
                        this.tempDistricts = response.detail;
                        this.tempDistricts.sort((a, b) => a.name.localeCompare(b.name));
                    }
                );
            }

            if (this.oneFormCustomer.temporaryDistrict !== null && this.oneFormCustomer.temporaryDistrict.id !== null) {
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
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.tempDistricts = response.detail;
                    this.tempDistricts.sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    compareFn(c1: any, c2: any): boolean {
        return c1 && c2 ? c1.id === c2.id : c1 === c2;
    }

    getMunicipalitiesById(districtId: number, event) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
    }

    getTempMunicipalitiesById(districtId: number, event) {
        if (!ObjectUtil.isEmpty(districtId)) {
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
            if (!ObjectUtil.isEmpty(this.loanHolder) &&
            !ObjectUtil.isEmpty(this.loanHolder.nepData)) {
                const parsedNepData = JSON.parse(this.loanHolder.nepData);
                if (!ObjectUtil.isEmpty(parsedNepData)) {
                    this.userConfigForm.get('issuedDate').patchValue(parsedNepData.issuedDate ? parsedNepData.issuedDate.en : undefined);
                    /*this.userConfigForm.get('citizenshipIssueDate').patchValue(JSON.parse(this.loanHolder.nepData).citizenshipIssueDate.en);*/
                    this.userConfigForm.get('dobDateType').patchValue(parsedNepData.dobDateType ? parsedNepData.dobDateType.en : undefined);
                    this.userConfigForm.get('issuedDate').patchValue(parsedNepData.issuedDate ? parsedNepData.issuedDate.en : undefined);
                    this.userConfigForm.get('permanentMunType').patchValue(parsedNepData.permanentMunType ? parsedNepData.permanentMunType.en : undefined);
                }
                this.setDobCitizenDate();
            }
            if (!ObjectUtil.isEmpty(this.oneFormCustomer) &&
            !ObjectUtil.isEmpty(this.oneFormCustomer.individualJsonData)) {
                const parsedIndividualData = JSON.parse(this.oneFormCustomer.individualJsonData);
                if (!ObjectUtil.isEmpty(parsedIndividualData)) {
                    this.addressSameAsAbove = parsedIndividualData.sameAddress ? parsedIndividualData.sameAddress : undefined;
                    this.userConfigForm.get('relationMedium').patchValue(parsedIndividualData.relationMedium ?
                        Number(parsedIndividualData.relationMedium) : undefined);
                    this.userConfigForm.get('municipalityOrVdc').patchValue(parsedIndividualData.municipalityOrVdc ? parsedIndividualData.municipalityOrVdc : undefined);
                    this.userConfigForm.get('temporaryMunicipalityOrVdc').patchValue(parsedIndividualData.temporaryMunicipalityOrVdc ? parsedIndividualData.temporaryMunicipalityOrVdc : undefined);
                }
            }
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
                    this.oneFormCustomer.wardNumber : (!ObjectUtil.isEmpty(this.loanHolder) &&
                        !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                        !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).permanentWard)) ?
                        JSON.parse(this.loanHolder.nepData).permanentWard.en : undefined,
                temporaryWard: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryWardNumber,
                citizenshipIssueDistrict: ObjectUtil.isEmpty(this.nepData) ? undefined : this.loanHolder.customerType === CustomerType.INDIVIDUAL ?
                    this.nepData.citizenshipIssueDistrict.ct : undefined,
                registrationNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    this.oneFormCustomer.registrationNumber : undefined,
                registeredMunType: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunType) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ? JSON.parse(this.loanHolder.nepData).registeredMunType.en : undefined,
                registeredProvince: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredProvince) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredProvince.en : undefined,
                registeredProvinceCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredProvince) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredProvince.en.nepaliName : undefined,
                registeredDistrict: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en : undefined,
                registeredDistrictCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en.nepaliName : undefined,
                registeredDistrictTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredDistrict.en.nepaliName : undefined,
                registeredMunicipality: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en : undefined,
                registeredMunicipalityCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en.nepaliName : undefined,
                registeredMunicipalityTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).registeredMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).registeredMunicipality.en.nepaliName : undefined,
                currentMunType: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunType) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunType.en : undefined,
                currentProvince: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en : undefined,
                currentProvinceTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en.nepaliName : undefined,
                currentProvinceCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentProvince) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentProvince.en.nepaliName : undefined,
                currentDistrict: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en : undefined,
                currentDistrictTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en.nepaliName : undefined,
                currentDistrictCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentDistrict) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentDistrict.en.nepaliName : undefined,
                currentMunicipality: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en : undefined,
                currentMunicipalityCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en.nepaliName : undefined,
                currentMunicipalityTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentMunicipality) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentMunicipality.en.nepaliName : undefined,
                currentWard: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentWard.en : undefined,
                currentWardTrans: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    JSON.parse(this.loanHolder.nepData).currentWard.np : undefined,
                currentWardCT: !ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.loanHolder.nepData) &&
                !ObjectUtil.isEmpty(JSON.parse(this.loanHolder.nepData).currentWard) &&
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
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
        }
    }
    setDobCitizenDate() {
        const tempData = JSON.parse(this.loanHolder.nepData);
        if (!ObjectUtil.isEmpty(tempData) &&
            !ObjectUtil.isEmpty(tempData.dobDateType) && !ObjectUtil.isEmpty(tempData.dobDateType.en)) {
            if (tempData.dobDateType.en === 'AD') {
                this.userConfigForm.get('dob').patchValue(!ObjectUtil.isEmpty(tempData.dob) &&
                    !ObjectUtil.isEmpty(tempData.dob.en) ? new Date(tempData.dob.en) : undefined);
            } else {
                this.userConfigForm.get('dobNepali').patchValue(!ObjectUtil.isEmpty(tempData.dobNepali) &&
                    !ObjectUtil.isEmpty(tempData.dobNepali.en) ? tempData.dobNepali.en : undefined);
            }
        }
        if (!ObjectUtil.isEmpty(tempData) &&
            !ObjectUtil.isEmpty(tempData.issuedDate) &&
            !ObjectUtil.isEmpty(tempData.issuedDate.en)) {
            if (tempData.issuedDate.en === 'AD') {
                this.userConfigForm.get('citizenshipIssueDate').patchValue(!ObjectUtil.isEmpty(tempData.citizenshipIssueDate) &&
                !ObjectUtil.isEmpty(tempData.citizenshipIssueDate.en) ? new Date(tempData.citizenshipIssueDate.en) : undefined);
            } else {
                this.userConfigForm.get('citizenshipIssueDateNepali').patchValue(!ObjectUtil.isEmpty(tempData.citizenshipIssueDateNepali) &&
                    !ObjectUtil.isEmpty(tempData.citizenshipIssueDateNepali.en) ? tempData.citizenshipIssueDateNepali.en : undefined);
            }
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
            if (!ObjectUtil.isEmpty(this.loanHolder.nepData)) {
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
                /*let registrationDate: any;
                if (this.customerType === CustomerType.INSTITUTION) {
                    if (this.nepData.registrationDateOption.en === 'BS') {
                        registrationDate = this.nepData.registrationDate.en;
                    } else {
                        registrationDate = this.oneFormCustomer.establishmentDate;
                    }
                }*/
                this.userConfigForm.patchValue({
                    panNo: !ObjectUtil.isEmpty(nepData.panNo) && !ObjectUtil.isEmpty(nepData.panNo.en) ? nepData.panNo.en : undefined,
                    branchCT: !ObjectUtil.isEmpty(nepData.branch) && !ObjectUtil.isEmpty(nepData.branch.ct) ? nepData.branch.ct : undefined,
                    customerCodeCT: !ObjectUtil.isEmpty(nepData.customerCode) && !ObjectUtil.isEmpty(nepData.customerCode.ct)
                        ? nepData.customerCode.ct : undefined,
                    nameCT: !ObjectUtil.isEmpty(nepData.name) && !ObjectUtil.isEmpty(nepData.name.np) ? nepData.name.np : undefined,
                    emailCT: !ObjectUtil.isEmpty(nepData.email) && !ObjectUtil.isEmpty(nepData.email.np) ? nepData.email.np : undefined,
                    contactNoCT: !ObjectUtil.isEmpty(nepData.contactNo) && !ObjectUtil.isEmpty(nepData.contactNo.ct) ?
                        nepData.contactNo.ct : undefined,
                    panNoCT: !ObjectUtil.isEmpty(nepData.panNo) && !ObjectUtil.isEmpty(nepData.panNo.np) ? nepData.panNo.np : undefined,
                    actName: !ObjectUtil.isEmpty(nepData.actName) && !ObjectUtil.isEmpty(nepData.actName.en) ? nepData.actName.en : undefined,
                    actNameCT: !ObjectUtil.isEmpty(nepData.actName) && !ObjectUtil.isEmpty(nepData.actName.ct) ? nepData.actName.ct : undefined,
                    actNameTrans: !ObjectUtil.isEmpty(nepData.actName) && !ObjectUtil.isEmpty(nepData.actName.np) ?
                        nepData.actName.np : undefined,
                    authorizedBodyName: !ObjectUtil.isEmpty(nepData.authorizedBodyName) && !ObjectUtil.isEmpty(nepData.authorizedBodyName.en)
                        ? nepData.authorizedBodyName.en : undefined,
                    authorizedBodyNameCT: !ObjectUtil.isEmpty(nepData.authorizedBodyName) && !ObjectUtil.isEmpty(nepData.authorizedBodyName.ct) ?
                        nepData.authorizedBodyName.ct : undefined,
                    authorizedBodyNameTrans: !ObjectUtil.isEmpty(nepData.authorizedBodyName) &&
                    !ObjectUtil.isEmpty(nepData.authorizedBodyName.np) ?
                        nepData.authorizedBodyName.np : undefined,
                    issuingDistrict: !ObjectUtil.isEmpty(nepData.issuingDistrict) && !ObjectUtil.isEmpty(nepData.issuingDistrict.en) ?
                        nepData.issuingDistrict.en : undefined,
                    issuingDistrictCT: !ObjectUtil.isEmpty(nepData.issuingDistrict) && !ObjectUtil.isEmpty(nepData.issuingDistrict.ct) ?
                        nepData.issuingDistrict.ct : undefined,
                    issuingDistrictTrans: !ObjectUtil.isEmpty(nepData.issuingDistrict) && !ObjectUtil.isEmpty(nepData.issuingDistrict.ct) ?
                        nepData.issuingDistrict.ct : undefined,
                    registeredWith: !ObjectUtil.isEmpty(nepData.registeredWith) && !ObjectUtil.isEmpty(nepData.registeredWith.en) ?
                        nepData.registeredWith.en : undefined,
                    registeredWithCT: !ObjectUtil.isEmpty(nepData.registeredWith) && !ObjectUtil.isEmpty(nepData.registeredWith.ct) ?
                        nepData.registeredWith.ct : undefined,
                    registeredWithTrans: !ObjectUtil.isEmpty(nepData.registeredWith) && !ObjectUtil.isEmpty(nepData.registeredWith.np) ?
                        nepData.registeredWith.np : undefined,
                    registeredStreetTole: !ObjectUtil.isEmpty(nepData.registeredStreetTole) &&
                    !ObjectUtil.isEmpty(nepData.registeredStreetTole.en) ?
                        nepData.registeredStreetTole.en : undefined,
                    registeredStreetToleTrans: !ObjectUtil.isEmpty(nepData.registeredStreetTole) &&
                    !ObjectUtil.isEmpty(nepData.registeredStreetTole.np) ?
                        nepData.registeredStreetTole.np : undefined,
                    registeredStreetToleCT: !ObjectUtil.isEmpty(nepData.registeredStreetTole) &&
                    !ObjectUtil.isEmpty(nepData.registeredStreetTole.ct) ?
                        nepData.registeredStreetTole.ct : undefined,
                    currentStreetTole: !ObjectUtil.isEmpty(nepData.currentStreetTole) && !ObjectUtil.isEmpty(nepData.currentStreetTole.en) ?
                        nepData.currentStreetTole.en : undefined,
                    currentStreetToleTrans: !ObjectUtil.isEmpty(nepData.currentStreetTole) && !ObjectUtil.isEmpty(nepData.currentStreetTole.np) ?
                        nepData.currentStreetTole.np : undefined,
                    currentStreetToleCT: !ObjectUtil.isEmpty(nepData.currentStreetTole) && !ObjectUtil.isEmpty(nepData.currentStreetTole.ct) ?
                        nepData.currentStreetTole.ct : undefined,
                    radioActYearDate: !ObjectUtil.isEmpty(nepData.radioActYearDate) && !ObjectUtil.isEmpty(nepData.radioActYearDate.en) ?
                        nepData.radioActYearDate.en : undefined,
                    actYear: !ObjectUtil.isEmpty(nepData.actYear) && !ObjectUtil.isEmpty(nepData.actYear.en) ?
                        nepData.actYear.en : undefined,
                    citizenshipNoCT: !ObjectUtil.isEmpty(nepData.citizenshipNumber) && !ObjectUtil.isEmpty(nepData.citizenshipNumber.np) ?
                        nepData.citizenshipNumber.np : undefined,
                    genderCT: !ObjectUtil.isEmpty(nepData.gender) && !ObjectUtil.isEmpty(nepData.gender.np) ?
                        nepData.gender.np : undefined,
                    permanentProvinceCT: !ObjectUtil.isEmpty(nepData.permanentProvince) && !ObjectUtil.isEmpty(nepData.permanentProvince.np) ?
                        nepData.permanentProvince.np : undefined,
                    permanentDistrictCT: !ObjectUtil.isEmpty(nepData.permanentDistrict) && !ObjectUtil.isEmpty(nepData.permanentDistrict.np) ?
                        nepData.permanentDistrict.np : undefined,
                    registrationDateOption: !ObjectUtil.isEmpty(nepData.registrationDateOption) &&
                    !ObjectUtil.isEmpty(nepData.registrationDateOption.en) ?
                        nepData.registrationDateOption.en : undefined,
                    registrationDate: !ObjectUtil.isEmpty(nepData.registrationDate) && !ObjectUtil.isEmpty(nepData.registrationDate.en) ?
                        new Date(nepData.registrationDate.en) : undefined,
                    registrationDateTrans: ObjectUtil.isEmpty(this.userConfigForm.get('registrationDate').value) ?
                        undefined : this.userConfigForm.get('registrationDate').value,
                    registrationDateCT: ObjectUtil.isEmpty(this.userConfigForm.get('registrationDate').value) ?
                        undefined : this.userConfigForm.get('registrationDate').value,

                    registrationDateNepali: !ObjectUtil.isEmpty(nepData.registrationDateNepali) &&
                    !ObjectUtil.isEmpty(nepData.registrationDateNepali.en) ?
                        nepData.registrationDateNepali.en : undefined,
                    registrationDateNepaliTrans: ObjectUtil.isEmpty(this.userConfigForm.get('registrationDateNepali').value) ?
                        undefined : this.userConfigForm.get('registrationDateNepali').value,
                    registrationDateNepaliCT: ObjectUtil.isEmpty(this.userConfigForm.get('registrationDateNepali').value) ?
                        undefined : this.userConfigForm.get('registrationDateNepali').value,

                    // permanentMunicipality: !ObjectUtil.isEmpty(nepData.permanentMunicipality) ? nepData.permanentMunicipality.np : undefined,
                    temporaryProvinceCT: !ObjectUtil.isEmpty(nepData.temporaryProvince) && !ObjectUtil.isEmpty(nepData.temporaryProvince.np) ?
                        nepData.temporaryProvince.np : undefined,
                    temporaryDistrictCT: !ObjectUtil.isEmpty(nepData.temporaryDistrict) && !ObjectUtil.isEmpty(nepData.temporaryDistrict.np) ?
                        nepData.temporaryDistrict.np : undefined,
                    temporaryMunicipalityCT: !ObjectUtil.isEmpty(nepData.temporaryMunicipality) &&
                    !ObjectUtil.isEmpty(nepData.temporaryMunicipality.ct) ?
                        nepData.temporaryMunicipality.ct : undefined,
                    permanentMunicipalityCT: !ObjectUtil.isEmpty(nepData.permanentMunicipality) &&
                    !ObjectUtil.isEmpty(nepData.permanentMunicipality.ct) ?
                        nepData.permanentMunicipality.ct : undefined,
                    permanentWardCT: !ObjectUtil.isEmpty(nepData.permanentWard) && !ObjectUtil.isEmpty(nepData.permanentWard.np) ?
                        nepData.permanentWard.np : undefined,
                    temporaryWardCT: !ObjectUtil.isEmpty(nepData.temporaryWard) && !ObjectUtil.isEmpty(nepData.temporaryWard.np) ?
                        nepData.temporaryWard.np : undefined,
                    // citizenshipIssueDateCT: !ObjectUtil.isEmpty(nepData.citizenshipIssueDate) ? nepData.citizenshipIssueDate.np : undefined,
                    // dobCT: !ObjectUtil.isEmpty(nepData.permanentMunicipality) ? nepData.permanentMunicipality.np : undefined,
                    // citizenshipIssueDistrictCT: !ObjectUtil.isEmpty(nepData.permanentMunicipality) ?
                    // nepData.permanentMunicipality.np : undefined,
                    registrationNoCT: ObjectUtil.isEmpty(nepData.registrationNo) ? undefined :
                        this.loanHolder.customerType === CustomerType.INSTITUTION ?
                            nepData.registrationNo.ct : undefined
                });
            }
        }
    }

    patchIndividualData() {
        if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
            const memberData = JSON.parse(this.oneFormCustomer.individualJsonData);
            this.userConfigForm.patchValue({
                relationMedium: ObjectUtil.isEmpty(memberData.relationMedium) ? undefined : memberData.relationMedium,
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
        if (!ObjectUtil.isEmpty(this.translatedValues)) {
            this.userConfigForm.patchValue({
                nameCT: this.translatedValues.name ? this.translatedValues.name : '',
                emailCT: this.translatedValues.email ? this.translatedValues.email : '',
                // contactNoCT: this.translatedValues.contactNo ? this.translatedValues.contactNo : ',
                // panNoCT: this.translatedValues.panNo ? this.translatedValues.panNo : ',
                genderCT: this.translatedValues.gender ? this.translatedValues.gender : '',
                relationMediumCT: this.translatedValues.relationMedium ? this.translatedValues.relationMedium : '',
                fatherNameCT: this.translatedValues.fatherName ? this.translatedValues.fatherName : '',
                grandFatherNameCT: this.translatedValues.grandFatherName ? this.translatedValues.grandFatherName : '',
                husbandNameCT: this.translatedValues.husbandName ? this.translatedValues.husbandName : '',
                fatherInLawNameCT: this.translatedValues.fatherInLawName ? this.translatedValues.fatherInLawName : '',
                citizenshipNoCT: this.translatedValues.citizenshipNo ? this.translatedValues.citizenshipNo : '',
            });
        }
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
            currentProvinceCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('currentProvince').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('currentProvince').value.nepaliName)) ? this.userConfigForm.get('currentProvince').value.nepaliName : '',
            currentDistrictCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('currentDistrict').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('currentDistrict').value.nepaliName)) ? this.userConfigForm.get('currentDistrict').value.nepaliName : '',
            currentMunicipalityCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('currentMunicipality').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('currentMunicipality').value.nepaliName)) ? this.userConfigForm.get('currentMunicipality').value.nepaliName : '',
            registeredProvinceCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('registeredProvince').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('registeredProvince').value.nepaliName)) ? this.userConfigForm.get('registeredProvince').value.nepaliName : '',
            registeredDistrictCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('registeredDistrict').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('registeredDistrict').value.nepaliName)) ? this.userConfigForm.get('registeredDistrict').value.nepaliName : '',
            registeredMunicipalityCT: (!ObjectUtil.isEmpty(this.userConfigForm.get('registeredMunicipality').value) &&
                !ObjectUtil.isEmpty(this.userConfigForm.get('registeredMunicipality').value.nepaliName)) ? this.userConfigForm.get('registeredMunicipality').value.nepaliName : '',
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
            this.userConfigForm.get(['ownerDetails', index, fieldName + 'Trans']).patchValue(ownerTranslatedData[fieldName] ? ownerTranslatedData[fieldName] : '');
            this.userConfigForm.get(['ownerDetails', index, fieldName + 'CT']).patchValue(ownerTranslatedData[fieldName] ? ownerTranslatedData[fieldName] : '');
        }
    }

    async translateActYear(fieldName: any) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.userConfigForm.get(fieldName).value.toString());
        this.userConfigForm.get(fieldName).patchValue(wordLabelVar);
    }

    actYearTr(val, fieldName) {
        if (val === 'BS') {
            const wordLabelVar = this.engToNepaliNumberPipe.transform(this.userConfigForm.get(fieldName).value.toString());
            this.userConfigForm.get(fieldName).patchValue(wordLabelVar);
        }
    }

    guarantorActYearTr(val, fieldName, i) {
        if (val === 'BS') {
            const wordLabelVar = this.engToNepaliNumberPipe.transform(this.userConfigForm.get(
                ['guarantorDetails', i, fieldName]).value.toString());
            this.userConfigForm.get(['guarantorDetails', i , fieldName]).patchValue(wordLabelVar);
        }
    }

    async translateGuaActYear(fieldName: any, i: number) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.userConfigForm.get(['guarantorDetails', i, fieldName]).value.toString());
        this.userConfigForm.get(['guarantorDetails', i , fieldName]).patchValue(wordLabelVar);
    }

    translateJointCustomerSectionNumberField(arrName, source, index, target) {
        const translatedNepaliNum = this.engToNepaliNumberPipe.transform(String(this.userConfigForm.get([String(arrName), index, String(source)]).value));
        this.userConfigForm.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
        this.userConfigForm.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
    }

    translateNumberInFA(source, i) {
        const wordLabelVar = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(
            this.userConfigForm.get(['guarantorDetails', i, source]).value ?
            this.userConfigForm.get(['guarantorDetails', i, source]).value.toString() : ''));
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
            if (this.userConfigForm.get('relationMediumCT').value === null) {
                this.userConfigForm.get('relationMediumCT').patchValue(ObjectUtil.isEmpty(this.nepData.relationMedium) ? undefined : this.nepData.relationMedium.ct);
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
        // this.userConfigForm.get('dobTrans').patchValue(this.translatedValues.dob);
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
        // this.userConfigForm.get('citizenshipIssueDateTrans').patchValue(this.translatedValues.citizenshipIssueDate);
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
        if (!ObjectUtil.isEmpty(this.nepData)) {
            this.userConfigForm.get('citizenshipNoCT').patchValue(
                ObjectUtil.isEmpty(this.nepData.citizenshipNo) ? undefined : this.nepData.citizenshipNo.ct);
            this.userConfigForm.get('citizenshipIssueDistrictCT').patchValue(
                ObjectUtil.isEmpty(this.nepData.citizenshipIssueDistrict) ? undefined : this.nepData.citizenshipIssueDistrict.ct
            );
            // this.userConfigForm.get('permanentMunicipalityCT').patchValue(
            //     ObjectUtil.isEmpty(this.nepData.temporaryMunicipality) ? undefined : this.nepData.temporaryMunicipality.en.nepaliName
            // );
            this.userConfigForm.get('branchTrans').patchValue(ObjectUtil.isEmpty(this.nepData.branch) ?
                undefined : this.nepData.branch.en.nepaliName);
            this.userConfigForm.get('nameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.name) ? undefined : this.nepData.name.np);
            this.userConfigForm.get('emailTrans').patchValue(ObjectUtil.isEmpty(this.nepData.email) ? undefined : this.nepData.email.np);
            this.userConfigForm.get('contactNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.contactNo) ?
                undefined : this.nepData.contactNo.ct);
            this.userConfigForm.get('panNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.panNo) ? undefined : this.nepData.panNo.np);
            this.userConfigForm.get('customerCodeTrans').patchValue(ObjectUtil.isEmpty(this.nepData.customerCode) ?
                undefined : this.nepData.customerCode.ct);
            this.userConfigForm.get('genderTrans').patchValue(ObjectUtil.isEmpty(this.nepData.gender) ? undefined : this.nepData.gender.np);
            this.userConfigForm.get('fatherNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.fatherName) ?
                undefined : this.nepData.fatherName.ct);
            this.userConfigForm.get('grandFatherNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.grandFatherName) ?
                undefined : this.nepData.grandFatherName.ct);
            this.userConfigForm.get('relationMediumTrans').patchValue(ObjectUtil.isEmpty(this.nepData.relationMedium) ?
                undefined : this.nepData.relationMedium.np);
            this.userConfigForm.get('husbandNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.husbandName) ?
                undefined : this.nepData.husbandName.np);
            this.userConfigForm.get('fatherInLawNameTrans').patchValue(ObjectUtil.isEmpty(this.nepData.fatherInLawName) ?
                undefined : this.nepData.fatherInLawName.np);
            this.userConfigForm.get('citizenshipNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.citizenshipNo) ?
                undefined : this.nepData.citizenshipNo.np);
            this.userConfigForm.get('permanentProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentProvince) ?
                undefined : this.nepData.permanentProvince.en.nepaliName);
            this.userConfigForm.get('permanentDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentDistrict) ?
                undefined : this.nepData.permanentDistrict.en.nepaliName);
            this.userConfigForm.get('permanentMunicipalityTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentMunicipality) ?
                undefined : this.nepData.permanentMunicipality.en.nepaliName);
            this.userConfigForm.get('temporaryProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryProvince) ?
                undefined : this.nepData.temporaryProvince.en.nepaliName);
            this.userConfigForm.get('temporaryDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryDistrict) ?
                undefined : this.nepData.temporaryDistrict.en.nepaliName);
            this.userConfigForm.get('temporaryMunicipalityTrans').patchValue(
                ObjectUtil.isEmpty(this.nepData.temporaryMunicipality) ? undefined : this.nepData.temporaryMunicipality.en.nepaliName);
            this.userConfigForm.get('permanentWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentWard) ?
                undefined : this.nepData.permanentWard.np);
            this.userConfigForm.get('temporaryWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.temporaryWard) ?
                undefined : this.nepData.temporaryWard.np);
            this.userConfigForm.get('citizenshipIssueDistrictTrans').patchValue(ObjectUtil.isEmpty(this.nepData.citizenshipIssueDistrict) ?
                undefined : this.nepData.citizenshipIssueDistrict.ct);
            if (this.loanHolder.customerType === CustomerType.INSTITUTION) {
                this.userConfigForm.get('registrationNoTrans').patchValue(ObjectUtil.isEmpty(this.nepData.registrationNo) ? undefined :
                    this.loanHolder.customerType === CustomerType.INSTITUTION ?
                        this.nepData.registrationNo.ct : undefined);
                this.userConfigForm.get('registeredProvinceTrans').patchValue(ObjectUtil.isEmpty(this.nepData.registeredProvince) ?
                    undefined :
                    this.loanHolder.customerType === CustomerType.INSTITUTION ?
                        this.nepData.registeredProvince.en.nepaliName : undefined);
                // this.userConfigForm.get('registeredWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentWard) ? undefined :
                //     this.loanHolder.customerType === CustomerType.INSTITUTION ?
                //         this.nepData.permanentWard.ct : undefined);
            }
        }
    }

    addOwnerDetailsField() {
        return this.formBuilder.group({
            ownerName: [undefined],
            ownerNameTrans: [undefined],
            ownerNameCT: [undefined],
            ownerDob: [undefined],
            ownerDobTrans: [undefined],
            ownerDobCT: [undefined],
            ownerDobNepali: [undefined],
            ownerDobNepaliTrans: [undefined],
            ownerDobNepaliCT: [undefined],
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
            ownerCitizenshipIssuedDateNepali: [undefined],
            ownerCitizenshipIssuedDateNepaliTrans: [undefined],
            ownerCitizenshipIssuedDateNepaliCT: [undefined],

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
            ownerOtherAddressTemp: [undefined],
            ownerOtherAddressTempTrans: [undefined],
            ownerOtherAddressTempCT : [undefined],

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

            foreignAddressOptionTemp: [undefined],
            foreignAddressOptionTempTrans: [undefined],
            foreignAddressOptionTempCT: [undefined],


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
            otherOwnerPassportIssuedDateNepali: [undefined],
            otherOwnerPassportIssuedDateNepaliTrans: [undefined],
            otherOwnerPassportIssuedDateNepaliCT: [undefined],
            otherOwnerPassportIssuedDateOption: [undefined],
            otherOwnerPassportIssuedDateOptionTrans: [undefined],
            otherOwnerPassportIssuedDateOptionCT: [undefined],
            otherOwnerPassportValidityDate: [undefined],
            otherOwnerPassportValidityDateTrans: [undefined],
            otherOwnerPassportValidityDateCT: [undefined],
            otherOwnerPassportValidityDateNepali: [undefined],
            otherOwnerPassportValidityDateNepaliTrans: [undefined],
            otherOwnerPassportValidityDateNepaliCT: [undefined],
            otherOwnerPassportValidityDateOption: [undefined],
            otherOwnerPassportValidityDateOptionTrans: [undefined],
            otherOwnerPassportValidityDateOptionCT: [undefined],
            otherOwnerPassportIssuedFrom: [undefined],
            otherOwnerPassportIssuedFromTrans: [undefined],
            otherOwnerPassportIssuedFromCT: [undefined],
            isAuthorizedPerson: [undefined],
            isAuthorizedPersonTrans: [undefined],
            isAuthorizedPersonCT: [undefined],
        });
        this.shareHolderArray = this.userConfigForm.get('ownerDetails').value;
    }

    patchOwnerDetails() {
        if (this.customerType === CustomerType.INSTITUTION) {
            if (!ObjectUtil.isEmpty(this.oneFormCustomer) && !ObjectUtil.isEmpty(this.oneFormCustomer.companyJsonData)) {
                const nepData = JSON.parse(this.oneFormCustomer.companyJsonData);
                const ownerDetailControl = this.userConfigForm.get('ownerDetails') as FormArray;
                nepData.forEach((data, index) => {
                    this.getDistrictsByIdForOwner(data.ownerPermanentProvince ? data.ownerPermanentProvince.id : null, null, index);
                    this.getMunicipalitiesByIdForOwner(data.ownerPermanentDistrict ? data.ownerPermanentDistrict.id : null, null, index);
                    this.getDistrictsByIdForOwnerTemp(data.ownerTemporaryProvince ? data.ownerTemporaryProvince.id : null, null, index);
                    this.getMunicipalitiesByIdForOwnerTemp(data.ownerTemporaryDistrict ? data.ownerTemporaryDistrict.id : null, null, index);

                    ownerDetailControl.push(
                        this.formBuilder.group({
                            ownerName: data.ownerName ? data.ownerName : '',
                            ownerNameTrans: data.ownerNameTrans ? data.ownerNameTrans : '',
                            ownerNameCT: data.ownerNameCT ? data.ownerNameCT : '',
                            ownerDob: ObjectUtil.isEmpty(data.ownerDob) ? undefined : data.ownerDob ? new Date(data.ownerDob) : '',
                            ownerDobTrans: data.ownerDobTrans ? data.ownerDobTrans : '',
                            ownerDobCT: data.ownerDobCT ? data.ownerDobCT : '',
                            ownerDobNepali: ObjectUtil.isEmpty(data.ownerDobNepaliCT) ? undefined : data.ownerDobNepaliCT ? data.ownerDobNepaliCT : '',
                            ownerDobNepaliTrans: data.ownerDobNepaliTrans ? data.ownerDobNepaliTrans : '',
                            ownerDobNepaliCT: data.ownerDobNepaliCT ? data.ownerDobNepaliCT : '',
                            ownerEmail: data.ownerEmail ? data.ownerEmail : '',
                            ownerEmailTrans: data.ownerEmailTrans ? data.ownerEmailTrans : '',
                            ownerEmailCT: data.ownerEmailCT ? data.ownerEmailCT : '',
                            ownerContactNo: data.ownerContactNo ? data.ownerContactNo : '',
                            ownerContactNoTrans: data.ownerContactNoTrans ? data.ownerContactNoTrans : '',
                            ownerContactNoCT: data.ownerContactNoCT ? data.ownerContactNoCT : '',
                            ownerGender: data.ownerGender ? data.ownerGender : '',
                            ownerGenderTrans: data.ownerGenderTrans ? data.ownerGenderTrans : '',
                            ownerGenderCT: data.ownerGenderCT ? data.ownerGenderCT : '',
                            ownerMaritalStatus: data.ownerMaritalStatus ? data.ownerMaritalStatus : '',
                            ownerMaritalStatusTrans: data.ownerMaritalStatusTrans ? data.ownerMaritalStatusTrans : '',
                            ownerMaritalStatusCT: data.ownerMaritalStatusCT ? data.ownerMaritalStatusCT : '',
                            ownerCitizenshipNo: data.ownerCitizenshipNo ? data.ownerCitizenshipNo : '',
                            ownerCitizenshipNoTrans: data.ownerCitizenshipNoTrans ? data.ownerCitizenshipNoTrans : '',
                            ownerCitizenshipNoCT: data.ownerCitizenshipNoCT ? data.ownerCitizenshipNoCT : '',
                            ownerCitizenshipIssuedDistrict: data.ownerCitizenshipIssuedDistrict ? data.ownerCitizenshipIssuedDistrict : '',
                            ownerCitizenshipIssuedDistrictTrans: data.ownerCitizenshipIssuedDistrictTrans ? data.ownerCitizenshipIssuedDistrictTrans : '',
                            ownerCitizenshipIssuedDistrictCT: data.ownerCitizenshipIssuedDistrictCT ? data.ownerCitizenshipIssuedDistrictCT : '',
                            ownerCitizenshipIssuedDate: data.ownerCitizenshipIssuedDate !== '' ?
                                new Date(data.ownerCitizenshipIssuedDate) : '',
                            ownerCitizenshipIssuedDateNepali: data.ownerCitizenshipIssuedDateNepali !== '' ?
                                data.ownerCitizenshipIssuedDateNepali : '',
                            ownerCitizenshipIssuedDateTrans: data.ownerCitizenshipIssuedDateTrans ? data.ownerCitizenshipIssuedDateTrans : '',
                            ownerCitizenshipIssuedDateCT: data.ownerCitizenshipIssuedDateCT ? data.ownerCitizenshipIssuedDateCT : '',
                            ownerCitizenshipIssuedDateNepaliTrans: data.ownerCitizenshipIssuedDateNepaliTrans ? data.ownerCitizenshipIssuedDateNepaliTrans : '',
                            ownerCitizenshipIssuedDateNepaliCT: data.ownerCitizenshipIssuedDateNepaliCT ? data.ownerCitizenshipIssuedDateNepaliCT : '',
                            radioOwnerCitizenshipIssuedDate: data.radioOwnerCitizenshipIssuedDate ? data.radioOwnerCitizenshipIssuedDate : '',
                            radioOwnerCitizenshipIssuedDateTrans: data.radioOwnerCitizenshipIssuedDateTrans ? data.radioOwnerCitizenshipIssuedDateTrans : '',
                            radioOwnerCitizenshipIssuedDateCT: data.radioOwnerCitizenshipIssuedDateCT ? data.radioOwnerCitizenshipIssuedDateCT : '',
                            ownerPanNo: data.ownerPanNo ? data.ownerPanNo : '',
                            ownerPanNoTrans: data.ownerPanNoTrans ? data.ownerPanNoTrans : '',
                            ownerPanNoCT: data.ownerPanNoCT ? data.ownerPanNoCT : '',
                            ownerSharePercentage: data.ownerSharePercentage ? data.ownerSharePercentage : '',
                            ownerSharePercentageTrans: data.ownerSharePercentageTrans ? data.ownerSharePercentageTrans : '',
                            ownerSharePercentageCT: data.ownerSharePercentageCT ? data.ownerSharePercentageCT : '',
                            radioOwnerDob: 'AD',
                            radioOwnerDobTrans: data.radioOwnerDobTrans ? data.radioOwnerDobTrans : '',
                            radioOwnerDobCT: data.radioOwnerDobCT ? data.radioOwnerDobCT : '',
                            nepData: data.nepData ? data.nepData : '',
                            foreignAddressOption: data.foreignAddressOption ? data.foreignAddressOption : '',
                            foreignAddressOptionTrans: data.foreignAddressOptionTrans ? data.foreignAddressOptionTrans : '',
                            foreignAddressOptionCT: data.foreignAddressOptionCT ? data.foreignAddressOptionCT : '',
                            foreignAddressOptionTemp: data.foreignAddressOptionTemp ? data.foreignAddressOptionTemp : '',
                            foreignAddressOptionTempTrans: data.foreignAddressOptionTempTrans ? data.foreignAddressOptionTempTrans : '',
                            foreignAddressOptionTempCT: data.foreignAddressOptionTempCT ? data.foreignAddressOptionTempCT : '',
                            ownerOtherAddress: data.ownerOtherAddress ? data.ownerOtherAddress : '',
                            ownerOtherAddressTrans: data.ownerOtherAddressTrans ? data.ownerOtherAddressTrans : '',
                            ownerOtherAddressCT: data.ownerOtherAddressCT ? data.ownerOtherAddressCT : '',
                            ownerOtherAddressTemp: data.ownerOtherAddressTemp ? data.ownerOtherAddressTemp : '',
                            ownerOtherAddressTempTrans: data.ownerOtherAddressTempTrans ? data.ownerOtherAddressTempTrans : '',
                            ownerOtherAddressTempCT: data.ownerOtherAddressTempCT ? data.ownerOtherAddressTempCT : '',

                            // Relations Details

                            ownerFatherName: data.ownerFatherName ? data.ownerFatherName : '',
                            ownerFatherNameCT: data.ownerFatherNameCT ? data.ownerFatherNameCT : '',
                            ownerFatherNameTrans: data.ownerFatherNameTrans ? data.ownerFatherNameTrans : '',
                            ownerGrandFatherName: data.ownerGrandFatherName ? data.ownerGrandFatherName : '',
                            ownerGrandFatherNameTrans: data.ownerGrandFatherNameTrans ? data.ownerGrandFatherNameTrans : '',
                            ownerGrandFatherNameCT: data.ownerGrandFatherNameCT ? data.ownerGrandFatherNameCT : '',
                            ownerFatherInLawName: data.ownerFatherInLawName ? data.ownerFatherInLawName : '',
                            ownerFatherInLawNameTrans: data.ownerFatherInLawNameTrans ? data.ownerFatherInLawNameTrans : '',
                            ownerFatherInLawNameCT: data.ownerFatherInLawNameCT ? data.ownerFatherInLawNameCT : '',
                            ownerHusbandName: data.ownerHusbandName ? data.ownerHusbandName : '',
                            ownerHusbandNameTrans: data.ownerHusbandNameTrans ? data.ownerHusbandNameTrans : '',
                            ownerHusbandNameCT: data.ownerHusbandNameCT ? data.ownerHusbandNameCT : '',
                            ownerRelationMedium: data.ownerRelationMedium ? data.ownerRelationMedium : '',
                            ownerRelationMediumTrans: data.ownerRelationMediumTrans ? data.ownerRelationMediumTrans : '',
                            ownerRelationMediumCT: data.ownerRelationMediumCT ? data.ownerRelationMediumCT : '',
                            ownerDobDateType: data.ownerDobDateType ? data.ownerDobDateType : '',
                            ownerDobDateTypeTrans: data.ownerDobDateTypeTrans ? data.ownerDobDateTypeTrans : '',
                            ownerDobDateTypeCT: data.ownerDobDateTypeCT ? data.ownerDobDateTypeCT : '',


                            //    address Details
                            // for permanent
                            ownerPermanentProvince: data.ownerPermanentProvince ? data.ownerPermanentProvince : '',
                            ownerPermanentProvinceTrans: data.ownerPermanentProvinceTrans ? data.ownerPermanentProvinceTrans : '',
                            ownerPermanentProvinceCT: data.ownerPermanentProvinceCT ? data.ownerPermanentProvinceCT : '',
                            ownerPermanentDistrict: data.ownerPermanentDistrict ? data.ownerPermanentDistrict : '',
                            ownerPermanentDistrictTrans: data.ownerPermanentDistrictTrans ? data.ownerPermanentDistrictTrans : '',
                            ownerPermanentDistrictCT: data.ownerPermanentDistrictCT ? data.ownerPermanentDistrictCT : '',
                            ownerPermanentMunicipality: data.ownerPermanentMunicipality ? data.ownerPermanentMunicipality : '',
                            ownerPermanentMunicipalityTrans: data.ownerPermanentMunicipalityTrans ? data.ownerPermanentMunicipalityTrans : '',
                            ownerPermanentMunicipalityCT: data.ownerPermanentMunicipalityCT ? data.ownerPermanentMunicipalityCT : '',
                            ownerPermanentWardNo: data.ownerPermanentWardNo ? data.ownerPermanentWardNo : '',
                            ownerPermanentWardNoTrans: data.ownerPermanentWardNoTrans ? data.ownerPermanentWardNoTrans : '',
                            ownerPermanentWardNoCT: data.ownerPermanentWardNoCT ? data.ownerPermanentWardNoCT : '',
                            ownerPermanentStreetTole: data.ownerPermanentStreetTole ? data.ownerPermanentStreetTole : '',
                            ownerPermanentStreetToleTrans: data.ownerPermanentStreetToleTrans ? data.ownerPermanentStreetToleTrans : '',
                            ownerPermanentStreetToleCT: data.ownerPermanentStreetToleCT ? data.ownerPermanentStreetToleCT : '',

                            //    for temporary

                            ownerTemporaryProvince: data.ownerTemporaryProvince ? data.ownerTemporaryProvince : '',
                            ownerTemporaryProvinceTrans: data.ownerTemporaryProvinceTrans ? data.ownerTemporaryProvinceTrans : '',
                            ownerTemporaryProvinceCT: data.ownerTemporaryProvinceCT ? data.ownerTemporaryProvinceCT : '',
                            ownerTemporaryDistrict: data.ownerTemporaryDistrict ? data.ownerTemporaryDistrict : '',
                            ownerTemporaryDistrictTrans: data.ownerTemporaryDistrictTrans ? data.ownerTemporaryDistrictTrans : '',
                            ownerTemporaryDistrictCT: data.ownerTemporaryDistrictCT ? data.ownerTemporaryDistrictCT : '',
                            ownerTemporaryMunicipality: data.ownerTemporaryMunicipality ? data.ownerTemporaryMunicipality : '',
                            ownerTemporaryMunicipalityTrans: data.ownerTemporaryMunicipalityTrans ? data.ownerTemporaryMunicipalityTrans : '',
                            ownerTemporaryMunicipalityCT: data.ownerTemporaryMunicipalityCT ? data.ownerTemporaryMunicipalityCT : '',
                            ownerTemporaryWardNo: data.ownerTemporaryWardNo ? data.ownerTemporaryWardNo : '',
                            ownerTemporaryWardNoTrans: data.ownerTemporaryWardNoTrans ? data.ownerTemporaryWardNoTrans : '',
                            ownerTemporaryWardNoCT: data.ownerTemporaryWardNoCT ? data.ownerTemporaryWardNoCT : '',
                            ownerTemporaryStreetTole: data.ownerTemporaryStreetTole ? data.ownerTemporaryStreetTole : '',
                            ownerTemporaryStreetToleTrans: data.ownerTemporaryStreetToleTrans ? data.ownerTemporaryStreetToleTrans : '',
                            ownerTemporaryStreetToleCT: data.ownerTemporaryStreetToleCT ? data.ownerTemporaryStreetToleCT : '',

                            // address flag

                            ownerPermanentAddressRadio: data.ownerPermanentAddressRadio ? data.ownerPermanentAddressRadio : '',
                            ownerPermanentAddressRadioTrans: data.ownerPermanentAddressRadioTrans ? data.ownerPermanentAddressRadioTrans : '',
                            ownerPermanentAddressRadioCT: data.ownerPermanentAddressRadioCT ? data.ownerPermanentAddressRadioCT : '',
                            ownerTemporaryAddressRadio: data.ownerTemporaryAddressRadio ? data.ownerTemporaryAddressRadio : '',
                            ownerTemporaryAddressRadioTrans: data.ownerTemporaryAddressRadioTrans ? data.ownerTemporaryAddressRadioTrans : '',
                            ownerTemporaryAddressRadioCT: data.ownerTemporaryAddressRadioCT ? data.ownerTemporaryAddressRadioCT : '',

                            isSameTemporaryAndPermanent: data.isSameTemporaryAndPermanent ? data.isSameTemporaryAndPermanent : '',

                            //    Nationality-Indian

                            //    Embassy Certificate

                            ownerNationality: data.ownerNationality ? data.ownerNationality : '',
                            ownerNationalityTrans: data.ownerNationalityTrans ? data.ownerNationalityTrans : '',
                            ownerNationalityCT: data.ownerNationalityCT ? data.ownerNationalityCT : '',
                            indianOwnerDetailOption: data.indianOwnerDetailOption ? data.indianOwnerDetailOption : '',
                            indianOwnerDetailOptionTrans: data.indianOwnerDetailOptionTrans ? data.indianOwnerDetailOptionTrans : '',
                            indianOwnerDetailOptionCT: data.indianOwnerDetailOptionCT ? data.indianOwnerDetailOptionCT : '',
                            indianEmbassyNo: data.indianEmbassyNo ? data.indianEmbassyNo : '',
                            indianEmbassyNoTrans: data.indianEmbassyNoTrans ? data.indianEmbassyNoTrans : '',
                            indianEmbassyNoCT: data.indianEmbassyNoCT ? data.indianEmbassyNoCT : '',
                            indianEmbassyIssuedDate: data.indianEmbassyIssuedDate ? new Date(data.indianEmbassyIssuedDate) : '',
                            indianEmbassyIssuedDateTrans: data.indianEmbassyIssuedDateTrans ? data.indianEmbassyIssuedDateTrans : '',
                            indianEmbassyIssuedDateCT: data.indianEmbassyIssuedDateCT ? data.indianEmbassyIssuedDateCT : '',
                            indianEmbassyIssuedFrom: data.indianEmbassyIssuedFrom ? data.indianEmbassyIssuedFrom : '',
                            indianEmbassyIssuedFromTrans: data.indianEmbassyIssuedFromTrans ? data.indianEmbassyIssuedFromTrans : '',
                            indianEmbassyIssuedFromCT: data.indianEmbassyIssuedFromCT ? data.indianEmbassyIssuedFromCT : '',
                            indianEmbassyIssuedDateOption: data.indianEmbassyIssuedDateOption ? data.indianEmbassyIssuedDateOption : '',
                            indianEmbassyIssuedDateOptionTrans: data.indianEmbassyIssuedDateOptionTrans ? data.indianEmbassyIssuedDateOptionTrans : '',
                            indianEmbassyIssuedDateOptionCT: data.indianEmbassyIssuedDateOptionCT ? data.indianEmbassyIssuedDateOptionCT : '',

                            // Passport

                            indianOwnerPassportNo: data.indianOwnerPassportNo ? data.indianOwnerPassportNo : '',
                            indianOwnerPassportNoTrans: data.indianOwnerPassportNoTrans ? data.indianOwnerPassportNoTrans : '',
                            indianOwnerPassportNoCT: data.indianOwnerPassportNoCT ? data.indianOwnerPassportNoCT : '',
                            indianOwnerPassportIssuedDate: data.indianOwnerPassportIssuedDate ? new Date(data.indianOwnerPassportIssuedDate) : '',
                            indianOwnerPassportIssuedDateTrans: data.indianOwnerPassportIssuedDateTrans ? data.indianOwnerPassportIssuedDateTrans : '',
                            indianOwnerPassportIssuedDateCT: data.indianOwnerPassportIssuedDateCT ? data.indianOwnerPassportIssuedDateCT : '',
                            indianOwnerPassportIssuedDateOption: data.indianOwnerPassportIssuedDateOption ? data.indianOwnerPassportIssuedDateOption : '',
                            indianOwnerPassportIssuedDateOptionTrans: data.indianOwnerPassportIssuedDateOption ? data.indianOwnerPassportIssuedDateOption : '',
                            indianOwnerPassportIssuedDateOptionCT: data.indianOwnerPassportIssuedDateOptionCT ? data.indianOwnerPassportIssuedDateOptionCT : '',
                            indianOwnerPassportValidityDate: data.indianOwnerPassportValidityDate ? new Date(data.indianOwnerPassportValidityDate) : '',
                            indianOwnerPassportValidityDateTrans: data.indianOwnerPassportValidityDateTrans ? data.indianOwnerPassportValidityDateTrans : '',
                            indianOwnerPassportValidityDateCT: data.indianOwnerPassportValidityDateCT ? data.indianOwnerPassportValidityDateCT : '',
                            indianOwnerPassportValidityDateOption: data.indianOwnerPassportValidityDateOption ? data.indianOwnerPassportValidityDateOption : '',
                            indianOwnerPassportValidityDateOptionTrans: data.indianOwnerPassportValidityDateOptionTrans ? data.indianOwnerPassportValidityDateOptionTrans : '',
                            indianOwnerPassportValidityDateOptionCT: data.indianOwnerPassportValidityDateOptionCT ? data.indianOwnerPassportValidityDateOptionCT : '',
                            indianOwnerPassportIssuedFrom: data.indianOwnerPassportIssuedFrom ? data.indianOwnerPassportIssuedFrom : '',
                            indianOwnerPassportIssuedFromTrans: data.indianOwnerPassportIssuedFromTrans ? data.indianOwnerPassportIssuedFromTrans : '',
                            indianOwnerPassportIssuedFromCT: data.indianOwnerPassportIssuedFromCT ? data.indianOwnerPassportIssuedFromCT : '',

                            // Adhar Card

                            indianOwnerAdharCardNo: data.indianOwnerAdharCardNo ? data.indianOwnerAdharCardNo : '',
                            indianOwnerAdharCardNoTrans: data.indianOwnerAdharCardNoTrans ? data.indianOwnerAdharCardNoTrans : '',
                            indianOwnerAdharCardNoCT: data.indianOwnerAdharCardNoCT ? data.indianOwnerAdharCardNoCT : '',
                            indianOwnerAdharCardIssuedDate: data.indianOwnerAdharCardIssuedDate ? new Date(data.indianOwnerAdharCardIssuedDate) : '',
                            indianOwnerAdharCardIssuedDateTrans: data.indianOwnerAdharCardIssuedDateTrans ? data.indianOwnerAdharCardIssuedDateTrans : '',
                            indianOwnerAdharCardIssuedDateCT: data.indianOwnerAdharCardIssuedDateCT ? data.indianOwnerAdharCardIssuedDateCT : '',
                            indianOwnerAdharCardIssuedDateOption: data.indianOwnerAdharCardIssuedDateOption ? data.indianOwnerAdharCardIssuedDateOption : '',
                            indianOwnerAdharCardIssuedDateOptionTrans: data.indianOwnerAdharCardIssuedDateOptionTrans ? data.indianOwnerAdharCardIssuedDateOptionTrans : '',
                            indianOwnerAdharCardIssuedDateOptionCT: data.indianOwnerAdharCardIssuedDateOptionCT ? data.indianOwnerAdharCardIssuedDateOptionCT : '',
                            indianOwnerAdharCardIssuedFrom: data.indianOwnerAdharCardIssuedFrom ? data.indianOwnerAdharCardIssuedFrom : '',
                            indianOwnerAdharCardIssuedFromTrans: data.indianOwnerAdharCardIssuedFromTrans ? data.indianOwnerAdharCardIssuedFromTrans : '',
                            indianOwnerAdharCardIssuedFromCT: data.indianOwnerAdharCardIssuedFromCT ? data.indianOwnerAdharCardIssuedFromCT : '',

                            //    for other than indian

                            otherOwnerPassportNo: data.otherOwnerPassportNo ? data.otherOwnerPassportNo : '',
                            otherOwnerPassportNoTrans: data.otherOwnerPassportNoTrans ? data.otherOwnerPassportNoTrans : '',
                            otherOwnerPassportNoCT: data.otherOwnerPassportNoCT ? data.otherOwnerPassportNoCT : '',
                            otherOwnerPassportIssuedDate: data.otherOwnerPassportIssuedDate !== '' ? new Date(data.otherOwnerPassportIssuedDate) : '',
                            otherOwnerPassportIssuedDateNepali: data.otherOwnerPassportIssuedDateNepali !== '' ? data.otherOwnerPassportIssuedDateNepali : '',
                            otherOwnerPassportIssuedDateTrans: data.otherOwnerPassportIssuedDateTrans ? data.otherOwnerPassportIssuedDateTrans : '',
                            otherOwnerPassportIssuedDateCT: data.otherOwnerPassportIssuedDateCT ? data.otherOwnerPassportIssuedDateCT : '',
                            otherOwnerPassportIssuedDateNepaliTrans: data.otherOwnerPassportIssuedDateNepaliTrans ? data.otherOwnerPassportIssuedDateNepaliTrans : '',
                            otherOwnerPassportIssuedDateNepaliCT: data.otherOwnerPassportIssuedDateNepaliCT ? data.otherOwnerPassportIssuedDateNepaliCT : '',
                            otherOwnerPassportIssuedDateOption: data.otherOwnerPassportIssuedDateOption ? data.otherOwnerPassportIssuedDateOption : '',
                            otherOwnerPassportIssuedDateOptionTrans: data.otherOwnerPassportIssuedDateOptionTrans ? data.otherOwnerPassportIssuedDateOptionTrans : '',
                            otherOwnerPassportIssuedDateOptionCT: data.otherOwnerPassportIssuedDateOptionCT ? data.otherOwnerPassportIssuedDateOptionCT : '',
                            otherOwnerPassportValidityDate: data.otherOwnerPassportValidityDate !== '' ? new Date(data.otherOwnerPassportValidityDate) : '',
                            otherOwnerPassportValidityDateTrans: data.otherOwnerPassportValidityDateTrans ? data.otherOwnerPassportValidityDateTrans : '',
                            otherOwnerPassportValidityDateCT: data.otherOwnerPassportValidityDateCT ? data.otherOwnerPassportValidityDateCT : '',
                            otherOwnerPassportValidityDateNepali: data.otherOwnerPassportValidityDateNepali !== '' ? data.otherOwnerPassportValidityDateNepali : '',
                            otherOwnerPassportValidityDateNepaliTrans: data.otherOwnerPassportValidityDateNepaliTrans ? data.otherOwnerPassportValidityDateNepaliTrans : '',
                            otherOwnerPassportValidityDateNepaliCT: data.otherOwnerPassportValidityDateNepaliCT ? data.otherOwnerPassportValidityDateNepaliCT : '',
                            otherOwnerPassportValidityDateOption: data.otherOwnerPassportValidityDateOption ? data.otherOwnerPassportValidityDateOption : '',
                            otherOwnerPassportValidityDateOptionTrans: data.otherOwnerPassportValidityDateOptionTrans ? data.otherOwnerPassportValidityDateOptionTrans : '',
                            otherOwnerPassportValidityDateOptionCT: data.otherOwnerPassportValidityDateOptionCT ? data.otherOwnerPassportValidityDateOptionCT : '',
                            otherOwnerPassportIssuedFrom: data.otherOwnerPassportIssuedFrom ? data.otherOwnerPassportIssuedFrom : '',
                            otherOwnerPassportIssuedFromTrans: data.otherOwnerPassportIssuedFromTrans ? data.otherOwnerPassportIssuedFromTrans : '',
                            otherOwnerPassportIssuedFromCT: data.otherOwnerPassportIssuedFromCT ? data.otherOwnerPassportIssuedFromCT : '',
                            isAuthorizedPerson: data.isAuthorizedPerson ? data.isAuthorizedPerson : '',
                            isAuthorizedPersonTrans: data.isAuthorizedPersonTrans ? data.isAuthorizedPersonTrans : '',
                            isAuthorizedPersonCT: data.isAuthorizedPersonCT ? data.isAuthorizedPersonCT : ''
                        })
                    );
                });
            }
        }
    }

    addOwnerDetails() {
        (this.userConfigForm.get('ownerDetails') as FormArray).push(this.addOwnerDetailsField());
    }

    getDistrictsByIdForOwner(provinceId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.ownerPermanentDistricts[i] = response.detail;
                    this.ownerPermanentDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getMunicipalitiesByIdForOwner(districtId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(districtId)) {
            const district = new District();
            district.id = districtId;
            this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    this.ownerPermanentMunicipality[i] = response.detail;
                    this.ownerPermanentMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getDistrictsByIdForOwnerTemp(provinceId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.ownerTemporaryDistricts[i] = response.detail;
                    this.ownerTemporaryDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getMunicipalitiesByIdForOwnerTemp(districtId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(districtId)) {
            const district = new District();
            district.id = districtId;
            this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    this.ownerTemporaryMunicipality[i] = response.detail;
                    this.ownerTemporaryMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getDistrictsByIdForRegisteredGuarantorAddress(provinceId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.guarantorRegisteredDistricts[i] = response.detail;
                    this.guarantorRegisteredDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getMunicipalitiesByIdForRegisteredGuarantorAddress(districtId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(districtId)) {
            const district = new District();
            district.id = districtId;
            this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    this.guarantorRegisteredMunicipality[i] = response.detail;
                    this.guarantorRegisteredMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getDistrictsByIdForCurrentGuarantorAddress(provinceId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    this.guarantorCurrentDistricts[i] = response.detail;
                    this.guarantorCurrentDistricts[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    getMunicipalitiesByIdForCurrentGuarantorAddress(districtId: number, event, i: any) {
        if (!ObjectUtil.isEmpty(districtId)) {
            const district = new District();
            district.id = districtId;
            this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    this.guarantorCurrentMunicipality[i] = response.detail;
                    this.guarantorCurrentMunicipality[i].sort((a, b) => a.name.localeCompare(b.name));
                }
            );
        }
    }

    async translateOwnerData(i: any) {
        const allOwnerData = this.userConfigForm.get('ownerDetails') as FormArray;
        if (allOwnerData.length > 0) {
            let ownerTranslatedData: any = [];
            this.spinner = true;
            this.translatedFormGroup = this.formBuilder.group({
                ownerName: this.userConfigForm.get(['ownerDetails', i, 'ownerName']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerName']).value : '',
                isAuthorizedPerson: this.userConfigForm.get(['ownerDetails', i, 'isAuthorizedPerson']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'isAuthorizedPerson']).value : '',
                ownerEmail: this.userConfigForm.get(['ownerDetails', i, 'ownerEmail']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerEmail']).value : '',
                ownerContactNo: this.userConfigForm.get(['ownerDetails', i, 'ownerContactNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerContactNo']).value : '',
                ownerGender: this.userConfigForm.get(['ownerDetails', i, 'ownerGender']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerGender']).value : '',
                ownerMaritalStatus: this.userConfigForm.get(['ownerDetails', i, 'ownerMaritalStatus']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerMaritalStatus']).value : '',
                ownerCitizenshipNo: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipNo']).value : '',
                radioOwnerCitizenshipIssuedDate: this.userConfigForm.get(['ownerDetails', i, 'radioOwnerCitizenshipIssuedDate']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'radioOwnerCitizenshipIssuedDate']).value : '',
                ownerPanNo: this.userConfigForm.get(['ownerDetails', i, 'ownerPanNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPanNo']).value : '',
                ownerSharePercentage: this.userConfigForm.get(['ownerDetails', i, 'ownerSharePercentage']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerSharePercentage']).value : '',
                radioOwnerDob: this.userConfigForm.get(['ownerDetails', i, 'radioOwnerDob']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'radioOwnerDob']).value : '',
                foreignAddressOption: this.userConfigForm.get(['ownerDetails', i, 'foreignAddressOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'foreignAddressOption']).value : '',
                foreignAddressOptionTemp: this.userConfigForm.get(['ownerDetails', i, 'foreignAddressOptionTemp']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'foreignAddressOptionTemp']).value : '',
                ownerOtherAddress: this.userConfigForm.get(['ownerDetails', i, 'ownerOtherAddress']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerOtherAddress']).value : '',
                ownerOtherAddressTemp: this.userConfigForm.get(['ownerDetails', i, 'ownerOtherAddressTemp']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerOtherAddressTemp']).value : '',

                ownerFatherName: this.userConfigForm.get(['ownerDetails', i, 'ownerFatherName']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerFatherName']).value : '',
                ownerGrandFatherName: this.userConfigForm.get(['ownerDetails', i, 'ownerGrandFatherName']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerGrandFatherName']).value : '',
                ownerFatherInLawName: this.userConfigForm.get(['ownerDetails', i, 'ownerFatherInLawName']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerFatherInLawName']).value : '',
                ownerHusbandName: this.userConfigForm.get(['ownerDetails', i, 'ownerHusbandName']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerHusbandName']).value : '',
                ownerRelationMedium: this.userConfigForm.get(['ownerDetails', i, 'ownerRelationMedium']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerRelationMedium']).value : '',
                ownerDobDateType: this.userConfigForm.get(['ownerDetails', i, 'ownerDobDateType']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerDobDateType']).value : '',

                ownerPermanentWardNo: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentWardNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentWardNo']).value : '',
                ownerPermanentStreetTole: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentStreetTole']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentStreetTole']).value : '',

                ownerTemporaryWardNo: this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryWardNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryWardNo']).value : '',
                ownerTemporaryStreetTole: this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryStreetTole']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryStreetTole']).value : '',

                ownerPermanentAddressRadio: this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentAddressRadio']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerPermanentAddressRadio']).value : '',
                ownerTemporaryAddressRadio: this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryAddressRadio']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerTemporaryAddressRadio']).value : '',

                ownerNationality: this.userConfigForm.get(['ownerDetails', i, 'ownerNationality']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'ownerNationality']).value : '',
                indianOwnerDetailOption: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerDetailOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerDetailOption']).value : '',
                indianEmbassyNo: this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyNo']).value : '',

                indianEmbassyIssuedFrom: this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedFrom']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedFrom']).value : '',
                indianEmbassyIssuedDateOption: this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianEmbassyIssuedDateOption']).value : '',

                indianOwnerPassportNo: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportNo']).value : '',

                indianOwnerPassportIssuedDateOption: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedDateOption']).value : '',
                indianOwnerPassportValidityDateOption: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportValidityDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportValidityDateOption']).value : '',
                indianOwnerPassportIssuedFrom: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedFrom']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerPassportIssuedFrom']).value : '',

                indianOwnerAdharCardNo: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardNo']).value : '',

                indianOwnerAdharCardIssuedDateOption: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedDateOption']).value : '',
                indianOwnerAdharCardIssuedFrom: this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedFrom']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'indianOwnerAdharCardIssuedFrom']).value : '',

                otherOwnerPassportNo: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportNo']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportNo']).value : '',
                otherOwnerPassportIssuedDateOption: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDateOption']).value : '',

                otherOwnerPassportValidityDateOption: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDateOption']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDateOption']).value : '',
                otherOwnerPassportIssuedFrom: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedFrom']).value ?
                    this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedFrom']).value : '',
            });
            // ownerTranslatedData = await this.translateService.translateForm(this.userConfigForm, 'ownerDetails', i);
            ownerTranslatedData = await this.translateService.translateForm(this.translatedFormGroup);


            // patch translated value
            this.userConfigForm.get(['ownerDetails', i]).patchValue({
                ownerNameTrans: ownerTranslatedData.ownerName ? ownerTranslatedData.ownerName : '',
                ownerNameCT: ownerTranslatedData.ownerName ? ownerTranslatedData.ownerName : '',
                isAuthorizedPersonTrans: ownerTranslatedData.isAuthorizedPerson ? ownerTranslatedData.isAuthorizedPerson : '',
                isAuthorizedPersonCT: ownerTranslatedData.isAuthorizedPerson ? ownerTranslatedData.isAuthorizedPerson : '',
                ownerDobTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerDob']).value,
                ownerDobCT: this.userConfigForm.get(['ownerDetails', i, 'ownerDob']).value,
                ownerDobNepaliTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerDobNepali']).value,
                ownerDobNepaliCT: this.userConfigForm.get(['ownerDetails', i, 'ownerDobNepali']).value,
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
                ownerCitizenshipIssuedDateNepaliTrans: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDateNepali']).value,
                ownerCitizenshipIssuedDateNepaliCT: this.userConfigForm.get(['ownerDetails', i, 'ownerCitizenshipIssuedDateNepali']).value,
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
                foreignAddressOptionTempTrans : ownerTranslatedData.foreignAddressOptionTemp ? ownerTranslatedData.foreignAddressOptionTemp : '' ,
                foreignAddressOptionTempCT : ownerTranslatedData.foreignAddressOptionTemp ? ownerTranslatedData.foreignAddressOptionTemp : '' ,
                ownerOtherAddressTrans:  ownerTranslatedData.ownerOtherAddress ? ownerTranslatedData.ownerOtherAddress : '' ,
                ownerOtherAddressCT :  ownerTranslatedData.ownerOtherAddress ? ownerTranslatedData.ownerOtherAddress : '' ,
                ownerOtherAddressTempTrans:  ownerTranslatedData.ownerOtherAddressTemp ? ownerTranslatedData.ownerOtherAddressTemp : '' ,
                ownerOtherAddressTempCT :  ownerTranslatedData.ownerOtherAddressTemp ? ownerTranslatedData.ownerOtherAddressTemp : '' ,

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
                otherOwnerPassportIssuedDateNepaliTrans: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDateNepali']).value,
                otherOwnerPassportIssuedDateNepaliCT: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportIssuedDateNepali']).value,
                otherOwnerPassportIssuedDateOptionTrans: ownerTranslatedData.otherOwnerPassportIssuedDateOption ? ownerTranslatedData.otherOwnerPassportIssuedDateOption : '',
                otherOwnerPassportIssuedDateOptionCT: ownerTranslatedData.otherOwnerPassportIssuedDateOption ? ownerTranslatedData.otherOwnerPassportIssuedDateOption : '',
                otherOwnerPassportValidityDateTrans: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDate']).value,
                otherOwnerPassportValidityDateCT: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDate']).value,
                otherOwnerPassportValidityDateNepaliTrans: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDateNepali']).value,
                otherOwnerPassportValidityDateNepaliCT: this.userConfigForm.get(['ownerDetails', i, 'otherOwnerPassportValidityDateNepali']).value,
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
                this.detailOption = `Share Holder's Detail`;
                break;
            case 'PRIVATE_PUBLIC':
                this.detailOption = `Share Holder's Detail`;
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

    setGuarantorRegisteredAndCurrentAddressSame(event, index) {
        if (event.target.checked === true) {
            this.getDistrictsByIdForCurrentGuarantorAddress(ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value) ? null :
                this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value.id , null, index);
            this.getMunicipalitiesByIdForCurrentGuarantorAddress(ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value) ? null :
                this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value.id , null, index);

            this.userConfigForm.get(['guarantorDetails', index]).patchValue({
                guarantorCurrentType: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredType']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredType']).value,
                guarantorCurrentTypeTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeTrans']).value,
                guarantorCurrentTypeCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredTypeCT']).value,

                guarantorCurrentProvince: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvince']).value,
                guarantorCurrentProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvinceTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorCurrentProvinceTrans']).value,
                guarantorCurrentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvinceCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredProvinceCT']).value,

                guarantorCurrentDistrict: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrict']).value,
                guarantorCurrentDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictTrans']).value,
                guarantorCurrentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredDistrictCT']).value,

                guarantorCurrentMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipality']).value,
                guarantorCurrentMunicipalityTrans: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityTrans']).value,
                guarantorCurrentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredMunicipalityCT']).value,
                guarantorCurrentWardNo:  ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNo']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNo']).value,
                guarantorCurrentWardNoTrans:  ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoTrans']).value,
                guarantorCurrentWardNoCT:  ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredWardNoCT']).value,
                guarantorCurrentStreetTole: ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetTole']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetTole']).value,
                guarantorCurrentStreetToleTrans:  ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleTrans']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleTrans']).value,
                guarantorCurrentStreetToleCT:  ObjectUtil.isEmpty(this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleCT']).value)
                    ? undefined :
                    this.userConfigForm.get(['guarantorDetails', index, 'guarantorRegisteredStreetToleCT']).value,
            });
        }
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

    accept(boolVal, i) {
        this.modalService.dismissAll();
        if (boolVal) {
            this.clearTagging(i);
        }
        if (!boolVal) {
            this.dialogRef.close();
        }
    }

    setDetailsEntered(i) {
        this.shareHolderArray = this.userConfigForm.get('ownerDetails').value;
        if (!this.userConfigForm.get(['guarantorDetails', i, 'detailsEntered']).value) {
            this.clearTagging(i);
        }
    }

    patchGuarantorFromShare(ownerUnique, i, ownerData) {
        if (this.userConfigForm.get(['guarantorDetails', i, 'detailsEntered']).value) {
            // console.log('Null Value:', this.userConfigForm.get(['guarantorDetails', i, 'detailsFrom']).value);
            if (this.userConfigForm.get(['guarantorDetails', i, 'detailsFrom']).value !== 'null,null' ||
                this.userConfigForm.get(['guarantorDetails', i, 'detailsFrom']).value !== 'null') {
                // console.log('Particular Owner Data:', ownerData);
                const tempArray = ownerUnique.split(',');
                // console.log('TempArray:', tempArray);
                const tempDetail = ownerData.filter(val =>
                    val.ownerName === tempArray[0] && (val.ownerFatherName === tempArray[1] || val.ownerFatherName === null)
                );
                // console.log('Filtered Value:', tempDetail);
                if (tempDetail.length > 0) {
                    this.getGuarantorDistrictsById(ObjectUtil.isEmpty(tempDetail[0].ownerPermanentProvince) ? null : tempDetail[0].ownerPermanentProvince.id, null, i);
                    this.getGuarantorMunicipalitiesById(ObjectUtil.isEmpty(tempDetail[0].ownerPermanentDistrict) ? null : tempDetail[0].ownerPermanentDistrict.id, null, i);
                    this.getGuarantorTempDistrictsById(ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryProvince) ? null : tempDetail[0].ownerTemporaryProvince.id, null, i);
                    this.getGuarantorTempMunicipalitiesById(ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryDistrict) ? null : tempDetail[0].ownerTemporaryDistrict.id, null, i);

                    // Proprietor to guarantor tagging
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorName']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerName) ? tempDetail[0].ownerName : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorNameTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerNameTrans) ? tempDetail[0].ownerNameTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorNameCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerNameCT) ? tempDetail[0].ownerNameCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'gender']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGender) ? tempDetail[0].ownerGender : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'genderTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGenderTrans) ? tempDetail[0].ownerGenderTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'genderCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGenderCT) ? tempDetail[0].ownerGenderCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatus']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerMaritalStatus) ? tempDetail[0].ownerMaritalStatus : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatusTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerMaritalStatusTrans) ? tempDetail[0].ownerMaritalStatusTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatusCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerMaritalStatusCT) ? tempDetail[0].ownerMaritalStatusCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'relationMedium']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerRelationMedium) ? tempDetail[0].ownerRelationMedium : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'relationMediumTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerRelationMediumTrans) ? tempDetail[0].ownerRelationMediumTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'relationMediumCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerRelationMediumCT) ? tempDetail[0].ownerRelationMediumCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'grandFatherName']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGrandFatherName) ? tempDetail[0].ownerGrandFatherName : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'grandFatherNameTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGrandFatherNameTrans) ? tempDetail[0].ownerGrandFatherNameTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'grandFatherNameCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerGrandFatherNameCT) ? tempDetail[0].ownerGrandFatherNameCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'fatherName']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherName) ? tempDetail[0].ownerFatherName : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'fatherNameTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherNameTrans) ? tempDetail[0].ownerFatherNameTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'fatherNameCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherNameCT) ? tempDetail[0].ownerFatherNameCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'husbandName']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerHusbandName) ? tempDetail[0].ownerHusbandName : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'husbandNameTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerHusbandNameTrans) ? tempDetail[0].ownerHusbandNameTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'husbandNameCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerHusbandNameCT) ? tempDetail[0].ownerHusbandNameCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawName']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherInLawName) ? tempDetail[0].ownerFatherInLawName : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawNameTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherInLawNameTrans) ? tempDetail[0].ownerFatherInLawNameTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawNameCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerFatherInLawNameCT) ? tempDetail[0].ownerFatherInLawNameCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationality']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerNationality) ? tempDetail[0].ownerNationality : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationalityTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerNationalityTrans) ? tempDetail[0].ownerNationalityTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationalityCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerNationalityCT) ? tempDetail[0].ownerNationalityCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'citizenNumber']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipNo) ? tempDetail[0].ownerCitizenshipNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'citizenNumberTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipNoTrans) ? tempDetail[0].ownerCitizenshipNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'citizenNumberCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipNoCT) ? tempDetail[0].ownerCitizenshipNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'issuedPlace']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipIssuedDistrict) ? tempDetail[0].ownerCitizenshipIssuedDistrict : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'issuedPlaceTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipIssuedDistrictTrans) ? tempDetail[0].ownerCitizenshipIssuedDistrictTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'issuedPlaceCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipIssuedDistrictCT) ? tempDetail[0].ownerCitizenshipIssuedDistrictCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'radioCitizenIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].radioOwnerCitizenshipIssuedDate) ? tempDetail[0].radioOwnerCitizenshipIssuedDate : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'citizenIssuedDateNepali']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipIssuedDateNepali) ? tempDetail[0].ownerCitizenshipIssuedDateNepali : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'citizenIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerCitizenshipIssuedDate) ? new Date(tempDetail[0].ownerCitizenshipIssuedDate) : undefined);

                    // Address Patch (Permanent)
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentProvince) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerPermanentProvince.name) ? tempDetail[0].ownerPermanentProvince : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentProvinceTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentProvinceTrans) ? tempDetail[0].ownerPermanentProvinceTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentProvinceCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentProvinceCT) ? tempDetail[0].ownerPermanentProvinceCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentDistrict) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerPermanentDistrict.name) ? tempDetail[0].ownerPermanentDistrict : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrictTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentDistrictTrans) ? tempDetail[0].ownerPermanentDistrictTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrictCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentDistrictCT) ? tempDetail[0].ownerPermanentDistrictCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipalityOrVdc']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentAddressRadio) ? tempDetail[0].ownerPermanentAddressRadio : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipality']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentMunicipality) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerPermanentMunicipality.name) ? tempDetail[0].ownerPermanentMunicipality : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipalityTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentMunicipalityTrans) ? tempDetail[0].ownerPermanentMunicipalityTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipalityCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentMunicipalityCT) ? tempDetail[0].ownerPermanentMunicipalityCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'permanentWard']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentWardNo) ? tempDetail[0].ownerPermanentWardNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentWardTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentWardNoTrans) ? tempDetail[0].ownerPermanentWardNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentWardCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentWardNoCT) ? tempDetail[0].ownerPermanentWardNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetTole']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentStreetTole) ? tempDetail[0].ownerPermanentStreetTole : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetToleTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentStreetToleTrans) ? tempDetail[0].ownerPermanentStreetToleTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetToleCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerPermanentStreetToleCT) ? tempDetail[0].ownerPermanentStreetToleCT : undefined);

                    // Address Patch (Temporary)

                    this.userConfigForm.get(['guarantorDetails', i, 'isSameTemporaryAndPermanent']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].isSameTemporaryAndPermanent) ? tempDetail[0].isSameTemporaryAndPermanent : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryProvince) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryProvince.name) ? tempDetail[0].ownerTemporaryProvince : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryProvinceTrans) ? tempDetail[0].ownerTemporaryProvinceTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryProvinceCT) ? tempDetail[0].ownerTemporaryProvinceCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryDistrict) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryDistrict.name) ? tempDetail[0].ownerTemporaryDistrict : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryDistrictTrans) ? tempDetail[0].ownerTemporaryDistrictTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryDistrictCT) ? tempDetail[0].ownerTemporaryDistrictCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdc']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryAddressRadio) ? tempDetail[0].ownerTemporaryAddressRadio : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryMunicipality) &&
                    !ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryMunicipality.name) ? tempDetail[0].ownerTemporaryMunicipality : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryMunicipalityTrans) ? tempDetail[0].ownerTemporaryMunicipalityTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryMunicipalityCT) ? tempDetail[0].ownerTemporaryMunicipalityCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryWardNo) ? tempDetail[0].ownerTemporaryWardNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryWardNoTrans) ? tempDetail[0].ownerTemporaryWardNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryWardNoCT) ? tempDetail[0].ownerTemporaryWardNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetTole']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryStreetTole) ? tempDetail[0].ownerTemporaryStreetTole : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryStreetToleTrans) ? tempDetail[0].ownerTemporaryStreetToleTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerTemporaryStreetToleCT) ? tempDetail[0].ownerTemporaryStreetToleCT : undefined);

                    // Indian Nationality
                    this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOption']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerDetailOption) ? tempDetail[0].indianOwnerDetailOption : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOptionTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerDetailOptionTrans) ? tempDetail[0].indianOwnerDetailOptionTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOptionCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerDetailOptionCT) ? tempDetail[0].indianOwnerDetailOptionCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'embassyNo']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyNo) ? tempDetail[0].indianEmbassyNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'embassyNoTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyNoTrans) ? tempDetail[0].indianEmbassyNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'embassyNoCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyNoCT) ? tempDetail[0].indianEmbassyNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyIssuedDate) ? new Date(tempDetail[0].indianEmbassyIssuedDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFrom']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyIssuedFrom) ? tempDetail[0].indianEmbassyIssuedFrom : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFromTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyIssuedFromTrans) ? tempDetail[0].indianEmbassyIssuedFromTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFromCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianEmbassyIssuedFromCT) ? tempDetail[0].indianEmbassyIssuedFromCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'passportNo']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportNo) ? tempDetail[0].indianOwnerPassportNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'passportNoTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportNoTrans) ? tempDetail[0].indianOwnerPassportNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'passportNoCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportNoCT) ? tempDetail[0].indianOwnerPassportNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportIssuedDate) ? new Date(tempDetail[0].indianOwnerPassportIssuedDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'passportValidityDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportValidityDate) ? new Date(tempDetail[0].indianOwnerPassportValidityDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFrom']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportIssuedFrom) ? tempDetail[0].indianOwnerPassportIssuedFrom : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFromTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportIssuedFromTrans) ? tempDetail[0].indianOwnerPassportIssuedFromTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFromCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerPassportIssuedFromCT) ? tempDetail[0].indianOwnerPassportIssuedFromCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardNo']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardNo) ? tempDetail[0].indianOwnerAdharCardNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardNoTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardNoTrans) ? tempDetail[0].indianOwnerAdharCardNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardNoCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardNoCT) ? tempDetail[0].indianOwnerAdharCardNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardIssuedDate) ? new Date(tempDetail[0].indianOwnerAdharCardIssuedDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFrom']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardIssuedFrom) ? tempDetail[0].indianOwnerAdharCardIssuedFrom : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFromTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardIssuedFromTrans) ? tempDetail[0].indianOwnerAdharCardIssuedFromTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFromCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].indianOwnerAdharCardIssuedFromCT) ? tempDetail[0].indianOwnerAdharCardIssuedFromCT : undefined);

                    // Other Nationality
                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNo']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportNo) ? tempDetail[0].otherOwnerPassportNo : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNoTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportNoTrans) ? tempDetail[0].otherOwnerPassportNoTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNoCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportNoCT) ? tempDetail[0].otherOwnerPassportNoCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDateOption']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedDateOption) ? tempDetail[0].otherOwnerPassportIssuedDateOption : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDateNepali']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedDateNepali) ? tempDetail[0].otherOwnerPassportIssuedDateNepali : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedDate) ? new Date(tempDetail[0].otherOwnerPassportIssuedDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDateOption']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportValidityDateOption) ? tempDetail[0].otherOwnerPassportValidityDateOption : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDateNepali']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportValidityDateNepali) ? tempDetail[0].otherOwnerPassportValidityDateNepali : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDate']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportValidityDate) ? new Date(tempDetail[0].otherOwnerPassportValidityDate) : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFrom']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedFrom) ? tempDetail[0].otherOwnerPassportIssuedFrom : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFromTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedFromTrans) ? tempDetail[0].otherOwnerPassportIssuedFromTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFromCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].otherOwnerPassportIssuedFromCT) ? tempDetail[0].otherOwnerPassportIssuedFromCT : undefined);

                    // Local and foreign Address
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOption']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOption) ? tempDetail[0].foreignAddressOption : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOptionTrans) ? tempDetail[0].foreignAddressOptionTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOptionCT) ? tempDetail[0].foreignAddressOptionCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddress']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddress) ? tempDetail[0].ownerOtherAddress : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddressTrans) ? tempDetail[0].ownerOtherAddressTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddressCT) ? tempDetail[0].ownerOtherAddressCT : undefined);

                    // Foreign Address temporary
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTemp']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOptionTemp) ? tempDetail[0].foreignAddressOptionTemp : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTempTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOptionTempTrans) ? tempDetail[0].foreignAddressOptionTempTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTempCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].foreignAddressOptionTempCT) ? tempDetail[0].foreignAddressOptionTempCT : undefined);

                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTemp']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddressTemp) ? tempDetail[0].ownerOtherAddressTemp : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTempTrans']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddressTempTrans) ? tempDetail[0].ownerOtherAddressTempTrans : undefined);
                    this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTempCT']).patchValue(!ObjectUtil.isEmpty(tempDetail[0].ownerOtherAddressTempCT) ? tempDetail[0].ownerOtherAddressTempCT : undefined);
                }
            }
        }
    }

    clearTagging(i) {
        // Proprietor to guarantor clearing
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorName']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorNameTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorNameCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'gender']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'genderTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'genderCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatus']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatusTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorMaritalStatusCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'relationMedium']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'relationMediumTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'relationMediumCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'grandFatherName']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'grandFatherNameTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'grandFatherNameCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'fatherName']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'fatherNameTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'fatherNameCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'husbandName']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'husbandNameTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'husbandNameCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawName']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawNameTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'fatherInLawNameCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationality']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationalityTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorNationalityCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'citizenNumber']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'citizenNumberTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'citizenNumberCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'issuedPlace']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'issuedPlaceTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'issuedPlaceCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'radioCitizenIssuedDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'citizenIssuedDateNepali']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'citizenIssuedDate']).patchValue(undefined);

        // Address Patch (Permanent)
        this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentProvinceTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentProvinceCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrictTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrictCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipalityOrVdc']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipality']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipalityTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipalityCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'permanentWard']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentWardTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentWardCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetTole']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetToleTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'permanentStreetToleCT']).patchValue(undefined);

        // Address Patch (Temporary)

        this.userConfigForm.get(['guarantorDetails', i, 'isSameGuarantorRegisteredAndCurrentAddress']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvinceCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrictCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdc']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipalityCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetTole']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'temporaryStreetToleCT']).patchValue(undefined);

        // Indian Nationality
        this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOption']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOptionTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'indianGuarantorDetailOptionCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'embassyNo']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'embassyNoTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'embassyNoCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFrom']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFromTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'embassyIssuedFromCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'passportNo']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'passportNoTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'passportNoCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'passportValidityDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFrom']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFromTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'passportIssuedFromCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'adharCardNo']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'adharCardNoTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'adharCardNoCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFrom']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFromTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'adharCardIssuedFromCT']).patchValue(undefined);

        // Other Nationality
        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNo']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNoTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportNoCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDateOption']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDateNepali']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDateOption']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDateNepali']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportValidityDate']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFrom']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFromTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'otherGuarantorPassportIssuedFromCT']).patchValue(undefined);

        // Local and foreign Address
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOption']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddress']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressCT']).patchValue(undefined);

        // Foreign Address temporary
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTemp']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTempTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorForeignAddressOptionTempCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTemp']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTempTrans']).patchValue(undefined);
        this.userConfigForm.get(['guarantorDetails', i, 'guarantorOtherAddressTempCT']).patchValue(undefined);

        this.userConfigForm.get(['guarantorDetails', i, 'detailsFrom']).patchValue(undefined);

        // this.userConfigForm.controls['guarantorDetails']['controls'][i].reset();
    }

    fetchDetails() {
        this.spinnerService.show();
        const customerId = this.custId;
        this.customerInfoService.fetchCustomerDetailsLos(customerId).subscribe((res: any) => {
            this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Fetched Customer Details !'));
            console.log('This is the response data ==> ', res);
            this.fetchedCustomerDetails = res.detail;
            this.setCustomerDetails();
            this.spinnerService.hide();
        }, error => {
            this.toastService.show(new Alert(AlertType.ERROR, 'Error fetching customer details! '));
            this.spinnerService.hide();
        });
    }

    setCustomerDetails() {
        if (!ObjectUtil.isEmpty(this.fetchedCustomerDetails)) {

            this.userConfigForm.get('issuedDate').patchValue('AD');
            this.userConfigForm.get('citizenshipIssueDate').patchValue(new Date(this.fetchedCustomerDetails.citizenshipIssuedDate));
            this.userConfigForm.get('name').patchValue(this.fetchedCustomerDetails.customerName);
            this.userConfigForm.get('email').patchValue(this.fetchedCustomerDetails.email);
            this.userConfigForm.get('citizenshipNo').patchValue(this.fetchedCustomerDetails.citizenshipNumber);
            this.userConfigForm.get('citizenshipIssueDistrict').patchValue(this.fetchedCustomerDetails.citizenshipIssuedPlace);
            this.userConfigForm.get('dobDateType').patchValue('AD');
            this.userConfigForm.get('dob').patchValue(this.fetchedCustomerDetails.dob);
            this.userConfigForm.get('gender').patchValue(this.fetchedCustomerDetails.gender.toUpperCase());
            this.userConfigForm.get('customerCode').patchValue(this.fetchedCustomerDetails.customerCode);
            this.userConfigForm.get('fatherName').patchValue(this.fetchedCustomerDetails.fatherName);
            this.userConfigForm.get('grandFatherName').patchValue(this.fetchedCustomerDetails.grandFatherName);
            this.userConfigForm.get('husbandName').patchValue(this.fetchedCustomerDetails.husbandName);
            this.userConfigForm.get('fatherInLawName').patchValue(this.fetchedCustomerDetails.fatherInLawName);
            this.userConfigForm.get('contactNo').patchValue(this.fetchedCustomerDetails.contactNumber);
            /* For Permanent Address */
            const filterData = this.provinceList.filter((data) => data.id.toString() === this.fetchedCustomerDetails.province)[0];
            this.fetchCustomerAddress(this.fetchedCustomerDetails.province,
                this.fetchedCustomerDetails.district, this.fetchedCustomerDetails.municipality, 'permanent');
            this.userConfigForm.get('permanentProvince').patchValue(filterData);
            // this.userConfigForm.get('permanentDistrict').patchValue(filterPerDistrict);
            // this.userConfigForm.get('permanentMunicipality').patchValue(filterPerMun);
            this.userConfigForm.get('permanentWard').patchValue(this.fetchedCustomerDetails.wardNumber);
            this.userConfigForm.get('municipalityOrVdc').patchValue('Municipality');

            /* For Temporary Address */
            const filterTempData = this.provinceList.filter((data) => data.id.toString() === this.fetchedCustomerDetails.temporaryProvince)[0];
            this.fetchCustomerAddress(this.fetchedCustomerDetails.temporaryProvince,
                this.fetchedCustomerDetails.temporaryDistrict, this.fetchedCustomerDetails.temporaryMunicipality, 'temporary');
            this.userConfigForm.get('temporaryProvince').patchValue(filterTempData);
            // this.userConfigForm.get('temporaryDistrict').patchValue(filterDistrict);
            // this.userConfigForm.get('temporaryMunicipality').patchValue(filterMunicipality);
            this.userConfigForm.get('temporaryWard').patchValue(this.fetchedCustomerDetails.temporaryWardNumber);
            this.userConfigForm.get('temporaryMunicipalityOrVdc').patchValue('Municipality');
        }
    }


    fetchCustomerAddress(provinceId, districtId, municipalityId , key?) {
        if (key === 'temporary') {
            this.getDistrictsByIdCusDetails(provinceId, districtId, 'temporaryDistrict', key);
            this.getMunicipalitiesByIdCusDetails(districtId, municipalityId, 'temporaryMunicipality', key);
        } else {
            this.getDistrictsByIdCusDetails(provinceId, districtId, 'permanentDistrict', key);
            this.getMunicipalitiesByIdCusDetails(districtId, municipalityId, 'permanentMunicipality', key);
        }
    }

    getDistrictsByIdCusDetails(provinceId: number, id , formControlName, key?) {
        if (!ObjectUtil.isEmpty(provinceId)) {
            const province = new Province();
            province.id = provinceId;
            this.addressService.getDistrictByProvince(province).subscribe(
                (response: any) => {
                    let filteredData;
                    if (key === 'permanent') {
                        this.districts = response.detail;
                        this.districts.sort((a, b) => a.name.localeCompare(b.name));
                        filteredData = this.districts.filter((data) => data.id.toString() === id)[0];
                    } else {
                        this.tempDistricts = response.detail;
                        this.tempDistricts.sort((a, b) => a.name.localeCompare(b.name));
                        filteredData = this.tempDistricts.filter((data) => data.id.toString() === id)[0];
                    }
                    this.userConfigForm.get(formControlName).patchValue(filteredData);
                }
            );
        }
    }

    getMunicipalitiesByIdCusDetails(districtId: number, id , formControlName, key?) {
        if (!ObjectUtil.isEmpty(districtId)) {
            const district = new District();
            district.id = districtId;
            this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
                (response: any) => {
                    let filteredData;
                    if (key === 'permanent') {
                        this.municipalities = response.detail;
                        this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
                        filteredData = this.municipalities.filter((data) => data.id.toString() === id)[0];
                    } else {
                        this.tempMunicipalities = response.detail;
                        this.tempMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
                        filteredData = this.tempMunicipalities.filter((data) => data.id.toString() === id)[0];
                    }

                        this.userConfigForm.get(formControlName).patchValue(filteredData);
                }
            );
        }
    }
}

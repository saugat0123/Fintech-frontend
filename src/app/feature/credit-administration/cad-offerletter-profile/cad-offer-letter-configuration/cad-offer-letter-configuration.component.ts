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
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

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
    isVdcSelected = false;
    isVdcTempSelected = false;

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
            jointCustomerDetails: this.formBuilder.array([]),
            guarantorDetails: this.formBuilder.array([]),
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
            if (controls[name].invalid) {
                invalidControls.push(this.titleCasePipe.transform(name).replace('ct', '').replace('trans', ''));
            }
        }
        console.log('invalidControls', invalidControls);
        if (this.userConfigForm.invalid) {
            this.toastService.show(new Alert(AlertType.DANGER, 'Please check validation. ' + invalidControls.filter((value, index, self) => self.indexOf(value) === index)
                .join(', ')));
            this.spinner = false;
            return;
        }
        const clientType = this.userConfigForm.get('clientType').value;

        this.oneFormCustomer.customerCode = this.userConfigForm.get('customerCode').value;
        this.oneFormCustomer.customerName = this.userConfigForm.get('name').value;
        this.oneFormCustomer.companyName = this.userConfigForm.get('name').value;
        this.oneFormCustomer.panNumber = this.userConfigForm.get('panNo').value;
        this.oneFormCustomer.email = this.userConfigForm.get('email').value;
        this.oneFormCustomer.registrationNumber = this.userConfigForm.get('registrationNo').value;
        this.oneFormCustomer.contactNumber = this.userConfigForm.get('contactNo').value;
        this.oneFormCustomer.gender = this.userConfigForm.get('gender').value;
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
        if (this.actionType === 'Edit') {
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

            if (key === 'guarantorDetails' || key === 'jointCustomerDetails') {
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
            this.deleteCTAndTransContorls(index);
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

            //english value
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


            //translated data
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
            nepData: [undefined],

        });
    }

    removeAtIndex(i: any) {
        (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
        this.translatedGuarantorDetails.splice(i, 1);
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


            formArray.push(this.formBuilder.group({
                guarantorName: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.en],
                guarantorNameTrans: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.np],
                guarantorNameCT: [ObjectUtil.isEmpty(nepaData.guarantorName) ? undefined : nepaData.guarantorName.ct],
                citizenNumberTrans: [ObjectUtil.isEmpty(nepaData.citizenNumber) ? undefined : nepaData.citizenNumber.np],
                issuedPlace: [ObjectUtil.isEmpty(nepaData.issuedPlace) ? undefined : nepaData.issuedPlace.ct],
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
                citizenIssuedDate: [ObjectUtil.isEmpty(value.issuedYear) ? undefined : value.issuedYear],
                guarantorPermanentMunicipalityOrVdcCT: [ObjectUtil.isEmpty(nepaData.guarantorPermanentMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorPermanentMunicipalityOrVdc.np],
                guarantorTemporaryMunicipalityOrVdcCT: [ObjectUtil.isEmpty(nepaData.guarantorTemporaryMunicipalityOrVdc) ?
                    undefined : nepaData.guarantorTemporaryMunicipalityOrVdc.np],
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
        this.setCustomerCTData();
        this.setCustomerTransData();
        this.patchCorrectData();

        this.setInstitutionCTValue();
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
            this.translatedGuarantorDetails[index] = newArr;
            // this.deleteCTAndTransContorls(index);
            this.userConfigForm.get(['guarantorDetails', index, 'nepData']).setValue(JSON.stringify(newArr));
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

    setGuarantorAddressSameAsPermanent(event, i, val) {
        if (event.target.checked === true) {
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipality']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'guarantorTemporaryMunicipalityOrVdc']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'guarantorPermanentMunicipalityOrVdc']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentWard']).value);
            this.userConfigForm.get(['guarantorDetails', i, 'temporaryWardCT']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentWardCT']).value);

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
                    this.loanHolder.branch.district,
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
        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer)) {
            const nepData = (JSON.parse(this.loanHolder.nepData));
            this.userConfigForm.patchValue({
                panNo: ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.en,
                branchCT: ObjectUtil.isEmpty(nepData.branch) ? undefined : nepData.branch.ct,
                customerCodeCT: ObjectUtil.isEmpty(nepData.customerCode) ? undefined : nepData.customerCode.ct,
                nameCT: ObjectUtil.isEmpty(nepData.name) ? undefined : nepData.name.np,
                emailCT: ObjectUtil.isEmpty(nepData.email) ? undefined : nepData.email.np,
                contactNoCT: ObjectUtil.isEmpty(nepData.contactNo) ? undefined : nepData.contactNo.ct,
                panNoCT: ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.ct,

                citizenshipNoCT: ObjectUtil.isEmpty(nepData.citizenshipNumber) ? undefined : nepData.citizenshipNumber.np,
                genderCT: ObjectUtil.isEmpty(nepData.gender) ? undefined : nepData.gender.np,
                permanentProvinceCT: ObjectUtil.isEmpty(nepData.permanentProvince) ? undefined : nepData.permanentProvince.np,
                permanentDistrictCT: ObjectUtil.isEmpty(nepData.permanentDistrict) ? undefined : nepData.permanentDistrict.np,
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
            currentProvinceCT: this.objectValueTranslater.currentProvince,
            currentDistrictCT: this.objectValueTranslater.currentDistrict,
            currentMunicipalityCT: this.objectValueTranslater.currentMunicipality,
            registeredProvinceCT: this.objectValueTranslater.registeredProvince,
            registeredDistrictCT: this.objectValueTranslater.registeredDistrict,
            registeredMunicipalityCT: this.objectValueTranslater.registeredMunicipality,
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
            permanentMunicipalityCT: this.isVdcSelected ? this.translatedValues.permanentMunicipality
                : ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ?
                    undefined : this.userConfigForm.get('permanentMunicipality').value.nepaliName,
            permanentMunicipalityTrans: this.isVdcSelected ? this.translatedValues.permanentMunicipality
            : ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ?
                    undefined : this.userConfigForm.get('permanentMunicipality').value.nepaliName,
            temporaryProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ?
                undefined : this.userConfigForm.get('temporaryProvince').value.nepaliName,
            temporaryProvinceTrans: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ?
                undefined : this.userConfigForm.get('temporaryProvince').value.nepaliName,
            temporaryDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ?
                undefined : this.userConfigForm.get('temporaryDistrict').value.nepaliName,
            temporaryDistrictTrans: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ?
                undefined : this.userConfigForm.get('temporaryDistrict').value.nepaliName,
            temporaryMunicipalityCT: this.isVdcTempSelected ? this.translatedValues.temporaryMunicipality
            : ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ?
                    undefined : this.userConfigForm.get('temporaryMunicipality').value.nepaliName,
            temporaryMunicipalityTrans: this.isVdcTempSelected ? this.translatedValues.temporaryMunicipality
                : ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ?
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
        this.userConfigForm.get('registrationNoTrans').patchValue(this.translatedValues.registrationNo);
        this.userConfigForm.get('registrationDateTrans').patchValue(this.translatedValues.registrationDate);
        this.userConfigForm.get('registeredMunicipalityTrans').patchValue(this.translatedValues.registeredMunicipality);
        this.userConfigForm.get('registeredMunTypeTrans').patchValue(this.translatedValues.registeredMunType);
        this.userConfigForm.get('registeredDistrictTrans').patchValue(this.translatedValues.registeredDistrict);
        this.userConfigForm.get('registeredProvinceTrans').patchValue(this.translatedValues.registeredProvince);
        this.userConfigForm.get('currentMunTypeTrans').patchValue(this.translatedValues.currentMunType);
        this.userConfigForm.get('currentProvinceTrans').patchValue(this.translatedValues.currentProvince);
        this.userConfigForm.get('currentWardTrans').patchValue(this.translatedValues.currentWard);
        this.userConfigForm.get('currentDistrictTrans').patchValue(this.translatedValues.currentDistrict);
        this.userConfigForm.get('currentMunicipalityTrans').patchValue(this.translatedValues.currentMunicipality);
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
                    this.nepData.registeredProvince.en.nepaliName : undefined),
            this.userConfigForm.get('registeredWardTrans').patchValue(ObjectUtil.isEmpty(this.nepData.permanentWard) ? undefined :
                this.loanHolder.customerType === CustomerType.INSTITUTION ?
                    this.nepData.permanentWard.ct : undefined);

    }

    openCloseTemplate(template) {
        this.modalService.open(template);
    }

    dismiss(template){
        this.modalService.dismissAll();
    }

    decline(template){
        this.modalService.dismissAll();
    }

    accept(){
        this.modalService.dismissAll();
        this.dialogRef.close();
    }

    vdcFields(event, flagName) {
        if (!ObjectUtil.isEmpty(event) && event === 'VDC') {
            this[flagName] = true;
        } else {
            this[flagName] = false;
        }
    }

}

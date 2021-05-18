import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {Customer} from '../../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LegalStatus} from '../../../../admin/modal/legal-status';
import {Capital} from '../../../../admin/modal/capital';
import {Swot} from '../../../../admin/modal/swot';
import {CompanyLocations} from '../../../../admin/modal/companyLocations';
import {ManagementTeam} from '../../../../admin/modal/management-team';
import {Proprietors} from '../../../../admin/modal/proprietors';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../loan/model/address';
import {BusinessType} from '../../../../admin/modal/businessType';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {LoanDataService} from '../../../../loan/service/loan-data.service';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../../@core/utils';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {BlacklistService} from '../../../../admin/component/blacklist/blacklist.service';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {NbDialogRef} from '@nebular/theme';
import {ContactPerson} from '../../../../admin/modal/contact-person';
import {CompanyService} from '../../../../admin/component/company/company.service';
import {Company} from '../../../../admin/modal/company';
import {DesignationList} from '../../../../loan/model/designationList';
import {BankingRelationComponent} from '../banking-relation/banking-relation.component';
import {Experience} from '../../../../admin/modal/experience';
import {Succession} from '../../../../admin/modal/succession';
import {RegulatoryConcern} from '../../../../admin/modal/regulatory-concern';
import {MarketCompetition} from '../../../../admin/modal/marketCompetition';
import {IndustryGrowth} from '../../../../admin/modal/industryGrowth';
import {Buyer} from '../../../../admin/modal/buyer';
import {Supplier} from '../../../../admin/modal/supplier';
import {BusinessAndIndustry} from '../../../../admin/modal/businessAndIndustry';
import {CompanyOtherDetailComponent} from './company-other-detail/company-other-detail.component';
import {CompanyJsonData} from '../../../../admin/modal/CompanyJsonData';
import {MarketScenarioComponent} from './market-scenario/market-scenario.component';
import {Editor} from '../../../../../@core/utils/constants/editor';
import {WhiteSpaceValidation} from '../../../../loan/model/whiteSpaceValidation';
import {CustomerService} from '../../../../admin/service/customer.service';
import {RegisteredOfficeList} from '../../../../admin/modal/registeredOfficeList';
import {BusinessGiven} from '../../../../admin/modal/businessGiven';
import {TranslateService} from '@ngx-translate/core';
import {CalendarType} from '../../../../../@core/model/calendar-type';
import {CommonAddressComponent} from '../../../../common-address/common-address.component';
import {FormUtils} from '../../../../../@core/utils/form.utils';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {AffiliateId} from '../../../../../@core/utils/constants/affiliateId';
import {environment as envSrdb} from '../../../../../../environments/environment.srdb';
import {OwnerKycApplicableComponent} from '../../../../loan-information-template/security/security-initial-form/owner-kyc-applicable/owner-kyc-applicable.component';
import {environment} from '../../../../../../environments/environment';
import {Clients} from '../../../../../../environments/Clients';
import {MicroCompanyFormComponentComponent} from '../../../../micro-loan/form-component/micro-company-form-component/micro-company-form-component.component';

@Component({
    selector: 'app-company-form',
    templateUrl: './company-form.component.html',
    styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
    @Input() formValue: CompanyInfo;
    @Input() bankingRelationshipInput: any;
    @Input() subSectorDetailCodeInput: any;
    @Input() customerCode: any;
    @Input() clientTypeInput: any;

    @ViewChild('companyLocation', {static: true}) companyLocation: CommonAddressComponent;
    @ViewChildren('shareholderKyc') shareholderKyc: QueryList<OwnerKycApplicableComponent>;
    calendarType = 'AD';
    microEnabled: boolean = environment.microLoan;
    microCustomer = false;
    companyInfoFormGroup: FormGroup;
    englishDateSelected = true;
    customerId;
    spinner = false;
    submitted = false;

    companyFormField = {
        showFormField: false,
        isOldCustomer: false
    };

    companySearch = {
        registrationNumber: undefined
    };
    client = environment.client;
    clientName = Clients;
    customer: Customer = new Customer();
    customerInfo: Customer;
    companyInfo: CompanyInfo;
    legalStatus: LegalStatus = new LegalStatus();
    capital: Capital = new Capital();
    swot: Swot = new Swot();
    locations: CompanyLocations = new CompanyLocations();
    managementTeamList: Array<ManagementTeam> = new Array<ManagementTeam>();
    proprietors: Proprietors = new Proprietors();
    proprietorsList: Array<Proprietors> = new Array<Proprietors>();
    provinceList: Array<Province> = new Array<Province>();
    districtList: Array<District> = new Array<District>();
    municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    businessTypes = BusinessType.enumObject();
    contactPerson: ContactPerson = new ContactPerson();
    allDistrict: Array<District> = Array<District>();
    private isBlackListed: boolean;
    companyStructureList: Array<Company>;
    designationList: DesignationList = new DesignationList();
    businessAndIndustry: BusinessAndIndustry = new BusinessAndIndustry();
    designation;
    additionalFieldSelected = false;
    additionalFieldData: any;
    subSector = [];
    clientType = [];

    ckeConfig = Editor.CK_CONFIG;

    // json data
    companyJsonData: CompanyJsonData = new CompanyJsonData();

    @ViewChild('bankingRelationComponent', {static: false})
    bankingRelationComponent: BankingRelationComponent;

    @ViewChild('companyOtherDetailComponent', {static: false})
    companyOtherDetailComponent: CompanyOtherDetailComponent;

    @ViewChild('marketScenarioComponent', {static: false})
    marketScenarioComponent: MarketScenarioComponent;

    @ViewChild('microCompanyFormComponent', {static: false})
    microCompanyFormComponent: MicroCompanyFormComponentComponent;


    experiences = Experience.enumObject();
    successionList = Succession.enumObject();
    regulatoryConcernList = RegulatoryConcern.enumObject();
    supplierList = Supplier.enumObject();
    buyerList = Buyer.enumObject();
    industryGrowthList = IndustryGrowth.enumObject();
    marketCompetitionList = MarketCompetition.enumObject();
    registeredOffice = RegisteredOfficeList.enumObject();
    businessGiven: BusinessGiven = new BusinessGiven();
    companyAddress;
    srdbAffiliatedId = false;
    disableCrgAlpha = envSrdb.disableCrgAlpha;
    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private companyInfoService: CompanyInfoService,
        private blackListService: BlacklistService,
        protected ref: NbDialogRef<CompanyFormComponent>,
        private company: CompanyService,
        private el: ElementRef,
        private customerService: CustomerService,
        private translate: TranslateService
    ) {

    }

    get form() {
        return this.companyInfoFormGroup.controls;
    }

    get additionalInfoForm() {
        return this.companyInfoFormGroup.controls.additionalCompanyInfo['controls'];
    }

    switchLang() {
        if (this.calendarType === CalendarType.BS) {
            this.translate.use('en');
        }
        if (this.calendarType === CalendarType.AD) {
            this.translate.use('np');
        }
    }

    // todo replace all objectutil checking with patch value method

    ngOnInit() {
        if (LocalStorageUtil.getStorage().bankUtil.AFFILIATED_ID === AffiliateId.SRDB) {
            this.srdbAffiliatedId = true;
        }
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.microCustomer = this.formValue.isMicroCustomer;
            this.microCustomerValidation()
        }
        this.companyInfo = this.formValue;
        if (!ObjectUtil.isEmpty(this.companyInfo) && !ObjectUtil.isEmpty(this.companyInfo.companyJsonData)) {
            this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
        }
        this.additionalFieldSelected = this.companyJsonData.isAdditionalCompanyInfo;
        if (this.additionalFieldSelected) {
            this.additionalFieldData = JSON.parse(this.companyInfo.additionalCompanyInfo);
        }
        if (!ObjectUtil.isEmpty(this.companyInfo) && !ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) {
            this.businessAndIndustry = JSON.parse(this.companyInfo.businessAndIndustry);
        }
        if (!ObjectUtil.isEmpty(this.companyInfo) && !ObjectUtil.isEmpty(this.companyInfo.businessGiven)) {
            this.businessGiven = JSON.parse(this.companyInfo.businessGiven);
        }
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            if (FormUtils.isJson(this.companyInfo.companyLocations.address)) {
                this.companyAddress = JSON.parse(this.companyInfo.companyLocations.address);
            }
        }
        this.buildForm();
        this.getAllDistrict();
        this.getCompanyStructure();
        this.getClientType();
        this.getSubSector();
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            this.setManagementTeams(this.companyJsonData.managementTeamList);
        } else {
            this.addManagementTeam();
        }
        if (!ObjectUtil.isEmpty(this.companyInfo)) {
            !ObjectUtil.isEmpty(this.companyJsonData.proprietorList) ?
                this.setProprietors(this.companyJsonData.proprietorList) : this.addProprietor();
        } else {
            this.addProprietor();
        }
        this.designation = this.designationList.designation;
        this.commonLocation.getProvince().subscribe(
            (response: any) => {
                this.provinceList = response.detail;
                this.provinceList.forEach((province: Province) => {
                    if (this.customerInfo !== undefined) {
                        if (!ObjectUtil.isEmpty(this.customerInfo.province)) {
                            if (province.id === this.customerInfo.province.id) {
                                this.companyInfoFormGroup.controls.contactProvince.setValue(province);
                                this.getDistricts(province.id, null);
                            }
                        }
                    }
                });
            }
        );

        if (ObjectUtil.isEmpty(this.formValue)) {
            this.customerId = Number(this.activatedRoute.snapshot.queryParamMap.get('customerId'));
            if (this.customerId !== 0) {
                this.loanFormService.detail(this.customerId).subscribe(
                    (response: any) => {
                        this.commonLocation.getProvince().subscribe(
                            (responseProvince: any) => {
                                this.provinceList = responseProvince.detail;
                                this.provinceList.forEach((province: Province) => {
                                    if (this.customerInfo !== undefined) {
                                        if (!ObjectUtil.isEmpty(this.customerInfo.province)) {
                                            if (province.id === this.customerInfo.province.id) {
                                                this.companyInfoFormGroup.controls.contactProvince.setValue(province);
                                                this.getDistricts(province.id, null);
                                            }
                                        }
                                    }
                                });
                            }
                        );
                        this.companyInfo = response.detail.companyInfo;
                        this.buildForm();
                        this.setCompanyInfo(this.companyInfo);
                    }
                );
            }
        } else {
            this.companyInfo = this.formValue;
            this.setCompanyInfo(this.companyInfo);
        }
        this.companyFormField = {
            showFormField: (!ObjectUtil.isEmpty(this.formValue)),
            isOldCustomer: (ObjectUtil.isEmpty(this.formValue))
        };
        this.calculateSharePercent('proprietors', 'totalSharePercent');
    }

    buildForm() {
        this.companyInfoFormGroup = this.formBuilder.group({

            // Company Information
            companyId:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.id)) ? undefined :
                    this.companyInfo.id],
            customerCode: [ObjectUtil.isEmpty(this.customerCode) ? undefined :
                this.customerCode],
            companyInfoVersion:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.version)) ? undefined :
                    this.companyInfo.version],
            companyName:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.companyName)) ? undefined :
                    this.companyInfo.companyName, [Validators.required]],
            registrationNumber:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.registrationNumber)) ? undefined :
                    this.companyInfo.registrationNumber, [Validators.required]],
            companyPAN:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.panNumber)) ? undefined :
                    this.companyInfo.panNumber, [Validators.required, WhiteSpaceValidation.cannotContainSpace,
                    Validators.maxLength(9), Validators.minLength(9)]],
            companyEstablishmentDate:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.establishmentDate)) ? undefined :
                    new Date(this.companyInfo.establishmentDate), [Validators.required, DateValidator.isValidBefore]],
            businessType:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.businessType)) ? undefined :
                    this.companyInfo.businessType, [Validators.required]],
            majorProductService:
                [(ObjectUtil.isEmpty(this.companyJsonData)
                    || ObjectUtil.isEmpty(this.companyJsonData.majorProductService)) ? undefined :
                    this.companyJsonData.majorProductService, [Validators.required]],
            relationshipSince:
                [(ObjectUtil.isEmpty(this.companyJsonData)
                    || ObjectUtil.isEmpty(this.companyJsonData.relationshipSince)) ? undefined :
                    this.companyJsonData.relationshipSince, DateValidator.isValidBefore],
            issuePlace:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.issuePlace)) ? undefined :
                    this.companyInfo.issuePlace, [Validators.required]],
            email:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.email)) ? undefined :
                    this.companyInfo.email, [Validators.email]],
            contactNum:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.contactNum)) ? undefined :
                    this.companyInfo.contactNum, [Validators.required, Validators.max(9999999999), Validators.min(1000000000)]],
            landLineNumber: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.landLineNumber)) ? undefined :
                this.companyInfo.landLineNumber],
            subsectorDetail:
                [(ObjectUtil.isEmpty(this.subSectorDetailCodeInput)) ? undefined :
                    this.subSectorDetailCodeInput],
            clientType:
                [ObjectUtil.isEmpty(this.clientTypeInput) ? undefined :
                    this.clientTypeInput, Validators.required],

            // legalStatus
            corporateStructure: [(ObjectUtil.isEmpty(this.companyInfo) || ObjectUtil.isEmpty(this.companyInfo.legalStatus) ||
                ObjectUtil.isEmpty(this.companyInfo.legalStatus.corporateStructure)) ?
                undefined : this.companyInfo.legalStatus.corporateStructure.id, Validators.required],


            registeredOffice: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                this.companyInfo.legalStatus.registeredOffice, Validators.required],

            registeredUnderAct: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? undefined :
                this.companyInfo.legalStatus.registeredUnderAct],

            registrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus.registrationDate)) ? undefined :
                new Date(this.companyInfo.legalStatus.registrationDate), [Validators.required, DateValidator.isValidBefore]],

            panRegistrationOffice: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)) ? 'Inland Revenue Department' :
                this.companyInfo.legalStatus.panRegistrationOffice, Validators.required],

            panRegistrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus.panRegistrationDate)) ? undefined :
                new Date(this.companyInfo.legalStatus.panRegistrationDate), [Validators.required, DateValidator.isValidBefore]],

            registrationExpiryDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus.registrationExpiryDate)) ? undefined :
                new Date(this.companyInfo.legalStatus.registrationExpiryDate)],
            // capital
            authorizedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.authorizedCapital],

            paidUpCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.paidUpCapital, Validators.required],

            issuedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.issuedCapital],

            totalCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.totalCapital],

            fixedCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.fixedCapital],

            workingCapital: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.workingCapital],

            numberOfShareholder: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.capital)) ? undefined :
                this.companyInfo.capital.numberOfShareholder],
            // managementTeams
            managementTeams: this.formBuilder.array([]),
            // managementTeamNote
            managementTeamNote: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.managementTeamNote)) ? undefined :
                this.companyJsonData.managementTeamNote],
            // proprietors
            proprietors: this.formBuilder.array([]),
            // contact person
            contactPersons: this.formBuilder.array([
                this.contactPersonFormGroup()
            ]),
            // Location
            locationVersion: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.version],
            locationId: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.id],
            houseNumber: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.houseNumber],
            streetName: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined : this.companyInfo.companyLocations.streetName],
            address: [undefined],
            // swot
            strength: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.swot)) ? undefined : this.companyJsonData.swot.strength, Validators.required],

            weakness: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.swot)) ? undefined : this.companyJsonData.swot.weakness, Validators.required],

            opportunity: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.swot)) ? undefined : this.companyJsonData.swot.opportunity, Validators.required],

            threats: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.swot)) ? undefined : this.companyJsonData.swot.threats, Validators.required],

            // Success Planning
            successionPlanning: [ObjectUtil.isEmpty(this.companyInfo) ? undefined :
                this.companyInfo.successionPlanning],

            // Business Objective
            businessObjective: [ObjectUtil.isEmpty(this.companyJsonData.businessObjective) ? undefined :
                this.companyJsonData.businessObjective],

            // Raw Materials
            rawMaterialSourcing: [ObjectUtil.isEmpty(this.companyJsonData.rawMaterialSourcing) ? undefined :
                this.companyJsonData.rawMaterialSourcing],
            rawMaterialAvailability: [ObjectUtil.isEmpty(this.companyJsonData.rawMaterialAvailability) ? undefined :
                this.companyJsonData.rawMaterialAvailability],

            // Sister concert
            sisterConcern: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.sisterConcern],

            // company background
            companyBackground: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.companyBackground, Validators.required],

            // additional company detail
            additionalCompanyInfo: this.formBuilder.group({
                registrationType: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    this.additionalFieldData.registrationType],
                licenseHolderName: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    this.additionalFieldData.licenseHolderName],
                licenseExpiryDate: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    new Date(this.additionalFieldData.licenseExpiryDate)],
                licenseIssuedDate: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    new Date(this.additionalFieldData.licenseIssuedDate)],
                licenseIssuePlace: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    this.additionalFieldData.licenseIssuePlace],
                additionalInfoRemark: [ObjectUtil.isEmpty(this.additionalFieldData) ? undefined :
                    this.additionalFieldData.additionalInfoRemark],
            }),

            /** 8.business and industry */
            regulatoryConcern: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.regulatoryConcern, this.disableCrgAlpha ? undefined : Validators.required],
            buyer: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.buyer, this.disableCrgAlpha ? undefined : Validators.required],
            supplier: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.supplier, this.disableCrgAlpha ? undefined : Validators.required],

            /** 9. Industry Growth*/
            industryGrowth: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.industryGrowth)) ? undefined :
                this.companyInfo.industryGrowth, this.disableCrgAlpha ? undefined : Validators.required],

            /** 10. Market competition*/
            marketCompetition: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.marketCompetition) ? undefined :
                this.companyInfo.marketCompetition, this.disableCrgAlpha ? undefined : Validators.required],

            /** 11. Experience*/
            experience: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.experience) ? undefined :
                this.companyInfo.experience, this.disableCrgAlpha ? undefined : Validators.required],

            /** Succession*/
            succession: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.succession) ? undefined :
                this.companyInfo.succession, this.disableCrgAlpha ? undefined : Validators.required],

            /** Groups BackGround*/
            groupsBackGround: [ObjectUtil.isEmpty(this.companyJsonData)
            || ObjectUtil.isEmpty(this.companyJsonData.groupsBackGround) ? undefined :
                this.companyJsonData.groupsBackGround],

            /** legal Review Remark*/
            legalReviewRemark: [ObjectUtil.isEmpty(this.companyJsonData)
            || ObjectUtil.isEmpty(this.companyJsonData.legalReviewRemark) ? undefined :
                this.companyJsonData.legalReviewRemark],
            /** Business Given*/
            interestIncomeDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.interestIncomeDuringReview) ? undefined :
                this.businessGiven.interestIncomeDuringReview],
            loanProcessingFeeDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.loanProcessingFeeDuringReview) ? undefined :
                this.businessGiven.loanProcessingFeeDuringReview],
            lcCommissionDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.lcCommissionDuringReview) ? undefined :
                this.businessGiven.lcCommissionDuringReview],
            guaranteeCommissionDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.guaranteeCommissionDuringReview) ? undefined :
                this.businessGiven.guaranteeCommissionDuringReview],
            otherCommissionDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.otherCommissionDuringReview) ? undefined :
                this.businessGiven.otherCommissionDuringReview],
            savingAccountDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.savingAccountDuringReview) ? undefined :
                this.businessGiven.savingAccountDuringReview],
            payrollAccountDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.payrollAccountDuringReview) ? undefined :
                this.businessGiven.payrollAccountDuringReview],
            debitCardsDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.debitCardsDuringReview) ? undefined :
                this.businessGiven.debitCardsDuringReview],
            creditCardsDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.creditCardsDuringReview) ? undefined :
                this.businessGiven.creditCardsDuringReview],
            mobileBankingDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.mobileBankingDuringReview) ? undefined :
                this.businessGiven.mobileBankingDuringReview],
            lockerDuringReview: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.lockerDuringReview) ? undefined :
                this.businessGiven.lockerDuringReview],
            total: [ObjectUtil.isEmpty(this.businessGiven)
            || ObjectUtil.isEmpty(this.businessGiven.total) ? undefined :
                this.businessGiven.total],
            totalSharePercent: [0],

            addressLegalDocument: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.addressLegalDocument)) ? undefined :
                this.companyJsonData.addressLegalDocument],

        });
        if (!this.additionalFieldSelected) {
            this.companyInfoFormGroup.get('additionalCompanyInfo').disable();
        }
    }

    setCompanyInfo(info: CompanyInfo) {
        // set contact persons data
        this.companyInfoFormGroup.setControl('contactPersons', this.setContactPersons(info.contactPersons));
    }

    managementTeamFormGroup(): FormGroup {
        return this.formBuilder.group({
            name: [undefined],
            designation: [undefined],
            companyLegalDocumentAddress: [undefined],
        });
    }

    // set managementTeams data
    setManagementTeams(data) {
        const control = this.companyInfoFormGroup.get('managementTeams') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(singleData => {
                control.push(
                    this.formBuilder.group({
                        name: [singleData.name],
                        designation: [singleData.designation],
                        companyLegalDocumentAddress: [singleData.companyLegalDocumentAddress]
                    })
                );
            });
        }
    }

    removeManagementTeam(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('managementTeams')).removeAt(index);
    }

    addManagementTeam() {
        const controls = this.companyInfoFormGroup.controls.managementTeams as FormArray;
        if (FormUtils.checkEmptyProperties(controls)) {
            this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All Management Detail To Add More'));
            return;
        }
        controls.push(this.managementTeamFormGroup());
    }

    proprietorsFormGroup(): FormGroup {
        this.addressList.push(new Address());
        return this.formBuilder.group({
            name: [undefined, Validators.required],
            contactNo: [undefined],
            share: [undefined, Validators.required],
            province: [null],
            district: [null],
            municipalityVdc: [null],
            holderPercentWardNumber: [undefined, Validators.required],
            citizenshipNum: [undefined],
            issuedDate: [undefined],
            issuedPlace: [undefined],
            fatherName: [undefined],
            grandFatherName: [undefined],
            dateOfBirth: [undefined],
            addressLine1: [undefined, Validators.required],
            addressLine2: [undefined],
            type: [null, Validators.required]
        });
    }

    contactPersonFormGroup(): FormGroup {
        return this.formBuilder.group({
            contactName: [undefined, Validators.required],
            contactEmail: [undefined],
            contactNumber: [undefined, Validators.required],
            functionalPosition: [undefined, Validators.required],
        });
    }

    setContactPersons(contactPerson) {
        const contactPersons = JSON.parse(contactPerson);
        const contactPersonFormArray = new FormArray([]);
        if (!ObjectUtil.isEmpty(contactPersons)) {
            contactPersons.forEach(data => {
                contactPersonFormArray.push(this.formBuilder.group({
                    contactName: [data.contactName, Validators.required],
                    contactEmail: [data.contactEmail],
                    contactNumber: [data.contactNumber, Validators.required],
                    functionalPosition: [data.functionalPosition, Validators.required],
                }));
            });
        } else {
            contactPersonFormArray.push(this.contactPersonFormGroup());
        }
            return contactPersonFormArray;
    }

    addContactPersons() {
        (<FormArray>this.companyInfoFormGroup.get('contactPersons')).push(this.contactPersonFormGroup());
    }

    removeContactPersons(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('contactPersons')).removeAt(index);
    }

    setProprietors(data): FormArray {
        const controls = this.companyInfoFormGroup.get('proprietors') as FormArray;
        this.addressList = new Array<Address>(data.length);
        let proprietorIndex = 0;
        data.forEach(proprietors => {
            this.addressList[proprietorIndex] = new Address();
            if (!ObjectUtil.isEmpty(proprietors.province) && proprietors.province.id !== null) {
                this.getDistricts(proprietors.province.id, proprietorIndex);
                if (!ObjectUtil.isEmpty(proprietors.district) && proprietors.district.id !== null) {
                    this.getMunicipalities(proprietors.district.id, proprietorIndex);
                }
            }
            proprietorIndex++;
            controls.push(this.formBuilder.group({
                name: [proprietors.name === undefined ? '' : proprietors.name, Validators.required],
                contactNo: [proprietors.contactNo === undefined ? '' : proprietors.contactNo],
                share: [proprietors.share === undefined ? '' : proprietors.share, Validators.required],
                province: [proprietors.province === null ? null : proprietors.province],
                district: [proprietors.district === null ? null : proprietors.district],
                municipalityVdc: [proprietors.municipalityVdc === null ? null : proprietors.municipalityVdc],
                holderPercentWardNumber: [proprietors.holderPercentWardNumber === null ? null : proprietors.holderPercentWardNumber],
                citizenshipNum: [proprietors.citizenshipNum === null ? null : proprietors.citizenshipNum],
                issuedDate: [proprietors.issuedDate === null ? null : proprietors.issuedDate],
                issuedPlace: [proprietors.issuedPlace === null ? null : proprietors.issuedPlace],
                dateOfBirth: [proprietors.dateOfBirth === null ? null : proprietors.dateOfBirth],
                fatherName: [proprietors.fatherName === null ? null : proprietors.fatherName],
                grandFatherName: [proprietors.grandFatherName === null ? null : proprietors.grandFatherName],
                addressLine1: [proprietors.addressLine1 === null ? null : proprietors.addressLine1],
                addressLine2: [proprietors.addressLine2 === null ? null : proprietors.addressLine2],
                type: [proprietors.type === undefined ? '' : proprietors.type, Validators.required]
            }));
        });
        return controls;
    }

    // return proprietors formArray
    getProprietor() {
        return (this.companyInfoFormGroup.value.proprietors as FormArray);
    }

    removeProprietor(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('proprietors')).removeAt(index);
        this.addressList.splice(index, 1);
    }

    addProprietor() {
        this.addressList.push(new Address());
        const controls = this.companyInfoFormGroup.controls.proprietors as FormArray;
        // if (FormUtils.checkEmptyProperties(controls)) {
        //     this.toastService.show(new Alert(AlertType.INFO, 'Please Fill All MProprietor/Shareholder/Partner Detail To Add More'));
        //     return;
        // }
        controls.push(this.proprietorsFormGroup());
    }

    // get district list based on province
    getDistricts(provinceId: number, proprietorIndex: number) {
        const province = new Province();
        province.id = provinceId;
        this.commonLocation.getDistrictByProvince(province).subscribe(
            (response: any) => {
                this.districtList = response.detail;
                this.districtList.sort((a, b) => a.name.localeCompare(b.name));
                if (proprietorIndex == null) {
                    if (!ObjectUtil.isEmpty(this.customerInfo)) {
                        this.districtList.forEach(district => {
                            if (!ObjectUtil.isEmpty(this.customerInfo['district']) && district.id === this.customerInfo.district.id) {
                                this.companyInfoFormGroup.controls.contactDistrict.setValue(district);
                                this.getMunicipalities(district.id, null);
                            }
                        });
                    }

                }
                if (!ObjectUtil.isEmpty(proprietorIndex)) {
                    this.addressList[proprietorIndex].districtList = this.districtList;
                }

            }
        );
    }

    // get municipalityVdc list based on district
    getMunicipalities(districtId: number, proprietorIndex: number) {
        const district = new District();
        district.id = districtId;
        this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
            (response: any) => {
                this.municipalityVdcList = response.detail;
                this.municipalityVdcList.sort((a, b) => a.name.localeCompare(b.name));
                if (proprietorIndex == null) {
                    if (!ObjectUtil.isEmpty(this.customerInfo)) {
                        this.municipalityVdcList.forEach(municipality => {
                            if (!ObjectUtil.isEmpty(this.customerInfo.municipalities) &&
                                municipality.id === this.customerInfo.municipalities.id) {
                                this.companyInfoFormGroup.controls.contactMunicipalities.setValue(municipality);
                            }
                        });
                    }
                }
                if (!ObjectUtil.isEmpty(proprietorIndex)) {
                    this.addressList[proprietorIndex].municipalityVdcList = this.municipalityVdcList;
                }
            }
        );
    }

    // todo remove if not used in future
    /*searchByRegNO() {
        this.companySearch.registrationNumber = this.companyInfoFormGroup.get('registrationNumber').value;
        const regNo = this.companyInfoFormGroup.get('registrationNumber').value;
        this.blackListService.checkBlacklistByRef(regNo).subscribe((response: any) => {
            this.isBlackListed = response.detail;

            if (this.isBlackListed) {
                this.companyFormField.showFormField = false;
                this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Company'));
            } else {
                this.companyFormField.showFormField = true;
                this.companyInfoService.getPaginationWithSearchObject(this.companySearch).subscribe((data: any) => {
                    if (data.detail.content <= 0) {
                        this.companyFormField.isOldCustomer = false;

                        this.companyInfo = undefined;
                        this.buildForm();
                        this.companyInfoFormGroup.get('registrationNumber').patchValue(regNo);
                        this.toastService.show(new Alert(AlertType.INFO, 'No company  under given registration number.'));
                    } else {
                        this.companyFormField.isOldCustomer = true;
                        this.companyInfo = data.detail.content[0];
                        // todo change these patching in common function
                        if (!ObjectUtil.isEmpty(this.companyInfo.additionalCompanyInfo)) {
                            this.additionalFieldData = JSON.parse(this.companyInfo.additionalCompanyInfo);
                            this.additionalFieldSelected = true;
                        }
                        if (!ObjectUtil.isEmpty(this.companyInfo) && !ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) {
                            this.businessAndIndustry = JSON.parse(this.companyInfo.businessAndIndustry);
                        }
                        if (!ObjectUtil.isEmpty(this.companyInfo) && !ObjectUtil.isEmpty(this.companyInfo.companyJsonData)) {
                            this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
                        }
                        this.buildForm();
                        this.setCompanyInfo(this.companyInfo);
                    }
                }, error => console.error(error));
                this.companyFormField.showFormField = true;
            }
        });
    }*/
    scrollToFirstInvalidControl() {
        const firstInvalidControl: HTMLElement = this.el.nativeElement.querySelector(
            'form .ng-invalid'
        );
        window.scroll({
            top: this.getTopOffset(firstInvalidControl),
            left: 0,
            behavior: 'smooth'
        });
        firstInvalidControl.focus();
    }

    private getTopOffset(controlEl: HTMLElement): number {
        const labelOffset = 50;
        return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
    }

    onSubmit() {
        this.submitted = true;
        this.marketScenarioComponent.onSubmit();
        this.companyOtherDetailComponent.onSubmit();
        if (!this.disableCrgAlpha) {
            this.bankingRelationComponent.onSubmit();
        }
        if (this.microCustomer) {
            this.microCompanyFormComponent.onSubmit();
            if (this.microCompanyFormComponent.microCustomerForm.invalid) {
                this.toastService.show(new Alert(AlertType.WARNING, 'Check Micro Customer Detail Validation'));
                return;
            }
        }
        this.companyLocation.onSubmit();
        if (this.companyInfoFormGroup.invalid || this.companyOtherDetailComponent.companyOtherDetailGroupForm.invalid
            || this.marketScenarioComponent.marketScenarioForm.invalid ||
            (this.disableCrgAlpha ? false : this.bankingRelationComponent.bankingRelationForm.invalid)
            || this.companyLocation.addressForm.invalid) {
            this.toastService.show(new Alert(AlertType.WARNING, 'Check Validation'));
            this.scrollToFirstInvalidControl();
            return;
        }
        this.spinner = true;
        this.companyInfo = new CompanyInfo();
        this.companyInfo.isMicroCustomer = this.microCustomer;
        // Company Information--
        this.companyInfo.id = this.companyInfoFormGroup.get('companyId').value;
        this.companyInfo.companyName = this.companyInfoFormGroup.get('companyName').value;
        this.companyInfo.customerCode = this.companyInfoFormGroup.get('customerCode').value;
        this.companyInfo.registrationNumber = this.companyInfoFormGroup.get('registrationNumber').value;
        this.companyInfo.panNumber = this.companyInfoFormGroup.get('companyPAN').value;
        this.companyInfo.establishmentDate = this.companyInfoFormGroup.get('companyEstablishmentDate').value;
        this.companyInfo.businessType = this.companyInfoFormGroup.get('businessType').value;
        this.companyInfo.version = this.companyInfoFormGroup.get('companyInfoVersion').value;
        this.companyInfo.email = this.companyInfoFormGroup.get('email').value;
        this.companyInfo.issuePlace = this.companyInfoFormGroup.get('issuePlace').value;
        this.companyInfo.contactNum = this.companyInfoFormGroup.get('contactNum').value;
        this.companyInfo.landLineNumber = this.companyInfoFormGroup.get('landLineNumber').value;
        this.companyInfo.clientType = this.companyInfoFormGroup.get('clientType').value;
        this.companyInfo.subsectorDetail = this.companyInfoFormGroup.get('subsectorDetail').value;


        // legalStatus
        // this.legalStatus.companyName = this.companyInfoFormGroup.get('companyName').value;
        const corporateStructure = new Company();
        corporateStructure.id = this.companyInfoFormGroup.get('corporateStructure').value;
        this.legalStatus.corporateStructure = ObjectUtil.isEmpty(corporateStructure.id) ? undefined : corporateStructure;
        this.legalStatus.registeredOffice = this.companyInfoFormGroup.get('registeredOffice').value;
        this.legalStatus.registeredUnderAct = this.companyInfoFormGroup.get('registeredUnderAct').value;
        // this.legalStatus.registrationNo = this.companyInfoFormGroup.get('registrationNo').value;
        this.legalStatus.registrationDate = this.companyInfoFormGroup.get('registrationDate').value;
        this.legalStatus.panRegistrationOffice = this.companyInfoFormGroup.get('panRegistrationOffice').value;
        // this.legalStatus.panNumber = this.companyInfoFormGroup.get('panNumber').value;
        this.legalStatus.panRegistrationDate = this.companyInfoFormGroup.get('panRegistrationDate').value;
        this.legalStatus.registrationExpiryDate = this.companyInfoFormGroup.get('registrationExpiryDate').value;

        this.companyInfo.legalStatus = this.legalStatus;
        // capital
        this.capital.authorizedCapital = this.companyInfoFormGroup.get('authorizedCapital').value;
        this.capital.paidUpCapital = this.companyInfoFormGroup.get('paidUpCapital').value;
        this.capital.issuedCapital = this.companyInfoFormGroup.get('issuedCapital').value;
        this.capital.totalCapital = this.companyInfoFormGroup.get('totalCapital').value;
        this.capital.fixedCapital = this.companyInfoFormGroup.get('fixedCapital').value;
        this.capital.workingCapital = this.companyInfoFormGroup.get('workingCapital').value;
        this.capital.numberOfShareholder = this.companyInfoFormGroup.get('numberOfShareholder').value;
        this.companyInfo.capital = this.capital;
        // swot
        this.swot.strength = this.companyInfoFormGroup.get('strength').value;
        this.swot.weakness = this.companyInfoFormGroup.get('weakness').value;
        this.swot.opportunity = this.companyInfoFormGroup.get('opportunity').value;
        this.swot.threats = this.companyInfoFormGroup.get('threats').value;

        // management Team Note
        this.companyJsonData.managementTeamNote = this.companyInfoFormGroup.get('managementTeamNote').value;

        // contactPerson
        this.companyInfo.contactPersons = JSON.stringify(this.companyInfoFormGroup.get('contactPersons').value);

        // additional registration/license information
        this.companyInfo.additionalCompanyInfo = JSON.stringify(this.companyInfoFormGroup.get('additionalCompanyInfo').value);

        // succession planning
        this.companyInfo.successionPlanning = this.companyInfoFormGroup.get('successionPlanning').value;

        // location
        this.locations.id = this.companyInfoFormGroup.get('locationId').value;
        this.locations.version = this.companyInfoFormGroup.get('locationVersion').value;
        this.locations.address = JSON.stringify(this.companyLocation.submitData);
        this.locations.houseNumber = this.companyInfoFormGroup.get('houseNumber').value;
        this.locations.streetName = this.companyInfoFormGroup.get('streetName').value;
        this.companyInfo.companyLocations = this.locations;
        // proprietorsList
        this.companyJsonData.proprietorList = new Array<Proprietors>();
        let proprietorsIndex = 0;
        while (proprietorsIndex < this.getProprietor().length) {
            const proprietors = new Proprietors();
            proprietors.name = this.getProprietor()[proprietorsIndex].name;
            proprietors.contactNo = this.getProprietor()[proprietorsIndex].contactNo;
            proprietors.share = this.getProprietor()[proprietorsIndex].share;
            proprietors.holderPercentWardNumber = this.getProprietor()[proprietorsIndex].holderPercentWardNumber;
            proprietors.citizenshipNum = this.getProprietor()[proprietorsIndex].citizenshipNum;
            proprietors.issuedDate = this.getProprietor()[proprietorsIndex].issuedDate;
            proprietors.dateOfBirth = this.getProprietor()[proprietorsIndex].dateOfBirth;
            proprietors.issuedPlace = this.getProprietor()[proprietorsIndex].issuedPlace;
            proprietors.fatherName = this.getProprietor()[proprietorsIndex].fatherName;
            proprietors.grandFatherName = this.getProprietor()[proprietorsIndex].grandFatherName;
            proprietors.addressLine1 = this.getProprietor()[proprietorsIndex].addressLine1;
            proprietors.addressLine2 = this.getProprietor()[proprietorsIndex].addressLine2;
            proprietors.type = this.getProprietor()[proprietorsIndex].type;
            let province = new Province();
            province = this.getProprietor()[proprietorsIndex].province;
            proprietors.province = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].province)) ? province : undefined;
            let district = new District();
            district = this.getProprietor()[proprietorsIndex].district;
            proprietors.district = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].district)) ? district : undefined;
            let municipalityVdc = new MunicipalityVdc();
            municipalityVdc = this.getProprietor()[proprietorsIndex].municipalityVdc;
            proprietors.municipalityVdc = (!ObjectUtil.isEmpty(this.getProprietor()[proprietorsIndex].municipalityVdc))
                ? municipalityVdc : undefined;
            if (this.client !== this.clientName.MEGA) {
                proprietors.kycInfo = this.shareholderKyc.filter(item => item.kycId.toString() ===
                    proprietorsIndex.toString())[0].ownerKycForm.value;
            }
            proprietorsIndex++;
            this.companyJsonData.proprietorList.push(proprietors);
        }

        if (!this.disableCrgAlpha) {
            /** banking relation setting data from child **/
            this.companyInfo.bankingRelationship = JSON.stringify(this.bankingRelationComponent.bankingRelation);

            /** business and industry */
            this.businessAndIndustry.regulatoryConcern = this.companyInfoFormGroup.get('regulatoryConcern').value;
            this.businessAndIndustry.supplier = this.companyInfoFormGroup.get('supplier').value;
            this.businessAndIndustry.buyer = this.companyInfoFormGroup.get('buyer').value;
            this.companyInfo.businessAndIndustry = JSON.stringify(this.businessAndIndustry);

            /** industry growth and market competition */
            this.companyInfo.marketCompetition = this.companyInfoFormGroup.get('marketCompetition').value;
            this.companyInfo.industryGrowth = this.companyInfoFormGroup.get('industryGrowth').value;

            /** experience & succession */
            this.companyInfo.experience = this.companyInfoFormGroup.get('experience').value;
            this.companyInfo.succession = this.companyInfoFormGroup.get('succession').value;
        }

        /**Business Given**/
        this.businessGiven.interestIncomeDuringReview = this.companyInfoFormGroup.get('interestIncomeDuringReview').value;
        this.businessGiven.loanProcessingFeeDuringReview = this.companyInfoFormGroup.get('loanProcessingFeeDuringReview').value;
        this.businessGiven.lcCommissionDuringReview = this.companyInfoFormGroup.get('lcCommissionDuringReview').value;
        this.businessGiven.guaranteeCommissionDuringReview = this.companyInfoFormGroup.get('guaranteeCommissionDuringReview').value;
        this.businessGiven.otherCommissionDuringReview = this.companyInfoFormGroup.get('otherCommissionDuringReview').value;
        this.businessGiven.savingAccountDuringReview = this.companyInfoFormGroup.get('savingAccountDuringReview').value;
        this.businessGiven.payrollAccountDuringReview = this.companyInfoFormGroup.get('payrollAccountDuringReview').value;
        this.businessGiven.debitCardsDuringReview = this.companyInfoFormGroup.get('debitCardsDuringReview').value;
        this.businessGiven.creditCardsDuringReview = this.companyInfoFormGroup.get('creditCardsDuringReview').value;
        this.businessGiven.mobileBankingDuringReview = this.companyInfoFormGroup.get('mobileBankingDuringReview').value;
        this.businessGiven.lockerDuringReview = this.companyInfoFormGroup.get('lockerDuringReview').value;
        this.businessGiven.total = this.companyInfoFormGroup.get('total').value;

        this.companyInfo.businessGiven = JSON.stringify(this.businessGiven);

        // todo change this to common function
        const submitData = new CompanyJsonData();
        Object.keys(submitData).forEach((k) => {
            submitData[k] = this.companyInfoFormGroup.value[k];
        });
        /** other company detail */
        submitData.otherCompanyDetail = this.companyOtherDetailComponent.submitData;
        submitData.rawMaterialSourcing = this.companyInfoFormGroup.get('rawMaterialSourcing').value;
        /** Market Scenario detail */
        submitData.marketScenario = this.marketScenarioComponent.submitData;
        submitData.managementTeamList = this.companyInfoFormGroup.get('managementTeams').value;
        submitData.proprietorList = this.companyJsonData.proprietorList;
        submitData.totalSharePercent = this.companyInfoFormGroup.get('totalSharePercent').value;
        submitData.isAdditionalCompanyInfo = this.additionalFieldSelected;
        submitData.addressLegalDocument = this.companyInfoFormGroup.get('addressLegalDocument').value;

        if (this.microCustomer) {
            /** micro data **/
            submitData.microCustomerDetail = this.microCompanyFormComponent.microCustomerForm.value;
        }


        // swot
        submitData.swot = this.swot;

        this.companyInfo.companyJsonData = JSON.stringify(submitData);
        this.companyInfoService.save(this.companyInfo).subscribe(() => {
            this.spinner = false;
            this.close();
            if (this.formValue.id == null) {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Company Info'));
            } else {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Company Info'));
            }
        }, error => {
            console.error(error);
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, `Error saving Company: ${error.error.message}`));
        });
    }

    selectDate(value) {
        this.englishDateSelected = !value;
    }

    close() {
        this.ref.close();
    }

    private getAllDistrict() {
        this.commonLocation.getAllDistrict().subscribe((response: any) => {
            this.allDistrict = response.detail;
            this.allDistrict.sort((a, b) => a.name.localeCompare(b.name));
        });
    }

    getCompanyStructure() {
        this.company.getAll().subscribe(res => {
            this.companyStructureList = res.detail;
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Company Structure can not be Loaded'));
        });
    }

    checkChecked(event, type) {
        switch (type) {
            case 'additionalInfo':
                if (event) {
                    this.additionalFieldSelected = true;
                    this.companyInfoFormGroup.enable();
                } else {
                    this.additionalFieldSelected = false;
                    this.companyInfoFormGroup.get('additionalCompanyInfo').clearValidators();
                    this.companyInfoFormGroup.get('additionalCompanyInfo').disable();
                }
                break;
        }
    }

    checkPanNumberNumber(regNumber: String) {
        this.companyInfoService.getCompanyInfoWithPanNumber(regNumber).subscribe((res) => {
            if (regNumber.toLowerCase() === res.detail.panNumber.toLowerCase()) {
                this.toastService.show(new Alert(AlertType.WARNING, 'This customer already exists. Please input a unique value or choose the customer from catalogue section'));
            }
        }, error => {
            console.error(error);
        });
    }


    getClientType() {
        this.customerService.clientType().subscribe((res: any) => {
                this.clientType = res.detail;
            }
            , error => {
                console.error(error);
            });
    }

    getSubSector() {
        this.customerService.subSector().subscribe((res: any) => {
                const response = res.detail;
                const sectorArray = [];
                Object.keys(res.detail).forEach(value => {
                    sectorArray.push({
                        key: value, value: response[value]
                    });
                });
                this.subSector = sectorArray;
            }
            , error => {
                console.error(error);
            });
    }

    calculateTotalIncomeDuringReview() {
        let total = 0;
        if (this.client !== this.clientName.MEGA) {
            total = this.companyInfoFormGroup.get('interestIncomeDuringReview').value +
                this.companyInfoFormGroup.get('loanProcessingFeeDuringReview').value +
                this.companyInfoFormGroup.get('lcCommissionDuringReview').value +
                this.companyInfoFormGroup.get('guaranteeCommissionDuringReview').value +
                this.companyInfoFormGroup.get('otherCommissionDuringReview').value +
                this.companyInfoFormGroup.get('savingAccountDuringReview').value +
                this.companyInfoFormGroup.get('payrollAccountDuringReview').value +
                this.companyInfoFormGroup.get('debitCardsDuringReview').value +
                this.companyInfoFormGroup.get('creditCardsDuringReview').value +
                this.companyInfoFormGroup.get('mobileBankingDuringReview').value +
                this.companyInfoFormGroup.get('lockerDuringReview').value;
            this.companyInfoFormGroup.get('total').patchValue(total.toFixed(2));
        } else {
            total = this.companyInfoFormGroup.get('interestIncomeDuringReview').value +
                this.companyInfoFormGroup.get('loanProcessingFeeDuringReview').value +
                this.companyInfoFormGroup.get('lcCommissionDuringReview').value +
                this.companyInfoFormGroup.get('guaranteeCommissionDuringReview').value +
                this.companyInfoFormGroup.get('otherCommissionDuringReview').value;
            this.companyInfoFormGroup.get('total').patchValue(total.toFixed(2));
        }
        // console.log(this.companyInfoFormGroup.get('interestIncomeDuringReview').value +
        //     this.companyInfoFormGroup.get('loanProcessingFeeDuringReview').value);
    }

    // Calculation of Share %
    calculateSharePercent(formArrayName, resultControllerName) {
        let total = 0;
        (this.companyInfoFormGroup.get(formArrayName) as FormArray).controls.forEach(group => {
            total = Number(group.get('share').value) + Number(total);
        });
        this.companyInfoFormGroup.get(resultControllerName).setValue(total);
    }

    microCustomerValidation() {
        this.controlValidation(['strength', 'weakness', 'opportunity', 'threats'] , !!this.microCustomer);
    }

    /** @Param validate --- true for add validation and false for remove validation
     * @Param controlNames --- list of formControlName**/
    controlValidation(controlNames: string[], validate) {

        controlNames.forEach(s => {
            if (validate) {
                this.companyInfoFormGroup.get(s).setValidators(Validators.required);
            } else {
                this.companyInfoFormGroup.get(s).clearValidators();
            }
            this.companyInfoFormGroup.get(s).updateValueAndValidity();
        });
    }
}

import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {Customer} from '../../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {LegalStatus} from '../../../../admin/modal/legal-status';
import {Capital} from '../../../../admin/modal/capital';
import {Swot} from '../../../../admin/modal/swot';
import {CompanyLocations} from '../../../../admin/modal/companyLocations';
import {Proprietors} from '../../../../admin/modal/proprietors';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {Address} from '../../../../loan/model/address';
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
import {Experience} from '../../../../admin/modal/experience';
import {Succession} from '../../../../admin/modal/succession';
import {RegulatoryConcern} from '../../../../admin/modal/regulatory-concern';
import {MarketCompetition} from '../../../../admin/modal/marketCompetition';
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
import {OwnerKycApplicableComponent} from '../../../../loan-information-template/security/security-initial-form/owner-kyc-applicable/owner-kyc-applicable.component';
import {environment} from '../../../../../../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Clients} from '../../../../../../environments/Clients';
import {CustomerCategory} from '../../../model/customerCategory';
import {ContactDetailsComponent} from '../../../../contact-details/contact-details.component';

@Component({
    selector: 'app-company-form',
    templateUrl: './company-form.component.html',
    styleUrls: ['./company-form.component.scss']
})
export class CompanyFormComponent implements OnInit {
    onActionChangeSpinner = false;
    @Input() formValue: CompanyInfo;
    @Input() bankingRelationshipInput: any;
    @Input() subSectorDetailCodeInput: any;
    @Input() customerCode: any;
    @Input() clientTypeInput: any;

    @ViewChild('companyLocation', {static: true}) companyLocation: CommonAddressComponent;
    @ViewChild('companyProjectLocation', {static: true}) companyProjectLocation: CommonAddressComponent;
    @ViewChild('companyCorrespondenceLocation', {static: true}) companyCorrespondenceLocation: CommonAddressComponent;
    @ViewChildren('shareholderKyc') shareholderKyc: QueryList<OwnerKycApplicableComponent>;
    @ViewChild('contactDetail', {static: true}) companyContactDetail: ContactDetailsComponent;
    calendarType = 'AD';
    companyInfoFormGroup: FormGroup;
    englishDateSelected = true;
    customerId;
    spinner = false;
    submitted = false;
    companyFormField = {
        showFormField: false,
        isOldCustomer: false
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
    contactDetails;
    proprietors: Proprietors = new Proprietors();
    provinceList: Array<Province> = new Array<Province>();
    districtList: Array<District> = new Array<District>();
    municipalityVdcList: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
    addressList: Array<Address> = new Array<Address>();
    contactPerson: ContactPerson = new ContactPerson();
    allDistrict: Array<District> = Array<District>();
    companyStructureList: Array<Company>;
    designationList: DesignationList = new DesignationList();
    businessAndIndustry: BusinessAndIndustry = new BusinessAndIndustry();
    designation;
    subSector = [];
    clientType: any;
    loanTypeList = [{
        key: 'UPTO_TEN_MILLION',
        value: 'Upto Ten Million'
    },
    {
        key: 'ABOVE_TEN_MILLION',
        value: 'Above Ten Million'
    }
];

    ckeConfig = Editor.CK_CONFIG;

    // json data
    companyJsonData: CompanyJsonData = new CompanyJsonData();

    @ViewChild('companyOtherDetailComponent', {static: false})
    companyOtherDetailComponent: CompanyOtherDetailComponent;

    @ViewChild('marketScenarioComponent', {static: false})
    marketScenarioComponent: MarketScenarioComponent;

    experiences = Experience.enumObject();
    successionList = Succession.enumObject();
    regulatoryConcernList = RegulatoryConcern.enumObject();
    supplierList = Supplier.enumObject();
    marketCompetitionList = MarketCompetition.enumObject();
    registeredOffice = RegisteredOfficeList.enumObject();
    businessGiven: BusinessGiven = new BusinessGiven();
    disableCrgAlpha = environment.disableCrgAlpha;
    microCustomerType: string;
    groupTable = '<table class="table table-sm table-condensed table-bordered table-responsive-md text-center table-sm sb-small" border="1" cellpadding="1" cellspacing="1" style="width:1000px"><thead><tr><th scope="col">S.No</th><th scope="col">Name of Units</th><th scope="col">Nature of Business</th><th scope="col">Key Person</th><th scope="col">Annual Sales</th><th scope="col">Existing Banker</th><th scope="col">Remarks</th></tr></thead><tbody><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr><tr><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></tbody></table><p>&nbsp;</p>';
    customerCate = CustomerCategory.enumObject();
    sameAddress = false;
    legalOtherData;
    customerCategory = [];
    isAboveTen = false;
    isBelowTen = false;
    isWholeSale = false;
    accStrategyOption = ['New', 'Grow', 'Maintain', 'Exit'];

    constructor(
        private formBuilder: FormBuilder,
        private commonLocation: AddressService,
        private loanDataService: LoanDataService,
        private activatedRoute: ActivatedRoute,
        private loanFormService: LoanFormService,
        private toastService: ToastService,
        private modalService: NgbModal,
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
        this.getCustomerCategory();
        this.companyInfo = this.formValue;
        if (!ObjectUtil.isEmpty(this.formValue)) {
            if (!ObjectUtil.isEmpty(this.companyInfo.companyJsonData)) {
                this.companyJsonData = JSON.parse(this.companyInfo.companyJsonData);
                this.sameAddress = this.companyJsonData.sameAddress;
            }
            if (!ObjectUtil.isEmpty(this.companyInfo.legalStatus.data)) {
                this.legalOtherData = JSON.parse(this.companyInfo.legalStatus.data);
            }
            if (!ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) {
                this.businessAndIndustry = JSON.parse(this.companyInfo.businessAndIndustry);
            }
            if (!ObjectUtil.isEmpty(this.companyInfo.businessGiven)) {
                this.businessGiven = JSON.parse(this.companyInfo.businessGiven);
            }
            if (!ObjectUtil.isEmpty(this.companyInfo.companyContactDetails)) {
                this.contactDetails = this.companyInfo.companyContactDetails;
            }
        }
        this.buildForm();
        // this.checkCustomerCategory();
        this.getAllDistrict();
        this.getCompanyStructure();
        this.getSubSector();
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.checkCustomerCategory(this.companyInfo.customerCategory, false);
            this.setCompanyInfo(this.companyInfo);
            this.setProprietors(this.companyJsonData.proprietorList);
            this.setAccountNumber(this.companyJsonData.accountDetails);
            this.calculateSharePercent('proprietors', 'totalSharePercent');
        } else {
            this.addProprietor();
            this.addAccountNumber();
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
            majorProductService:
                [(ObjectUtil.isEmpty(this.companyJsonData)
                    || ObjectUtil.isEmpty(this.companyJsonData.majorProductService)) ? undefined :
                    this.companyJsonData.majorProductService, [Validators.required]],
            relationshipSince:
                [(ObjectUtil.isEmpty(this.companyJsonData)
                    || ObjectUtil.isEmpty(this.companyJsonData.relationshipSince)) ? undefined :
                    new Date(this.companyJsonData.relationshipSince), DateValidator.isValidBefore],
            relationshipSinceWithCustomer:
                [(ObjectUtil.isEmpty(this.companyJsonData)
                    || ObjectUtil.isEmpty(this.companyJsonData.relationshipSinceWithCustomer)) ? undefined :
                    new Date(this.companyJsonData.relationshipSinceWithCustomer), DateValidator.isValidBefore],
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
                    this.companyInfo.contactNum],
            landLineNumber: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.landLineNumber)) ? undefined :
                this.companyInfo.landLineNumber],
            subsectorDetail:
                [(ObjectUtil.isEmpty(this.subSectorDetailCodeInput)) ? undefined :
                    this.subSectorDetailCodeInput],

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

            regIssuedPlace: [ObjectUtil.isEmpty(this.legalOtherData) ? '' : this.legalOtherData.regIssuedPlace],
            vatRegistrationOffice: [ObjectUtil.isEmpty(this.legalOtherData) ? '' : this.legalOtherData.vatRegistrationOffice],
            vatRegistrationDate: [ObjectUtil.isEmpty(this.legalOtherData) ? '' : new Date(this.legalOtherData.vatRegistrationDate)],
            registrationDistrict: [ObjectUtil.isEmpty(this.legalOtherData) ? '' : this.legalOtherData.registrationDistrict],
            udhyogBibhag: [ObjectUtil.isEmpty(this.legalOtherData) ? '' : this.legalOtherData.udhyogBibhag],
            panRegistrationDate: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus)
                || ObjectUtil.isEmpty(this.companyInfo.legalStatus.panRegistrationDate)) ? undefined :
                new Date(this.companyInfo.legalStatus.panRegistrationDate), [Validators.required, DateValidator.isValidBefore]],

            accountNo:
                [(ObjectUtil.isEmpty(this.companyInfo)
                    || ObjectUtil.isEmpty(this.companyInfo.accountNo)) ? undefined :
                    this.companyInfo.accountNo],

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
            // proprietors
            proprietors: this.formBuilder.array([]),
            // contact person
            contactPersons: this.formBuilder.array([
                this.contactPersonFormGroup()
            ]),
            // Location
            locationVersion: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined :
                this.companyInfo.companyLocations.version],
            locationId: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined :
                this.companyInfo.companyLocations.id],
            houseNumber: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined :
                this.companyInfo.companyLocations.houseNumber],
            streetName: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.companyLocations)) ? undefined :
                this.companyInfo.companyLocations.streetName],
            address: [undefined],
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
            // company background
            businessManagementRisk: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.businessManagementRisk],
            promoterBackground: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.promoterBackground],
            lineOfBusiness: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.lineOfBusiness],
            discriptionWithComment: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.discriptionWithComment],
            majorBuyersSuppliers: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.majorBuyersSuppliers],
            promotersKeyPersons: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.promotersKeyPersons],
            BusinessIndustryOutlook: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                this.companyJsonData.BusinessIndustryOutlook],
            group: [ObjectUtil.isEmpty(this.companyJsonData) ? undefined :
                ObjectUtil.isEmpty(this.companyJsonData.group) ? this.groupTable :
                    this.companyJsonData.group],
            /** 8.business and industry */
            regulatoryConcern: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.regulatoryConcern,  undefined ],
            buyer: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.buyer,  undefined ],
            supplier: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.businessAndIndustry)) ? undefined :
                this.businessAndIndustry.supplier, undefined ],

            /** 9. Industry Growth*/
            industryGrowth: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyInfo.industryGrowth)) ? undefined :
                this.companyInfo.industryGrowth, undefined ],

            /** 10. Market competition*/
            marketCompetition: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.marketCompetition) ? undefined :
                this.companyInfo.marketCompetition, undefined ],

            /** 11. Experience*/
            experience: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.experience) ? undefined :
                this.companyInfo.experience, undefined ],

            /** Succession*/
            succession: [ObjectUtil.isEmpty(this.companyInfo)
            || ObjectUtil.isEmpty(this.companyInfo.succession) ? undefined :
                this.companyInfo.succession,  undefined ],

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
            irdReport: [(ObjectUtil.isEmpty(this.companyInfo)
                || ObjectUtil.isEmpty(this.companyJsonData.irdReport)) ? undefined :
                this.companyJsonData.irdReport],
            accountDetails: this.formBuilder.array([]),
            branchAddress: [(ObjectUtil.isEmpty(this.companyJsonData)
                || ObjectUtil.isEmpty(this.companyJsonData.branchAddress)) ? undefined :
                this.companyJsonData.branchAddress],
            warehouseAddress: [(ObjectUtil.isEmpty(this.companyJsonData)
                || ObjectUtil.isEmpty(this.companyJsonData.warehouseAddress)) ? undefined :
                this.companyJsonData.warehouseAddress],
            business: [(ObjectUtil.isEmpty(this.companyJsonData)
                || ObjectUtil.isEmpty(this.companyJsonData.business)) ? undefined :
                this.companyJsonData.business],
            promoterNetWorth: [(ObjectUtil.isEmpty(this.companyJsonData)
                || ObjectUtil.isEmpty(this.companyJsonData.promoterNetWorth)) ? undefined :
                this.companyJsonData.promoterNetWorth],
            customerCategory: [(ObjectUtil.isEmpty(this.companyInfo)) ? undefined :
                this.companyInfo.customerCategory, [Validators.required]],
            accStrategy: [(ObjectUtil.isEmpty(this.companyInfo)) ? undefined :
                this.companyInfo.accStrategy, [Validators.required]]
        });
    }

    setCompanyInfo(info: CompanyInfo) {
        // set contact persons data
        this.companyInfoFormGroup.setControl('contactPersons', this.setContactPersons(info.contactPersons));
    }

    onCloseCreateCustomer() {
        this.onClose();
    }

    onClose() {
        this.modalService.dismissAll();
    }

    changeAction(template) {
        this.onClose();
        this.modalService.open(template);
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
            contactName: [undefined],
            contactEmail: [undefined],
            contactNumber: [undefined],
            functionalPosition: [undefined],
        });
    }

    setContactPersons(contactPerson) {
        const contactPersons = JSON.parse(contactPerson);
        const contactPersonFormArray = new FormArray([]);
        if (!ObjectUtil.isEmpty(contactPersons)) {
            contactPersons.forEach(data => {
                contactPersonFormArray.push(this.formBuilder.group({
                    contactName: [data.contactName],
                    contactEmail: [data.contactEmail],
                    contactNumber: [data.contactNumber],
                    functionalPosition: [data.functionalPosition],
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
                issuedDate: [ObjectUtil.isEmpty(proprietors.issuedDate) ? undefined : new Date(proprietors.issuedDate)],
                issuedPlace: [proprietors.issuedPlace === null ? null : proprietors.issuedPlace],
                dateOfBirth: [ObjectUtil.isEmpty(proprietors.dateOfBirth) ? undefined : new Date(proprietors.dateOfBirth)],
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
        this.spinner = true;
        this.submitted = true;
        this.companyOtherDetailComponent.onSubmit();
        this.companyContactDetail.onSubmit();
        if (this.companyInfoFormGroup.invalid) {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.WARNING, 'Check Validation'));
            this.scrollToFirstInvalidControl();
            return;
        }
        this.companyInfo = new CompanyInfo();

        // Company Information--
        this.companyInfo.id = this.companyInfoFormGroup.get('companyId').value;
        this.companyInfo.companyName = this.companyInfoFormGroup.get('companyName').value;
        this.companyInfo.customerCode = this.companyInfoFormGroup.get('customerCode').value;
        this.companyInfo.registrationNumber = this.companyInfoFormGroup.get('registrationNumber').value;
        this.companyInfo.panNumber = this.companyInfoFormGroup.get('companyPAN').value;
        this.companyInfo.version = this.companyInfoFormGroup.get('companyInfoVersion').value;
        this.companyInfo.email = this.companyInfoFormGroup.get('email').value;
        this.companyInfo.issuePlace = this.companyInfoFormGroup.get('issuePlace').value;
        this.companyInfo.contactNum = this.companyInfoFormGroup.get('contactNum').value;
        this.companyInfo.landLineNumber = this.companyInfoFormGroup.get('landLineNumber').value;
        this.companyInfo.subsectorDetail = this.companyInfoFormGroup.get('subsectorDetail').value;

        // legalStatus
        const corporateStructure = new Company();
        corporateStructure.id = this.companyInfoFormGroup.get('corporateStructure').value;
        this.legalStatus.corporateStructure = ObjectUtil.isEmpty(corporateStructure.id) ? undefined : corporateStructure;
        this.legalStatus.registeredOffice = this.companyInfoFormGroup.get('registeredOffice').value;
        this.legalStatus.registeredUnderAct = this.companyInfoFormGroup.get('registeredUnderAct').value;
        this.legalStatus.registrationDate = this.companyInfoFormGroup.get('registrationDate').value;
        this.legalStatus.panRegistrationOffice = this.companyInfoFormGroup.get('panRegistrationOffice').value;
        this.legalStatus.panRegistrationDate = this.companyInfoFormGroup.get('panRegistrationDate').value;
        this.legalStatus.registrationExpiryDate = this.companyInfoFormGroup.get('registrationExpiryDate').value;
        const data = {
            regIssuedPlace: this.companyInfoFormGroup.get('regIssuedPlace').value,
            vatRegistrationOffice: this.companyInfoFormGroup.get('vatRegistrationOffice').value,
            vatRegistrationDate: this.companyInfoFormGroup.get('vatRegistrationDate').value,
            registrationDistrict: this.companyInfoFormGroup.get('registrationDistrict').value,
            udhyogBibhag: this.companyInfoFormGroup.get('udhyogBibhag').value,
        };
        this.legalStatus.data = JSON.stringify(data);
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


        // contactPerson
        this.companyInfo.contactPersons = JSON.stringify(this.companyInfoFormGroup.get('contactPersons').value);

        // succession planning
        this.companyInfo.successionPlanning = this.companyInfoFormGroup.get('successionPlanning').value;

        // location
        this.locations.id = this.companyInfoFormGroup.get('locationId').value;
        this.locations.version = this.companyInfoFormGroup.get('locationVersion').value;
        this.locations.houseNumber = this.companyInfoFormGroup.get('houseNumber').value;
        this.locations.streetName = this.companyInfoFormGroup.get('streetName').value;
        this.companyInfo.companyLocations = this.locations;
        // this.companyInfo.companyContactDetail = this.contact;
        this.companyInfo.companyContactDetails = this.companyContactDetail.submitData;
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
                proprietors.kycInfo = this.shareholderKyc.filter(item => item.kycId.toString() ===
                    proprietorsIndex.toString())[0].ownerKycForm.value;
            proprietorsIndex++;
            this.companyJsonData.proprietorList.push(proprietors);
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
        submitData.proprietorList = this.companyJsonData.proprietorList;
        submitData.totalSharePercent = this.companyInfoFormGroup.get('totalSharePercent').value;
        submitData.addressLegalDocument = this.companyInfoFormGroup.get('addressLegalDocument').value;
        submitData.BusinessIndustryOutlook = this.companyInfoFormGroup.get('BusinessIndustryOutlook').value;
        submitData.businessManagementRisk = this.companyJsonData.businessManagementRisk;
        submitData.irdReport = this.companyInfoFormGroup.get('irdReport').value;
        submitData.accountDetails = this.companyInfoFormGroup.get('accountDetails').value;
        // submitData.companyBackgroundBusiness = this.companyInfoFormGroup.get('companyBackgroundBusiness').value;
        submitData.promotersKeyPersons = this.companyInfoFormGroup.get('promotersKeyPersons').value;
        submitData.promoterBackground = this.companyInfoFormGroup.get('promoterBackground').value;
        submitData.lineOfBusiness = this.companyInfoFormGroup.get('lineOfBusiness').value;
        submitData.discriptionWithComment = this.companyInfoFormGroup.get('discriptionWithComment').value;
        submitData.majorBuyersSuppliers = this.companyInfoFormGroup.get('majorBuyersSuppliers').value;
        submitData.group = this.companyInfoFormGroup.get('group').value;
        submitData.sameAddress = this.sameAddress;
        submitData.business = this.companyInfoFormGroup.get('business').value;
        submitData.promoterNetWorth = this.companyInfoFormGroup.get('promoterNetWorth').value;
        if (!ObjectUtil.isEmpty(this.formValue)) {
            this.companyInfo.withinLimitRemarks = this.formValue.withinLimitRemarks;
        }
        this.companyInfo.customerCategory = this.companyInfoFormGroup.get('customerCategory').value;
        this.companyInfo.accStrategy = this.companyInfoFormGroup.get('accStrategy').value;
        this.companyInfo.companyJsonData = JSON.stringify(submitData);
        this.companyInfoService.save(this.companyInfo).subscribe(() => {
            this.spinner = false;
            this.close();
            if (ObjectUtil.isEmpty(this.formValue.id)) {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Saved Company Information'));
            } else {
                this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Company Information'));
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

    checkPanNumberNumber(regNumber: String) {
        this.companyInfoService.getCompanyInfoWithPanNumber(regNumber).subscribe((res) => {
            if (!ObjectUtil.isEmpty(res.detail)) {
                if (regNumber.toLowerCase() === res.detail.panNumber.toLowerCase()) {
                    this.toastService.show(new Alert(AlertType.WARNING, 'This customer already exists. Please input a unique value or choose the customer from catalogue section'));
                }
            }
        }, error => {
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
            total = this.companyInfoFormGroup.get('interestIncomeDuringReview').value +
                this.companyInfoFormGroup.get('loanProcessingFeeDuringReview').value +
                this.companyInfoFormGroup.get('lcCommissionDuringReview').value +
                this.companyInfoFormGroup.get('guaranteeCommissionDuringReview').value +
                this.companyInfoFormGroup.get('otherCommissionDuringReview').value;
            this.companyInfoFormGroup.get('total').patchValue(total.toFixed(2));
    }

    // Calculation of Share %
    calculateSharePercent(formArrayName, resultControllerName) {
        let total = 0;
        (this.companyInfoFormGroup.get(formArrayName) as FormArray).controls.forEach(group => {
            total = Number(group.get('share').value) + Number(total);
        });
        this.companyInfoFormGroup.get(resultControllerName).setValue(total);
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

    addAccountNumber() {
        (this.companyInfoFormGroup.get('accountDetails') as FormArray).push(
            this.formBuilder.group({
                accountNo: [undefined],
            })
        );
    }

    removeAccount(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('accountDetails')).removeAt(index);
    }

    setAccountNumber(data) {
        const account = this.companyInfoFormGroup.get('accountDetails') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(l => {
                account.push(this.formBuilder.group({
                    accountNo: [l.accountNo]
                }));
            });
        }
    }

    oldAccountDetails() {
        if (!ObjectUtil.isEmpty(this.companyInfo.accountNo)) {
            const oldAccountNo = {
                accountDetails: []
            };
            oldAccountNo.accountDetails.push({
                'accountNo': this.companyInfo.accountNo
            });
            this.setAccountNumber(oldAccountNo.accountDetails);
        }
    }

    addSisterConcern() {
        (this.companyInfoFormGroup.get('sisterConcern') as FormArray).push(
            this.formBuilder.group({
                sisterCon: [undefined],
            })
        );
    }

    removeSisterConcern(index: number) {
        (<FormArray>this.companyInfoFormGroup.get('sisterConcern')).removeAt(index);
    }

    setSisterConcern(data) {
        const sis = this.companyInfoFormGroup.get('sisterConcern') as FormArray;
        if (!ObjectUtil.isEmpty(data)) {
            data.forEach(l => {
                sis.push(this.formBuilder.group({
                    sisterCon: [l.sisterCon]
                }));
            });
        }
    }

    sameAsPermanent(value) {
        if (value) {
            this.companyLocation.onSubmit();
            if (this.companyLocation.addressForm.invalid) {
                this.sameAddress = false;
                this.toastService.show(new Alert(AlertType.WARNING, 'Please fill registered address'));
                return;
            }
            const data = this.companyLocation.submitData;
            if (!ObjectUtil.isEmpty(data)) {
                if (!ObjectUtil.isEmpty(data.province)) {
                    this.companyProjectLocation.getDistrictsById(data.province.id, null);
                    this.companyProjectLocation.getMunicipalitiesById(data.district.id, null);
                }
                this.companyProjectLocation.addressForm.patchValue(data);
            }
            this.sameAddress = value;
        } else {
            this.companyProjectLocation.addressForm.get('address1').patchValue(null);
            this.companyProjectLocation.addressForm.get('address2').patchValue(null);
            this.companyProjectLocation.addressForm.get('province').patchValue(null);
            this.companyProjectLocation.addressForm.get('district').patchValue(null);
            this.companyProjectLocation.addressForm.get('municipalityVdc').patchValue(null);
            this.companyProjectLocation.addressForm.get('ward').patchValue(null);
            this.sameAddress = value;
        }
    }

    getCustomerCategory() {
        this.customerCategory = this.customerCate.filter(f =>
            f.value !== CustomerCategory.AGRICULTURE_WITHOUT_COLLATERAL);
    }

    checkCustomerCategory(targetValue, editCustomer: boolean) {
        this.isAboveTen = false;
        this.isBelowTen = false;
        this.isWholeSale = false;
        let value: any = null;
        if (editCustomer) {
            const newValue = targetValue.split(':').map(m => m.trim());
            value = newValue[newValue.length - 1];
        } else {
            value = targetValue;
        }
        if (value === 'SME_ABOVE_TEN_MILLION' || value === 'AGRICULTURE_ABOVE_TEN_MILLION') {
            this.isAboveTen = true;
            this.companyInfoFormGroup.get('business').patchValue(null);
            this.companyInfoFormGroup.get('promoterNetWorth').patchValue(null);
            this.companyInfoFormGroup.get('group').patchValue(this.groupTable);
        } else if (value === 'SME_UPTO_TEN_MILLION' ||
            value === 'AGRICULTURE_UPTO_TWO_MILLION' ||
            value === 'AGRICULTURE_TWO_TO_TEN_MILLION') {
            const formControlName = ['promoterBackground', 'lineOfBusiness', 'discriptionWithComment', 'majorBuyersSuppliers', 'group'];
            formControlName.forEach(f => this.companyInfoFormGroup.get(f).patchValue(null));
            this.isBelowTen = true;
        } else {
            this.isWholeSale = true;
        }
    }
}

import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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

@Component({
  selector: 'app-cad-offer-letter-configuration',
  templateUrl: './cad-offer-letter-configuration.component.html',
  styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

  @Input() customerType: String;
  @Input() personalCustomerType: String;
  @Input() jointCustomerNum: String;
  @Input() institutionCustomerType: String;
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
  activeTemplateDataTab = true;
  addressSameAsAbove = false;
  provinceList: Array<Province> = new Array<Province>();
  districts: Array<District> = new Array<District>();
  municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
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

  constructor(private formBuilder: FormBuilder,
              private loanConfigService: LoanConfigService,
              private branchService: BranchService,
              private customerInfoService: CustomerInfoService,
              private cadOneformService: CadOneformService,
              private customerService: CustomerService,
              private toastService: ToastService,
              private engToNepNumber: EngToNepaliNumberPipe,
              public datepipe: DatePipe,
              protected dialogRef: NbDialogRef<CadOfferLetterConfigurationComponent>,
              private http: HttpClient,
              private translateService: SbTranslateService,
              private addressService: AddressService) {
  }

  get configForm() {
    return this.userConfigForm.controls;
  }

  get form() {
    return this.userConfigForm.controls;
  }

  ngOnInit() {
    this.addressService.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
        });

    this.addressService.getProvince().subscribe(
        (response: any) => {
          this.tempProvinceList = response.detail;
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
    this.addJointCustomerDetails();
    this.addGuarantor();
    this.translateObjectValue();
    this.userConfigForm.get('clientType').patchValue(this.customerType);
    this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
      this.branchList = response.detail;
      this.branchList.sort((a, b) => a.name.localeCompare(b.name));
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
    });
    if (!ObjectUtil.isEmpty(this.customerInfo.nepData)) {
      const data = JSON.parse(this.customerInfo.nepData);
      this.userConfigForm.patchValue(data);
      this.setGuarantors(data.guarantorDetails);
    }
  }

  buildForm() {
    this.userConfigForm = this.formBuilder.group({
      branch: [undefined],
      branchCT: [undefined],
      clientType: [undefined],
      clientTypeCT: [undefined],
      name: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.customerName],
      nameCT: [undefined],
      email: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.email],
      emailCT: [undefined],
      contactNo: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.contactNumber],
      contactNoCT: [undefined],
      panNo: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.panNumber],
      panNoCT: [undefined],
      registrationNo: [undefined],
      registrationNoCT: [undefined],
      registrationDate: [undefined],
      registrationDateCT: [undefined],
      registeredMunicipality: [undefined],
      registeredMunicipalityCT: [undefined],
      registeredMunType: [undefined],
      registeredMunTypeCT: [undefined],
      registeredDistrict: [undefined],
      registeredDistrictCT: [undefined],
      registeredProvince: [undefined],
      registeredProvinceCT: [undefined],
      currentMunType: [undefined],
      currentMunTypeCT: [undefined],
      currentProvince: [undefined],
      currentProvinceCT: [undefined],
      currentWard: [undefined],
      currentWardCT: [undefined],
      currentDistrict: [undefined],
      currentDistrictCT: [undefined],
      currentMunicipality: [undefined],
      currentMunicipalityCT: [undefined],
      customerCode: [undefined],
      customerCodeCT: [undefined],


      gender: [undefined],
      genderCT: [undefined],
      fatherName: [undefined],
      fatherNameCT: [undefined],
      grandFatherName: [undefined],
      grandFatherNameCT: [undefined],
      relationMedium: [undefined],
      relationMediumCT: [undefined],
      husbandName: [undefined],
      husbandNameCT: [undefined],
      fatherInLawName: [undefined],
      fatherInLawNameCT: [undefined],
      citizenshipNo: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.citizenshipNumber],
      citizenshipNoCT: [undefined],
      dob: [undefined],
      dobCT: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentProvinceCT: [undefined],
      permanentProvince: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.province],
      // tslint:disable-next-line:max-line-length
      permanentDistrict: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.district],
      permanentDistrictCT: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentMunicipality: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.municipalities],
      permanentMunicipalityCT: [undefined],
      permanentMunType: [0],
      permanentMunTypeCT: [0],
      // tslint:disable-next-line:max-line-length
      temporaryProvince: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryProvince],
      temporaryProvinceCT: [undefined],
      // tslint:disable-next-line:max-line-length
      temporaryDistrict: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryDistrict],
      temporaryDistrictCT: [undefined],
      // tslint:disable-next-line:max-line-length
      temporaryMunicipality: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryMunicipalities],
      temporaryMunicipalityCT: [undefined],
      permanentWard: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.wardNumber],
      permanentWardCT: [undefined],
      temporaryWard: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryWardNumber],
      temporaryWardCT: [undefined],
      temporaryMunType: [1],
      temporaryMunTypeCT: [undefined],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDistrictCT: [undefined],
      citizenshipIssueDate: [undefined],
      citizenshipIssueDateCT: [undefined],
      municipalityOrVdc: [undefined],
      municipalityOrVdcCT: [undefined],
      temporaryMunicipalityOrVdc: [undefined],
      temporaryMunicipalityOrVdcCT: [undefined],
      dobDateType: [undefined],
      dobDateTypeCT: [undefined],
      issuedDate: [undefined],
      issuedDateCT: [undefined],
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
    this.submitted = true;
    this.spinner = true;
    const clientType = this.userConfigForm.get('clientType').value;
    this.oneFormCustomer.customerCode = this.userConfigForm.get('customerCode').value;
    this.oneFormCustomer.customerName = this.userConfigForm.get('name').value;
    this.oneFormCustomer.companyName = this.userConfigForm.get('name').value;
    this.oneFormCustomer.panNumber = this.userConfigForm.get('panNo').value;
    this.oneFormCustomer.email = this.userConfigForm.get('email').value;
    this.oneFormCustomer.registrationNumber = this.userConfigForm.get('registrationNo').value;
    this.oneFormCustomer.customerName = this.userConfigForm.get('name').value;
    this.oneFormCustomer.contactNumber = this.userConfigForm.get('contactNo').value;
    this.oneFormCustomer.gender = this.userConfigForm.get('gender').value;
    const customer = {
      relationMedium: this.userConfigForm.get('relationMedium').value,
      husbandName: this.userConfigForm.get('husbandName').value,
      fatherInLawName: this.userConfigForm.get('fatherInLawName').value,
      grandFatherName: this.userConfigForm.get('grandFatherName').value,
      fatherName: this.userConfigForm.get('fatherName').value,
      municipalityOrVdc: this.userConfigForm.get('municipalityOrVdc').value,
      temporaryMunicipalityOrVdc: this.userConfigForm.get('temporaryMunicipalityOrVdc').value,
    };
    this.oneFormCustomer.individualJsonData = JSON.stringify(customer);
    this.oneFormCustomer.citizenshipNumber = this.userConfigForm.get('citizenshipNo').value;
    const dobDateType = this.userConfigForm.get('dobDateType').value;
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
    this.oneFormCustomer.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssueDistrict').value;
    this.oneFormCustomer.province = this.userConfigForm.get('permanentProvince').value;
    this.oneFormCustomer.district = this.userConfigForm.get('permanentDistrict').value;
    this.oneFormCustomer.municipalities = this.userConfigForm.get('permanentMunicipality').value;
    this.oneFormCustomer.wardNumber = this.userConfigForm.get('permanentWard').value;
    this.oneFormCustomer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
    this.oneFormCustomer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
    this.oneFormCustomer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
    this.oneFormCustomer.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;
    Object.keys(this.userConfigForm.controls).forEach(key => {
      console.log(key);
      if (key.indexOf('CT') > -1) {
        return;
      }
      if (key === 'guarantorDetails' || key === 'jointCustomerDetails') {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.userConfigForm.get(key).value;
      this.attributes.np = this.translatedValues[key];
      this.attributes.ct = this.userConfigForm.get(key + 'CT').value;
      this.translatedData[key] = this.attributes;
    });
    // this.translatedData['guarantorDetails'] = this.translatedGuarantorDetails;

    const data = {
      branch: this.userConfigForm.get('branch').value,
      customerType: clientType,
      customer: this.oneFormCustomer,
      guarantorDetails: this.userConfigForm.get('guarantorDetails').value,
      jointCustomerDetails: this.userConfigForm.get('jointCustomerDetails').value,
      translatedData: this.translatedData
    };
    this.cadOneformService.saveCustomer(data).subscribe(res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer'));
      console.log(res);
      this.customerId = res.detail.customerInfoId;
      this.responseData = res.detail;
      this.activeCustomerTab = false;
      this.activeLoanTab = true;
    }, res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
    });
  }

  closeModal() {
    this.dialogRef.close();
  }

  addJointCustomerDetails() {
    (this.userConfigForm.get('jointCustomerDetails') as FormArray).push(this.addJointCustomerDetailFields({}));
  }

  addJointCustomerDetailFields(value: any) {
    return this.formBuilder.group({
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
      contactNo: [value.contactNo ? value.contactNo : undefined],
      contactNoTrans: [value.contactNoTrans ? value.contactNoTrans : undefined],
      contactNoCT: [value.contactNoCT ? value.contactNoCT : undefined],
      panNo: [value.panNo ? value.panNo : undefined],
      panNoTrans: [value.panNoTrans ? value.panNoTrans : undefined],
      panNoCT: [value.panNoCT ? value.panNoCT : undefined],
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
      //Trans tslint:disable-nextTrans-line:maxTrans-line-length
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
    });
  }

  setJointCustomerDetails(jointCustomerDetails: any) {
    if (ObjectUtil.isEmpty(jointCustomerDetails)) {
      this.addJointCustomerDetails();
      return;
    }
    const formArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;

    jointCustomerDetails.forEach(value => {
      formArray.push(this.addJointCustomerDetailFields(value));
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
      guarantorNameTrans: [undefined],
      guarantorNameCT: '',
      issuedYear: '',
      issuedYearCT: '',
      issuedPlace: '',
      issuedPlaceTrans: [undefined],
      issuedPlaceCT: '',
      guarantorPermanentMunicipalityOrVdc: '',
      guarantorPermanentMunicipalityOrVdcTrans: '',
      guarantorPermanentMunicipalityOrVdcCT: '',
      guarantorTemporaryMunicipalityOrVdc: '',
      guarantorTemporaryMunicipalityOrVdcTrans: '',
      guarantorTemporaryMunicipalityOrVdcCT: '',
      relationship: '',
      relationshipCT: '',
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
      citizenIssuedDate: [undefined],
      citizenIssuedDateTrans: [undefined],
      citizenIssuedDateCT: [undefined],
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

      nepData: [undefined]
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
    if (!ObjectUtil.isEmpty(this.customerInfo.guarantors)) {
      if (!ObjectUtil.isEmpty(this.customerInfo.guarantors.guarantorList)) {
        const guarantorList = this.customerInfo.guarantors.guarantorList;
        this.guarantorList = guarantorList;
      }
    }
    guarantorDetails.forEach(value => {
      formArray.push(this.formBuilder.group({
        guarantorName: [value.guarantorName],
        guarantorNameTrans: [undefined],
        guarantorNameCT: [value.guarantorNameCT],
        citizenNumberTrans: [undefined],
        issuedYear: [value.issuedYear],
        issuedYearCT: [value.issuedYearCT],
        issuedPlace: [value.issuedPlace],
        issuedPlaceTrans: [undefined],
        issuedPlaceCT: [value.issuedPlaceCT],
        genderCT: [value.genderCT],
        gender: [value.gender],
        genderTrans: [undefined],
        relationMediumCT: [value.relationMediumCT],
        relationMedium: [value.relationMedium],
        husbandNameCT: [value.husbandNameCT],
        husbandName: [value.husbandName],
        husbandNameTrans: [undefined],

        fatherInLawNameCT: [value.fatherInLawNameCT],
        fatherInLawName: [value.fatherInLawName],
        fatherInLawNameTrans: [undefined],

        grandFatherNameCT: [value.grandFatherNameCT],
        grandFatherName: [value.grandFatherName],
        grandFatherNameTrans: [undefined],

        fatherNameCT: [value.fatherNameCT],
        fatherName: [value.fatherName],
        fatherNameTrans: [undefined],

        relationship: [value.relationship],
        relationshipCT: [value.relationshipCT],
        citizenNumber: [value.citizenNumber],
        citizenNumberCT: [value.citizenNumberCT],
        gurantedAmount: [value.gurantedAmount],
        gurantedAmountCT: [value.gurantedAmountCT],
        gurantedAmountTrans: [undefined],

        permanentProvince: [value.permanentProvince],
        permanentProvinceCT: [value.permanentProvinceCT],
        permanentProvinceTrans: [undefined],
        permanentDistrict: [value.permanentDistrict],
        permanentDistrictCT: [value.permanentDistrictCT],
        permanentDistrictTrans: [undefined],
        permanentMunicipality: [value.permanentMunicipality],
        permanentMunicipalityCT: [value.permanentMunicipalityCT],
        permanentMunicipalityTrans: [undefined],
        permanentWard: [value.permanentWard],
        permanentWardCT: [value.permanentWardCT],
        permanentWardTrans: [undefined],

        temporaryProvince: [value.temporaryProvince],
        temporaryProvinceCT: [value.temporaryProvinceCT],
        temporaryProvinceTrans: [undefined],
        temporaryDistrict: [value.temporaryDistrict],
        temporaryDistrictCT: [value.temporaryDistrictCT],
        temporaryDistrictTrans: [undefined],
        temporaryMunicipality: [value.temporaryMunicipality],
        temporaryMunicipalityCT: [value.temporaryMunicipalityCT],
        temporaryMunicipalityTrans: [undefined],
        temporaryWard: [value.temporaryWard],
        temporaryWardCT: [value.temporaryWardCT],
        temporaryWardTrans: [undefined],
        isSameTemporaryAndPermanent: [value.isSameTemporaryAndPermanent],
        isSameTemporaryAndPermanentCT: [undefined],
        isSameTemporaryAndPermanentTrans: [undefined],
        nepData: [value.nepData],
      }));
    });
  }

  refreshPage() {
    window.location.reload();
  }

  async translate() {
    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.userConfigForm);
    this.spinner = false;
    this.objectTranslateForm.patchValue({
      branch: ObjectUtil.isEmpty(this.userConfigForm.get('branch').value) ? null : this.userConfigForm.get('branch').value.name,
      branchCT: ObjectUtil.isEmpty(this.userConfigForm.get('branchCT').value) ? null : this.userConfigForm.get('branchCT').value.name,
      permanentProvince: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvince').value) ? null :
          this.userConfigForm.get('permanentProvince').value.name,
      permanentProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvinceCT').value) ? null :
          this.userConfigForm.get('permanentProvinceCT').value.name,
      permanentDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrict').value) ? null :
          this.userConfigForm.get('permanentDistrict').value.name,
      permanentDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrictCT').value) ? null :
          this.userConfigForm.get('permanentDistrictCT').value.name,
      permanentMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ? null :
          this.userConfigForm.get('permanentMunicipality').value.name,
      permanentMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipalityCT').value) ? null :
          this.userConfigForm.get('permanentMunicipalityCT').value.name,
      temporaryProvince: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ? null :
          this.userConfigForm.get('temporaryProvince').value.name,
      temporaryProvinceCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvinceCT').value) ? null :
          this.userConfigForm.get('temporaryProvinceCT').value.name,
      temporaryDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ? null :
          this.userConfigForm.get('temporaryDistrict').value.name,
      temporaryDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrictCT').value) ? null :
          this.userConfigForm.get('temporaryDistrictCT').value.name,
      temporaryMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ? null :
          this.userConfigForm.get('temporaryMunicipality').value.name,
      temporaryMunicipalityCT: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipalityCT').value) ? null :
          this.userConfigForm.get('temporaryMunicipalityCT').value.name,
      citizenshipIssueDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ? null :
          this.userConfigForm.get('citizenshipIssueDistrict').value.name,
      citizenshipIssueDistrictCT: ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrictCT').value) ? null :
          this.userConfigForm.get('citizenshipIssueDistrictCT').value.name,
    });
    this.objectValueTranslater = await this.translateService.translateForm(this.objectTranslateForm);
    this.disableSave = false;
  }


  async translateJointCustomerData(index) {
    const allJointCustomers = this.userConfigForm.get('jointCustomerDetails').value as FormArray;
    if (allJointCustomers.length > 0) {
      let jointCustomerDetails: any = [];
      jointCustomerDetails = await this.translateService.translateForm(this.userConfigForm, 'jointCustomerDetails', index);

      this.userConfigForm.get(['jointCustomerDetails', index, 'branchTrans']).setValue(jointCustomerDetails.branch || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'nameTrans']).setValue(jointCustomerDetails.name || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'emailTrans']).setValue(jointCustomerDetails.email || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'contactNoTrans']).setValue(jointCustomerDetails.contactNo || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'panNoTrans']).setValue(jointCustomerDetails.panNo || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'customerCodeTrans']).setValue(jointCustomerDetails.customerCode || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'genderTrans']).setValue(jointCustomerDetails.gender || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameTrans']).setValue(jointCustomerDetails.fatherName || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameTrans']).setValue(jointCustomerDetails.grandFatherName || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'relationMediumTrans']).setValue(jointCustomerDetails.relationMedium || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameTrans']).setValue(jointCustomerDetails.husbandName || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameTrans']).setValue(jointCustomerDetails.fatherInLawName || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipNoTrans']).setValue(jointCustomerDetails.citizenshipNo || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'dobTrans']).setValue(jointCustomerDetails.dob || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDistrictTrans']).setValue(jointCustomerDetails.citizenshipIssueDistrict || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'citizenshipIssueDateTrans']).setValue(jointCustomerDetails.citizenshipIssueDate || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'municipalityOrVdcTrans']).setValue(jointCustomerDetails.municipalityOrVdc || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'dobDateTypeTrans']).setValue(jointCustomerDetails.dobDateType || '');
      this.userConfigForm.get(['jointCustomerDetails', index, 'issuedDateTrans']).setValue(jointCustomerDetails.issuedDate || '');

      // this.userConfigForm.get(['jointCustomerDetails', index, 'guarantorNameTrans']).setValue(jointCustomerDetails.guarantorName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'guarantorNameTrans']).setValue(jointCustomerDetails.guarantorName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'citizenNumberTrans']).setValue(jointCustomerDetails.citizenNumber || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'issuedPlaceTrans']).setValue(jointCustomerDetails.issuedPlace || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'genderTrans']).setValue(jointCustomerDetails.gender || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'husbandNameTrans']).setValue(jointCustomerDetails.husbandName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'fatherInLawNameTrans']).setValue(jointCustomerDetails.fatherInLawName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'grandFatherNameTrans']).setValue(jointCustomerDetails.grandFatherName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'fatherNameTrans']).setValue(jointCustomerDetails.fatherName || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'gurantedAmountTrans']).setValue(jointCustomerDetails.gurantedAmount || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'permanentWardTrans']).setValue(jointCustomerDetails.permanentWard || '');
      // this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryWardTrans']).setValue(jointCustomerDetails.temporaryWard || '');

      this.addressFromGroup = this.formBuilder.group({
        permanentProvince: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentProvince']).value,
        permanentDistrict: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrict']).value,
        permanentMunicipality: this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipality']).value,
        temporaryProvince: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryProvince']).value,
        temporaryDistrict: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryDistrict']).value,
        temporaryMunicipality: this.userConfigForm.get(['jointCustomerDetails', index, 'temporaryMunicipality']).value,
      });

      this.jointCustomerAddressTranslatedValue = await this.translateService.translateForm(this.addressFromGroup);

      // translate jointCustomerDetails
      const formArrayDataArrays: FormArray = this.userConfigForm.get(`jointCustomerDetails`) as FormArray;
      let a: any;
      a = formArrayDataArrays.controls;
      const newArr = {};
      // for (let i = 0; i < a.length; i++) {
      const individualData = a[index] as FormGroup;
      Object.keys(individualData.controls).forEach(key => {
        console.log('key: ', key);
        if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value) {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = individualData.get(key).value;
        this.attributes.np = jointCustomerDetails[key];
        this.attributes.ct = individualData.get(key + 'CT').value;
        newArr[key] = this.attributes;
      });
      this.translatedGuarantorDetails[index] = newArr;
      this.deleteJointCustomerCTAndTransControls(index);
      this.userConfigForm.get(['jointCustomerDetails', index, 'nepData']).setValue(JSON.stringify(newArr));
      // end guarantorDetails
    }
  }

  async translateGuarantorData(index) {
    const alluarantors = this.userConfigForm.get('guarantorDetails').value as FormArray;
    if (alluarantors.length > 0) {
      let guarantorsDetails: any = [];
      guarantorsDetails = await this.translateService.translateForm(this.userConfigForm, 'guarantorDetails', index);
      this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).setValue(guarantorsDetails.guarantorName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberTrans']).setValue(guarantorsDetails.citizenNumber || '');
      this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).setValue(guarantorsDetails.issuedPlace || '');
      this.userConfigForm.get(['guarantorDetails', index, 'genderTrans']).setValue(guarantorsDetails.gender || '');
      this.userConfigForm.get(['guarantorDetails', index, 'husbandNameTrans']).setValue(guarantorsDetails.husbandName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameTrans']).setValue(guarantorsDetails.fatherInLawName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).setValue(guarantorsDetails.grandFatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).setValue(guarantorsDetails.fatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).setValue(guarantorsDetails.gurantedAmount || '');
      this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).setValue(guarantorsDetails.permanentWard || '');
      this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).setValue(guarantorsDetails.temporaryWard || '');

      this.addressFromGroup = this.formBuilder.group({
        permanentProvince: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value.name,
        permanentDistrict: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value.name,
        permanentMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value.name,
        temporaryProvince: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value.name,
        temporaryDistrict: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value.name,
        temporaryMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value.name,
      });

      this.addressTranslatedValue = await this.translateService.translateForm(this.addressFromGroup);

      // translate guarantorsDetails
      const formArrayDataArrays: FormArray = this.userConfigForm.get(`guarantorDetails`) as FormArray;
      let a: any;
      a = formArrayDataArrays.controls;
      const newArr = {};
      // for (let i = 0; i < a.length; i++) {
      const individualData = a[index] as FormGroup;
      Object.keys(individualData.controls).forEach(key => {
        console.log('key: ', key);
        if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1 || !individualData.get(key).value) {
          return;
        }
        this.attributes = new Attributes();
        this.attributes.en = individualData.get(key).value;
        this.attributes.np = guarantorsDetails[key];
        this.attributes.ct = individualData.get(key + 'CT').value;
        newArr[key] = this.attributes;
      });
      this.translatedGuarantorDetails[index] = newArr;
      this.deleteCTAndTransContorls(index);
      this.userConfigForm.get(['guarantorDetails', index, 'nepData']).setValue(JSON.stringify(newArr));
      // end guarantorDetails
    }
  }

  // deleteCTAndTransContorls from form controls
  deleteJointCustomerCTAndTransControls(index) {
    let formArrayDataArrays: FormArray = this.userConfigForm.get('jointCustomerDetails') as FormArray;
    let a: any;
    a = formArrayDataArrays.controls;
    let individualData = a[index] as FormGroup;
    Object.keys(individualData.controls).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1) {
        individualData.removeControl(key);
      }
    });
  }

  // deleteCTAndTransContorls from form controls
  deleteCTAndTransContorls(index) {
    let formArrayDataArrays: FormArray = this.userConfigForm.get('guarantorDetails') as FormArray;
    let a: any;
    a = formArrayDataArrays.controls;
    let individualData = a[index] as FormGroup;
    Object.keys(individualData.controls).forEach(key => {
      if (key.indexOf('CT') > -1 || key.indexOf('Trans') > -1) {
        individualData.removeControl(key);
      }
    });
  }

  getCadApprovedData(data) {
    this.cadData = data.customerApprovedLoanCadDocumentation;
  }

  sameAsPermanent(event) {
    if (event.target.checked === true) {
      this.addressSameAsAbove = true;
      this.userConfigForm.patchValue({
        temporaryProvince: this.userConfigForm.get('permanentProvince').value,
        temporaryDistrict: this.userConfigForm.get('permanentDistrict').value,
        temporaryMunicipality: this.userConfigForm.get('permanentMunicipality').value,
        temporaryWard: this.userConfigForm.get('permanentWard').value
      });
    } else {
      this.addressSameAsAbove = false;
      this.userConfigForm.patchValue({
        temporaryProvince: undefined,
        temporaryDistrict: undefined,
        temporaryMunicipality: undefined,
        temporaryWard: undefined
      });
    }
  }

  getDistrictsById(provinceId: number, event) {
    console.log(provinceId);
    const province = new Province();
    province.id = provinceId;
    this.addressService.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districts = response.detail;
          this.districts.sort((a, b) => a.name.localeCompare(b.name));
        }
    );
  }

  // get district/municipalities for guarantors
  getJointCustomerDistrictsById(provinceId: number, event, index) {
    const province = new Province();
    province.id = provinceId;
    this.addressService.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districts = response.detail;
          this.districts.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentDistrict']).patchValue(null);
          }
        }
    );
  }

  getJointCustomerMunicipalitiesById(districtId: number, event, index) {
    const district = new District();
    district.id = districtId;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalities = response.detail;
          this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['jointCustomerDetails', index, 'permanentMunicipality']).patchValue(null);
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
  getGuarantorDistrictsById(provinceId: number, event, index) {
    const province = new Province();
    province.id = provinceId;
    this.addressService.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districts = response.detail;
          this.districts.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).patchValue(null);
          }
        }
    );
  }

  getGuarantorMunicipalitiesById(districtId: number, event, index) {
    const district = new District();
    district.id = districtId;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalities = response.detail;
          this.municipalities.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).patchValue(null);
          }
        }
    );
  }

  setGuarantorAddressSameAsPermanent(event, i, val) {
    if (event.target.checked === true) {
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentProvince']).value);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentDistrict']).value);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentMunicipality']).value);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(this.userConfigForm.get(['guarantorDetails', i, 'permanentWard']).value);
    } else {
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryProvince']).patchValue(null);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryDistrict']).patchValue(null);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryMunicipality']).patchValue(null);
      this.userConfigForm.get(['guarantorDetails', i, 'temporaryWard']).patchValue(null);
    }
  }

  getAllEditedDistrictAndMunicipalities() {
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
            if (event !== null) {
              this.userConfigForm.get('permanentMunicipality').patchValue(null);
            }
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
            if (event !== null) {
              this.userConfigForm.get('temporaryMunicipality').patchValue(null);
            }
          }
      );
    }
  }

  getTempDistrictsById(provinceId: number, event) {
    console.log(provinceId);
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
      permanentProvince: [undefined],
      permanentProvinceCT: [undefined],
      permanentDistrict: [undefined],
      permanentDistrictCT: [undefined],
      permanentMunicipality: [undefined],
      permanentMunicipalityCT: [undefined],
      temporaryProvince: [undefined],
      temporaryProvinceCT: [undefined],
      temporaryDistrict: [undefined],
      temporaryDistrictCT: [undefined],
      temporaryMunicipality: [undefined],
      temporaryMunicipalityCT: [undefined],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDistrictCT: [undefined]

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
}

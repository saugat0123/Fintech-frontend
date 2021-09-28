import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
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
import {Gender} from '../../../../@core/model/enum/gender';
import {OneFormCustomerDto} from '../../model/one-form-customer-dto';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Attributes} from '../../../../@core/model/attributes';
import {CustomerInfoNepaliComponent} from '../../../loan/component/loan-main-nepali-template/customer-info-nepali/customer-info-nepali.component';
import {LoanCreateComponent} from './loan-create/loan-create.component';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {NepaliCalendarService, NepaliDayPipe} from 'nepali-patro';

@Component({
  selector: 'app-cad-offer-letter-configuration',
  templateUrl: './cad-offer-letter-configuration.component.html',
  styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

  @Input() customerType;
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
  tempGuarantorProvinceList: Array<Province> = new Array<Province>();
  districts: Array<District> = new Array<District>();
  tempGuarantorDistricts: Array<District> = new Array<District>();
  municipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
  tempGuarantorMunicipalities: Array<MunicipalityVdc> = new Array<MunicipalityVdc>();
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
  nepData;
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

  ngOnInit() {
    this.addressService.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
        });

    this.addressService.getProvince().subscribe(
        (response: any) => {
          this.tempProvinceList = response.detail;
        });
    this.addressService.getProvince().subscribe((response: any) => {
      this.tempGuarantorProvinceList = response.detail;
    });

    if (!ObjectUtil.isEmpty(this.oneFormCustomer)) {
        this.getAllEditedDistrictAndMunicipalities();
        this.dateTypeAD = true;
    } else {
        this.oneFormCustomer = new OneFormCustomerDto();
    }

    this.addressService.getAllDistrict().subscribe( (resp: any) => {
      this.allDistrictList = resp.detail;
    });
    this.buildForm();
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

    if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer) ) {
      this.nepData = (JSON.parse(this.loanHolder.nepData));
    }

    this.patchValue();
    this.patchNepData();
    this.patchIndividualData();
    // this.patchGuarantorsData();
    this.patchCorrectionData();

  }

  buildForm() {
    this.userConfigForm = this.formBuilder.group({
      branch: [undefined],
      branchCT: [undefined],
      clientType: [undefined],
      clientTypeCT: [undefined],
      name: [undefined],
      nameCT: [undefined],
      email: [undefined],
      emailCT: [undefined],
      contactNo: [undefined],
      contactNoCT: [undefined],
      panNo: [undefined],
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
      citizenshipNo: [undefined],
      citizenshipNoCT: [undefined],
      dob: [undefined],
      dobCT: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentProvinceCT: [undefined],
      permanentProvince: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentDistrict: [undefined],
      permanentDistrictCT: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentMunicipality: [undefined],
      permanentMunicipalityCT: [undefined],
      permanentMunType: [0],
      permanentMunTypeCT: [0],
      // tslint:disable-next-line:max-line-length
      temporaryProvince: [undefined],
      temporaryProvinceCT: [undefined],
      // tslint:disable-next-line:max-line-length
      temporaryDistrict: [undefined],
      temporaryDistrictCT: [undefined],
      // tslint:disable-next-line:max-line-length
      temporaryMunicipality: [undefined],
      temporaryMunicipalityCT: [undefined],
      permanentWard: [undefined],
      permanentWardCT: [undefined],
      temporaryWard: [undefined],
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
        sameAddress: this.addressSameAsAbove,
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
    this.oneFormCustomer.customerInfoId = ObjectUtil.isEmpty(this.loanHolder) ? null : this.loanHolder.id;
    Object.keys(this.userConfigForm.controls).forEach(key => {
        // console.log(key);
        if (key.indexOf('CT') > -1) {
          return;
        }
        if (key === 'guarantorDetails') {
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
        relationshipTrans: [undefined],
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
        citizenshipIssueDistrict:  ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ? null :
            this.userConfigForm.get('citizenshipIssueDistrict').value,
      citizenshipIssueDistrictCT:  ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrictCT').value) ? null :
          this.userConfigForm.get('citizenshipIssueDistrictCT').value.name,
    });
    this.objectValueTranslater = await  this.translateService.translateForm(this.objectTranslateForm);
    this.disableSave = false;
  }

  async translateGuarantorData(index) {
    const alluarantors = this.userConfigForm.get('guarantorDetails').value as FormArray;
    if (alluarantors.length > 0) {
      let guarantorsDetails: any = [];
      guarantorsDetails = await this.translateService.translateForm(this.userConfigForm, 'guarantorDetails', index);
      this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameTrans']).setValue(guarantorsDetails.guarantorName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'guarantorNameCT']).setValue(guarantorsDetails.guarantorName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberTrans']).setValue(guarantorsDetails.citizenNumber || '');
      this.userConfigForm.get(['guarantorDetails', index, 'citizenNumberCT']).setValue(guarantorsDetails.citizenNumber || '');
      this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceTrans']).setValue(guarantorsDetails.issuedPlace || '');
      this.userConfigForm.get(['guarantorDetails', index, 'issuedPlaceCT']).setValue(guarantorsDetails.issuedPlace || '');
      this.userConfigForm.get(['guarantorDetails', index, 'genderTrans']).setValue(guarantorsDetails.gender || '');
      this.userConfigForm.get(['guarantorDetails', index, 'genderCT']).setValue(guarantorsDetails.gender || '');
      this.userConfigForm.get(['guarantorDetails', index, 'husbandNameCT']).setValue(guarantorsDetails.husbandName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameCT']).setValue(guarantorsDetails.fatherInLawName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameCT']).setValue(guarantorsDetails.grandFatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherNameCT']).setValue(guarantorsDetails.fatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountCT']).setValue(guarantorsDetails.gurantedAmount || '');

      this.userConfigForm.get(['guarantorDetails', index, 'husbandNameTrans']).setValue(guarantorsDetails.husbandName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherInLawNameTrans']).setValue(guarantorsDetails.fatherInLawName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'grandFatherNameTrans']).setValue(guarantorsDetails.grandFatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'fatherNameTrans']).setValue(guarantorsDetails.fatherName || '');
      this.userConfigForm.get(['guarantorDetails', index, 'gurantedAmountTrans']).setValue(guarantorsDetails.gurantedAmount || '');
      this.userConfigForm.get(['guarantorDetails', index, 'permanentWardTrans']).setValue(guarantorsDetails.permanentWard || '');
      this.userConfigForm.get(['guarantorDetails', index, 'permanentWardCT']).setValue(guarantorsDetails.permanentWard || '');
      this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardTrans']).setValue(guarantorsDetails.temporaryWard || '');
      this.userConfigForm.get(['guarantorDetails', index, 'temporaryWardCT']).setValue(guarantorsDetails.temporaryWard || '');
      this.userConfigForm.get(['guarantorDetails', index, 'relationshipTrans']).setValue(guarantorsDetails.relationship || '');
      this.userConfigForm.get(['guarantorDetails', index, 'relationshipCT']).setValue(guarantorsDetails.relationship || '');

      this.addressFromGroup = this.formBuilder.group({
        permanentProvince: this.userConfigForm.get(['guarantorDetails', index, 'permanentProvince']).value.name || '',
        permanentDistrict: this.userConfigForm.get(['guarantorDetails', index, 'permanentDistrict']).value.name || '',
        permanentMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'permanentMunicipality']).value.name || '',
        temporaryProvince: this.userConfigForm.get(['guarantorDetails', index, 'temporaryProvince']).value.name || '',
        temporaryDistrict: this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).value.name || '',
        temporaryMunicipality: this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).value.name || '',
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
        temporaryWard: this.userConfigForm.get('permanentWard').value,
          tempMunicipalitiesOrVdc: this.userConfigForm.get('municipalityOrVdc').value
      });
    } else {
      this.addressSameAsAbove = false;
        this.userConfigForm.patchValue({
            temporaryProvince: undefined,
            temporaryDistrict: undefined,
            temporaryMunicipality: undefined,
            temporaryWard: undefined,
            tempMunicipalitiesOrVdc: undefined
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

  // get district/municipalities for guarantors
  getGuarantorTempDistrictsById(provinceId: number, event, index) {
    const province = new Province();
    province.id = provinceId;
    this.addressService.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.tempGuarantorDistricts = response.detail;
          this.tempGuarantorDistricts.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryDistrict']).patchValue(null);
          }
        }
    );
  }
  getGuarantorTempMunicipalitiesById(districtId: number, event, index) {
    const district = new District();
    district.id = districtId;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.tempGuarantorMunicipalities = response.detail;
          this.tempGuarantorMunicipalities.sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.userConfigForm.get(['guarantorDetails', index, 'temporaryMunicipality']).patchValue(null);
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
       if(this.loanHolder.customerType === CustomerType.INDIVIDUAL){
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

  get form() {
    return this.userConfigForm.controls;
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

    patchValue(): void {

    if(this.loanHolder.customerType === CustomerType.INDIVIDUAL){
      this.userConfigForm.get('dobDateType').patchValue(JSON.parse(this.loanHolder.nepData).dobDateType.en);
      this.userConfigForm.get('issuedDate').patchValue(JSON.parse(this.loanHolder.nepData).issuedDate.en);
      this.userConfigForm.get('permanentMunType').patchValue(JSON.parse(this.loanHolder.nepData).permanentMunType.en);
      this.addressSameAsAbove = JSON.parse(this.oneFormCustomer.individualJsonData).sameAddress;
      this.userConfigForm.get('dob').patchValue(JSON.parse(this.loanHolder.nepData).dob.en);
      this.userConfigForm.get('citizenshipIssueDate').patchValue(JSON.parse(this.loanHolder.nepData).citizenshipIssueDate.en);
      this.userConfigForm.get('relationMedium').patchValue(Number(JSON.parse(this.oneFormCustomer.individualJsonData).relationMedium));
      this.userConfigForm.get('municipalityOrVdc').patchValue(JSON.parse(this.oneFormCustomer.individualJsonData).municipalityOrVdc);
      console.log(this.userConfigForm.get('dobDateType').value);
    }




        if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer) ) {

            this.userConfigForm.patchValue({
              branch: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.branch,
              gender: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.gender,
                customerCode: ObjectUtil.isEmpty(this.loanHolder) ? undefined : this.loanHolder.customerCode,
                name: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.customerName,
                email: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.email,
                contactNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.contactNumber,
                panNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.panNumber,
                citizenshipNo: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.citizenshipNumber,
                permanentProvince: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.province,
                permanentDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.district,
              permanentMunicipality: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.municipalities,
                temporaryProvince: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryProvince,
                temporaryDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryDistrict,
                temporaryMunicipality: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryMunicipalities,
                permanentWard: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.wardNumber,
                temporaryWard: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.temporaryWardNumber,
                citizenshipIssueDistrict: ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : this.oneFormCustomer.citizenshipIssuedPlace,


            });
        }
    }

    patchNepData(){
      if (!ObjectUtil.isEmpty(this.loanHolder) && !ObjectUtil.isEmpty(this.oneFormCustomer) ) {
        const nepData = (JSON.parse(this.loanHolder.nepData));
        console.log(nepData);
        this.userConfigForm.patchValue({
          panNo : ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.en,
          branchCT: ObjectUtil.isEmpty(nepData.branch) ? undefined : nepData.branch.ct,
          customerCodeCT: ObjectUtil.isEmpty(nepData.customerCode) ? undefined : nepData.customerCode.np,
          nameCT: ObjectUtil.isEmpty(nepData.name) ? undefined : nepData.name.np,
          emailCT:  ObjectUtil.isEmpty(nepData.email) ? undefined : nepData.email.np,
          contactNoCT:  ObjectUtil.isEmpty(nepData.contactNo) ? undefined : nepData.contactNo.np,
          panNoCT: ObjectUtil.isEmpty(nepData.panNo) ? undefined : nepData.panNo.np,

          citizenshipNoCT: ObjectUtil.isEmpty(nepData.citizenshipNumber) ? undefined : nepData.citizenshipNumber.np,
          genderCT: ObjectUtil.isEmpty(nepData.gender) ? undefined : nepData.gender.np,
          permanentProvinceCT: ObjectUtil.isEmpty(nepData.permanentProvince) ? undefined : nepData.permanentProvince.np,
          permanentDistrictCT: ObjectUtil.isEmpty(nepData.permanentDistrict) ? undefined : nepData.permanentDistrict.np,
          permanentMunicipality: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,
          temporaryProvinceCT: ObjectUtil.isEmpty(nepData.temporaryProvince) ? undefined : nepData.temporaryProvince.np,
          temporaryDistrictCT: ObjectUtil.isEmpty(nepData.temporaryDistrict) ? undefined : nepData.temporaryDistrict.np,
          temporaryMunicipalityCT: ObjectUtil.isEmpty(nepData.temporaryMunicipality) ? undefined : nepData.temporaryMunicipality.np,
          permanentWardCT: ObjectUtil.isEmpty(nepData.permanentWard) ? undefined : nepData.permanentWard.np,
          temporaryWardCT: ObjectUtil.isEmpty(nepData.temporaryWard) ? undefined : nepData.temporaryWard.np,
          citizenshipIssueDateCT : ObjectUtil.isEmpty(nepData.citizenshipIssueDate) ? undefined : nepData.citizenshipIssueDate.np,
          // dobCT: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,
          // citizenshipIssueDistrictCT: ObjectUtil.isEmpty(nepData.permanentMunicipality) ? undefined : nepData.permanentMunicipality.np,

        });
      }
    }

    patchIndividualData(){
      if (this.loanHolder.customerType === CustomerType.INDIVIDUAL) {
        const memberData = JSON.parse(this.oneFormCustomer.individualJsonData);
        this.userConfigForm.patchValue({
          fatherName: ObjectUtil.isEmpty(memberData.fatherName) ? undefined : memberData.fatherName,
          grandFatherName: ObjectUtil.isEmpty(memberData.grandFatherName) ? undefined : memberData.grandFatherName,
          husbandName: ObjectUtil.isEmpty(memberData.husbandName) ? undefined : memberData.husbandName,
          fatherInLawName : ObjectUtil.isEmpty(memberData.fatherInLawName) ? undefined : memberData.fatherInLawName,
        });
      }
    }

    // patchGuarantorsData(): void{
    //   const formArray = this.userConfigForm.get('guarantorDetails') as FormArray;
    //  this.loanHolder.guarantors.guarantorList.forEach( value => {
    //    console.log(value);
    //    formArray[0].patchValue({
    //      guarantorName: value.name
    //    });
    //  });
    // }


  patchCorrectionData(): void {
    this.userConfigForm.patchValue({
      branchCT: !ObjectUtil.isEmpty(this.translatedValues.branch) ? this.translatedValues.branch : this.nepData.branch.ct,
    });
  }

    munVdcValue(values: any) {
        console.log(values);
    }
}

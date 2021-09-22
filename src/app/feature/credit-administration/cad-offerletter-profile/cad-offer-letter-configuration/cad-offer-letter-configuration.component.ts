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
  // @Input() customer: Customer;
  @Output()
  customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
  @ViewChild('loan-create', {static: true}) loanCreateComponent: LoanCreateComponent;
  loanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
  loanTypeList = LoanType;
  branchList: Array<Branch> = new Array<Branch>();
  guarantorList: Array<Guarantor>;
  userConfigForm: FormGroup;
  spinner = false;
  submitted = false;
  relationshipList = RelationshipNepali.enumObject();
  hideSaveBtn = false;
  clientType = CustomerType;
  translatedValues: any;
  translatedData = {};
  customer: Customer = new Customer();
  customerId = undefined;
  attributes: Attributes = new Attributes();
  company: CompanyInfo = new CompanyInfo();
  companyLocations: CompanyLocations = new CompanyLocations();
  disableLoanFacility = true;
  oneFormCustomer: OneFormCustomerDto = new OneFormCustomerDto();
  calendarType = CalendarType.AD;
  disableTemplateData = true;
  disableLoanTab = true;
  disableTemplateTab = true;
  responseData: any;
  disableSave = true;
  activeCustomerTab = true;
  activeLoanTab = false;
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
  }

  buildForm() {
    this.userConfigForm = this.formBuilder.group({
      branch: [undefined],
      clientType: [undefined],
      name: [undefined],
      email: [undefined],
      contactNo: [undefined],
      panNo: [undefined],
      registrationNo: [undefined],
      registrationDate: [undefined],
      registeredMunicipality: [undefined],
      registeredMunType: [undefined],
      registeredDistrict: [undefined],
      registeredProvince: [undefined],
      currentMunType: [undefined],
      currentProvince: [undefined],
      currentWard: [undefined],
      currentDistrict: [undefined],
      currentMunicipality: [undefined],
      customerCode: [undefined],


      gender: [this.checkIsIndividual() ? this.gender(this.customerInfo.gender) : undefined],
      fatherName: [undefined],
      grandFatherName: [undefined],
      relationMedium: [undefined],
      husbandName: [undefined],
      fatherInLawName: [undefined],
      citizenshipNo: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customerInfo.idNumber) : undefined],
      dob: [undefined],
      // tslint:disable-next-line:max-line-length
      permanentProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.province.nepaliName) ? undefined : this.customer.province.nepaliName : undefined],
      // tslint:disable-next-line:max-line-length
      permanentDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.district.nepaliName) ? undefined : this.customer.district.nepaliName : undefined],
      // tslint:disable-next-line:max-line-length
      permanentMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.municipalities.nepaliName) ? undefined : this.customer.municipalities.nepaliName : undefined],
      permanentMunType: [0],
      // tslint:disable-next-line:max-line-length
      temporaryProvince: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryProvince.nepaliName) ? undefined : this.customer.temporaryProvince.nepaliName : undefined],
      // tslint:disable-next-line:max-line-length
      temporaryDistrict: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryDistrict.nepaliName) ? undefined : this.customer.temporaryDistrict.nepaliName : undefined],
      // tslint:disable-next-line:max-line-length
      temporaryMunicipality: [this.checkIsIndividual() ? ObjectUtil.isEmpty(this.customer.temporaryMunicipalities.nepaliName) ? undefined : this.customer.temporaryMunicipalities.nepaliName : undefined],
      permanentWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.wardNumber) : undefined],
      temporaryWard: [this.checkIsIndividual() ? this.engToNepNumber.transform(this.customer.temporaryWardNumber) : undefined],
      temporaryMunType: [1],
      citizenshipIssueDistrict: [undefined],
      citizenshipIssueDate: [undefined],
      guarantorDetails: this.formBuilder.array([]),
      loanDetails: this.formBuilder.array([]),


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

  // submit() {
  //   this.customer.customerName = this.userConfigForm.get('name').value;
  //   this.customer.customerCode = this.userConfigForm.get('customerCode').value;
  //   this.cadOneformService.saveCustomer(this.customer).subscribe(res => {
  //     this.toastService.show(new Alert(AlertType.SUCCESS, 'User created successfully'));
  //   }, error => {
  //     console.error(error);
  //     this.toastService.show(new Alert(AlertType.DANGER, 'Error creating user'));
  //   });
  // }


  saveCustomer() {


    //
    // console.log(this.translatedData.branch.en, 'asdasdasdasd');

    this.submitted = true;
    // if (this.userConfigForm.invalid) {
    //   return;
    // }
    this.spinner = true;


    // this.customer.id = this.customer ? (this.customer.id ? this.customer.id : undefined) : undefined;
    // this.customer.customerCode = this.userConfigForm.get('customerCode').value;
    // this.customer.customerName = this.userConfigForm.get('name').value;
    // this.customer.customerCode = this.userConfigForm.get('customerCode').value;
    // this.customer.province = this.userConfigForm.get('province').value;
    // this.customer.district = this.userConfigForm.get('district').value;
    // this.customer.municipalities = this.userConfigForm.get('municipalities').value;
    // this.customer.wardNumber = this.userConfigForm.get('wardNumber').value;
    // this.customer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
    // this.customer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
    // this.customer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipalities').value;
    // this.customer.temporaryWardNumber = this.userConfigForm.get('temporaryWardNumber').value;
    // this.customer.contactNumber = this.userConfigForm.get('contactNumber').value;
    // this.customer.email = this.userConfigForm.get('email').value;
    // this.customer.dob = this.userConfigForm.get('dob').value;
    // this.customer.initialRelationDate = this.userConfigForm.get('initialRelationDate').value;
    // this.customer.citizenshipNumber = this.userConfigForm.get('citizenshipNumber').value;
    // this.customer.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssuedPlace').value;
    // this.customer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssuedDate').value;
    // this.customer.clientType = this.userConfigForm.get('clientType').value;
    // this.customer.subsectorDetail = this.userConfigForm.get('subsectorDetail').value;
    // this.customer.gender = this.userConfigForm.get('gender').value;
    // this.customer.maritalStatus = this.userConfigForm.get('maritalStatus').value;
    // this.customer.customerLegalDocumentAddress = this.userConfigForm.get('customerLegalDocumentAddress').value;


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
    this.oneFormCustomer.citizenshipNumber = this.userConfigForm.get('citizenshipNo').value;

    this.oneFormCustomer.dob = new Date(this.userConfigForm.get('dob').value.eDate);
    this.oneFormCustomer.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssueDistrict').value.name;
    this.oneFormCustomer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDate').value;
    this.oneFormCustomer.province = this.userConfigForm.get('permanentProvince').value;
    this.oneFormCustomer.district = this.userConfigForm.get('permanentDistrict').value;
    this.oneFormCustomer.municipalities = this.userConfigForm.get('permanentMunicipality').value;
    this.oneFormCustomer.wardNumber = this.userConfigForm.get('permanentWard').value;
    this.oneFormCustomer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
    this.oneFormCustomer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
    this.oneFormCustomer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
    this.oneFormCustomer.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;

    // this.company.establishmentDate = this.userConfigForm.get('registrationDate').value;
    // this.company.companyLegalDocumentAddress = JSON.stringify(
    //     this.userConfigForm.get('registeredMunicipality').value +
    //     this.userConfigForm.get('registeredMunType').value +
    //     this.userConfigForm.get('registeredDistrict').value +
    //     this.userConfigForm.get('registeredProvince').value
    // );
    // this.companyLocations.address = this.userConfigForm.get('currentMunType').value +
    //     this.userConfigForm.get('currentProvince').value +
    //     this.userConfigForm.get('currentWard').value +
    //     this.userConfigForm.get('currentDistrict').value +
    //     this.userConfigForm.get('currentMunicipality').value;
    //
    // this.company.companyLocations = this.companyLocations;
    // this.company.registeredMunicipality = this.userConfigForm.get('registeredMunicipality').value;
    // this.company.registeredMunType = this.userConfigForm.get('registeredMunType').value;
    // this.company.registeredDistrict = this.userConfigForm.get('registeredDistrict').value;
    // this.company.registeredProvince = this.userConfigForm.get('registeredProvince').value;
    // this.company.currentMunType = this.userConfigForm.get('currentMunType').value;
    // this.company.currentProvince = this.userConfigForm.get('currentProvince').value;
    // this.company.currentWard = this.userConfigForm.get('currentWard').value;
    // this.company.currentDistrict = this.userConfigForm.get('currentDistrict').value;
    // this.company.currentMunicipality = this.userConfigForm.get('currentMunicipality').value;
    // this.company.customerCode = this.userConfigForm.get('customerCode').value;


    // this.company.fatherName = this.userConfigForm.get('fatherName').value;
    // this.company.grandFatherName = this.userConfigForm.get('grandFatherName').value;
    // this.company.relationMedium = this.userConfigForm.get('relationMedium').value;
    // this.company.husbandName = this.userConfigForm.get('husbandName').value;
    // this.company.fatherInLawName = this.userConfigForm.get('fatherInLawName').value;
    // this.company.panNumber = this.userConfigForm.get('panNo').value;
    // this.company.province = this.userConfigForm.get('permanentProvince').value;
    // this.company.district = this.userConfigForm.get('permanentDistrict').value;
    // this.company.municipalities = this.userConfigForm.get('permanentMunicipality').value;
    // this.company.wardNumber = this.userConfigForm.get('permanentWard').value;
    // this.company.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
    // this.company.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
    // this.company.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
    // this.company.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;
    // this.company.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssueDistrict').value;
    // this.company.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDate').value;

    // this.customer.province = this.userConfigForm.get('permanentProvince').value;
    // this.customer.district = this.userConfigForm.get('permanentDistrict').value;
    // this.customer.municipalities = this.userConfigForm.get('permanentMunicipality').value;
    // this.customer.wardNumber = this.userConfigForm.get('permanentWard').value;
    // this.customer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
    // this.customer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
    // this.customer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
    // this.customer.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;

    // this.customer.withinLimitRemarks = this.formValue.withinLimitRemarks;
    // const occupations = {
    //   multipleOccupation: this.userConfigForm.get('occupation').value,
    //   otherOccupation: this.userConfigForm.get('otherOccupation').value
    // };
    // const incomeSource = {
    //   multipleIncome: this.userConfigForm.get('incomeSource').value,
    //   otherIncome: this.userConfigForm.get('otherIncome').value
    // };
    // this.customer.occupation = JSON.stringify(occupations);
    // this.customer.incomeSource = JSON.stringify(incomeSource);
    // this.customer.introduction = this.userConfigForm.get('introduction').value;
    // this.customer.version = this.userConfigForm.get('version').value;
    // const rawFromValue = this.userConfigForm.getRawValue();
    // this.customer.customerRelatives = rawFromValue.customerRelatives;

    /** banking relation setting data from child **/
    // possibly can have more field in banking relationship
    // this.customer.bankingRelationship = JSON.stringify(this.userConfigForm.get('bankingRelationship').value);
    // this.customer.netWorth = this.userConfigForm.get('netWorth').value;

    /** Remaining static read-write only data*/
    //  this.customer.individualJsonData = this.setIndividualJsonData();

    // this.customer.isMicroCustomer = this.microCustomer;

    Object.keys(this.userConfigForm.controls).forEach(key => {
      if (key === 'loanDetails') {
        return;
      }
      this.attributes = new Attributes();
      console.log(key);
      console.log(this.userConfigForm.get(key).value);
      this.attributes.en = this.userConfigForm.get(key).value;
      this.attributes.np = this.translatedValues[key];
      this.translatedData[key] = this.attributes;
      console.log(this.translatedData);
    });

    // const translationMap = new Map<String, Attributes>();

    // const obj = Object.fromEntries(map);

    // @ts-ignore
    const data = {
      branch: this.userConfigForm.get('branch').value,
      customerType: clientType,
      customer: this.oneFormCustomer,
      loanDetails: this.userConfigForm.get('loanDetails').value,
      guarantorDetails: this.userConfigForm.get('guarantorDetails').value,
      translatedData: this.translatedData
    };

    //  data.translatedData = JSON.stringify(jsonObject);
    console.log('final data:::::', data);
    console.log(this.oneFormCustomer);
    console.log(this.userConfigForm.value);
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

    // const data = JSON.stringify(this.userConfigForm.value);
    // this.customerInfoService.updateNepaliConfigData(data, this.customerInfo.id).subscribe(res => {
    //   this.customerInfoData = res.detail;
    //   this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated!!!'));
    //   this.spinner = false;
    //   this.dialogRef.close(this.customerInfoData);
    //   this.refreshPage();
    // }, error => {
    //   this.toastService.show(new Alert(AlertType.ERROR, 'Error while Updating data!!!'));
    //   console.log(error);
    //   this.spinner = false;
    //   this.dialogRef.close();
    // });

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
      guarantorName: '',
      issuedYear: '',
      issuedPlace: '',
      guarantorLegalDocumentAddress: '',
      relationship: '',
      citizenNumber: ''
    });
  }

  removeAtIndex(i: any) {
    (this.userConfigForm.get('guarantorDetails') as FormArray).removeAt(i);
  }

  onChangeTab(event) {
    this.hideSaveBtn = false;
    // if (event.tabId === '2' || event.tabId === '3') {
    //     this.hideSaveBtn = true;
    // }

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
        issuedYear: [value.issuedYear],
        issuedPlace: [value.issuedPlace],
        guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
        relationship: [value.relationship],
        citizenNumber: [value.citizenNumber]
      }));
    });
  }

  refreshPage() {
    window.location.reload();
  }


  async translate() {

    this.spinner = true;
    this.translatedValues = await this.translateService.translateForm(this.userConfigForm);
    this.objectTranslateForm.patchValue({
      permanentProvince: ObjectUtil.isEmpty(this.userConfigForm.get('permanentProvince').value) ? null :
          this.userConfigForm.get('permanentProvince').value.name,
      permanentDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('permanentDistrict').value) ? null :
          this.userConfigForm.get('permanentDistrict').value.name,
      permanentMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('permanentMunicipality').value) ? null :
          this.userConfigForm.get('permanentMunicipality').value.name,
      temporaryProvince: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryProvince').value) ? null :
          this.userConfigForm.get('temporaryProvince').value.name,
      temporaryDistrict: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryDistrict').value) ? null :
          this.userConfigForm.get('temporaryDistrict').value.name,
      temporaryMunicipality: ObjectUtil.isEmpty(this.userConfigForm.get('temporaryMunicipality').value) ? null :
          this.userConfigForm.get('temporaryMunicipality').value.name,
        citizenshipIssueDistrict:  ObjectUtil.isEmpty(this.userConfigForm.get('citizenshipIssueDistrict').value) ? null :
            this.userConfigForm.get('citizenshipIssueDistrict').value.name,
    });
    this.objectValueTranslater = await  this.translateService.translateForm(this.objectTranslateForm);
    this.disableSave = false;
    this.spinner = false;
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
      permanentProvince: [undefined],
      permanentDistrict: [undefined],
      permanentMunicipality: [undefined],
      temporaryProvince: [undefined],
      temporaryDistrict: [undefined],
      temporaryMunicipality: [undefined],
        citizenshipIssueDistrict: [undefined]

    });
  }

    setDateTypeBS(){
        this.dateTypeBS = true;
        this.dateTypeAD = false;
    }

    setDateTypeAD(){
        this.dateTypeBS = false;
        this.dateTypeAD = true;
    }
}

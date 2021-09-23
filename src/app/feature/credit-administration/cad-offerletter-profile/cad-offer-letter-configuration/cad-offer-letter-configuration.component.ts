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
 vdcOption = [{value: 'Municipality', label: 'Municipality'}, {value: 'VDC', label: 'VDC'}];

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

    if(!ObjectUtil.isEmpty(this.oneFormCustomer)){
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
      dob: [ObjectUtil.isEmpty(this.oneFormCustomer) ? undefined : new Date(this.oneFormCustomer.dob)],
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
        municipalityOrVdc: this.userConfigForm.get('municipalityOrVdc').value
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
      if (key === 'guarantorDetails') {
        return;
      }
      this.attributes = new Attributes();
      this.attributes.en = this.userConfigForm.get(key).value;
      this.attributes.np = this.translatedValues[key];
      this.attributes.ct = this.userConfigForm.get(key + 'CT').value;
      this.translatedData[key] = this.attributes;
    });
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
      guarantorNameCT: '',
      issuedYear: '',
      issuedYearCT: '',
      issuedPlace: '',
      issuedPlaceCT: '',
      guarantorLegalDocumentAddress: '',
      guarantorLegalDocumentAddressCT: '',
      relationship: '',
      relationshipCT: '',
      citizenNumber: '',
      citizenNumberCT: '',
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
        guarantorNameCT: [value.guarantorNameCT],
        issuedYear: [value.issuedYear],
        issuedYearCT: [value.issuedYearCT],
        issuedPlace: [value.issuedPlace],
        issuedPlaceCT: [value.issuedPlaceCT],
        guarantorLegalDocumentAddress: [value.guarantorLegalDocumentAddress],
        guarantorLegalDocumentAddressCT: [value.guarantorLegalDocumentAddressCT],
        relationship: [value.relationship],
        relationshipCT: [value.relationshipCT],
        citizenNumber: [value.citizenNumber],
        citizenNumberCT: [value.citizenNumberCT],
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
        // if (!ObjectUtil.isEmpty(this.translatedValues[formControlName])) {
        //   const val = this.translatedValues[formControlName];
        //   this.form.get(formControlName + 'TransVal').patchValue(val);
        // }
        const checkVal = event.target.checked;
        this[formControlName + 'Check'] = checkVal;
        console.log('checked Value', this[formControlName + 'Check']);
        if (!checkVal) {
            this.clearForm(formControlName + 'CT');
        }
    }

    clearForm(controlName) {
        this.userConfigForm.get(controlName).setValue(null);
    }
}

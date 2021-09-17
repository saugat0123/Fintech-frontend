import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
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
import {HttpClient} from '@angular/common/http';
import {SbTranslateService} from '../../../../@core/service/sbtranslate.service';
import {CadOneformService} from '../../service/cad-oneform.service';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {Branch} from '../../../admin/modal/branch';
import {BranchService} from '../../../admin/component/branch/branch.service';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {CompanyLocations} from '../../../admin/modal/companyLocations';

@Component({
  selector: 'app-cad-offer-letter-configuration',
  templateUrl: './cad-offer-letter-configuration.component.html',
  styleUrls: ['./cad-offer-letter-configuration.component.scss']
})
export class CadOfferLetterConfigurationComponent implements OnInit {

  @Input() customerInfo: CustomerInfoData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  @Input() guarantorDetail: GuarantorDetail;
  // @Input() customer: Customer;
  @Output()
  customerInfoData: EventEmitter<CustomerInfoData> = new EventEmitter<CustomerInfoData>();
  loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
  branchList: Array<Branch> = new Array<Branch>();
  guarantorList: Array<Guarantor>;
  userConfigForm: FormGroup;
  spinner = false;
  submitted = false;
  relationshipList = RelationshipNepali.enumObject();
  hideSaveBtn = false;
  clientType = CustomerType;
  translatedValues: any;
  customer: Customer = new Customer();
  company: CompanyInfo = new CompanyInfo();
  companyLocations: CompanyLocations = new CompanyLocations();


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
              private translateService: SbTranslateService) {
  }

  get configForm() {
    return this.userConfigForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.loanConfigService.getAll().subscribe((response: any) => {
      this.loanTypeList = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });
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
      loanType: [undefined],
      proposedAmount: [undefined],
      status: [undefined],
      createdOn: [undefined],
      comments: [undefined],
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

  save() {
    this.submitted = true;
    // if (this.userConfigForm.invalid) {
    //   return;
    // }
    this.spinner = true;


    this.customer.id = this.customer ? (this.customer.id ? this.customer.id : undefined) : undefined;
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
    console.log(this.userConfigForm.get('clientType').value, 'adsasdasd');
    this.customer.customerName = this.userConfigForm.get('name').value;

    if (this.userConfigForm.get('clientType').value === 'INSTITUTION') {
      this.company.companyName = this.userConfigForm.get('name').value;
      this.company.email = this.userConfigForm.get('email').value;
      this.company.contactNum = this.userConfigForm.get('contactNo').value;
      this.company.registrationNumber = this.userConfigForm.get('registrationNo').value;
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
      this.company.customerCode = this.userConfigForm.get('customerCode').value;


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
    } else {
      console.log(this.userConfigForm.get('clientType').value, 'adsasdasd');
      this.customer.customerName = this.userConfigForm.get('name').value;
      this.customer.email = this.userConfigForm.get('email').value;
      this.customer.contactNumber = this.userConfigForm.get('contactNo').value;

      this.customer.customerCode = this.userConfigForm.get('customerCode').value;
      // this.customer.gender = this.userConfigForm.get('gender').value === 'Male' ? Gender.MALE : Gender.FEMALE;
      this.customer.citizenshipNumber = this.userConfigForm.get('citizenshipNo').value;
      this.customer.dob = this.userConfigForm.get('dob').value;
      // this.customer.province = this.userConfigForm.get('permanentProvince').value;
      // this.customer.district = this.userConfigForm.get('permanentDistrict').value;
      // this.customer.municipalities = this.userConfigForm.get('permanentMunicipality').value;
      // this.customer.wardNumber = this.userConfigForm.get('permanentWard').value;
      // this.customer.temporaryProvince = this.userConfigForm.get('temporaryProvince').value;
      // this.customer.temporaryDistrict = this.userConfigForm.get('temporaryDistrict').value;
      // this.customer.temporaryMunicipalities = this.userConfigForm.get('temporaryMunicipality').value;
      // this.customer.temporaryWardNumber = this.userConfigForm.get('temporaryWard').value;
      this.customer.citizenshipIssuedPlace = this.userConfigForm.get('citizenshipIssueDistrict').value;
      this.customer.citizenshipIssuedDate = this.userConfigForm.get('citizenshipIssueDate').value;

    }

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
    const dat = {
          branch: this.userConfigForm.get('branch').value,
          customerType: clientType,
          customer: this.customer,
          company: this.company,
        };
    console.log(dat);
    this.cadOneformService.saveCustomer(dat).subscribe(res => {
      this.spinner = false;
      // this.close();
      /*if (this.formValue.id == null) {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer Info'));
      } else {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Customer Info'));
      }*/
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
      name: '',
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
        name: [value.name],
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
    this.translatedValues = await this.translateService.translateForm(this.userConfigForm);
  }
}

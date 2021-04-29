import {Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {environment, environment as env} from '../../../../../../environments/environment';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CustomerService} from '../../../../admin/service/customer.service';
import {ToastService} from '../../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BlacklistService} from '../../../../admin/component/blacklist/blacklist.service';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {BankingRelationship} from '../../../../admin/modal/banking-relationship';
import {RelationshipList} from '../../../../loan/model/relationshipList';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {Gender} from '../../../../../@core/model/enum/gender';
import {MaritalStatus} from '../../../../../@core/model/enum/marital-status';
import {IndividualJsonData} from '../../../../admin/modal/IndividualJsonData';
import {environment as envSrdb} from '../../../../../../environments/environment.srdb';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {Pattern} from '../../../../../@core/utils/constants/pattern';
import {CustomerAssociateComponent} from '../../../../loan/component/loan-main-template/customer-associate/customer-associate.component';
import {CustomerComponent} from '../../customer-list/customer.component';

@Component({
  selector: 'app-joint-form',
  templateUrl: './joint-form.component.html',
  styleUrls: ['./joint-form.component.scss']
})
export class JointFormComponent implements OnInit, OnChanges {
  @Input() formValue: Customer = new Customer();
  @Input() clientTypeInput: any;
  @Input() customerIdInput: any;
  @Input() bankingRelationshipInput: any;
  @Input() subSectorDetailCodeInput: any;
  @Input() gender;
  @Input() maritalStatus;
  @Input() customerLegalDocumentAddress;
  @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() currentVal: any;
  jointFormData = [];
  jointInputVal: number;

  calendarType = 'AD';
  microCustomer = false;
  microEnabled: boolean = env.microLoan;
  jointForm = [];
  basicJointInfo: FormGroup;
  submitted = false;
  spinner = false;
  displayEngDate = true;
  formLabel: string;

  customerDetailField = {
    showFormField: false,
    isOldCustomer: false
  };
  customerSearchData = {
    citizenshipNumber: undefined
  };
  customer: Customer = new Customer();
  customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
  province: Province = new Province();
  provinceList: Array<Province> = Array<Province>();
  temporaryProvinceList: Array<Province> = Array<Province>();
  district: District = new District();
  districtList: Array<District> = Array<District>();
  municipality: MunicipalityVdc = new MunicipalityVdc();
  municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
  temporaryDistrictList: Array<District> = Array<District>();
  temporaryMunicipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

  private isBlackListed: boolean;
  allDistrict: Array<District> = Array<District>();
  private customerList: Array<Customer> = new Array<Customer>();
  public showMatchingTable: boolean;
  tempFlag = {
    showOtherOccupation: false,
    showOtherIncomeSource: false,
    hideIncomeSource: false
  };

  bankingRelationshipList = BankingRelationship.enumObject();
  subSector = [];
  clientType = [];
  relationArray: RelationshipList = new RelationshipList();
  public genderPairs = EnumUtils.pairs(Gender);
  maritalStatusEnum = MaritalStatus;
  placeHolderForMaritalStatus;
  individualJsonData: IndividualJsonData;

  crgLambdaDisabled = envSrdb.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private customerService: CustomerService,
      private toastService: ToastService,
      private modalService: NgbModal,
      private blackListService: BlacklistService,
      private dialogService: NbDialogService,
      protected ref: NbDialogRef<JointFormComponent>,
      private el: ElementRef
  ) {
  }

  get basicJointInfoControls() {
    return this.basicJointInfo.controls;
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('current val1: ', this.currentVal);
  }

  ngOnInit() {
    console.log('current val2: ', this.currentVal);
    this.getProvince();
    this.getAllDistrict();
    this.getClientType();
    this.getSubSector();
    this.formMaker();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      if (!ObjectUtil.isEmpty(this.formValue.individualJsonData)) {
        this.individualJsonData = JSON.parse(this.formValue.individualJsonData);
      }
      this.microCustomer = this.formValue.isMicroCustomer;
      this.customerDetailField.showFormField = true;
      this.customer = this.formValue;
      this.customer.clientType = this.clientTypeInput;
      this.customer.customerCode = this.customerIdInput;
      this.formMaker();
      this.setRelatives(this.customer.customerRelatives);
      this.setOccupationAndIncomeSourceAndParentInput(this.formValue);
      // this.occupationChange();
      this.getJointValue();

    } else {
      this.createRelativesArray();
    }
  }
  getJointValue () {
    this.jointInputVal = Number(this.currentVal);
    for (let i = 0; i < this.jointInputVal; i++) {
      this.jointFormData.push(i);
    }
    console.log('Number', this.jointFormData);
  }


  addRelatives() {
    (this.basicJointInfo.get('customerRelatives') as FormArray).push(
        this.formBuilder.group({
          customerRelation: [undefined, Validators.required],
          customerRelativeName: [undefined, Validators.compose([Validators.required])],
          citizenshipNumber: [undefined],
          citizenshipIssuedPlace: [undefined],
          citizenshipIssuedDate: [undefined, DateValidator.isValidBefore],
          age: [undefined, Validators.required],
          version: [0]
        })
    );
  }

  removeRelatives(i) {
    (this.basicJointInfo.get('customerRelatives') as FormArray).removeAt(i);
  }

  getDistricts(province: Province) {
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          this.districtList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
              this.basicJointInfo.controls.district.setValue(district);
              this.getMunicipalities(district);
            }
          });
        }
    );
  }

  getMunicipalities(district: District) {
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalitiesList = response.detail;
          this.municipalitiesList.forEach(municipality => {
            if (!ObjectUtil.isEmpty(this.customer.municipalities) && municipality.id === this.customer.municipalities.id) {
              this.basicJointInfo.controls.municipalities.setValue(municipality);
            }
          });
        }
    );

  }
  getTemporaryDistricts(province: Province) {
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.temporaryDistrictList = response.detail;
          this.temporaryDistrictList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.temporaryDistrict) && district.id === this.customer.temporaryDistrict.id) {
              this.basicJointInfo.controls.temporaryDistrict.patchValue(district);
              this.getTemporaryMunicipalities(district);
            }
          });
        }
    );
  }

  getTemporaryMunicipalities(district: District) {
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.temporaryMunicipalitiesList = response.detail;
          this.temporaryMunicipalitiesList.forEach(municipality => {
            if (!ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) &&
                municipality.id === this.customer.temporaryMunicipalities.id) {
              this.basicJointInfo.controls.temporaryMunicipalities.setValue(municipality);
            }
          });
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
    console.log(this.basicJointInfo);
    this.submitted = true;
    const tempId = this.basicJointInfo.get('citizenshipNumber').value;
    this.blackListService.checkBlacklistByRef(tempId).subscribe((response: any) => {
      this.isBlackListed = response.detail;
      this.blackListStatusEmitter.emit(this.isBlackListed);
      if (this.isBlackListed) {
        this.customerDetailField.showFormField = false;
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Customer'));
        return;
      } else {
        if (this.client !== this.clientName.SHINE_RESUNGA) {
          const ageControl = this.basicJointInfo.get('customerRelatives') as FormArray;
          ageControl.controls.filter(f => {
            f.get('age').clearValidators();
            f.get('age').updateValueAndValidity();
          });
        }
        if (this.basicJointInfo.invalid) {
          this.toastService.show(new Alert(AlertType.WARNING, 'Check Validation'));
          this.scrollToFirstInvalidControl();
          this.spinner = false;
          return;
        }
        {
          this.spinner = true;
          this.customer.id = this.customer ? (this.customer.id ? this.customer.id : undefined) : undefined;
          this.customer.customerName = this.basicJointInfo.get('customerName').value;
          this.customer.customerCode = this.basicJointInfo.get('customerCode').value;
          this.customer.province = this.basicJointInfo.get('province').value;
          this.customer.district = this.basicJointInfo.get('district').value;
          this.customer.municipalities = this.basicJointInfo.get('municipalities').value;
          this.customer.wardNumber = this.basicJointInfo.get('wardNumber').value;
          this.customer.temporaryProvince = this.basicJointInfo.get('temporaryProvince').value;
          this.customer.temporaryDistrict = this.basicJointInfo.get('temporaryDistrict').value;
          this.customer.temporaryMunicipalities = this.basicJointInfo.get('temporaryMunicipalities').value;
          this.customer.temporaryWardNumber = this.basicJointInfo.get('temporaryWardNumber').value;
          this.customer.contactNumber = this.basicJointInfo.get('contactNumber').value;
          this.customer.landLineNumber = this.basicJointInfo.get('landLineNumber').value;
          this.customer.email = this.basicJointInfo.get('email').value;
          this.customer.dob = this.basicJointInfo.get('dob').value;
          this.customer.initialRelationDate = this.basicJointInfo.get('initialRelationDate').value;
          this.customer.citizenshipNumber = this.basicJointInfo.get('citizenshipNumber').value;
          this.customer.citizenshipIssuedPlace = this.basicJointInfo.get('citizenshipIssuedPlace').value;
          this.customer.citizenshipIssuedDate = this.basicJointInfo.get('citizenshipIssuedDate').value;
          this.customer.clientType = this.basicJointInfo.get('clientType').value;
          this.customer.subsectorDetail = this.basicJointInfo.get('subsectorDetail').value;
          this.customer.gender = this.basicJointInfo.get('gender').value;
          this.customer.maritalStatus = this.basicJointInfo.get('maritalStatus').value;
          this.customer.customerLegalDocumentAddress = this.basicJointInfo.get('customerLegalDocumentAddress').value;
          const occupations = {
            multipleOccupation: this.basicJointInfo.get('occupation').value,
            otherOccupation: this.basicJointInfo.get('otherOccupation').value
          };
          const incomeSource = {
            multipleIncome: this.basicJointInfo.get('incomeSource').value,
            otherIncome: this.basicJointInfo.get('otherIncome').value
          };
          this.customer.occupation = JSON.stringify(occupations);
          this.customer.incomeSource = JSON.stringify(incomeSource);
          this.customer.introduction = this.basicJointInfo.get('introduction').value;
          this.customer.version = this.basicJointInfo.get('version').value;
          const rawFromValue = this.basicJointInfo.getRawValue();
          this.customer.customerRelatives = rawFromValue.customerRelatives;

          /** banking relation setting data from child **/
          // possibly can have more field in banking relationship
          this.customer.bankingRelationship = JSON.stringify(this.basicJointInfo.get('bankingRelationship').value);
          this.customer.netWorth = this.basicJointInfo.get('netWorth').value;

          /** Remaining static read-write only data*/
          this.customer.individualJsonData = this.setIndividualJsonData();

          this.customer.isMicroCustomer = this.microCustomer;

          this.customerService.save(this.customer).subscribe(res => {
            this.spinner = false;
            this.close();
            if (this.formValue.id == null) {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Customer Info'));
            } else {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Customer Info'));
            }
          }, res => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
          });
        }
      }
    });
  }

  getProvince() {
    this.commonLocation.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
          this.provinceList.forEach((province: Province) => {
            if (this.customer !== undefined) {
              if (!ObjectUtil.isEmpty(this.customer.province)) {
                if (province.id === this.customer.province.id) {
                  this.basicJointInfo.controls.province.setValue(province);
                  this.getDistricts(province);
                }
              }
              if (!ObjectUtil.isEmpty(this.customer.temporaryProvince)) {
                if (province.id === this.customer.temporaryProvince.id) {
                  this.basicJointInfo.controls.temporaryProvince.setValue(province);
                  this.getTemporaryDistricts(province);
                }
              }
            }
          });
        }
    );
  }

  formMaker() {
    this.basicJointInfo = this.formBuilder.group({
      customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName, Validators.required],
      customerCode: [this.customer.customerCode === undefined ? undefined : this.customer.customerCode],
      province: [this.customer.province === null ? undefined : this.customer.province, Validators.required],
      district: [this.customer.district === null ? undefined : this.customer.district, Validators.required],
      municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities, Validators.required],
      permanentAddressLine1: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.permanentAddressLine1],
      permanentAddressLine2: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.permanentAddressLine2],
      wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber, Validators.required],
      contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, [Validators.required,
        Validators.max(9999999999), Validators.min(1000000000)]],
      landLineNumber: [this.customer.landLineNumber === undefined ? undefined : this.customer.landLineNumber],
      email: [this.customer.email === undefined ? undefined : this.customer.email, Validators.email],
      // initial Relation Date not used in ui
      initialRelationDate: [this.customer.initialRelationDate === undefined ? undefined :
          new Date(this.customer.initialRelationDate)],
      citizenshipNumber: [this.customer.citizenshipNumber === undefined ? undefined : this.customer.citizenshipNumber
        , Validators.required],
      citizenshipIssuedPlace: [this.customer.citizenshipIssuedPlace === undefined ? undefined : this.customer.citizenshipIssuedPlace,
        Validators.required],
      citizenshipIssuedDate: [ObjectUtil.isEmpty(this.customer.citizenshipIssuedDate) ? undefined :
          new Date(this.customer.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]],
      dob: [ObjectUtil.isEmpty(this.customer.dob) ? undefined :
          new Date(this.customer.dob), [Validators.required, DateValidator.isValidBefore]],
      occupation: [this.customer.occupation === undefined ? undefined : this.customer.occupation, [Validators.required]],
      version: [this.customer.version === undefined ? undefined : this.customer.version],
      otherOccupation: [this.customer.otherOccupation === undefined ? undefined : this.customer.otherOccupation],
      incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
      otherIncome: [this.customer.otherIncome === undefined ? undefined : this.customer.otherIncome],
      customerRelatives: this.formBuilder.array([]),
      introduction: [this.customer.introduction === undefined ? undefined : this.customer.introduction, [Validators.required]],
      securityRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.securityRisk],
      incomeRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.incomeRisk],
      successionRisk: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.successionRisk],
      bankingRelationship: [this.customer.bankingRelationship === undefined ?
          undefined : JSON.parse(this.customer.bankingRelationship), this.crgLambdaDisabled ? undefined : [Validators.required]],
      netWorth: [this.customer.netWorth === undefined ?
          undefined : this.customer.netWorth,
        this.crgLambdaDisabled ? undefined : [Validators.required, Validators.pattern(Pattern.NUMBER_DOUBLE)]],
      subsectorDetail: [this.customer.subsectorDetail === undefined ? undefined : this.customer.subsectorDetail],
      clientType: [this.customer.clientType === undefined ? undefined : this.customer.clientType],
      temporaryProvince: [this.customer.temporaryProvince === null ? undefined :
          this.customer.temporaryProvince, Validators.required],
      temporaryDistrict: [this.customer.temporaryDistrict === null ? undefined :
          this.customer.temporaryDistrict, Validators.required],
      temporaryMunicipalities: [this.customer.temporaryMunicipalities === null ? undefined :
          this.customer.temporaryMunicipalities, Validators.required],
      temporaryAddressLine1: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.temporaryAddressLine1],
      temporaryAddressLine2: [ObjectUtil.isEmpty(this.individualJsonData) ? undefined :
          this.individualJsonData.temporaryAddressLine2],
      temporaryWardNumber: [this.customer.temporaryWardNumber === null ? undefined :
          this.customer.temporaryWardNumber, Validators.required],
      gender: [this.gender === null ? undefined :
          this.gender, Validators.required],
      maritalStatus: [this.maritalStatus === null ? undefined :
          this.maritalStatus, Validators.required],
      customerLegalDocumentAddress: [this.customerLegalDocumentAddress == null ? undefined :
          this.customerLegalDocumentAddress, Validators.required],

    });
  }

  setIndividualJsonData() {
    const individualJsonData = new IndividualJsonData();
    individualJsonData.incomeRisk = this.basicJointInfoControls.incomeRisk.value;
    individualJsonData.securityRisk = this.basicJointInfoControls.securityRisk.value;
    individualJsonData.successionRisk = this.basicJointInfoControls.successionRisk.value;
    individualJsonData.permanentAddressLine1 = this.basicJointInfoControls.permanentAddressLine1.value;
    individualJsonData.permanentAddressLine2 = this.basicJointInfoControls.permanentAddressLine2.value;
    individualJsonData.temporaryAddressLine1 = this.basicJointInfoControls.temporaryAddressLine1.value;
    individualJsonData.temporaryAddressLine2 = this.basicJointInfoControls.temporaryAddressLine2.value;
    return  JSON.stringify(individualJsonData);
  }

  createRelativesArray() {
    const relation = ['Grand Father', 'Father'];
    relation.forEach((customerRelation) => {
      (this.basicJointInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
        customerRelation: [{value: customerRelation, disabled: true}],
        customerRelativeName: [undefined, Validators.required],
        citizenshipNumber: [undefined],
        citizenshipIssuedPlace: [undefined],
        citizenshipIssuedDate: [undefined, DateValidator.isValidBefore],
        age: [undefined, Validators.required],
        version: [undefined]
      }));
    });
  }

  setRelatives(currentData) {
    const relativesData = (this.basicJointInfo.get('customerRelatives') as FormArray);
    if (!ObjectUtil.isEmpty(currentData)) {
      currentData.forEach((singleRelatives, index) => {
        const customerRelative = singleRelatives.customerRelation;
        // Increase index number with increase in static relatives---
        relativesData.push(this.formBuilder.group({
          customerRelation: (index > 1) ? [(customerRelative)] :
              [({value: customerRelative, disabled: true}), Validators.required],
          customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
          version: [singleRelatives.version === undefined ? undefined : singleRelatives.version],
          citizenshipNumber: [singleRelatives.citizenshipNumber],
          citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
          citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
              undefined : new Date(singleRelatives.citizenshipIssuedDate), DateValidator.isValidBefore],
          age: [singleRelatives.age, Validators.required]
        }));
      });

    } else {
      this.createRelativesArray();
    }
  }

  checkCustomer() {
    const customerName = this.basicJointInfo.get('customerName').value;
    const citizenShipIssuedDate = this.customer.citizenshipIssuedDate = this.basicJointInfo.get('citizenshipIssuedDate').value;
    const citizenShipNo = this.customer.citizenshipIssuedDate = this.basicJointInfo.get('citizenshipNumber').value;
    const modalRef = this.modalService.open(CustomerAssociateComponent, {size: 'lg'});
    if (ObjectUtil.isEmpty(customerName) || ObjectUtil.isEmpty(citizenShipIssuedDate
        || ObjectUtil.isEmpty(citizenShipNo))) {
      modalRef.componentInstance.model = undefined;
    } else {
      modalRef.componentInstance.model = this.customer;
    }
  }

  private getAllDistrict() {
    this.commonLocation.getAllDistrict().subscribe((response: any) => {
      this.allDistrict = response.detail;
    });
  }

  onClick(i: number) {
    this.getProvince();
    this.showMatchingTable = false;
    this.customerDetailField.showFormField = true;
    this.customer = this.customerList[i];
    this.formMaker();
    this.setRelatives(this.customer.customerRelatives);
  }

  continueAsNew() {
    this.getProvince();
    this.customer = new Customer();
    this.customer.citizenshipNumber = this.basicJointInfoControls.citizenshipNumber.value;
    this.formMaker();
    this.createRelativesArray();
    this.customerDetailField.showFormField = true;
    this.showMatchingTable = false;
  }

  close() {
    this.ref.close();
  }

  occupationChange() {
    const isOtherSelected = this.basicJointInfo.get('occupation').value.includes('Other');
    if (isOtherSelected) {
      this.tempFlag.showOtherOccupation = true;
      this.basicJointInfo.get('otherOccupation').setValidators(Validators.required);
    } else {
      this.tempFlag.showOtherOccupation = false;
      this.basicJointInfo.get('otherOccupation').setValidators(null);
    }
    this.basicJointInfo.get('otherOccupation').updateValueAndValidity();
    const houseWifeSelected = !this.basicJointInfo.get('occupation').value.includes('House Wife') ?
        false : this.basicJointInfo.get('occupation').value.length <= 1;
    if (houseWifeSelected) {
      this.tempFlag.hideIncomeSource = true;
      this.basicJointInfo.get('incomeSource').clearValidators();
    }  else {
      this.tempFlag.hideIncomeSource = false;
      this.basicJointInfo.get('incomeSource').setValidators(Validators.required);
    }
    this.basicJointInfo.get('incomeSource').updateValueAndValidity();

  }
  // ngDoCheck(): void {
  //   if (this.formValue.id == null) {
  //     this.formLabel = 'Add';
  //   } else {
  //     this.formLabel = 'Edit';
  //   }
  // }

  onIncomeSourceChange() {
    const isOtherSourceSelected = this.basicJointInfo.get('incomeSource').value.includes('Other');
    if (isOtherSourceSelected) {
      this.tempFlag.showOtherIncomeSource = true;
      this.basicJointInfo.get('otherIncome').setValidators(Validators.required);
    } else {
      this.tempFlag.showOtherIncomeSource = false;
      this.basicJointInfo.get('otherIncome').setValidators(null);
    }
    this.basicJointInfo.get('otherIncome').updateValueAndValidity();
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

  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
  }

  setOccupationAndIncomeSourceAndParentInput(formValue) {
    if (!ObjectUtil.isEmpty(formValue.incomeSource)) {
      const incomeSource = JSON.parse(formValue.incomeSource);
      this.basicJointInfo.controls.incomeSource.patchValue(incomeSource.multipleIncome);
      this.basicJointInfo.controls.otherIncome.patchValue(incomeSource.otherIncome);
    }
    if (!ObjectUtil.isEmpty(formValue.occupation)) {
      const occupation = JSON.parse(formValue.occupation);
      this.basicJointInfo.controls.occupation.patchValue(occupation.multipleOccupation);
      this.basicJointInfo.controls.otherOccupation.patchValue(occupation.otherOccupation);
    }
    if (!ObjectUtil.isEmpty(this.bankingRelationshipInput)) {
      this.basicJointInfo.controls.bankingRelationship.patchValue(JSON.parse(this.bankingRelationshipInput));

    }
    if (!ObjectUtil.isEmpty(this.subSectorDetailCodeInput)) {
      this.basicJointInfo.controls.subsectorDetail.patchValue(this.subSectorDetailCodeInput);

    }

  }
  sameAsPermanent() {
    // if (ObjectUtil.isEmpty(this.basicJointInfo.get('municipalities').value)) {
    //     this.toastService.show(new Alert(AlertType.WARNING, 'Please fill Permanent Address Completely'));
    //     return true;
    // }
    this.basicJointInfo.get('temporaryProvince').patchValue(this.basicJointInfo.get('province').value);
    this.customer.temporaryDistrict = this.basicJointInfo.get('district').value;
    this.getTemporaryDistricts(this.basicJointInfo.get('temporaryProvince').value);
    this.customer.temporaryMunicipalities = this.basicJointInfo.get('municipalities').value;
    this.getTemporaryMunicipalities(this.basicJointInfo.get('temporaryMunicipalities').value);
    this.basicJointInfo.controls.temporaryAddressLine1.patchValue(this.basicJointInfo.get('permanentAddressLine1').value);
    this.basicJointInfo.controls.temporaryAddressLine2.patchValue(this.basicJointInfo.get('permanentAddressLine2').value);
    this.basicJointInfo.controls.temporaryWardNumber.setValue(this.basicJointInfo.get('wardNumber').value);

  }

  /** @Param validate --- true for add validation and false for remove validation
   * @Param controlNames --- list of formControlName**/
  controlValidation(controlNames: string[], validate) {
    console.log(validate);
    controlNames.forEach(s => {
      if (validate) {
        this.basicJointInfo.get(s).setValidators(Validators.required);
      } else {
        this.basicJointInfo.get(s).clearValidators();
      }
      this.basicJointInfo.get(s).updateValueAndValidity();
    });
  }

  onCustomerTypeChange(check: boolean) {
    console.log('value is check' , check);
    if (check || this.crgLambdaDisabled) {
      this.controlValidation(['incomeRisk', 'securityRisk', 'successionRisk', 'bankingRelationship',
        'netWorth'], false);
    } else {
      this.controlValidation(['incomeRisk', 'securityRisk', 'successionRisk', 'bankingRelationship',
        'netWorth'], true);
    }
  }

}

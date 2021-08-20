import {Component, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
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
import {RelationshipList} from '../../../../loan/model/relationshipList';
import {EnumUtils} from '../../../../../@core/utils/enums.utils';
import {Gender} from '../../../../../@core/model/enum/gender';
import {MaritalStatus} from '../../../../../@core/model/enum/marital-status';
import {Clients} from '../../../../../../environments/Clients';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {BankingRelationship} from '../../../../admin/modal/banking-relationship';
import {Editor} from '../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-joint-form',
  templateUrl: './joint-form.component.html',
  styleUrls: ['./joint-form.component.scss']
})
export class JointFormComponent implements OnInit {
    onActionChangeSpinner = false;
  @Input() formValue: Customer = new Customer();
  @Input() clientTypeInput: any;
  @Input() subSectorInput: any;
  @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() currentVal: any;
  jointInputVal: number;
  calendarType = 'AD';
  basicJointInfo: FormGroup;
  submitted = false;
  spinner = false;
  customerDetailField = {
    showFormField: false,
    isOldCustomer: false
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
  individualJsonData: any;
  crgLambdaDisabled = environment.disableCrgLambda;
  client = environment.client;
  clientName = Clients;
  id: number;
  version: number;
  ckeConfig = Editor.CK_CONFIG;
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
  ) {}

  ngOnInit() {
    this.getProvince(0);
    this.getAllDistrict();
    this.getClientType();
    this.getSubSector();
    this.formMaker();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      if (!ObjectUtil.isEmpty(this.formValue.jointInfo)) {
        this.individualJsonData = JSON.parse(this.formValue.jointInfo);
        this.setJointDetail(this.individualJsonData);
        this.id = this.formValue.id;
        this.version = this.formValue.version;
        this.customer.clientType = this.clientTypeInput;
        this.customer.subsectorDetail = this.subSectorInput;
        this.basicJointInfo.get('clientType').patchValue(this.customer.clientType);
        this.basicJointInfo.get('subsectorDetail').patchValue(this.customer.subsectorDetail);
        this.basicJointInfo.get('introduction').patchValue(this.individualJsonData.introduction);
        this.basicJointInfo.get('incomeRisk').patchValue(this.individualJsonData.incomeRisk);
        this.basicJointInfo.get('securityRisk').patchValue(this.individualJsonData.securityRisk);
        this.basicJointInfo.get('successionRisk').patchValue(this.individualJsonData.successionRisk);
        this.basicJointInfo.get('bankingRelationship').patchValue(this.individualJsonData.bankingRelationship);
        this.basicJointInfo.get('netWorth').patchValue(this.formValue.netWorth);
        this.getProvince(0);
      }
      this.getJointValue();
    }
  }
  getJointValue () {
    this.jointInputVal = Number(this.currentVal);
    for (let i = 0; i < this.jointInputVal; i++) {
        this.addMoreJointForm();
    }
  }

  setJointDetail(data) {
    const formControls = this.basicJointInfo.get('jointCustomerInfo') as FormArray;
    data.jointCustomerInfo.forEach((jointDetail, i) => {
        // console.log('this is joint detail',jointDetail);
      formControls.push(
          this.formBuilder.group({
            customerName: [jointDetail.customerName],
            customerCode: [jointDetail.customerCode],
            province: [jointDetail.province],
            district: [jointDetail.district],
            municipalities: [jointDetail.municipalities],
            permanentAddressLine1: [jointDetail.permanentAddressLine1],
            permanentAddressLine2: [jointDetail.permanentAddressLine2],
            wardNumber: [jointDetail.wardNumber],
            contactNumber: [jointDetail.contactNumber],
            landLineNumber: [jointDetail.landLineNumber],
            email: [jointDetail.email],
            // initial Relation Date not used in ui
            initialRelationDate: [jointDetail.initialRelationDate],
            citizenshipNumber: [jointDetail.citizenshipNumber],
            citizenshipIssuedPlace: [jointDetail.citizenshipIssuedPlace],
            citizenshipIssuedDate: new Date(jointDetail.citizenshipIssuedDate),
            dob: [ObjectUtil.isEmpty(jointDetail.dob) ?
                undefined : new Date(jointDetail.dob), DateValidator.isValidBefore],
            occupation: [jointDetail.occupation],
            otherOccupation: [jointDetail.otherOccupation],
            incomeSource: [jointDetail.incomeSource],
            otherIncome: [jointDetail.otherIncome],
            temporaryProvince: [jointDetail.temporaryProvince],
            temporaryDistrict: [jointDetail.temporaryDistrict],
            temporaryMunicipalities: [jointDetail.temporaryMunicipalities],
            temporaryAddressLine1: [jointDetail.temporaryAddressLine1],
            temporaryAddressLine2: [jointDetail.temporaryAddressLine2],
            temporaryWardNumber: [jointDetail.temporaryWardNumber],
            gender: [jointDetail.gender],
            maritalStatus: [jointDetail.maritalStatus],
            customerLegalDocumentAddress: [jointDetail.customerLegalDocumentAddress],
            relationCheck: [jointDetail.relationCheck],
            introduction: [jointDetail.introduction],
            incomeRisk: [jointDetail.incomeRisk],
            securityRisk: [jointDetail.securityRisk],
            successionRisk: [jointDetail.successionRisk],
            bankingRelationship: [jointDetail.bankingRelationship],
            netWorth: [jointDetail.netWorth],
              customerRelations: this.formBuilder.array([]),
            fatherName: [jointDetail.fatherName],
            grandFatherName: [jointDetail.grandFatherName],
          })
      );
        const secControl = this.basicJointInfo.get(['jointCustomerInfo', i, 'customerRelations']) as FormArray;
        (this.basicJointInfo.get(['jointCustomerInfo', i, 'customerRelations']) as FormArray).clear();
        if (jointDetail.customerRelations.length > 0) {
            jointDetail.customerRelations.forEach((cr) => {
                console.log(cr);
                secControl.push(this.formBuilder.group({
                    age: [cr.age],
                    customerRelation: [cr.customerRelation],
                    customerRelativeName: [cr.customerRelativeName],
                    citizenshipNumber: [cr.citizenshipNumber],
                    citizenshipIssuedPlace: [cr.citizenshipIssuedPlace],
                    citizenshipIssuedDate: [cr.citizenshipIssuedDate],
                }));
            });
        } else {
            console.log('new form');
            secControl.push(this.setRelation());
        }
    });
  }

  getDistricts(index, province: Province, event) {
      if (event) {
          this.basicJointInfo.get(['jointCustomerInfo', index, 'district']).setValue(null);
          this.basicJointInfo.get(['jointCustomerInfo', index, 'municipalities']).setValue(null);
      }
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          this.districtList.sort((a, b) => a.name.localeCompare(b.name));
          this.districtList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
                this.basicJointInfo.get(['jointCustomerInfo', index, 'district']).setValue(district);
              this.getMunicipalities(index, district, event);
            }
          });
        }
    );
  }

  getMunicipalities(index, district: District, event) {
      if (event) {
          this.basicJointInfo.get(['jointCustomerInfo', index, 'municipalities']).setValue(null);
      }
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalitiesList = response.detail;
          this.municipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
          this.municipalitiesList.forEach(municipality => {
            if (!ObjectUtil.isEmpty(this.customer.municipalities) && municipality.id === this.customer.municipalities.id) {
                this.basicJointInfo.get(['jointCustomerInfo', index, 'municipalities']).setValue(district);
            }
          });
        }
    );

  }
  getTemporaryDistricts(index, province: Province, event) {
      if (event) {
          this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryDistrict']).setValue(null);
          this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryMunicipalities']).setValue(null);
      }
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.temporaryDistrictList = response.detail;
          this.temporaryDistrictList.sort((a, b) => a.name.localeCompare(b.name));
          this.temporaryDistrictList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.temporaryDistrict) && district.id === this.customer.temporaryDistrict.id) {
              this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryDistrict']).setValue(district);
              this.getTemporaryMunicipalities(index, district, event);
            }
          });
        }
    );
  }

  getTemporaryMunicipalities(index, district: District, event) {
      if (event) {
          this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryMunicipalities']).setValue(null);
      }
    this.commonLocation.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.temporaryMunicipalitiesList = response.detail;
          this.temporaryMunicipalitiesList.sort((a, b) => a.name.localeCompare(b.name));
          this.temporaryMunicipalitiesList.forEach(municipality => {
            if (!ObjectUtil.isEmpty(this.customer.temporaryMunicipalities) &&
                municipality.id === this.customer.temporaryMunicipalities.id) {
              this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryMunicipalities']).setValue(municipality);
            }
          });
        }
    );

  }

  onSubmit(value) {
    this.submitted = true;
    const tempId = this.basicJointInfo.get('jointCustomerInfo')['controls'][0].get('citizenshipNumber').value;
    this.blackListService.checkBlacklistByRef(tempId).subscribe((response: any) => {
      this.isBlackListed = response.detail;
      this.blackListStatusEmitter.emit(this.isBlackListed);
      if (this.isBlackListed) {
        this.customerDetailField.showFormField = false;
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Customer'));
        return;
      } else {
          if (this.basicJointInfo.controls['jointCustomerInfo'].invalid) {
              this.toastService.show(new Alert(AlertType.WARNING, 'Please check validation'));
              return;
          }
        {
          this.spinner = true;
          // for update join customer form
          if (!ObjectUtil.isEmpty(this.formValue)) {
              this.customer.id = this.id;
              this.customer.version = this.version;
          }
          this.customer.isJointCustomer = true;
          this.customer.clientType = this.basicJointInfo.get('clientType').value;
          this.customer.subsectorDetail = this.basicJointInfo.get('subsectorDetail').value;
          this.customer.subsectorDetail = this.basicJointInfo.get('subsectorDetail').value;
          this.customer.introduction = this.basicJointInfo.get('introduction').value;
          this.customer.bankingRelationship = JSON.stringify(this.basicJointInfo.get('bankingRelationship').value);
          this.customer.netWorth = this.basicJointInfo.get('netWorth').value;
          // to avoid backend validation error
          const customerName1 = this.basicJointInfo.get('jointCustomerInfo')['controls'][0].get('customerName').value;
          const customerName2 = this.basicJointInfo.get('jointCustomerInfo')['controls'][1].get('customerName').value;
          this.customer.customerName = customerName1 + '/' + customerName2;
          this.customer.citizenshipNumber = this.basicJointInfo.get('jointCustomerInfo')['controls'][0]
              .get('citizenshipNumber').value;
          this.customer.citizenshipIssuedPlace = this.basicJointInfo.get('jointCustomerInfo')['controls'][0]
              .get('citizenshipIssuedPlace').value;
          this.customer.citizenshipIssuedDate = this.basicJointInfo.get('jointCustomerInfo')['controls'][0]
              .get('citizenshipIssuedDate').value;
          this.customer.dob = this.basicJointInfo.get('jointCustomerInfo')['controls'][0].get('dob').value;
          // to json
          this.customer.jointInfo = JSON.stringify(value);
            console.log('this is joint customer valiue', value);
          this.customerService.save(this.customer).subscribe(res => {
            this.spinner = false;
            this.close();
            if (this.formValue.id == null) {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved Joint Customer Info'));
            } else {
              this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Joint Customer Info'));
            }
          }, res => {
            this.spinner = false;
            this.toastService.show(new Alert(AlertType.ERROR, res.error.message));
          });
        }
      }
    });
  }

  getProvince(index) {
    this.commonLocation.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
          this.provinceList.forEach((province: Province) => {
            if (this.customer !== undefined) {
              if (!ObjectUtil.isEmpty(this.customer.province)) {
                if (province.id === this.customer.province.id) {
                    this.basicJointInfo.get(['jointCustomerInfo', index, 'province']).setValue(province);
                  // this.basicJointInfo.controls.province.setValue(province);
                  this.getDistricts(index, province, event);
                }
              }
              if (!ObjectUtil.isEmpty(this.customer.temporaryProvince)) {
                if (province.id === this.customer.temporaryProvince.id) {
                    this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryProvince']).setValue(province);
                  // this.basicJointInfo.controls.temporaryProvince.setValue(province);
                  this.getTemporaryDistricts(index, province, event);
                }
              }
            }
          });
        }
    );
  }

  formMaker() {
    this.basicJointInfo = this.formBuilder.group({
      clientType: [undefined],
      subsectorDetail: [undefined],
      introduction: [undefined, Validators.required],
      incomeRisk: [undefined, Validators.required],
      securityRisk: [undefined, Validators.required],
      successionRisk: [undefined, Validators.required],
      bankingRelationship: [undefined, Validators.required],
      netWorth: [undefined, Validators.required],
      jointCustomerInfo: this.formBuilder.array([])
    });
  }

  jointFormGroup(): FormGroup {
    return this.formBuilder.group({
      customerName: [undefined, Validators.required],
      customerCode: [undefined],
      province: [undefined, Validators.required],
      district: [undefined, Validators.required],
      municipalities: [undefined, Validators.required],
      permanentAddressLine1: [undefined],
      permanentAddressLine2: [undefined],
      wardNumber: [undefined, Validators.required],
      contactNumber: [undefined, [Validators.required, Validators.max(9999999999), Validators.min(1000000000)]],
      landLineNumber: [undefined],
      email: [undefined, Validators.email],
      // initial Relation Date not used in ui
      citizenshipNumber: [undefined, Validators.required],
      citizenshipIssuedPlace: [undefined, Validators.required],
      citizenshipIssuedDate: [undefined, [Validators.required, DateValidator.isValidBefore]],
      dob: [ObjectUtil.isEmpty(this.customer.dob) ? undefined :
          new Date(this.customer.dob), [Validators.required, DateValidator.isValidBefore]],
      occupation: [undefined, [Validators.required]],
      otherOccupation: [undefined],
      incomeSource: [undefined, [Validators.required]],
      otherIncome: [undefined],
      temporaryProvince: [undefined, Validators.required],
      temporaryDistrict: [undefined, Validators.required],
      temporaryMunicipalities: [undefined, Validators.required],
      temporaryAddressLine1: [undefined],
      temporaryAddressLine2: [undefined],
      temporaryWardNumber: [undefined, Validators.required],
      gender: [undefined, Validators.required],
      maritalStatus: [undefined, Validators.required],
      customerLegalDocumentAddress: [undefined, Validators.required],
        customerRelations: this.formBuilder.array([this.setRelation()]),
        fatherName: [undefined],
        grandFatherName: [undefined],
    });
  }

  addMoreJointForm() {
    (this.basicJointInfo.get('jointCustomerInfo') as FormArray).push(this.jointFormGroup());
  }

  private getAllDistrict() {
    this.commonLocation.getAllDistrict().subscribe((response: any) => {
      this.allDistrict = response.detail;
    });
  }

  close() {
    this.ref.close();
  }

  changeAction(template) {
        this.onClose();
        this.modalService.open(template);
  }

  onCloseJointCustomer() {
        this.onClose();
  }

  onClose() {
        this.modalService.dismissAll();
  }

  occupationChange(index) {
    const isOtherSelected = this.basicJointInfo.get(['jointCustomerInfo', index, 'occupation']).value.includes('Other');
    if (isOtherSelected) {
      this.tempFlag.showOtherOccupation = true;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'otherOccupation']).setValidators(Validators.required);
    } else {
      this.tempFlag.showOtherOccupation = false;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'otherOccupation']).setValidators(null);
    }
    this.basicJointInfo.get(['jointCustomerInfo', index, 'otherOccupation']).updateValueAndValidity();
    const houseWifeSelected = !this.basicJointInfo.get(['jointCustomerInfo', index, 'occupation']).value.includes('House Wife') ?
        false : this.basicJointInfo.get(['jointCustomerInfo', index, 'occupation']).value.length <= 1;
    if (houseWifeSelected) {
      this.tempFlag.hideIncomeSource = true;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'incomeSource']).clearValidators();
    }  else {
      this.tempFlag.hideIncomeSource = false;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'incomeSource']).setValidators(Validators.required);
    }
    this.basicJointInfo.get(['jointCustomerInfo', index, 'incomeSource']).updateValueAndValidity();

  }

  onIncomeSourceChange(index) {
    const isOtherSourceSelected = this.basicJointInfo.get(['jointCustomerInfo', index, 'incomeSource']).value.includes('Other');
    if (isOtherSourceSelected) {
      this.tempFlag.showOtherIncomeSource = true;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'otherIncome']).setValidators(Validators.required);
    } else {
      this.tempFlag.showOtherIncomeSource = false;
      this.basicJointInfo.get(['jointCustomerInfo', index, 'otherIncome']).setValidators(null);
    }
    this.basicJointInfo.get(['jointCustomerInfo', index, 'otherIncome']).updateValueAndValidity();
  }

  sameAsPermanent(index) {
    this.basicJointInfo.get(['jointCustomerInfo' , index, 'temporaryProvince'])
        .setValue(this.basicJointInfo.get(['jointCustomerInfo', index, 'province']).value);
    this.customer.temporaryDistrict = this.basicJointInfo.get(['jointCustomerInfo', index, 'district']).value;
    this.getTemporaryDistricts(index, this.basicJointInfo.get(['jointCustomerInfo', index, 'province']).value, event);
    this.customer.temporaryMunicipalities = this.basicJointInfo.get(['jointCustomerInfo', index, 'municipalities']).value;
    this.getTemporaryMunicipalities(index, this.basicJointInfo.get(['jointCustomerInfo', index, 'district']).value, event);
    this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryAddressLine1'])
        .setValue(this.basicJointInfo.get(['jointCustomerInfo', index, 'permanentAddressLine1']).value);
    this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryAddressLine2'])
        .setValue(this.basicJointInfo.get(['jointCustomerInfo', index, 'permanentAddressLine2']).value);
    this.basicJointInfo.get(['jointCustomerInfo', index, 'temporaryWardNumber'])
        .setValue(this.basicJointInfo.get(['jointCustomerInfo', index, 'wardNumber']).value);
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

    addRelation(i: number) {
        const formGroup = this.basicJointInfo.get(['jointCustomerInfo', i , 'customerRelations']) as FormArray;
        formGroup.push(this.setRelation());
    }

    removeRelation(i: number, ii: number) {
        const formGroup = this.basicJointInfo.get(['jointCustomerInfo', i, 'customerRelations']) as FormArray;
        formGroup.removeAt(ii);
    }

    setRelation(): FormGroup {
        return this.formBuilder.group({
            age: [undefined],
            customerRelation: [undefined, Validators.required],
            customerRelativeName: [undefined, Validators.compose([Validators.required])],
            citizenshipNumber: [undefined],
            citizenshipIssuedPlace: [undefined],
            citizenshipIssuedDate: [undefined, DateValidator.isValidBefore],
        });
    }
}

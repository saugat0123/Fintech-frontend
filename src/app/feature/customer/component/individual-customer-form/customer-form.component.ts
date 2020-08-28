import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Customer} from '../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerRelative} from '../../../admin/modal/customer-relative';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {CustomerService} from '../../../admin/service/customer.service';
import {ToastService} from '../../../../@core/utils';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BlacklistService} from '../../../admin/component/blacklist/blacklist.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../@core/validator/date-validator';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CustomerAssociateComponent} from '../../../loan/component/loan-main-template/customer-associate/customer-associate.component';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {

  @Input() formValue: Customer;
  calendarType = 'AD';
  @Output() blackListStatusEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();

  basicInfo: FormGroup;
  submitted = false;
  spinner = false;
  displayEngDate = true;

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
  district: District = new District();
  districtList: Array<District> = Array<District>();
  municipality: MunicipalityVdc = new MunicipalityVdc();
  municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();
  private isBlackListed: boolean;
  allDistrict: Array<District> = Array<District>();
  private customerList: Array<Customer> = new Array<Customer>();
  public showMatchingTable: boolean;

  constructor(
      private formBuilder: FormBuilder,
      private commonLocation: AddressService,
      private customerService: CustomerService,
      private toastService: ToastService,
      private modalService: NgbModal,
      private blackListService: BlacklistService,
      private dialogService: NbDialogService,
      protected ref: NbDialogRef<CustomerFormComponent>
  ) {
  }

  ngOnInit() {
    this.getProvince();
    this.getAllDistrict();
    this.formMaker();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.customerDetailField.showFormField = true;
      this.customer = this.formValue;
      this.formMaker();
      this.setRelatives(this.customer.customerRelatives);
    } else {
      this.createRelativesArray();
    }
  }

  addRelatives() {
    (this.basicInfo.get('customerRelatives') as FormArray).push(
        this.formBuilder.group({
          customerRelation: [undefined, Validators.required],
          customerRelativeName: [undefined, Validators.compose([Validators.required])],
          citizenshipNumber: [undefined, Validators.compose([Validators.required])],
          citizenshipIssuedPlace: [undefined],
          citizenshipIssuedDate: [undefined],
          version: [0]
        })
    );
  }

  removeRelatives(i) {
    (this.basicInfo.get('customerRelatives') as FormArray).removeAt(i);
  }

  get basicInfoControls() {
    return this.basicInfo.controls;
  }

  getDistricts(province: Province) {
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          this.districtList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
              this.basicInfo.controls.district.setValue(district);
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
              this.basicInfo.controls.municipalities.setValue(municipality);
            }
          });
        }
    );

  }

  searchByCustomerCitizen() {
    const tempId = this.basicInfo.get('citizenshipNumber').value;
    this.blackListService.checkBlacklistByRef(tempId).subscribe((response: any) => {
      this.isBlackListed = response.detail;
      this.blackListStatusEmitter.emit(this.isBlackListed);

      if (this.isBlackListed) {
        this.customerDetailField.showFormField = false;
        this.toastService.show(new Alert(AlertType.ERROR, 'Blacklisted Customer'));
      } else {
        this.customerDetailField.showFormField = true;
        this.customerSearchData.citizenshipNumber = tempId;
        this.customerService.getByCustomerByCitizenshipNo(this.customerSearchData.citizenshipNumber)
        .subscribe((customerResponse: any) => {
          if (customerResponse.detail.length === 0) {
            this.getProvince();
            this.customerDetailField.isOldCustomer = false;
            this.toastService.show(new Alert(AlertType.INFO, 'No Customer Found under provided Citizenship No.'));
            this.customer = new Customer();
            this.customer.citizenshipNumber = tempId;
            this.formMaker();
            this.createRelativesArray();
          } else {
            this.getProvince();
            this.customerList = customerResponse.detail;
            if (this.customerList.length < 2) {
              this.customer = this.customerList[0];
              this.formMaker();
              this.setRelatives(this.customer.customerRelatives);
            } else {
              this.customerDetailField.showFormField = false;
              this.showMatchingTable = true;
              this.toastService.show(new Alert(AlertType.INFO, `${this.customerList.length}
                                       customer found with same citizenship number`));
            }
          }
        });
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    this.spinner = true;
    if (this.basicInfo.invalid) {
      return;
    }
    this.customer.id = (this.customer.citizenshipIssuedPlace ===
        this.basicInfo.get('citizenshipIssuedPlace').value) ? this.customer.id : undefined;
    this.customer.customerName = this.basicInfo.get('customerName').value;
    this.customer.province = this.basicInfo.get('province').value;
    this.customer.district = this.basicInfo.get('district').value;
    this.customer.municipalities = this.basicInfo.get('municipalities').value;
    this.customer.street = this.basicInfo.get('street').value;
    this.customer.wardNumber = this.basicInfo.get('wardNumber').value;
    this.customer.contactNumber = this.basicInfo.get('contactNumber').value;
    this.customer.email = this.basicInfo.get('email').value;
    this.customer.dob = this.basicInfo.get('dob').value;
    this.customer.initialRelationDate = this.basicInfo.get('initialRelationDate').value;
    this.customer.citizenshipNumber = this.basicInfo.get('citizenshipNumber').value;
    this.customer.citizenshipIssuedPlace = this.basicInfo.get('citizenshipIssuedPlace').value;
    this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
    this.customer.occupation = this.basicInfo.get('occupation').value;
    this.customer.incomeSource = this.basicInfo.get('incomeSource').value;
    this.customer.version = this.basicInfo.get('version').value;
    const rawFromValue = this.basicInfo.getRawValue();
    this.customer.customerRelatives = rawFromValue.customerRelatives;

    this.customerService.save(this.customer).subscribe(res => {
      this.spinner = false;
      this.close();
    }, res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, res.error.message))
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
                  this.basicInfo.controls.province.setValue(province);
                  this.getDistricts(province);
                }
              }
            }
          });
        }
    );
  }

  formMaker() {
    this.basicInfo = this.formBuilder.group({
      customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName, Validators.required],
      province: [this.customer.province === null ? undefined : this.customer.province, Validators.required],
      district: [this.customer.district === null ? undefined : this.customer.district, Validators.required],
      municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities, Validators.required],
      street: [this.customer.street === null ? undefined : this.customer.street, Validators.required],
      wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber, Validators.required],
      contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber, Validators.required],
      email: [this.customer.email === undefined ? undefined : this.customer.email, Validators.required],
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
      incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
      customerRelatives: this.formBuilder.array([])
    });
  }

  createRelativesArray() {
    const relation = ['Grand Father', 'Father'];
    relation.forEach((customerRelation) => {
      (this.basicInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
        customerRelation: [{value: customerRelation, disabled: true}],
        customerRelativeName: [undefined, Validators.required],
        citizenshipNumber: [undefined, Validators.required],
        citizenshipIssuedPlace: [undefined, Validators.required],
        citizenshipIssuedDate: [undefined, Validators.required],
        version: [undefined]
      }));
    });
  }

  setRelatives(currentData) {
    const relativesData = (this.basicInfo.get('customerRelatives') as FormArray);
    currentData.forEach((singleRelatives, index) => {
      const customerRelative = singleRelatives.customerRelation;
      // Increase index number with increase in static relatives---
      relativesData.push(this.formBuilder.group({
        customerRelation: (index > 1) ? [(customerRelative)] :
            [({value: customerRelative, disabled: true}), Validators.required],
        customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
        version: [singleRelatives.version === undefined ? undefined : singleRelatives.version],
        citizenshipNumber: [singleRelatives.citizenshipNumber, Validators.required],
        citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
        citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
            undefined : new Date(singleRelatives.citizenshipIssuedDate)]
      }));
    });
  }

  checkCustomer() {
    const customerName = this.basicInfo.get('customerName').value;
    const citizenShipIssuedDate = this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipIssuedDate').value;
    const citizenShipNo = this.customer.citizenshipIssuedDate = this.basicInfo.get('citizenshipNumber').value;
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
    this.customer.citizenshipNumber = this.basicInfoControls.citizenshipNumber.value;
    this.formMaker();
    this.createRelativesArray();
    this.customerDetailField.showFormField = true;
    this.showMatchingTable = false;
  }

  close() {
    this.ref.close();
  }
}

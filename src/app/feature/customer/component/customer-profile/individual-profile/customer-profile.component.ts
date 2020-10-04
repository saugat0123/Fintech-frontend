import {AfterContentInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {CustomerService} from '../../../service/customer.service';
import {ToastService} from '../../../../../@core/utils';
import {Customer} from '../../../../admin/modal/customer';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {LoanType} from '../../../../loan/model/loanType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {ApiConfig} from '../../../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {Province} from '../../../../admin/modal/province';
import {District} from '../../../../admin/modal/district';
import {AddressService} from '../../../../../@core/service/baseservice/address.service';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {MunicipalityVdc} from '../../../../admin/modal/municipality_VDC';
import {FetchLoan} from '../../../model/fetchLoan';
import {LoanAmountType} from '../../../model/loanAmountType';
import {CustomerType} from '../../../model/customerType';
import {CustomerInfoService} from '../../../service/customer-info.service';
// @ts-ignore
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {KycFormComponent} from './kyc-form/kyc-form.component';
import {NbDialogService} from '@nebular/theme';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';
import {CustomerLoanApplyComponent} from '../../customer-loan-apply/customer-loan-apply.component';
import {CustomerListGroupComponent} from '../../customer-group-associate-loan-list/customer-list-group.component';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit, AfterContentInit {
  @ViewChild('customerListGroupComponent', {static: false})
  public customerListGroupComponent: CustomerListGroupComponent;

  associateId: number;
  customerInfoId: number;
  customer: Customer = new Customer();
  loanType = LoanType;
  spinner = false;
  formData: FormData = new FormData();
  restUrl = ApiConfig.URL;
  mySubscription: any;
  isEdited = false;
  basicForm: FormGroup;
  customerRelatives: Array<CustomerRelative> = new Array<CustomerRelative>();
  province: Province = new Province();
  provinceList: Array<Province> = Array<Province>();
  district: District = new District();
  districtList: Array<District> = Array<District>();
  municipality: MunicipalityVdc = new MunicipalityVdc();
  municipalitiesList: Array<MunicipalityVdc> = Array<MunicipalityVdc>();

  totalProposedAmountByGuarantor = 0;
  totalProposedAmountByGroup = 0;
  proposeAmountOfGroup = 0;
  totalGroupAmount = 0;
  totalProposalAmount = 0;
  totalLoanProposedAmount = 0;
  fetchLoan = FetchLoan;
  paramProp: any;
  filterLoanCat = CustomerType.INSTITUTION;
  isIndividual = false;
  customerInfo: CustomerInfoData;
  maker = false;
  profilePic;

  constructor(private route: ActivatedRoute,
              private customerService: CustomerService,
              private customerInfoService: CustomerInfoService,
              private customerLoanService: LoanFormService,
              private toastService: ToastService,
              private router: Router,
              private modalService: NgbModal,
              private formBuilder: FormBuilder,
              private loanConfigService: LoanConfigService,
              private commonLocation: AddressService,
              private activatedRoute: ActivatedRoute,
              private dialogService: NbDialogService) {

    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    this.mySubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Trick the Router into believing it's last link wasn't previously loaded
        this.router.navigated = false;
      }
    });
  }

  ngOnInit() {
    this.associateId = this.route.snapshot.params.id;
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.paramProp = {
            customerType: null,
            customerInfoId: null
          };
          this.paramProp = paramsValue;
          this.customerInfoId = this.paramProp.customerInfoId;
          this.getCustomerInfo();
        });
    if (CustomerType.INDIVIDUAL === CustomerType[this.paramProp.customerType]) {
      this.filterLoanCat = CustomerType.INDIVIDUAL;
      this.isIndividual = true;
    }
    this.customerService.detail(this.associateId).subscribe((res: any) => {
      this.customer = res.detail;
      this.customerBasicFormBuilder();
      this.getProvince();
      this.setRelatives(this.customer.customerRelatives);
    });


  }

  ngAfterContentInit(): void {
    const roleType = LocalStorageUtil.getStorage().roleType;
    if (roleType === 'MAKER') {
      this.maker = true;
    }
  }

  getCustomerInfo() {
    this.spinner = true;
    this.customerInfoService.detail(this.customerInfoId).subscribe((res: any) => {
      this.customerInfo = res.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer information'));
      this.spinner = false;
    });
  }

  public refreshCustomerInfo(): void {
    this.customerInfo = undefined;
    this.getCustomerInfo();
  }

  getProvince() {
    this.commonLocation.getProvince().subscribe(
        (response: any) => {
          this.provinceList = response.detail;
          this.provinceList.forEach((province: Province) => {
            if (this.customer !== undefined) {
              if (!ObjectUtil.isEmpty(this.customer.province)) {
                if (province.id === this.customer.province.id) {
                  this.basicForm.controls.province.setValue(province);
                  this.getDistricts(province);
                }
              }
            }
          });
        }
    );
  }


  openSelectLoanTemplate() {
    const modalRef = this.modalService.open(CustomerLoanApplyComponent, {size: 'lg'});
    modalRef.componentInstance.customerType = this.filterLoanCat;
    modalRef.componentInstance.paramProp = this.paramProp;
    modalRef.componentInstance.associateId = this.associateId;
    modalRef.componentInstance.customerInfo = this.customerInfo;
    modalRef.result.then(close => {
      if (close) {
        this.refreshCustomerInfo();
      }
    });
  }


  onClick(loanConfigId: number, customerId: number) {
    this.spinner = true;
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId,
        catalogue: true
      }
    });
  }

  editCustomer(val) {
    this.isEdited = val === 1;
  }

  profileUploader(event, template) {
    this.profilePic = event.target.files[0];
    this.modalService.open(template);

  }

  confirmUpload() {
    this.modalService.dismissAll();
    this.formData.append('file', this.profilePic);
    this.formData.append('customerInfoId', this.customerInfo.id.toString());
    this.formData.append('name', this.customerInfo.name);
    this.formData.append('branch', this.customerInfo.branch.name);
    this.formData.append('customerType', this.customerInfo.customerType);
    this.customerInfoService.uploadFile(this.formData).subscribe((res: any) => {
      this.customerInfo.profilePic = res.detail;
      this.formData = new FormData();
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Picture HAS BEEN UPLOADED'));
      this.refreshCustomerInfo();
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  onClose() {
    this.modalService.dismissAll();
  }

  customerBasicFormBuilder() {
    this.basicForm = this.formBuilder.group({
      id: [this.customer.id === undefined ? undefined : this.customer.id],
      profilePic: [this.customer.profilePic === undefined ? undefined : this.customer.profilePic],
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
      incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource, [Validators.required]],
      customerRelatives: this.formBuilder.array([]),
      version: [this.customer.version === undefined ? undefined : this.customer.version],
    });
  }

  createRelativesArray() {
    const relation = ['Grand Father', 'Father'];
    relation.forEach((customerRelation) => {
      (this.basicForm.get('customerRelatives') as FormArray).push(this.formBuilder.group({
        customerRelation: [{value: customerRelation, disabled: true}],
        customerRelativeName: [undefined, Validators.compose([Validators.required])],
        citizenshipNumber: [undefined, Validators.compose([Validators.required])],
        citizenshipIssuedPlace: [undefined, Validators.compose([Validators.required])],
        citizenshipIssuedDate: [undefined, Validators.compose([Validators.required, DateValidator.isValidBefore])]
      }));
    });
  }

  setRelatives(currentData) {
    const relativesData = (this.basicForm.get('customerRelatives') as FormArray);
    currentData.forEach((singleRelatives, index) => {
      const customerRelative = singleRelatives.customerRelation;
      // Increase index number with increase in static relatives---
      relativesData.push(this.formBuilder.group({
        customerRelation: [singleRelatives.customerRelation],
        customerRelativeName: [singleRelatives.customerRelativeName],
        citizenshipNumber: [singleRelatives.citizenshipNumber],
        citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
        citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
            undefined : new Date(singleRelatives.citizenshipIssuedDate), [Validators.required, DateValidator.isValidBefore]]
      }));
    });
  }

  getDistricts(province: Province) {
    this.commonLocation.getDistrictByProvince(province).subscribe(
        (response: any) => {
          this.districtList = response.detail;
          this.districtList.forEach(district => {
            if (!ObjectUtil.isEmpty(this.customer.district) && district.id === this.customer.district.id) {
              this.basicForm.controls.district.setValue(district);
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
              this.basicForm.controls.municipalities.setValue(municipality);
            }
          });
        }
    );

  }

  saveBasic() {
    this.customerService.save(this.basicForm.value).subscribe((res: any) => {
      this.customer = res.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
      this.isEdited = false;
      this.customerBasicFormBuilder();
      this.getProvince();
      this.setRelatives(this.customer.customerRelatives);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  checkKycLoan(customerRelative: CustomerRelative) {

    this.customerService.getCustomerIdOfRelative(customerRelative).subscribe((response: any) => {
      this.customer = response.detail;
      if (this.customer !== null) {
        this.router.navigate(['/home/customer/profile/' + this.customer.id]);
        this.associateId = this.customer.id;
      }
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }

  getTotalLoanAmount(value: LoanAmountType) {
    if (value.type === this.fetchLoan.CUSTOMER_LOAN) {
      this.totalLoanProposedAmount = value.value;
    }
    if (value.type === this.fetchLoan.CUSTOMER_AS_GROUP) {
      this.totalProposedAmountByGroup = value.value;
      this.proposeAmountOfGroup = value.otherParam;
    }
    this.totalGroupAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByGroup;
    this.totalProposalAmount = this.totalProposedAmountByGuarantor +
        this.totalLoanProposedAmount + this.proposeAmountOfGroup;
  }

  openKycModal() {
    const customer = this.customer;
    this.dialogService.open(KycFormComponent, {context: {customer}}).onClose.subscribe(res => {
      if (!ObjectUtil.isEmpty(res)) {
       this.refreshCustomerInfo();
      }
    });
  }

  refreshGroup() {
   this.refreshCustomerInfo();
  }
}

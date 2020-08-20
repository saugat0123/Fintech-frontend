import {Component, OnInit, TemplateRef} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Params, Router} from '@angular/router';
import {CustomerService} from '../../service/customer.service';
import {ToastService} from '../../../../@core/utils';
import {Customer} from '../../../admin/modal/customer';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanType} from '../../../loan/model/loanType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../@core/validator/date-validator';
import {Province} from '../../../admin/modal/province';
import {District} from '../../../admin/modal/district';
import {AddressService} from '../../../../@core/service/baseservice/address.service';
import {CustomerRelative} from '../../../admin/modal/customer-relative';
import {MunicipalityVdc} from '../../../admin/modal/municipality_VDC';
import {FetchLoan} from '../../model/fetchLoan';
import {LoanAmountType} from '../../model/loanAmountType';
import {LoanCategory} from '../../../loan/model/loan-category';
import {CustomerType} from '../../model/customerType';
import {CustomerInfoService} from '../../service/customer-info.service';
// @ts-ignore
import {CustomerInfoData} from '../../../loan/model/customerInfoData';


@Component({
  selector: 'app-customer-profile',
  templateUrl: './customer-profile.component.html',
  styleUrls: ['./customer-profile.component.scss']
})
export class CustomerProfileComponent implements OnInit {
  associateId: number;
  customerInfoId: number;
  customer: Customer = new Customer();
  loanType = LoanType;
  loanList = [];
  spinner = false;
  formData: FormData = new FormData();
  restUrl = ApiConfig.URL;
  applyForm = {
    loanId: undefined,
    customerProfileId: undefined
  };
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
  routeLoanForm = false;

  totalProposedAmountByKYC = 0;
  totalProposedAmountByGuarantor = 0;
  totalGroupAmount = 0;
  totalProposalAmount = 0;
  totalLoanProposedAmount = 0;
  fetchLoan = FetchLoan;
  paramProp: any;
  filterLoanCat = LoanCategory.BUSINESS;
  isIndividual = false;
  customerInfo: CustomerInfoData;

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
              private activatedRoute: ActivatedRoute, ) {

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
      this.filterLoanCat = LoanCategory.PERSONAL;
      this.isIndividual = true;
    }
    this.customerService.detail(this.associateId).subscribe((res: any) => {
      this.customer = res.detail;
      this.customerBasicFormBuilder();
      this.getProvince();
      this.setRelatives(this.customer.customerRelatives);


    });


    this.loanConfigService.getAllByLoanCategory(this.filterLoanCat).subscribe((response: any) => {
      this.loanList = response.detail;
    });
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


  openSelectLoanTemplate(template: TemplateRef<any>) {
    this.modalService.open(template);

  }

  onClose() {
    this.modalService.dismissAll();
  }

  openLoanForm() {
    this.onClose();
    this.spinner = true;
    let loanCategory = 'BUSINESS_TYPE';
    if (CustomerType.INDIVIDUAL === CustomerType[this.paramProp.customerType]) {
      loanCategory = 'PERSONAL_TYPE';
    }
    this.router.navigate(['/home/loan/loanForm'], {
      queryParams: {
        loanId: this.applyForm.loanId,
        customerInfoId: this.paramProp.customerInfoId,
        customerType: this.paramProp.customerType,
        customerProfileId: this.associateId,
        loanCategory: loanCategory
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

  profileUploader(event) {
    const file = event.target.files[0];

    this.formData.append('file', file);
    this.formData.append('citizenNumber', this.customer.citizenshipNumber);
    this.formData.append('customerName', this.customer.customerName);
    this.customerService.uploadFile(this.formData).subscribe((res: any) => {
      this.customer.profilePic = res.detail;
      this.formData = new FormData();
      this.customerService.save(this.customer).subscribe((response: any) => {
        this.customer = response.detail;
        this.customerBasicFormBuilder();
        this.getProvince();
        this.setRelatives(this.customer.customerRelatives);
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Picture HAS BEEN UPLOADED'));
      }, error => {
        this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
      });
    });

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
    const relation = ['Grand Father', 'Father', 'Spouse'];
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
        customerRelation: (index > 2) ? [(customerRelative)] :
            [({value: customerRelative, disabled: true}), Validators.required],
        customerRelativeName: [singleRelatives.customerRelativeName, Validators.required],
        citizenshipNumber: [singleRelatives.citizenshipNumber, Validators.required],
        citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace, Validators.required],
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
    if (value.type === this.fetchLoan.CUSTOMER_AS_KYC) {
      this.totalProposedAmountByKYC = value.value;
    }
    if (value.type === this.fetchLoan.CUSTOMER_AS_GUARANTOR) {
      this.totalProposedAmountByGuarantor = value.value;
    }
    this.totalGroupAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByKYC;
    this.totalProposalAmount = this.totalProposedAmountByGuarantor + this.totalProposedAmountByKYC + this.totalLoanProposedAmount;
  }

  openTemplate(template) {
    this.modalService.open(template, {size: 'lg'});
  }
}

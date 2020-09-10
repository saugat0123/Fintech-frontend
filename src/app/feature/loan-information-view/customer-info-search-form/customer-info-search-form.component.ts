import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerType} from '../../customer/model/customerType';
import {District} from '../../admin/modal/district';
import {AddressService} from '../../../@core/service/baseservice/address.service';
import {CustomerInfoService} from '../../customer/service/customer-info.service';
import {CalendarType} from '../../../@core/model/calendar-type';
import {Customer} from '../../admin/modal/customer';
import {CustomerService} from '../../customer/service/customer.service';
import {CustomerInfoData} from '../../loan/model/customerInfoData';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {Router} from '@angular/router';
import {LocalStorageUtil} from '../../../@core/utils/local-storage-util';
import {CompanyInfo} from '../../admin/modal/company-info';
import {CompanyInfoService} from '../../admin/service/company-info.service';

@Component({
  selector: 'app-customer-info-search-form',
  templateUrl: './customer-info-search-form.component.html',
  styleUrls: ['./customer-info-search-form.component.scss']
})
export class CustomerInfoSearchFormComponent implements OnInit {

  static INDIVIDUAL_MESSAGE = 'Citizenship Number is Required';

  static COMPANY_MESSAGE = 'PAN Number is Required';

  static COMPANY_PLACEHOLDER = 'PAN Number';

  static INDIVIDUAL_PLACEHOLDER = 'Citizenship Number';

  static INDIVIDUAL_CITIZENSHIP = 'CITIZENSHIP';

  static COMPANY_PAN = 'PAN';

  @Input() calendarType: CalendarType;

  @Input() loanId: any;


  @Input() customerType: CustomerType;

  customerInfo = new CustomerInfoData();

  ifSameBranch = false;
  branch = LocalStorageUtil.getStorage().branch;
  search: FormGroup;
  submitted = false;
  placeHolder = CustomerInfoSearchFormComponent.INDIVIDUAL_PLACEHOLDER;
  errorMessage = CustomerInfoSearchFormComponent.INDIVIDUAL_MESSAGE;
  allDistrict: Array<District> = Array<District>();

  constructor(private formBuilder: FormBuilder,
              private commonLocation: AddressService,
              private customerInfoService: CustomerInfoService,
              private individualService: CustomerService,
              private dialogService: NbDialogService,
              private router: Router,
              private companyService: CompanyInfoService,
  ) {
  }

  individual = new Customer();
  displayIndividual = true;
  hasError = false;
  company = new CompanyInfo();

  ngOnInit() {

    this.searchForm();
    this.getAllDistrict();
    if (this.customerType === CustomerType.COMPANY) {
      this.placeHolder = CustomerInfoSearchFormComponent.COMPANY_PLACEHOLDER;
      this.errorMessage = CustomerInfoSearchFormComponent.COMPANY_MESSAGE;
      this.displayIndividual = false;
    }

  }

  searchForm() {
    this.search = this.formBuilder.group({
      idNumber: [undefined
        , Validators.required],
      idRegPlace: [undefined,
        Validators.required],
      customerType: [this.customerType === CustomerType.INDIVIDUAL ? 'INDIVIDUAL' : 'COMPANY'],
      idRegDate: [undefined, Validators.required],
      idType: [this.customerType === CustomerType.INDIVIDUAL ? CustomerInfoSearchFormComponent.INDIVIDUAL_CITIZENSHIP
          : CustomerInfoSearchFormComponent.COMPANY_PAN],

    });
  }

  get searchControls() {
    return this.search.controls;
  }

  private getAllDistrict() {
    this.commonLocation.getAllDistrict().subscribe((response: any) => {
      this.allDistrict = response.detail;
    });
  }

  onSubmit(template: TemplateRef<any>) {
    this.submitted = true;
    this.hasError = false;
    if (this.search.invalid) {
      return;
    }
    this.customerInfoService.getCustomerByTypeIdNumberIdTypeRegDate(this.search.value)
    .subscribe((res: any) => {
      this.customerInfo = res.detail;
      if (this.branch === this.customerInfo.branch.id.toString()) {
        this.ifSameBranch = true;
      } else {
        this.ifSameBranch = false;
      }
      if (this.customerType === CustomerType.INDIVIDUAL) {
        this.individualService.detail(this.customerInfo.associateId).subscribe((response: any) => {
          this.individual = response.detail;
          this.displayIndividual = true;
          const modalRef = this.dialogService.open(template);

        });
      } else {
        this.companyService.detail(this.customerInfo.associateId).subscribe((response: any) => {
          this.company = response.detail;
          this.displayIndividual = false;
          const modalRef = this.dialogService.open(template);

        });

      }

    }, error => {
      this.hasError = true;
      this.displayIndividual = false;
    });
  }


  fetchCustomer(ref: NbDialogRef<TemplateRef<any>>) {
    ref.close();
    let loanCategory = 'BUSINESS_TYPE';
    if (CustomerType.INDIVIDUAL === this.customerType) {
      loanCategory = 'PERSONAL_TYPE';
    }
    this.router.navigate(['/home/loan/loanForm'], {
      queryParams: {
        loanId: this.loanId,
        customerInfoId: this.customerInfo.id,
        customerType: this.customerInfo.customerType,
        customerProfileId: this.customerInfo.associateId,
        loanCategory: loanCategory
      }
    });
  }


}

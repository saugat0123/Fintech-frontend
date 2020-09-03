import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CustomerType} from '../../customer/model/customerType';
import {District} from '../../admin/modal/district';
import {AddressService} from '../../../@core/service/baseservice/address.service';

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

  @Input() customerType: CustomerType;

  private search: FormGroup;
  private submitted = false;
  placeHolder = CustomerInfoSearchFormComponent.INDIVIDUAL_PLACEHOLDER;
  errorMessage = CustomerInfoSearchFormComponent.INDIVIDUAL_MESSAGE;
  allDistrict: Array<District> = Array<District>();

  constructor(private formBuilder: FormBuilder, private commonLocation: AddressService,) {
  }

  ngOnInit() {
    this.searchForm();
    this.getAllDistrict();
    if (this.customerType === CustomerType.COMPANY) {
      this.placeHolder = CustomerInfoSearchFormComponent.COMPANY_PLACEHOLDER;
      this.errorMessage = CustomerInfoSearchFormComponent.COMPANY_MESSAGE;
    }

  }

  searchForm() {
    this.search = this.formBuilder.group({
      idNumber: [undefined
        , Validators.required],
      idRegPlace: [undefined,
        Validators.required],
      customerType: [this.customerType],
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

  onSubmit() {
    this.submitted = true;

    console.log(this.search.value);
    if (this.search.invalid) {
      return;
    }
  }
}

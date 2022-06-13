import {Component, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AddressService} from '../../@core/service/baseservice/address.service';
import {ObjectUtil} from '../../@core/utils/ObjectUtil';
import {FormUtils} from '../../@core/utils/form.utils';
import {CompanyInfo} from '../admin/modal/company-info';
import {EventEmitter} from 'events';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.scss']
})
export class ContactDetailsComponent implements OnInit {
  @Input() formValue: CompanyInfo;
  @Input() contactDetail;
  contactDetailsFormGroup: FormGroup;
  submitData;
  companyInfo: CompanyInfo;
  submitted = false;
  constructor(private addressService: AddressService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.contactDetailsFormGroup = this.formBuilder.group({
      registeredOfficeLegalAddress : [undefined , Validators.required],
      residenceOfMainPerson : [undefined , Validators.required],
      factoryBusinessLegalAddress : [undefined , Validators.required],
      registeredOfficePhoneNumber :  [undefined, Validators.required],
      residenceOfMainPersonPhoneNumber : [undefined, Validators.required],
      factoryBusinessPhoneNumber : [undefined, Validators.required],
      registeredOfficeFax : [undefined, Validators.required],
      residenceOfMainPersonFax : [undefined, Validators.required],
      factoryBusinessFax : [undefined, Validators.required],
      registeredOfficeEmail : [undefined, Validators.required],
      residenceOfMainPersonEmail : [undefined, Validators.required],
      factoryBusinessEmail : [undefined, Validators.required],
      registeredOfficeContactPer : [undefined, Validators.required],
      residenceOfMainPersonContactPer : [undefined, Validators.required],
      factoryBusinessContactPer : [undefined, Validators.required],
      registeredOfficeMobile : [undefined, Validators.required],
      residenceOfMainPersonMobile : [undefined, Validators.required],
      factoryBusinessMobile : [undefined, Validators.required]
    });
  }

  get form() {
    return this.contactDetailsFormGroup.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.submitData = this.contactDetailsFormGroup.value;
  }

}

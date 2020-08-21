import {Component, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Customer} from '../../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../service/customer.service';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from "../../../../../@core/validator/date-validator";

@Component({
  selector: 'app-kyc-edit',
  templateUrl: './kyc-edit.component.html',
  styleUrls: ['./kyc-edit.component.scss']
})
export class KycEditComponent implements OnInit {

  id: number;

  isEdited = false;
  spinner = false;
  relative: [];

  @Input()
  kycRelative: Array<CustomerRelative> ;
  calendarType = 'AD';

  displayEngDate = true;

  @Input()
  customer: Customer ;

  kycForm: FormGroup;
  data: object;
  edited = false;


  customerInfo: Customer = new Customer();

  constructor(
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private customerService: CustomerService,
      private loanformService: LoanFormService,
      private toastService: ToastService,
      private router: Router,
      private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.editCustomer(1);
    this.buildForm();
    this.setRelatives(this.kycRelative);
  }
  buildForm() {
    this.kycForm =  this.formBuilder.group({
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

  setRelatives(currentData) {
    const relativesData = (this.kycForm.get('customerRelatives') as FormArray);
    currentData.forEach((singleRelatives, index) => {
      const customerRelative = singleRelatives.customerRelation;
      // Increase index number with increase in static relatives---
      relativesData.push(this.formBuilder.group({
        customerRelation: [singleRelatives.customerRelation],
        customerRelativeName: [singleRelatives.customerRelativeName],
        citizenshipNumber: [singleRelatives.citizenshipNumber],
        version: [singleRelatives.version === undefined ? undefined : singleRelatives.version],
        citizenshipIssuedPlace: [singleRelatives.citizenshipIssuedPlace],
        citizenshipIssuedDate: [ObjectUtil.isEmpty(singleRelatives.citizenshipIssuedDate) ?
            undefined : new Date(singleRelatives.citizenshipIssuedDate)]
      }));
    });
  }
  editCustomer(val) {
    this.isEdited = val === 1;
  }
  saveKyc() {
    this.spinner = true;
    this.customer.id = (this.customer.citizenshipIssuedPlace ===
        this.kycForm.get('citizenshipIssuedPlace').value) ? this.customer.id : undefined;
    this.customer.customerName = this.kycForm.get('customerName').value;
    this.customer.province = this.kycForm.get('province').value;
    this.customer.district = this.kycForm.get('district').value;
    this.customer.municipalities = this.kycForm.get('municipalities').value;
    this.customer.street = this.kycForm.get('street').value;
    this.customer.wardNumber = this.kycForm.get('wardNumber').value;
    this.customer.contactNumber = this.kycForm.get('contactNumber').value;
    this.customer.email = this.kycForm.get('email').value;
    this.customer.dob = this.kycForm.get('dob').value;
    this.customer.initialRelationDate = this.kycForm.get('initialRelationDate').value;
    this.customer.citizenshipNumber = this.kycForm.get('citizenshipNumber').value;
    this.customer.citizenshipIssuedPlace = this.kycForm.get('citizenshipIssuedPlace').value;
    this.customer.citizenshipIssuedDate = this.kycForm.get('citizenshipIssuedDate').value;
    this.customer.occupation = this.kycForm.get('occupation').value;
    this.customer.incomeSource = this.kycForm.get('incomeSource').value;
    this.customer.incomeSource = this.kycForm.get('incomeSource').value;
    this.customer.version = this.kycForm.get('version').value;
    const rawFromValue = this.kycForm.getRawValue();
    this.customer.customerRelatives = rawFromValue.customerRelatives;
    this.customerService.save(this.customer).subscribe((res: any) => {
      this.customer = res.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
      this.edited = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
    this.editCustomer(0);
  }



}

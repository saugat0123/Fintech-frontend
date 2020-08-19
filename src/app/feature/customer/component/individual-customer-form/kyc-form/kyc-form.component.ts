import {Component, Inject, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {LoanDataService} from '../../../../loan/service/loan-data.service';
import {CustomerService} from '../../../service/customer.service';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {CustomerFormComponent} from '../customer-form.component';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {ActivatedRoute} from '@angular/router';
import {NbDialogRef, NbDialogService} from '@nebular/theme';



@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.scss']
})
export class KycFormComponent implements OnInit {
  id: number;

  @Input()
  kycRelative: Array<CustomerRelative> ;

  kycInfo: FormGroup;
  data: object;
  edited = false;


  customer: Customer = new Customer();

  constructor(
      private route: ActivatedRoute,
      private formBuilder: FormBuilder,
      private customerService: CustomerService,
      private loanformService: LoanFormService,
      private toastService: ToastService,
      private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.createRelativesArray();
    this.id = this.route.snapshot.params.id;
    this.customerService.detail(this.id).subscribe((res: any) => {
      this.customer = res.detail;
      this.buildForm();
      this.createRelativesArray();
      console.log(this.customer);
    });
  }
  buildForm() {
    this.kycInfo =  this.formBuilder.group({
      customerName: [this.customer.customerName === undefined ? undefined : this.customer.customerName],
      province: [this.customer.province === null ? undefined : this.customer.province],
      district: [this.customer.district === null ? undefined : this.customer.district],
      municipalities: [this.customer.municipalities === null ? undefined : this.customer.municipalities],
      street: [this.customer.street === null ? undefined : this.customer.street],
      wardNumber: [this.customer.wardNumber === null ? undefined : this.customer.wardNumber],
      contactNumber: [this.customer.contactNumber === undefined ? undefined : this.customer.contactNumber],
      email: [this.customer.email === undefined ? undefined : this.customer.email],
      initialRelationDate: [this.customer.initialRelationDate === undefined ? undefined :
          new Date(this.customer.initialRelationDate)],
      citizenshipNumber: [this.customer.citizenshipNumber === undefined ? undefined : this.customer.citizenshipNumber
        , Validators.required],
      citizenshipIssuedPlace: [this.customer.citizenshipIssuedPlace === undefined ? undefined : this.customer.citizenshipIssuedPlace,
        Validators.required],
      citizenshipIssuedDate: [ObjectUtil.isEmpty(this.customer.citizenshipIssuedDate) ? undefined :
          new Date(this.customer.citizenshipIssuedDate)],
      dob: [ObjectUtil.isEmpty(this.customer.dob) ? undefined :
          new Date(this.customer.dob)],
      occupation: [this.customer.occupation === undefined ? undefined : this.customer.occupation],
      incomeSource: [this.customer.incomeSource === undefined ? undefined : this.customer.incomeSource],
      customerRelatives: this.formBuilder.array([])
    });

  }


  onSubmit() {
    // this.data = this.kycInfo.value;
    // this.customerService.save(this.data).subscribe((res: any) => {
    //   console.log(res.detail);
    //   this.customer = res.detail;
    //   this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
    // }, error => {
    //   this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    // });
    this.customer.id = (this.customer.citizenshipIssuedPlace ===
        this.kycInfo.get('citizenshipIssuedPlace').value) ? this.customer.id : undefined;
    this.customer.customerName = this.kycInfo.get('customerName').value;
    this.customer.province = this.kycInfo.get('province').value;
    this.customer.district = this.kycInfo.get('district').value;
    this.customer.municipalities = this.kycInfo.get('municipalities').value;
    this.customer.street = this.kycInfo.get('street').value;
    this.customer.wardNumber = this.kycInfo.get('wardNumber').value;
    this.customer.contactNumber = this.kycInfo.get('contactNumber').value;
    this.customer.email = this.kycInfo.get('email').value;
    this.customer.dob = this.kycInfo.get('dob').value;
    this.customer.initialRelationDate = this.kycInfo.get('initialRelationDate').value;
    this.customer.citizenshipNumber = this.kycInfo.get('citizenshipNumber').value;
    this.customer.citizenshipIssuedPlace = this.kycInfo.get('citizenshipIssuedPlace').value;
    this.customer.citizenshipIssuedDate = this.kycInfo.get('citizenshipIssuedDate').value;
    this.customer.occupation = this.kycInfo.get('occupation').value;
    this.customer.incomeSource = this.kycInfo.get('incomeSource').value;
    const rawFromValue = this.kycInfo.getRawValue();
    this.customer.customerRelatives = rawFromValue.customerRelatives;

    this.customerService.save(this.customer).subscribe(res => {
      console.log(res.detail);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
      this.buildForm();
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
    this.edited = false;
  }
  createRelativesArray() {
    (this.kycInfo.get('customerRelatives') as FormArray).push(this.formBuilder.group({
      customerRelation: [undefined],
      customerRelativeName: [undefined],
      citizenshipNumber: [undefined],
      citizenshipIssuedPlace: [undefined],
      citizenshipIssuedDate: [undefined]
    }));

  }



}

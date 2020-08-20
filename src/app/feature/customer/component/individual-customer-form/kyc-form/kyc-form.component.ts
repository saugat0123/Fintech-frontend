import {Component, Inject, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {CustomerService} from '../../../service/customer.service';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ToastService} from '../../../../../@core/utils';
import {ActivatedRoute, Router} from '@angular/router';
import {NbDialogRef, NbDialogService} from '@nebular/theme';



@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.scss']
})
export class KycFormComponent implements OnInit {
  id: number;

  isEdited = false;

  @Input()
  kycRelative: Array<CustomerRelative> ;
  calendarType = 'AD';

  displayEngDate = true;

  @Input()
  customer: Customer = new Customer();

  kycInfo: FormGroup;
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
    this.createRelativesArray();
    console.log(this.customer);
  }
  buildForm() {
    this.kycInfo =  this.formBuilder.group({
      customerRelatives: this.formBuilder.array([])
    });

  }


  onSubmit() {
    this.kycRelative.push(this.kycInfo.get('customerRelatives')['controls'][0].value);
    this.customer.customerRelatives = this.kycRelative;
    console.log(this.customer.customerRelatives);

    this.customerService.save(this.customer).subscribe(response => {
      this.customer = response.detail;
      console.log(response.detail.customerRelatives);
      console.log(this.customer);
      this.isEdited = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
    });
    this.editCustomer(0);
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
  editCustomer(val) {
    this.isEdited = val === 1;
  }



}

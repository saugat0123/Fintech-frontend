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
      this.kycRelative.push(res.detail.customerRelatives);
      console.log(res.detail.customerRelatives);
      this.buildForm();
      this.createRelativesArray();
      console.log(this.customer);
    });
  }
  buildForm() {
    this.kycInfo =  this.formBuilder.group({
      customerRelatives: this.formBuilder.array([])
    });

  }


  onSubmit() {
    this.kycRelative = this.kycInfo.get('customerRelatives').value;
    this.customer.customerRelatives = this.kycRelative;

    this.customerService.save(this.customer).subscribe(res => {
      console.log(res.detail.customerRelatives);
      this.kycRelative.push(res.detail.customerRelatives);
      this.customer.customerRelatives = this.kycRelative;
      console.log(this.customer);
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

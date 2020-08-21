import {Component, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {Customer} from '../../../../admin/modal/customer';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerService} from '../../../service/customer.service';
import {LoanFormService} from '../../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../../@core/utils';
import {NbDialogService} from '@nebular/theme';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-kyc-edit',
  templateUrl: './kyc-edit.component.html',
  styleUrls: ['./kyc-edit.component.scss']
})
export class KycEditComponent implements OnInit {

  id: number;

  isEdited = false;
  spinner = false;

  @Input()
  kycRelative: Array<CustomerRelative> ;
  calendarType = 'AD';

  displayEngDate = true;

  @Input()
  customer: Customer = new Customer();

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
    console.log(this.customer);
  }
  buildForm() {
    this.kycForm =  this.formBuilder.group({
      customerRelatives: this.formBuilder.array([])
    });

  }


  onSubmit() {
    console.log(this.kycForm.get('customerRelatives').value);
    this.kycRelative.push(this.kycForm.get('customerRelatives')['controls'][0].value);
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
  setRelatives(currentData) {
    const relativesData = (this.kycForm.get('customerRelatives') as FormArray);
    currentData.forEach((singleRelatives, index) => {
      const customerRelative = singleRelatives.customerRelation;
      // Increase index number with increase in static relatives---
      relativesData.push(this.formBuilder.group({
        customerRelation: [singleRelatives.customerRelation],
        customerRelativeName: [singleRelatives.customerRelativeName],
        citizenshipNumber: [singleRelatives.citizenshipNumber],
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
    this.customerService.save(this.kycForm.value).subscribe((res: any) => {
      this.customer = res.detail;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'SUCCESSFULLY UPDATED '));
      this.edited = false;
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }



}

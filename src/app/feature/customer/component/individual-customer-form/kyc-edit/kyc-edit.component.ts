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
import {CustomerRelativeService} from "../../../service/customer-relative.service";

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
      private customerRelativeService: CustomerRelativeService,
      private toastService: ToastService,
      private router: Router,
      private dialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.editCustomer(1);
    this.buildForm();
    this.setRelatives(this.customer.customerRelatives);
  }
  buildForm() {
    this.kycForm =  this.formBuilder.group({

      customerRelatives: this.formBuilder.array([])
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

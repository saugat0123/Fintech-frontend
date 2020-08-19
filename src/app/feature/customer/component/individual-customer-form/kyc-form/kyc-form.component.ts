import {Component, Input, OnInit} from '@angular/core';
import {CustomerRelative} from '../../../../admin/modal/customer-relative';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {Customer} from '../../../../admin/modal/customer';
import {LoanDataService} from '../../../../loan/service/loan-data.service';
import {CustomerService} from '../../../service/customer.service';



@Component({
  selector: 'app-kyc-form',
  templateUrl: './kyc-form.component.html',
  styleUrls: ['./kyc-form.component.scss']
})
export class KycFormComponent implements OnInit {

  @Input()
  kycRelative: Array<CustomerRelative> ;

  kycInfo: FormGroup;


  customer: Customer = new Customer();

  constructor(
      private formBuilder: FormBuilder,
      private customerService: CustomerService,
      private loanDataService: LoanDataService
  ) {
  }

  ngOnInit() {
    this.buildForm();
    this.createRelativesArray();

  }
  buildForm() {
    this.kycInfo =  this.formBuilder.group({

      customerRelatives: this.formBuilder.array([])
    });

  }


  onSubmit() {
    this.kycRelative = this.kycInfo.get('customerRelatives').value;
    console.log(this.kycRelative);

    this.customerService.saveAny(this.kycInfo.get('customerRelatives').value).subscribe((res: any) => {
      console.log(res);
    });
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

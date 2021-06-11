import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../../../@core/model/calendar-type';

@Component({
  selector: 'app-fix-deposit-receipt-security',
  templateUrl: './fix-deposit-receipt-security.component.html',
  styleUrls: ['./fix-deposit-receipt-security.component.scss']
})
export class FixDepositReceiptSecurityComponent implements OnInit {
  @Input() calendarType: CalendarType;
  fixedDepositForm: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fixedDepositForm = this.formBuilder.group({
      fixedDepositReceipt: this.formBuilder.array([this.fixedDepositFormGroup()])
    });
  }

  private fixedDepositFormGroup(): FormGroup {
    return this.formBuilder.group({
      receiptNumber: [''],
      amount: [''],
      expiryDate: undefined,
      couponRate: [''],
      beneficiary: [''],
      remarks: [''],
      accountHolderName: undefined,
      accountNumber: [undefined, Validators.required],
      tenureStartDate: undefined
    });
  }

  public addFixedDepositForm(): void {
    (this.fixedDepositForm.get('fixedDepositReceipt') as FormArray).push(this.fixedDepositFormGroup());
  }

  public removeFixedDepositForm(index: number): void {
    (this.fixedDepositForm.get('fixedDepositReceipt') as FormArray).removeAt(index);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../@core/model/calendar-type';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {
  fixedDepositForm: FormGroup;
  submitted = false;
  @Input() calendarType: CalendarType;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log('fixed deposit receipt works');
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.fixedDepositForm = this.formBuilder.group({
      fixedDepositDetails: this.formBuilder.array([this.fixedDepositFormGroup()])
    });
  }

  public removeFixedDeposit(index: number): void {
    (this.fixedDepositForm.get('fixedDepositDetails') as FormArray).removeAt(index);
  }

  public addFixedDeposit(): void {
    (this.fixedDepositForm.get('fixedDepositDetails') as FormArray).push(this.fixedDepositFormGroup());
  }

  public fixedDepositFormGroup(): FormGroup {
    return this.formBuilder.group({
      receiptNumber: [undefined],
      amount: [undefined, Validators.required],
      considerValue: [undefined, Validators.required],
      distressValue: [undefined],
      fairMarketValue: [undefined],
      expiryDate: [undefined],
      couponRate: [undefined],
      beneficiary: [undefined],
      remarks: [undefined],
      accountHolderName: [undefined],
      accountNumber: [undefined, Validators.required],
      tenureStartDate: [undefined],
    });
  }

}

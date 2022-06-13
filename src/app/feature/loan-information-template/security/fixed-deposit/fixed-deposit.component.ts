import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Security} from '../../../loan/model/security';

@Component({
  selector: 'app-fixed-deposit',
  templateUrl: './fixed-deposit.component.html',
  styleUrls: ['./fixed-deposit.component.scss']
})
export class FixedDepositComponent implements OnInit {
  fixedDepositForm: FormGroup;
  submitted = false;
  @Input() calendarType: CalendarType;
  @Input() security: Security;
  @Input() isEdit = false;


  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
    if (this.isEdit) {
      this.setFixedDeposit();
    } else {
      this.addFixedDeposit();
    }
  }

  private setFixedDeposit() {
    const formData = JSON.parse(this.security.data);
    const fixedDepositData = this.fixedDepositForm.get('fixedDepositDetails') as FormArray;
    fixedDepositData.push(
        this.formBuilder.group({
          receiptNumber: [formData.receiptNumber],
          amount: [formData.amount],
          considerValue: [formData.considerValue],
          distressValue: [formData.distressValue],
          fairMarketValue: [formData.fairMarketValue],
          expiryDate: [formData.expiryDate],
          couponRate: [formData.couponRate],
          beneficiary: [formData.beneficiary],
          remarks: [formData.remarks],
          accountHolderName: [formData.accountHolderName],
          accountNumber: [formData.accountNumber],
          tenureStartDate: [formData.tenureStartDate],
            fixedDepositFirstValuationDate: [formData.fixedDepositFirstValuationDate]
        })
    );
  }

    private buildForm(): FormGroup {
        return this.fixedDepositForm = this.formBuilder.group({
            fixedDepositDetails: this.formBuilder.array([])
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
        fixedDepositFirstValuationDate: [undefined]
    });
  }

}

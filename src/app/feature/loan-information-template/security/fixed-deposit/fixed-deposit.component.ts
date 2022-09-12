import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Security} from '../../../loan/model/security';
import {Editor} from '../../../../@core/utils/constants/editor';

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

  ckeConfig = Editor.CK_CONFIG;

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
            // considerValue: [formData.considerValue],
            distressValue: [formData.distressValue],
            fairMarketValue: [formData.fairMarketValue],
            expiryDate: [formData.expiryDate ? new Date(formData.expiryDate) : ''],
            couponRate: [formData.couponRate],
            beneficiary: [formData.beneficiary],
            remarks: [formData.remarks],
            marketValue: [formData.marketValue],
            realizableRate: [formData.realizableRate],
            realizableValue: [formData.realizableValue],
            accountHolderName: [formData.accountHolderName],
            accountNumber: [formData.accountNumber],
            tenureStartDate: [formData.tenureStartDate ? new Date(formData.tenureStartDate) : ''],
            fixedDepositFirstValuationDate: [formData.fixedDepositFirstValuationDate ? new Date(formData.fixedDepositFirstValuationDate) : '']
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
      // considerValue: [undefined, Validators.required],
      distressValue: [undefined],
      fairMarketValue: [undefined],
      marketValue: [undefined],
      realizableRate: [undefined],
      realizableValue: [undefined],
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

    calRealizable(i: number, realizableValue) {
      const value = (this.fixedDepositForm.get(['fixedDepositDetails', i, 'fairMarketValue']).value / 100) *
          this.fixedDepositForm.get(['fixedDepositDetails', i, 'realizableRate']).value;
      this.fixedDepositForm.get(['fixedDepositDetails', i, realizableValue]).patchValue(value);
    }
}

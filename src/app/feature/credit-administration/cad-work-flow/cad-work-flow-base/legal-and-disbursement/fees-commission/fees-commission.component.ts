import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-fees-commission',
  templateUrl: './fees-commission.component.html',
  styleUrls: ['./fees-commission.component.scss']
})
export class FeesCommissionComponent implements OnInit {
  @Input() cadData: CustomerApprovedLoanCadDocumentation;

  feeCommissionFormGroup: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.feeCommissionFormGroup = this.formBuilder.group({
      feeAmountDetails : this.formBuilder.array([])
    });
    this.addFeeAmountDetails();
  }

  addFeeAmountDetails () {
    this.feeAmountDetails.push(this.formBuilder.group({
      feeType: [undefined],
      feePercent: [undefined],
      feeAmount: [undefined],
    }));
  }
  get feeCommissionForm() {
    return this.feeCommissionFormGroup.controls;
  }

  get feeAmountDetails() {
    return this.feeCommissionFormGroup.get('feeAmountDetails') as FormArray;
  }

  c(v){
    console.log(this.feeAmountDetails.value);
    console.log(v);
  }

  get totalFeeAmount() {
    let t = 0;
    this.feeAmountDetails.controls.forEach(value => t += Number(value.get('feeAmount').value));
    return t;
  }

}

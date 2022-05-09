import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../loan/model/security';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-plant-machinery-adder',
  templateUrl: './plant-machinery-adder.component.html',
  styleUrls: ['./plant-machinery-adder.component.scss']
})
export class PlantMachineryAdderComponent implements OnInit {
  @Input() securities: Array<Security>;
  plantMachineryForm: FormGroup;
    limitExceed = [];
    isUsedAmount = [];
    @Input() proposedLimit: number;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    console.log(this.securities);
    console.log(this.proposedLimit);
    this.buildForm();
    if (this.securities.length > 0) {
      this.setPlantDetails(this.securities);
    }
  }

  get plantMachinery(): FormArray {
    return this.plantMachineryForm.get('plantDetails') as FormArray;
  }

  private buildForm(): FormGroup {
    return this.plantMachineryForm = this.formBuilder.group({
      plantDetails: this.formBuilder.array([]),
    });
  }

  setPlantDetails(securityData) {
    const plantDetails = this.plantMachineryForm.get('plantDetails') as FormArray;
    securityData.forEach((singleData, index) => {
      plantDetails.push(
          this.formBuilder.group({
            id: [singleData.id],
            version: [singleData.version],
            data: [singleData.data],
            fairMarketValue: [singleData.fairMarketValue],
            distressValue: [singleData.distressValue],
            considerValue: [singleData.considerValue],
            securityType: [singleData.securityType],
            coverage: [singleData.coverage],
            freeLimit: [singleData.considerValue],
            usedAmount: [singleData.usedAmount],
          })
      );
    });
  }

  public calcFreeLimit(index: number, usedAmount: number, formControlName: string): void {
      let freeLimit = 0;
      freeLimit = usedAmount;
      freeLimit -= usedAmount;
      const coverage = (usedAmount / this.proposedLimit) * 100;
      this.limitExceed[index] = freeLimit < 0;
      this.isUsedAmount[index] = false;
      this.plantMachineryForm.get([formControlName, index, 'freeLimit']).setValue(freeLimit);
      this.plantMachineryForm.get([formControlName, index, 'coverage']).setValue(coverage.toFixed(2));
  }

}

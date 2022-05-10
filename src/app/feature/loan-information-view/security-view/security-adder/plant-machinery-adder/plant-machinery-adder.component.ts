import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../loan/model/security';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityLoanReferenceService} from '../../../../security-service/security-loan-reference.service';

@Component({
  selector: 'app-plant-machinery-adder',
  templateUrl: './plant-machinery-adder.component.html',
  styleUrls: ['./plant-machinery-adder.component.scss']
})
export class PlantMachineryAdderComponent implements OnInit {
  @Input() securities: Array<Security>;
  securityForm: FormGroup;
    limitExceed = [];
    isUsedAmount = [];
    @Input() proposedLimit: number;
    toggleArray: { toggled: boolean, security: any }[] = [];
    spinner = false;
    securityPresent = [];
    securityList: Array<Security> = new Array<Security>();

  constructor(private formBuilder: FormBuilder,
              private securityLoanReferenceService: SecurityLoanReferenceService) { }

  ngOnInit() {
    this.buildForm();
    if (this.securities.length > 0) {
      this.setPlantDetails(this.securities);
      this.toggleSecurity();
    }
  }

  get securityControls(): FormArray {
    return this.securityForm.get('securityDetails') as FormArray;
  }

  private buildForm(): FormGroup {
    return this.securityForm = this.formBuilder.group({
      securityDetails: this.formBuilder.array([]),
    });
  }

  setPlantDetails(securityData) {
    const plantDetails = this.securityForm.get('securityDetails') as FormArray;
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

  public calcFreeLimit(index: number, freeLimit: number, usedAmount: number, formControlName: string): void {
      freeLimit -= usedAmount;
      const coverage = (usedAmount / this.proposedLimit) * 100;
      this.limitExceed[index] = freeLimit < 0;
      this.isUsedAmount[index] = false;
      this.securityForm.get([formControlName, index, 'freeLimit']).setValue(freeLimit);
      this.securityForm.get([formControlName, index, 'coverage']).setValue(Number(coverage.toFixed(2)));
  }

    private getSecurityDetails(id, i): void {
        this.spinner = true;
        this.securityLoanReferenceService.getAllSecurityLoanReferences(Number(id)).subscribe(res => {
            this.spinner = false;
            this.toggleArray[i].security = res.detail;
            this.securityPresent[i] = this.toggleArray[i].security.length > 0;
        }, (err) => {
            this.spinner = false;
        });
    }

    public setToggled(array): void {
        this.toggleArray = [];
        array.forEach((a, i) => {
            this.toggleArray.push({toggled: false, security: null});
            this.getSecurityDetails(a.id, i);
        });
    }

    public toggleSecurity(): void {
        this.toggleArray = [];
        if (this.securities.length > 0) {
            this.setToggled(this.securities);
        }
    }

    public tagSecurity(security: any, key, idx: number): void {
        if (security.value.usedAmount <= 0) {
            this.isUsedAmount[idx] = true;
            return;
        }
            if (this.securityList.length > 0) {
                this.securityList.splice(idx, 1);
            }
            this.securityList.push(security.value);
            console.log(this.securityList);
    }

    public removeSecurity(idx): void {
        this.securityList.splice(idx, 1);
    }

}

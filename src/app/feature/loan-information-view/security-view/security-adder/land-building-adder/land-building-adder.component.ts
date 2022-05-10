import {Component, Input, OnInit} from '@angular/core';
import {Security} from '../../../../loan/model/security';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {SecurityLoanReferenceService} from '../../../../security-service/security-loan-reference.service';

@Component({
  selector: 'app-land-building-adder',
  templateUrl: './land-building-adder.component.html',
  styleUrls: ['./land-building-adder.component.scss']
})
export class LandBuildingAdderComponent implements OnInit {
  @Input() securities: Array<Security>;
  landBuildingForm: FormGroup;
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
  }

  get plantMachinery(): FormArray {
    return this.landBuildingForm.get('plantDetails') as FormArray;
  }

  private buildForm(): FormGroup {
    return this.landBuildingForm = this.formBuilder.group({
      landBuildingDetais: this.formBuilder.array([]),
    });
  }
  setLandBuilding(securityData) {
    const plantDetails = this.landBuildingForm.get('landBuildingDetails') as FormArray;
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
}

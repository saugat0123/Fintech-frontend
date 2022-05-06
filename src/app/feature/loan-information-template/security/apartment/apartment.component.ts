import { Component, OnInit } from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {
  underConstructionChecked = false;

  apartmentForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }



  underConstruction(checkedStatus) {
    if (checkedStatus) {
      this.underConstructionChecked = true;
    } else {
      this.underConstructionChecked = false;
    }
  }

  checkedChange(event, value) {
    switch (value) {
      case 'landCross':
        if (event) {
          this.apartmentForm.get('landCrossChecked').patchValue(event);
        } else {
          this.apartmentForm.get('landCrossChecked').patchValue(event);
        }
        break;
      case 'lbCross':
        if (event) {
          this.apartmentForm.get('lbCrossChecked').patchValue(event);
        } else {
          this.apartmentForm.get('lbCrossChecked').patchValue(event);
        }
        break;
      case 'apartmentCross':
        if (event) {
          this.apartmentForm.get('apartmentCrossChecked').patchValue(event);
        } else {
          this.apartmentForm.get('apartmentCrossChecked').patchValue(event);
        }
        break;
    }
    const sec = this.apartmentForm.get(value) as FormArray;
    sec.clear();
    this.calculateTotalCross(value);
  }

  calculateTotalCross(security) {
    let totalExposure = 0;
    let totalRmValue = 0;
    let totalFMV = 0;
    const crossData = this.apartmentForm.get(security) as FormArray;
    crossData.value.forEach(cd => {
      totalExposure += cd.totalExposure;
      totalRmValue += cd.rmValue;
      totalFMV += cd.fmvApportion;
    });
    switch (security) {
      case 'landCross':
        this.apartmentForm.get('landExposureTotal').patchValue(totalExposure);
        this.apartmentForm.get('landRmValueTotal').patchValue(totalRmValue);
        this.apartmentForm.get('landFmvOfFacTotal').patchValue(totalFMV);
        break;
      case 'lbCross':
        this.apartmentForm.get('lbExposureTotal').patchValue(totalExposure);
        this.apartmentForm.get('lbRmValueTotal').patchValue(totalRmValue);
        this.apartmentForm.get('lbFmvOfFacTotal').patchValue(totalFMV);
        break;
      case 'apartmentCross':
        this.apartmentForm.get('apartmentExposureTotal').patchValue(totalExposure);
        this.apartmentForm.get('apartmentRmValueTotal').patchValue(totalRmValue);
        this.apartmentForm.get('apartmentFmvOfFacTotal').patchValue(totalFMV);
        break;
    }
  }

}

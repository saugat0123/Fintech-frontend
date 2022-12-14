import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateValidator} from '../../../../../@core/validator/date-validator';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-customer-info-nepali',
  templateUrl: './customer-info-nepali.component.html',
  styleUrls: ['./customer-info-nepali.component.scss']
})
export class CustomerInfoNepaliComponent implements OnInit {
  @Input() data: string;
  customerInfoNepali: FormGroup;
  submitted = false;
  finalData: string;

  constructor(
      private formBuilder: FormBuilder,
  ) {
  }

  get customerInfoNepaliControls() {
    return this.customerInfoNepali.controls;
  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(): void {
    this.customerInfoNepali = this.formBuilder.group({
      customerName: [undefined, Validators.required],
      dob: [undefined, [Validators.required, DateValidator.isValidBefore]],
      province: [undefined, Validators.required],
      district: [undefined, Validators.required],
      municipalities: [undefined, Validators.required],
      street: [undefined, Validators.required],
      wardNumber: [undefined, Validators.required],
      contactNumber: [undefined, Validators.required],
      citizenshipNumber: [undefined, Validators.required],
      citizenshipIssuedPlace: [undefined, Validators.required],
      citizenshipIssuedDate: [undefined, [Validators.required, DateValidator.isValidBefore]],
      occupation: [undefined, [Validators.required]],
      incomeSource: [undefined, [Validators.required]],
      customerRelatives: this.formBuilder.array([])
    });
    if (!ObjectUtil.isEmpty(this.data)) {
      const parsedData = JSON.parse(this.data);
      this.customerInfoNepali.patchValue(parsedData);
      parsedData['customerRelatives'].forEach(v => this.addRelatives(v));
    }
  }

  addRelatives(data: any | null) {
    (this.customerInfoNepaliControls.customerRelatives as FormArray).push(
        this.formBuilder.group({
          customerRelation: [
            ObjectUtil.setUndefinedIfNull(data.customerRelation),
            Validators.required
          ],
          customerRelativeName: [
            ObjectUtil.setUndefinedIfNull(data.customerRelativeName),
            Validators.compose([Validators.required])
          ],
          citizenshipNumber: [
            ObjectUtil.setUndefinedIfNull(data.citizenshipNumber),
            Validators.compose([Validators.required])
          ],
          citizenshipIssuedPlace: [
            ObjectUtil.setUndefinedIfNull(data.citizenshipIssuedPlace),
            Validators.compose([Validators.required])
          ],
          citizenshipIssuedDate: [
            ObjectUtil.setUndefinedIfNull(data.citizenshipIssuedDate),
            Validators.compose([Validators.required, DateValidator.isValidBefore])
          ]
        })
    );
  }

  removeRelatives(i) {
    (this.customerInfoNepaliControls.customerRelatives as FormArray).removeAt(i);
  }

  onSubmit(): void {
    this.finalData = JSON.stringify(this.customerInfoNepali.value);
  }

}

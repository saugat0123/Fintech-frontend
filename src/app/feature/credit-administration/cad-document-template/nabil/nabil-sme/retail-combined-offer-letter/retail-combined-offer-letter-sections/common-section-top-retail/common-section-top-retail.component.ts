import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-common-section-top-retail',
  templateUrl: './common-section-top-retail.component.html',
  styleUrls: ['./common-section-top-retail.component.scss']
})
export class CommonSectionTopRetailComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      referenceNumber: [undefined],
      sanctionLetterDate: [undefined],
      nameOfBorrower: [undefined],
      addressOfBorrower: [undefined],
    });
  }

}

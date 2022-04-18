import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section1-customer-offer-letter-type',
  templateUrl: './section1-customer-offer-letter-type.component.html',
  styleUrls: ['./section1-customer-offer-letter-type.component.scss']
})
export class Section1CustomerOfferLetterTypeComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      requestLetterDate: [undefined],
      previousSanctionLetter: [undefined],
      requestLetterDate1: [undefined],
      previousSanctionLetter1: [undefined],
      requestLetterDate2: [undefined],
      previousSanctionLetter2: [undefined],
      requestLetterDate3: [undefined],
      requestLetterDate4: [undefined],
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section18-required-security-documents',
  templateUrl: './section18-required-security-documents.component.html',
  styleUrls: ['./section18-required-security-documents.component.scss']
})
export class Section18RequiredSecurityDocumentsComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      loanAmountInFigure: [undefined],
      totalAmountInFigure: [undefined],
      remortgageDeedAmountInFigure: [undefined],
      nameOfGuarantors: [undefined],
      guaranteeAmount: [undefined],
      guaranteeAmountInWords: [undefined],
      insuranceAmount: [undefined],
    });
  }
}

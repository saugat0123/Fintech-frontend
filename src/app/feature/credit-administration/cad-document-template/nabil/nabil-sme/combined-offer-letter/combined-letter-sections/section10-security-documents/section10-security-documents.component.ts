import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-section10-security-documents',
  templateUrl: './section10-security-documents.component.html',
  styleUrls: ['./section10-security-documents.component.scss']
})
export class Section10SecurityDocumentsComponent implements OnInit {
  form: FormGroup;
  constructor(private formBuilder: FormBuilder,) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      loanAmountInFigure: [undefined],
      nameOfBranch: [undefined],
      additionalGuarantorDetails: [undefined],
      guarantorName: [undefined],
    })
  }

}

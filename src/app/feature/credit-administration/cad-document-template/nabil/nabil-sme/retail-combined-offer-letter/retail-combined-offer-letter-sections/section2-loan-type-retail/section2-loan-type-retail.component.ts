import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section2-loan-type-retail',
  templateUrl: './section2-loan-type-retail.component.html',
  styleUrls: ['./section2-loan-type-retail.component.scss']
})
export class Section2LoanTypeRetailComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({

    });
  }
}

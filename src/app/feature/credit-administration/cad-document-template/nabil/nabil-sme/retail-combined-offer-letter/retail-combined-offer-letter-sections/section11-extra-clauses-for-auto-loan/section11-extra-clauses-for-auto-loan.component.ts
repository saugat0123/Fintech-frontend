import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section11-extra-clauses-for-auto-loan',
  templateUrl: './section11-extra-clauses-for-auto-loan.component.html',
  styleUrls: ['./section11-extra-clauses-for-auto-loan.component.scss']
})
export class Section11ExtraClausesForAutoLoanComponent implements OnInit {
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

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section6-loan-limit-related-clauses',
  templateUrl: './section6-loan-limit-related-clauses.component.html',
  styleUrls: ['./section6-loan-limit-related-clauses.component.scss']
})
export class Section6LoanLimitRelatedClausesComponent implements OnInit {
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

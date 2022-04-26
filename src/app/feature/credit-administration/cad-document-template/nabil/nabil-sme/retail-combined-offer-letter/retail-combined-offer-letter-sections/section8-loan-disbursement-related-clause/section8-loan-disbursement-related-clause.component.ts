import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section8-loan-disbursement-related-clause',
  templateUrl: './section8-loan-disbursement-related-clause.component.html',
  styleUrls: ['./section8-loan-disbursement-related-clause.component.scss']
})
export class Section8LoanDisbursementRelatedClauseComponent implements OnInit {
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

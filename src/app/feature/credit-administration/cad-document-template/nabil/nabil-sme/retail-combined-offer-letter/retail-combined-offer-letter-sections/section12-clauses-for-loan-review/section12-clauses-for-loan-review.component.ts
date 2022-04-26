import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section12-clauses-for-loan-review',
  templateUrl: './section12-clauses-for-loan-review.component.html',
  styleUrls: ['./section12-clauses-for-loan-review.component.scss']
})
export class Section12ClausesForLoanReviewComponent implements OnInit {
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

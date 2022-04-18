import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section9-insurance-related-clauses',
  templateUrl: './section9-insurance-related-clauses.component.html',
  styleUrls: ['./section9-insurance-related-clauses.component.scss']
})
export class Section9InsuranceRelatedClausesComponent implements OnInit {
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

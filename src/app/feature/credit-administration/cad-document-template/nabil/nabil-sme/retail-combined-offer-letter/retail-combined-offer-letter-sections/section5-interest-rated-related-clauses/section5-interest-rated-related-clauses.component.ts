import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section5-interest-rated-related-clauses',
  templateUrl: './section5-interest-rated-related-clauses.component.html',
  styleUrls: ['./section5-interest-rated-related-clauses.component.scss']
})
export class Section5InterestRatedRelatedClausesComponent implements OnInit {
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

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section6-facilities-clause',
  templateUrl: './section6-facilities-clause.component.html',
  styleUrls: ['./section6-facilities-clause.component.scss']
})
export class Section6FacilitiesClauseComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      tenureOfOne: [undefined],
    });
  }

}

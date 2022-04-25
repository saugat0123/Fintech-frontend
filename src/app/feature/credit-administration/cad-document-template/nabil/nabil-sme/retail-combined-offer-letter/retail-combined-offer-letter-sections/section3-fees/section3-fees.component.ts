import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section3-fees',
  templateUrl: './section3-fees.component.html',
  styleUrls: ['./section3-fees.component.scss']
})
export class Section3FeesComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      PODPercentage: [undefined],
      PODPercentage2: [undefined]
    });
  }
}

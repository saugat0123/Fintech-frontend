import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section14-other-terms',
  templateUrl: './section14-other-terms.component.html',
  styleUrls: ['./section14-other-terms.component.scss']
})
export class Section14OtherTermsComponent implements OnInit {
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

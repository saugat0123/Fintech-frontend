import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-section9-other-clause',
  templateUrl: './section9-other-clause.component.html',
  styleUrls: ['./section9-other-clause.component.scss']
})
export class Section9OtherClauseComponent implements OnInit {
  form: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      freeText1: [undefined],
    });
  }

}

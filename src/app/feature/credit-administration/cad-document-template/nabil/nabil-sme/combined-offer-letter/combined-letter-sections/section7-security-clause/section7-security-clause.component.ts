import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-section7-security-clause',
  templateUrl: './section7-security-clause.component.html',
  styleUrls: ['./section7-security-clause.component.scss']
})
export class Section7SecurityClauseComponent implements OnInit {
  form: FormGroup;

  constructor(private formbuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.form = this.formbuilder.group({
      nameOfBranch: [undefined],
    })
  }

}

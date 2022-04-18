import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section19-to-section22',
  templateUrl: './section19-to-section22.component.html',
  styleUrls: ['./section19-to-section22.component.scss']
})
export class Section19ToSection22Component implements OnInit {
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

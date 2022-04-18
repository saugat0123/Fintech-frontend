import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section10-extra-charges-related-clauses',
  templateUrl: './section10-extra-charges-related-clauses.component.html',
  styleUrls: ['./section10-extra-charges-related-clauses.component.scss']
})
export class Section10ExtraChargesRelatedClausesComponent implements OnInit {
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

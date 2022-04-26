import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section13-clauses-personal-loan-and-overdraft',
  templateUrl: './section13-clauses-personal-loan-and-overdraft.component.html',
  styleUrls: ['./section13-clauses-personal-loan-and-overdraft.component.scss']
})
export class Section13ClausesPersonalLoanAndOverdraftComponent implements OnInit {
  form: FormGroup;
  constructor(
      private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    return this.form = this.formBuilder.group({
      nameOfCompany: [undefined],
      nameOfCompany1: [undefined],
      nameOfCompany2: [undefined]
    });
  }
}

import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section2-loan-type',
  templateUrl: './section2-loan-type.component.html',
  styleUrls: ['./section2-loan-type.component.scss']
})
export class Section2LoanTypeComponent implements OnInit {
  form: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}

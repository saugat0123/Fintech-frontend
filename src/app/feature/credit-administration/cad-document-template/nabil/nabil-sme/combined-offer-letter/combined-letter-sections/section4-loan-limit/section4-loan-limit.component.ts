import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section4-loan-limit',
  templateUrl: './section4-loan-limit.component.html',
  styleUrls: ['./section4-loan-limit.component.scss']
})
export class Section4LoanLimitComponent implements OnInit {
  section2: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}

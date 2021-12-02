import { Component, OnInit } from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section8-insurance-clause',
  templateUrl: './section8-insurance-clause.component.html',
  styleUrls: ['./section8-insurance-clause.component.scss']
})
export class Section8InsuranceClauseComponent implements OnInit {
  section8: FormGroup;
  constructor() { }

  ngOnInit() {
  }

}

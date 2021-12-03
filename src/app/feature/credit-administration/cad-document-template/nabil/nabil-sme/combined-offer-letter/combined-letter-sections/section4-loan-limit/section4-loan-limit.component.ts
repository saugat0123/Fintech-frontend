import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-section4-loan-limit',
  templateUrl: './section4-loan-limit.component.html',
  styleUrls: ['./section4-loan-limit.component.scss']
})
export class Section4LoanLimitComponent implements OnInit {
  section2: FormGroup;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.section2 = this.formBuilder.group({
      totalFundedLimitInFigure: [undefined],
      /*securities: this.formBuilder.array([]),
      freeTextVal : [undefined],*/
      totalFundedLimitInWords: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined],
    });
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {MawCreditRiskGrading} from '../../../model/MawCreditRiskGrading';

@Component({
  selector: 'app-maw-credit-risk-grading',
  templateUrl: './maw-credit-risk-grading.component.html',
  styleUrls: ['./maw-credit-risk-grading.component.scss']
})
export class MawCreditRiskGradingComponent implements OnInit {
  @Input() mawCreditRiskGradingData: MawCreditRiskGrading;

  constructor() { }

  ngOnInit() {
  }

}

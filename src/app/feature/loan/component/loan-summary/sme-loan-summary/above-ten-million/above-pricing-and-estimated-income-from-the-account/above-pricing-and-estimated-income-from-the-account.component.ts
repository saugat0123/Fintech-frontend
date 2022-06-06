import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
  selector: 'app-above-pricing-and-estimated-income-from-the-account',
  templateUrl: './above-pricing-and-estimated-income-from-the-account.component.html',
  styleUrls: ['./above-pricing-and-estimated-income-from-the-account.component.scss']
})
export class AbovePricingAndEstimatedIncomeFromTheAccountComponent implements OnInit {
  @Input() customerAllLoanList: LoanDataHolder[];

  constructor() { }

  ngOnInit() {
  }

}

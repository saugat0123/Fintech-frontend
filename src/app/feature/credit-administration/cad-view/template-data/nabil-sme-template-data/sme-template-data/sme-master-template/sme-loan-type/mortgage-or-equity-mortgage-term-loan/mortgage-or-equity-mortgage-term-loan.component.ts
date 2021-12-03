import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mortgage-or-equity-mortgage-term-loan',
  templateUrl: './mortgage-or-equity-mortgage-term-loan.component.html',
  styleUrls: ['./mortgage-or-equity-mortgage-term-loan.component.scss']
})
export class MortgageOrEquityMortgageTermLoanComponent implements OnInit {
  @Input() loanName;

  constructor() { }

  ngOnInit() {
  }

}

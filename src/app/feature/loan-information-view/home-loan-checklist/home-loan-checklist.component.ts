import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';

@Component({
  selector: 'app-home-loan-checklist',
  templateUrl: './home-loan-checklist.component.html',
  styleUrls: ['./home-loan-checklist.component.scss']
})
export class HomeLoanChecklistComponent implements OnInit {
  @Input() customerAllLoanList: LoanDataHolder[];

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../loan/model/loanData';

@Component({
  selector: 'app-loan-view',
  templateUrl: './loan-view.component.html',
  styleUrls: ['./loan-view.component.scss']
})
export class LoanViewComponent implements OnInit {
  @Input() customerLoan: LoanDataHolder;

  constructor() {
  }

  ngOnInit() {
  }

}

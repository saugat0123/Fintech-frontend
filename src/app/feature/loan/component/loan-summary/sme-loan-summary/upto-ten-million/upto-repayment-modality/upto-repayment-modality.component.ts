import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
  selector: 'app-upto-repayment-modality',
  templateUrl: './upto-repayment-modality.component.html',
  styleUrls: ['./upto-repayment-modality.component.scss']
})
export class UptoRepaymentModalityComponent implements OnInit {
  @Input() customerAllLoanList: LoanDataHolder[];

  constructor() { }

  ngOnInit() {
  }

}

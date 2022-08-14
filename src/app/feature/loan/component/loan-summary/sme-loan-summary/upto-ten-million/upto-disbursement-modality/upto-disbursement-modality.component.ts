import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
  selector: 'app-upto-disbursement-modality',
  templateUrl: './upto-disbursement-modality.component.html',
  styleUrls: ['./upto-disbursement-modality.component.scss']
})
export class UptoDisbursementModalityComponent implements OnInit {
  @Input() customerAllLoanList: LoanDataHolder[];

  constructor() { }

  ngOnInit() {
  }

}

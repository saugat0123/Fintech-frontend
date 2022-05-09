import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../../model/loanData';

@Component({
  selector: 'app-above-bank-sol',
  templateUrl: './above-bank-sol.component.html',
  styleUrls: ['./above-bank-sol.component.scss']
})
export class AboveBankSolComponent implements OnInit {

  @Input() loanDataHolder: LoanDataHolder;
  commonData;
  constructor() { }

  ngOnInit() {
    this.commonData = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';

@Component({
  selector: 'app-upto-ten-million',
  templateUrl: './upto-ten-million.component.html',
  styleUrls: ['./upto-ten-million.component.scss']
})
export class UptoTenMillionComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() fiscalYear;
  @Input() totalProposed;
  @Input() customerAllLoanList: LoanDataHolder[];
  // loanDataHolder: LoanDataHolder;
  constructor() { }

  ngOnInit() {
  }

}
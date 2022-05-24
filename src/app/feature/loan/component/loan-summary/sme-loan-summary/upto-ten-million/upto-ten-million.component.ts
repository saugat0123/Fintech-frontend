import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';
import {CustomerCategory} from '../../../../../customer/model/customerCategory';

@Component({
  selector: 'app-upto-ten-million',
  templateUrl: './upto-ten-million.component.html',
  styleUrls: ['./upto-ten-million.component.scss']
})
export class UptoTenMillionComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() fiscalYear;
  @Input() totalProposed;
  @Input() isDetailedView: boolean;
  @Input() customerAllLoanList: LoanDataHolder[];
  // loanDataHolder: LoanDataHolder;
  customerCategory = CustomerCategory.SME_UPTO_TEN_MILLION;
  data;
  approveAuth;
  constructor() { }

  ngOnInit() {
    this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    this.approveAuth = this.data.approvingAuthority;
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';
import {CustomerCategory} from '../../../../../customer/model/customerCategory';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';

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
  @Input() fixedAssetsData: Array<any>;
  // loanDataHolder: LoanDataHolder;
  customerCategory = CustomerCategory.SME_UPTO_TEN_MILLION;
  data;
  approveAuth;
  totalAmount;
  constructor(
      private currencyFormatterPipe: CurrencyFormatterPipe
  ) { }

  ngOnInit() {
    this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    this.approveAuth = this.data.approvingAuthority;
    this.totalAmount = this.currencyFormatterPipe.transform(this.totalProposed);
  }

}

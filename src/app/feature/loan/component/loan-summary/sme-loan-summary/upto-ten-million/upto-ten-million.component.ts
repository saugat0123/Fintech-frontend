import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {FiscalYear} from '../../../../../admin/modal/FiscalYear';
import {CustomerCategory} from '../../../../../customer/model/customerCategory';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

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
  @Input() isExecutive: boolean;
  // loanDataHolder: LoanDataHolder;
  customerCategory = CustomerCategory.SME_UPTO_TEN_MILLION;
  data;
  approveAuth;
  totalAmount;
  financialCCBL;
  constructor(
      private currencyFormatterPipe: CurrencyFormatterPipe
  ) { }

  ngOnInit() {
    this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    if (!ObjectUtil.isEmpty(this.data)) {
      this.approveAuth = this.data.approvingAuthority;
    }
    this.totalAmount = this.currencyFormatterPipe.transform(this.totalProposed);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financialCcbl)) {
      this.financialCCBL = JSON.parse(this.loanDataHolder.loanHolder.financialCcbl);
    }
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../../../model/loanData';
import {CustomerCategory} from '../../../../../customer/model/customerCategory';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {CustomerInfoData} from '../../../../model/customerInfoData';
import {CalendarType} from '../../../../../../@core/model/calendar-type';

@Component({
  selector: 'app-sana-byabasayi-saral-karja',
  templateUrl: './sana-byabasayi-saral-karja.component.html',
  styleUrls: ['./sana-byabasayi-saral-karja.component.scss']
})
export class SanaByabasayiSaralKarjaComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() customerInfo: CustomerInfoData;
  @Input() calendarType: CalendarType = CalendarType.AD;
  @Input() fiscalYear;
  @Input() totalProposed;
  @Input() isDetailedView: boolean;
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() fixedAssetsData: Array<any>;
  @Input() isExecutive: boolean;
  customerCategory;
  data;
  approveAuth;
  totalAmount;
  financialCCBL;
  zeroPointFive = false;

  constructor(
      private currencyFormatterPipe: CurrencyFormatterPipe
  ) { }

  ngOnInit() {
    this.checkCustomerCategoryForDetailView();
    this.customerCategory = this.loanDataHolder.loanHolder.customerCategory;
    this.data = JSON.parse(this.loanDataHolder.loanHolder.commonLoanData);
    if (!ObjectUtil.isEmpty(this.data)) {
      this.approveAuth = this.data.approvingAuthority;
    }
    this.totalAmount = this.currencyFormatterPipe.transform(this.totalProposed);
    if (!ObjectUtil.isEmpty(this.loanDataHolder.loanHolder.financialCcbl)) {
      this.financialCCBL = JSON.parse(this.loanDataHolder.loanHolder.financialCcbl);
    }
  }

  checkCustomerCategoryForDetailView() {
    if (this.loanDataHolder.loanHolder.customerCategory.toString() === 'AGRICULTURE_UPTO_ZERO_POINT_FIVE_MILLION') {
      this.zeroPointFive = true;
      this.isDetailedView = true;
    }
  }
}


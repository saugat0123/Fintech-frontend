import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CustomerType} from '../../model/customerType';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {CoreCapitalService} from '../../../admin/service/core-capital.service';
import {CalendarType} from '../../../../@core/model/calendar-type';
import {Customer} from '../../../admin/modal/customer';

@Component({
  selector: 'app-customer-loan-information-view',
  templateUrl: './customer-loan-information-view.component.html',
  styleUrls: ['./customer-loan-information-view.component.scss']
})
export class CustomerLoanInformationViewComponent implements OnInit {
  @Input() customerInfo: CustomerInfoData;
  @Input() customer: Customer;
  @Input() fiscalYear;

  companyInfo = new CompanyInfo();
    nbDialogRef: NbDialogRef<any>;
  customerType = CustomerType;
  nrpValue: any;
  asOnDate: any;
  spinner = false;
  isRetailCustomer = false;
  calendarType: CalendarType = CalendarType.AD;
  isAgri = false;
  category = ['AGRICULTURE_UPTO_TWO_MILLION', 'AGRICULTURE_TWO_TO_TEN_MILLION', 'AGRICULTURE_ABOVE_TEN_MILLION', 'AGRICULTURE_UPTO_ZERO_POINT_FIVE_MILLION', 'DSL_WHOLE_SALE'];

  constructor(private companyInfoService: CompanyInfoService, private toastService: ToastService,
              private modalService: NbDialogService, protected fiscalYearService: FiscalYearService,
              private coreCapitalService: CoreCapitalService) {
  }

  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.checkCustomerType();
    }
    this.coreCapitalService.getActiveBaseRate().subscribe(rs => {
      if (!ObjectUtil.isEmpty(rs.detail)) {
        this.nrpValue = rs.detail.rate;
        this.asOnDate = rs.detail.createdAt;
      }
    });
    this.getFiscalYears();
    for (const cat of this.category) {
      if (this.customerInfo.customerCategory === cat) {
        this.isAgri = true;
        break;
      }
    }
  }

  checkCustomerType() {
    if (CustomerType[this.customerInfo.customerType] === CustomerType.INSTITUTION) {
      this.isRetailCustomer = false;
      this.companyInfoService.detail(this.customerInfo.associateId).subscribe((res: any) => {
        this.companyInfo = res.detail;
      }, error => {
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      });
    } else {
      this.isRetailCustomer = true;
    }
  }

  getFiscalYears() {
    this.spinner = true;
    this.fiscalYearService.getAll().subscribe(response => {
      this.fiscalYear = response.detail;
      this.spinner = false;
    }, error => {
      console.log(error);
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Fiscal Year!'));
    });
  }

  openModel(name: TemplateRef<any>) {
    this.nbDialogRef = this.modalService.open(name, {hasScroll: true, closeOnBackdropClick: false, closeOnEsc: false});
  }

}

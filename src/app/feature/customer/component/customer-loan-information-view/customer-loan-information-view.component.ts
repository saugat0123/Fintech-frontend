import {ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, TemplateRef} from '@angular/core';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CustomerType} from '../../model/customerType';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {ToastService} from '../../../../@core/utils';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NbDialogRef, NbDialogService} from '@nebular/theme';
import {FiscalYearService} from '../../../admin/service/fiscal-year.service';
import {FiscalYear} from '../../../admin/modal/FiscalYear';

@Component({
  selector: 'app-customer-loan-information-view',
  templateUrl: './customer-loan-information-view.component.html',
  styleUrls: ['./customer-loan-information-view.component.scss']
})
export class CustomerLoanInformationViewComponent implements OnInit {
  @Input() customerInfo: CustomerInfoData | any;
  @Input() customerType: CustomerType;
  @Input() customerInfoId: number;
  @Input() fromProfile: boolean;
  companyInfo = new CompanyInfo();
  nbDialogRef: NbDialogRef<any>;
  fiscalYearArray: Array<FiscalYear>;
  @Input() isMicroCustomer: boolean;
  isIndividual = false;
  constructor(private companyInfoService: CompanyInfoService, private toastService: ToastService,
              private modalService: NbDialogService, private  fiscalYearService: FiscalYearService) {
  }


  ngOnInit() {
    if (!ObjectUtil.isEmpty(this.customerInfo)) {
      this.checkCustomerType();
    }
    if (!ObjectUtil.isEmpty(this.customerInfo.securities)) {
      this.customerInfo.securities = this.customerInfo.securities ? this.customerInfo.securities : [];
    }
    this. fiscalYearService.getAll().subscribe( res => {
      this.fiscalYearArray = res.detail;
    });
    if (this.customerType === CustomerType.INDIVIDUAL) {
      this.isIndividual = true;
    }
  }

  checkCustomerType() {
    if (CustomerType[this.customerInfo.customerType] === CustomerType.INSTITUTION) {
      this.companyInfoService.detail(this.customerInfo.associateId).subscribe((res: any) => {
        this.companyInfo = res.detail;
      }, error => {
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      });
    }
  }

  openModel(name: TemplateRef<any>) {
    this.nbDialogRef = this.modalService.open(name, {closeOnBackdropClick: false, closeOnEsc: false});
  }

}

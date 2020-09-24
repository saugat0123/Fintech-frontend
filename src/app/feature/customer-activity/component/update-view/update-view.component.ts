import {Component, Input, OnInit} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../../customer/model/customerType';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {ToastService} from '../../../../@core/utils';
import {NepseMaster} from '../../../admin/modal/NepseMaster';

@Component({
  selector: 'app-update-view',
  templateUrl: './update-view.component.html',
  styleUrls: ['./update-view.component.scss']
})
export class UpdateViewComponent implements OnInit {

  @Input() data: any;

  @Input() profile: CustomerInfoData;

  @Input() activity: string;

  unParsedData;
  shareSecurity;
  totalAmount = 0;
  shareTotalValue = 0;
  totalConsideredValue = 0;
  loanSharePercent: NepseMaster = new NepseMaster();
  loanUpdateData = {
    proposal: null,
    guarantor: {guarantorList: null},
    priority: null
  };

  companyInfo = new CompanyInfo();

  constructor(private modalService: NgbModal,
              private companyInfoService: CompanyInfoService,
              private toastService: ToastService,
  ) {
  }

  ngOnInit() {
    this.unParsedData = this.data;
    this.data = JSON.parse(this.data);
    if (this.unParsedData === '[]') {
      this.data = null;
    }
    if (this.activity === 'LOAN_UPDATE') {
      this.loanUpdateData = this.data;
      if (this.unParsedData === '{}') {
        this.data = null;
      } else if (!ObjectUtil.isEmpty(this.loanUpdateData.guarantor)) {
        this.loanUpdateData.guarantor.guarantorList = this.data.guarantor;
      }
    }

    if (this.activity === 'SHARE_SECURITY') {
      this.shareSecurity = JSON.parse(this.data.data);
      this.calculateShareTotals();
    }
    this.checkCustomerType();
  }

  close() {
    this.modalService.dismissAll();
  }

  checkCustomerType() {
    if (CustomerType[this.profile.customerType] === CustomerType.COMPANY) {
      this.companyInfoService.detail(this.profile.associateId).subscribe((res: any) => {
        this.companyInfo = res.detail;
      }, error => {
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      });
    }
  }

  calculateShareTotals() {
    const shareList = this.shareSecurity['shareSecurityDetails'];
    shareList.forEach(share => {
      this.shareTotalValue += share.total;
      this.totalConsideredValue += share.consideredValue;
    });
    this.loanSharePercent = this.shareSecurity['loanShareRate'];
  }

}

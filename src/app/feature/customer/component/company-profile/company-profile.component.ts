import { Component, OnInit } from '@angular/core';
import {CompanyInfo} from '../../../admin/modal/company-info';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../admin/service/company-info.service';
import {ToastService} from '../../../../@core/utils';
import {ActivatedRoute, Params} from '@angular/router';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {CustomerInfoService} from '../../service/customer-info.service';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit {
  companyInfo: CompanyInfo = new CompanyInfo();
  customerInfo: CustomerInfoData = new CustomerInfoData();
  customerInfoId;
  spinner = false;
  isEdited = false;

  totalProposalAmount = 0;
  totalLoanProposedAmount = 0;

  constructor(private companyInfoService: CompanyInfoService,
              private customerInfoService: CustomerInfoService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((paramObject: Params) => {
      this.customerInfoId = paramObject.id;
      this.getCompanyInfo(paramObject.companyInfoId);
      this.getCustomerInfo(this.customerInfoId);
    });
  }

  getCompanyInfo(companyInfoId) {
    this.spinner = true;
    this.companyInfoService.detail(companyInfoId).subscribe((res: any) => {
      this.companyInfo = res.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load company information!'));
      this.spinner = false;
    });
  }

  getCustomerInfo(customerInfoId) {
    this.spinner = true;
    this.customerInfoService.detail(customerInfoId).subscribe((res: any) => {
      this.customerInfo = res.detail;
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load customer information'));
      this.spinner = false;
    });
  }

  editCompany() {
  }

  public refreshCustomerInfo(): void {
    this.customerInfo = undefined;
    this.getCustomerInfo(this.customerInfoId);
  }
}

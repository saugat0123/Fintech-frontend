import {AfterContentInit, Component, OnInit, TemplateRef} from '@angular/core';
import {CompanyInfo} from '../../../../admin/modal/company-info';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {CompanyInfoService} from '../../../../admin/service/company-info.service';
import {ToastService} from '../../../../../@core/utils';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {CustomerInfoData} from '../../../../loan/model/customerInfoData';
import {CustomerInfoService} from '../../../service/customer-info.service';
import {CustomerType} from '../../../model/customerType';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {LoanConfigService} from '../../../../admin/component/loan-config/loan-config.service';
import {LoanCategory} from '../../../../loan/model/loan-category';
import {LocalStorageUtil} from '../../../../../@core/utils/local-storage-util';

@Component({
  selector: 'app-company-profile',
  templateUrl: './company-profile.component.html',
  styleUrls: ['./company-profile.component.scss']
})
export class CompanyProfileComponent implements OnInit, AfterContentInit {
  companyInfo: CompanyInfo = new CompanyInfo();
  customerInfo: CustomerInfoData = new CustomerInfoData();
  customerInfoId;
  spinner = false;
  isEdited = false;
  paramProp: any;
  applyForm = {
    loanId: undefined,
    customerProfileId: undefined
  };
  loanList = [];
  filterLoanCat = LoanCategory.BUSINESS;

  totalProposalAmount = 0;
  totalLoanProposedAmount = 0;
  maker = false;

  constructor(private companyInfoService: CompanyInfoService,
              private customerInfoService: CustomerInfoService,
              private toastService: ToastService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private modalService: NgbModal,
              private loanConfigService: LoanConfigService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((paramObject: Params) => {
      this.customerInfoId = paramObject.id;
      this.paramProp = paramObject;
      this.getCompanyInfo(this.paramProp.companyInfoId);
      this.getCustomerInfo(this.customerInfoId);
    });
    this.loanConfigService.getAllByLoanCategory(this.filterLoanCat).subscribe((response: any) => {
      this.loanList = response.detail;
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

  onClose() {
    this.modalService.dismissAll();
  }

  openLoanForm() {
    this.onClose();
    this.spinner = true;
    let loanCategory = 'BUSINESS_TYPE';
    if (CustomerType.INDIVIDUAL === CustomerType[this.paramProp.customerType]) {
      loanCategory = 'PERSONAL_TYPE';
    }
    this.router.navigate(['/home/loan/loanForm'], {
      queryParams: {
        loanId: this.applyForm.loanId,
        customerInfoId: this.paramProp.id,
        customerType: this.paramProp.customerType,
        customerProfileId: this.paramProp.companyInfoId,
        loanCategory: loanCategory
      }
    });
  }

  public refreshCustomerInfo(): void {
    this.customerInfo = undefined;
    this.getCustomerInfo(this.customerInfoId);
  }

  openSelectLoanTemplate(template: TemplateRef<any>) {
    this.modalService.open(template);
  }

  ngAfterContentInit(): void {
    const roleType = LocalStorageUtil.getStorage().roleType;
    if (roleType === 'MAKER') {
      this.maker = true;
    }
  }
}

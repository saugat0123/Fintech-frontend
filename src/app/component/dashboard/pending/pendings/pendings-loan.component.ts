import {Component, OnInit} from '@angular/core';
import {DmsLoanFile} from '../../../../feature/admin/modal/dms-loan-file';
import {User} from '../../../../feature/admin/modal/user';
import {UserService} from '../../../../@core/service/user.service';
import {LoanConfig} from '../../../../feature/admin/modal/loan-config';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';

import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {LoanConfigService} from '../../../../feature/admin/component/loan-config/loan-config.service';
import {DmsLoanService} from '../../../../feature/loan/component/loan-main-template/dms-loan-file/dms-loan-service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService} from '../../../../@core/utils';
import {DatePipe} from '@angular/common';
import {LoanFormService} from '../../../../feature/loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../../feature/loan/model/loanData';
import {DocStatus} from '../../../../feature/loan/model/docStatus';
import {BranchService} from '../../../../feature/admin/component/branch/branch.service';
import {LoanType} from '../../../../feature/loan/model/loanType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-pendings',
  templateUrl: './pendings-loan.component.html',
  styleUrls: ['./pendings-loan.component.css']
})
export class PendingsLoanComponent implements OnInit {
  dmsLoanFiles: Array<DmsLoanFile>;
  loanDataHolders: Array<LoanDataHolder>;
  loanType = LoanType;
  user: User = new User();
  search: any = {
    documentStatus: DocStatus.value(DocStatus.PENDING),
    loanConfigId: undefined,
    branchIds: undefined,
    loanNewRenew: undefined,
    customerName: undefined
  };
  filterForm: FormGroup;
  loanList: Array<LoanConfig> = new Array<LoanConfig>();
  pageable: Pageable = new Pageable();
  spinner = false;
  page = 1;
  branchList = [];
  branchFilter = true;
  isFilterCollapsed = true;
  docStatus = DocStatus;
  docStatusMakerList = [];

  constructor(
      private service: DmsLoanService,
      private userService: UserService,
      private loanConfigService: LoanConfigService,
      private loanFormService: LoanFormService,
      private branchService: BranchService,
      private router: Router,
      private toastService: ToastService,
      private route: ActivatedRoute,
      private datePipe: DatePipe,
      private formBuilder: FormBuilder) {
  }


  static loadData(other: PendingsLoanComponent) {
    other.spinner = true;
    other.loanFormService.getPaginationWithSearchObject(other.search, other.page, 10).subscribe(
        (response: any) => {
          other.dmsLoanFiles = response.detail.content;
          other.loanDataHolders = response.detail.content;
          other.pageable = PaginationUtils.getPageable(response.detail);
          other.spinner = false;
        }, error => {
          console.log(error);
          other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Data!'));
          other.spinner = false;
        }
    );
  }

  ngOnInit() {

    this.search.documentStatus = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.buildFilterForm();
    this.docStatusForMaker();
    PendingsLoanComponent.loadData(this);
    this.userService.getLoggedInUser().subscribe(
        (response: any) => {
          this.user = response.detail;
        }
    );
    this.loanConfigService.getAll().subscribe(
        (response: any) => {
          this.loanList = response.detail;
        }
    );

    const roleAccess = localStorage.getItem('roleAccess');
    if (roleAccess === 'ALL') {
      this.branchService.getAll().subscribe((res: any) => {
        this.branchFilter = true;
        this.branchList = res.detail;
      });
    } else {
      this.branchService.getBranchAccessByCurrentUser().subscribe((res: any) => {
        if (roleAccess === 'OWN') {
          this.branchList = [];
          this.branchFilter = false;
        }
        this.branchList = res.detail;
      });
    }
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      branch: [undefined],
      customerName: [undefined],
      loanType: [undefined],
      loan: [undefined],
      documentStatus: [undefined]
    });
  }

  onSearch() {
    this.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined : this.filterForm.get('branch').value;
    this.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loan').value) ? undefined : this.filterForm.get('loan').value;
    this.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ? undefined :
        this.filterForm.get('loanType').value;
    this.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
        this.filterForm.get('customerName').value;
    this.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('documentStatus').value) ? undefined :
        this.filterForm.get('documentStatus').value;
    PendingsLoanComponent.loadData(this);
  }

  onClick(loanConfigId: number, customerId: number) {
    this.spinner = true;
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId
      }
    });
  }

  changePage(page: number) {
    this.page = page;
    PendingsLoanComponent.loadData(this);
  }

  getCsv() {
    this.loanFormService.download(this.search).subscribe((response: any) => {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = ApiConfig.URL + '/' + response.detail;
      link.download = ApiConfig.URL + '/' + response.detail;
      link.setAttribute('visibility', 'hidden');
      link.click();
    });
  }

  docStatusForMaker() {
    DocStatus.values().forEach((value) => {
      if (value === DocStatus.value(DocStatus.DISCUSSION) ||
          value === DocStatus.value(DocStatus.DOCUMENTATION) ||
          value === DocStatus.value(DocStatus.VALUATION) ||
          value === DocStatus.value(DocStatus.INITIAL) ||
          value === DocStatus.value(DocStatus.UNDER_REVIEW)) {
        this.docStatusMakerList.push(value);
      }
    });
  }
}

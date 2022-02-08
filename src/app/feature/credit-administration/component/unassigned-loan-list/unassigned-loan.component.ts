import {Component, OnInit} from '@angular/core';
import {CreditAdministrationService} from '../../service/credit-administration.service';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {NgxSpinnerService} from 'ngx-spinner';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {LoanType} from '../../../loan/model/loanType';
import {NbDialogService, NbToastrService} from '@nebular/theme';
import {AssignPopUpComponent} from '../assign-pop-up/assign-pop-up.component';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {RouterUtilsService} from '../../utils/router-utils.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {Router} from '@angular/router';
import {User} from '../../../admin/modal/user';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {Role} from '../../../admin/modal/role';
import {RoleType} from '../../../admin/modal/roleType';
import {ProductUtils} from '../../../admin/service/product-mode.service';

@Component({
  selector: 'app-unassigned-loan',
  templateUrl: './unassigned-loan.component.html',
  styleUrls: ['./unassigned-loan.component.scss']
})
export class UnassignedLoanComponent implements OnInit {
  searchObj = {};
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  loanList = [];
  loanType = LoanType;
  toggleArray: { toggled: boolean }[] = [];
  storage = LocalStorageUtil.getStorage();
  roleType = RoleType;
  cadData;
  productUtils = LocalStorageUtil.getStorage().productUtil;
  constructor(private service: CreditAdministrationService,
              private spinnerService: NgxSpinnerService,
              private nbModalService: NbDialogService,
              private modalService: NgbModal,
              public routerUtils: RouterUtilsService,
              private toastService: NbToastrService,
              private routerService: Router) {
  }

  static loadData(other: UnassignedLoanComponent) {
    other.spinner = true;
    other.toggleArray = [];
    other.loanList = [];
    other.service.getPaginationWithSearchObject(other.searchObj, other.page, PaginationUtils.PAGE_SIZE).subscribe((res: any) => {
      other.loanList = res.detail.content;
      other.pageable = PaginationUtils.getPageable(res.detail);
      other.loanList.forEach(() => other.toggleArray.push({toggled: false}));
      other.spinner = false;

    }, error => {
      console.log('error unassigned component::', error);
      other.spinner = false;
    });
  }

  ngOnInit() {
    UnassignedLoanComponent.loadData(this);
  }

  changePage(page: number) {
    this.page = page;
    UnassignedLoanComponent.loadData(this);
  }

  openAssignPopUp(data: CustomerApprovedLoanCadDocumentation) {
    const comp = this.modalService.open(AssignPopUpComponent);
    comp.componentInstance.cadData = data;
  }

  setSearchValue(value) {
    this.searchObj = value;
    UnassignedLoanComponent.loadData(this);
  }


  public getTotal(key: string, loanList: LoanDataHolder[]): number {
    return this.isNumber(loanList
    .map(l => (l.proposal.proposedLimit))
    .reduce((a, b) => a + b, 0));

  }

  isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }

  openPopUp(template, data) {
    this.cadData = data;
    this.modalService.open(template, {
      size: 'xl',
      windowClass: 'on-pull-click full-width modal'
    });
  }
  onClose() {
    this.modalService.dismissAll();
  }
  pullLoan(data) {
    console.log(data);
    const user = new User();
    user.id = +LocalStorageUtil.getStorage().userId;
    const role = new Role();
    role.id = +LocalStorageUtil.getStorage().roleId;
    this.spinnerService.show();
    const obj = {
      customerLoanDtoList: data.customerLoanDtoList,
      toUser: user ,
      toRole: role,
      docAction: 'PULLED',
      comment: 'Pulled To Own Bucket',
      loanHolderId: data.id,
      cadId: ObjectUtil.isEmpty(data.cadId) ? undefined : data.cadId
    };
    this.service.assignLoanToUser(obj).subscribe(res => {
      this.spinnerService.hide();
      this.toastService.success('Successfully Pulled Loan');
      this.modalService.dismissAll();
      this.routerService.navigateByUrl('/home/credit/offer-pending');
    }, err => {
      this.spinnerService.hide();
      this.modalService.dismissAll();
      this.toastService.danger('Something Went Wrong');
    });
  }

}

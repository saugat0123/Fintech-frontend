import {Component, OnInit} from '@angular/core';
import {BranchService} from '../branch/branch.service';
import {Branch} from '../../modal/branch';
import {LoanConfig} from '../../modal/loan-config';
import {LoanConfigService} from '../loan-config/loan-config.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {Pageable} from '../../../../@core/service/baseservice/common-pageable';
import {PaginationUtils} from '../../../../@core/utils/PaginationUtils';
import {DocStatus} from '../../../loan/model/docStatus';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {RoleAccess} from '../../modal/role-access';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Role} from '../../modal/role';
import {RoleService} from '../role-permission/role.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {UserService} from '../user/user.service';
import {LoanActionService} from '../../../loan/loan-action/service/loan-action.service';
import {LoanType} from '../../../loan/model/loanType';
import {RoleType} from '../../modal/roleType';
import {ApiConfig} from '../../../../@core/utils/api/ApiConfig';
import {DocAction} from '../../../loan/model/docAction';
import {LoanStage} from '../../../loan/model/loanStage';
import {SocketService} from '../../../../@core/service/socket.service';
import {CatalogueSearch, CatalogueService} from './catalogue.service';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss']
})
export class CatalogueComponent implements OnInit {
  branchList: Array<Branch> = new Array<Branch>();
  loanTypeList: Array<LoanConfig> = new Array<LoanConfig>();
  loanDataHolderList: Array<LoanDataHolder> = new Array<LoanDataHolder>();
  roleList: Array<Role> = new Array<Role>();
  page = 1;
  spinner = false;
  pageable: Pageable = new Pageable();
  age: number;
  docStatus = DocStatus;
  loanType = LoanType;
  filterForm: FormGroup;
  tempLoanType = null;
  validStartDate = true;
  validEndDate = true;
  transferDoc = false;
  roleType = false;
  roleAccess: string;
  accessSpecific: boolean;
  accessAll: boolean;
  statusApproved = false;
  loanDataHolder: LoanDataHolder;
  transferUserList;
  formAction: FormGroup;
  redirected = false;
  isFilterCollapsed = true;
  isExpiryClicked = true;
  showBranch = true;
  expiryButton = 'Expiry';

  constructor(
      private branchService: BranchService,
      private loanConfigService: LoanConfigService,
      private toastService: ToastService,
      private router: Router,
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private formBuilder: FormBuilder,
      private modalService: NgbModal,
      private loanActionService: LoanActionService,
      private userService: UserService,
      private roleService: RoleService,
      private socketService: SocketService,
      private catalogueService: CatalogueService) {
  }

  static loadData(other: CatalogueComponent) {
    other.loanFormService.getCatalogues(other.catalogueService.search, other.page, 10).subscribe((response: any) => {
      other.loanDataHolderList = response.detail.content;
      other.pageable = PaginationUtils.getPageable(response.detail);
      other.spinner = false;
    }, error => {
      console.error(error);
      other.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loans!'));
      other.spinner = false;
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.redirected = paramsValue.redirect === 'true';
        });

    this.buildFilterForm();
    this.buildActionForm();

    this.roleAccess = localStorage.getItem('roleAccess');
    if (localStorage.getItem('roleType') === RoleType.MAKER) {
      this.roleType = true;
    }
    if (this.roleAccess === RoleAccess.SPECIFIC) {
      this.accessSpecific = true;
    } else if (this.roleAccess === RoleAccess.ALL) {
      this.accessAll = true;
    }
    if (this.roleAccess === RoleAccess.OWN) {
      this.showBranch = false;
    }

    if (this.accessSpecific || this.accessAll) {
      this.branchService.getBranchAccessByCurrentUser().subscribe((response: any) => {
        this.branchList = response.detail;
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Branch!'));
      });
    }
    if (this.accessAll) {
      this.roleService.getAll().subscribe(
          (response: any) => {
            this.roleList = response.detail;
            this.roleList.splice(0, 1); // removes ADMIN
          }, error => {
            console.log(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to load Roles'));
          }
      );
    }
    this.loanConfigService.getAll().subscribe((response: any) => {
      this.loanTypeList = response.detail;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });


    if (localStorage.getItem('username') === 'SPADMIN') {
      this.transferDoc = true;
    }

    if (!this.redirected) {
      // reset filter object if not redirected from other component
      const resetSearch: CatalogueSearch = new CatalogueSearch();
      resetSearch.documentStatus = DocStatus.value(DocStatus.PENDING);
      this.catalogueService.search = resetSearch;
    }
    CatalogueComponent.loadData(this);
  }

  buildFilterForm() {
    this.filterForm = this.formBuilder.group({
      branch: [undefined],
      loanType: [undefined],
      loanNewRenew: [undefined],
      docStatus: [undefined],
      startDate: [undefined],
      endDate: [undefined],
      role: [undefined],
      customerName: [undefined],
      companyName: [undefined]
    });
  }

  buildActionForm(): void {
    this.formAction = this.formBuilder.group(
        {
          loanConfigId: [undefined],
          customerLoanId: [undefined],
          toUser: [undefined],
          toRole: [undefined],
          docAction: [undefined],
          comment: [undefined, Validators.required],
          documentStatus: [undefined]
        }
    );
  }

  changePage(page: number) {
    this.page = page;
    CatalogueComponent.loadData(this);
  }

  getDifferenceInDays(createdDate: Date): number {
    const createdAt = new Date(createdDate);
    const current = new Date();
    return Math.floor((Date.UTC(current.getFullYear(), current.getMonth(), current.getDate()) -
        Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
  }

  getDaysDifference(lastModifiedDate: Date, createdDate: Date): number {
    const createdAt = new Date(createdDate);
    const lastModifiedAt = new Date(lastModifiedDate);
    return Math.floor((Date.UTC(lastModifiedAt.getFullYear(), lastModifiedAt.getMonth(), lastModifiedAt.getDate()) -
        Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate())) / (1000 * 60 * 60 * 24));
  }

  checkIfDateFiltration() {
    this.validStartDate = this.filterForm.get('startDate').valid;
    this.validEndDate = this.filterForm.get('endDate').valid;
  }

  onSearch() {
    this.tempLoanType = null;
    this.statusApproved = this.filterForm.get('docStatus').value === 'APPROVED';
    this.catalogueService.search.branchIds = ObjectUtil.isEmpty(this.filterForm.get('branch').value) ? undefined :
        this.filterForm.get('branch').value;
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          if (paramsValue.search === 'APPROVED') {
            this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                DocStatus.value(DocStatus.APPROVED) : this.filterForm.get('docStatus').value;
          } else if (paramsValue.search === 'REJECTED') {
            this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                DocStatus.value(DocStatus.REJECTED) : this.filterForm.get('docStatus').value;
          } else if (paramsValue.search === 'CLOSED') {
            this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                DocStatus.value(DocStatus.CLOSED) : this.filterForm.get('docStatus').value;
          } else {
            this.catalogueService.search.documentStatus = ObjectUtil.isEmpty(this.filterForm.get('docStatus').value) ?
                DocStatus.value(DocStatus.PENDING) : this.filterForm.get('docStatus').value;
          }
        });
    this.catalogueService.search.loanConfigId = ObjectUtil.isEmpty(this.filterForm.get('loanType').value) ?
        undefined : this.filterForm.get('loanType').value;
    this.catalogueService.search.loanNewRenew = ObjectUtil.isEmpty(this.filterForm.get('loanNewRenew').value) ? undefined :
        this.filterForm.get('loanNewRenew').value;
    if (!ObjectUtil.isEmpty(this.filterForm.get('startDate').value) && this.filterForm.get('endDate').value) {
      this.catalogueService.search.currentStageDate = JSON.stringify({
        // note: new Date().toString() is needed here to preserve timezone while JSON.stringify()
        'startDate': new Date(this.filterForm.get('startDate').value).toLocaleDateString(),
        'endDate': new Date(this.filterForm.get('endDate').value).toLocaleDateString()
      });
    }
    this.catalogueService.search.currentUserRole = ObjectUtil.isEmpty(this.filterForm.get('role').value) ? undefined :
        this.filterForm.get('role').value;
    this.catalogueService.search.customerName = ObjectUtil.isEmpty(this.filterForm.get('customerName').value) ? undefined :
        this.filterForm.get('customerName').value;
    this.catalogueService.search.companyName = ObjectUtil.isEmpty(this.filterForm.get('companyName').value) ? undefined :
        this.filterForm.get('companyName').value;
    CatalogueComponent.loadData(this);
  }

  onClick(loanConfigId: number, customerId: number) {
    this.spinner = true;
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: customerId,
        catalogue: true
      }
    });
  }

  clearSearch() {
    this.buildFilterForm();
  }

  onTransferClick(template, customerLoanId, userId) {
    this.userService.getUserListForTransfer(userId).subscribe((res: any) => {
      this.transferUserList = res.detail;
    });
    this.formAction.patchValue({
          customerLoanId: customerLoanId,
          docAction: DocAction.value(DocAction.TRANSFER),
          documentStatus: DocStatus.PENDING,
          comment: 'TRANSFER'
        }
    );
    this.modalService.open(template);
  }

  onClose() {
    this.modalService.dismissAll();
  }

  changeAction() {
    this.loanDataHolder.loanType = this.tempLoanType;
    this.loanFormService.renewLoan(this.loanDataHolder).subscribe(() => {
          this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully updated loan type.'));
          this.modalService.dismissAll('Close modal');
          this.tempLoanType = null;
          this.clearSearch();
          this.catalogueService.search.documentStatus = DocStatus.value(DocStatus.APPROVED);
          this.onSearch();
        }, error => {
          this.toastService.show(new Alert(AlertType.ERROR, 'Unable to update loan type.'));
          this.modalService.dismissAll('Close modal');
        }
    );

  }

  docTransfer(userId, roleId) {
    const users = {id: userId};
    const role = {id: roleId};
    this.formAction.patchValue({
          toUser: users,
          toRole: role
        }
    );
  }

  action(templates) {
    this.onClose();
    this.modalService.open(templates);
  }

  confirm() {
    this.onClose();
    this.loanFormService.postLoanAction(this.formAction.value).subscribe((response: any) => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Document Has been Successfully ' +
          this.formAction.get('docAction').value));
      this.sendLoanNotification(response.detail.customerLoanId);
      CatalogueComponent.loadData(this);
    }, error => {
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));

    });
  }

  onChange(data, onActionChange) {
    this.loanDataHolder = data;
    this.modalService.open(onActionChange);

  }

  renewedOrCloseFrom(loanConfigId, childId) {
    this.router.navigate(['/home/loan/summary'], {
      queryParams: {
        loanConfigId: loanConfigId,
        customerId: childId,
        catalogue: true
      }

    });


  }

  getCsv() {
    this.loanFormService.download(this.catalogueService.search).subscribe((response: any) => {
      const link = document.createElement('a');
      link.target = '_blank';
      link.href = ApiConfig.URL + '/' + response.detail;
      link.download = ApiConfig.URL + '/' + response.detail;
      link.setAttribute('visibility', 'hidden');
      link.click();

    });
  }

  sendLoanNotification(customerLoanId: number): void {
    this.loanFormService.detail(customerLoanId).subscribe((loanResponse: any) => {
      const customerLoan: LoanDataHolder = loanResponse.detail;
      // set loan stage information
      this.socketService.message.loanConfigId = customerLoan.loan.id;
      this.socketService.message.customerId = customerLoan.id;
      this.socketService.message.toUserId = customerLoan.currentStage.toUser.id;
      this.socketService.message.toRoleId = customerLoan.currentStage.toRole.id;
      this.socketService.message.fromId = customerLoan.currentStage.fromUser.id;
      this.socketService.message.fromRole = customerLoan.currentStage.fromRole.id;
      this.socketService.message.date = new Date();
      this.socketService.message.docAction = customerLoan.currentStage.docAction;

      const docAction = customerLoan.currentStage.docAction.toString();
      if (docAction === DocAction.value(DocAction.TRANSFER)) {
        // send notification to current stage user
        this.socketService.message.toId = customerLoan.currentStage.toUser.id;
        this.socketService.message.toRole = customerLoan.currentStage.toRole.id;
        this.socketService.sendMessageUsingSocket();
      }
      // send notifications to unique previous stage users
      for (const distinct of customerLoan.distinctPreviousList) {
        const distinctStage: LoanStage = distinct;

        if (customerLoan.currentStage.toUser.id !== distinctStage.toUser.id
            && customerLoan.currentStage.fromUser.id !== distinctStage.toUser.id) {
          this.socketService.message.toId = distinctStage.toUser.id;
          this.socketService.message.toRole = distinctStage.toRole.id;
          this.socketService.sendMessageUsingSocket();
        }
      }
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, error.error.message));
    });
  }


}

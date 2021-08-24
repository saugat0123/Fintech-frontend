import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Router} from '@angular/router';
import {LoanConfigService} from '../../../admin/component/loan-config/loan-config.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {CustomerInfoData} from '../../../loan/model/customerInfoData';
import {LoanType} from '../../../loan/model/loanType';
import {CombinedLoanService} from '../../../service/combined-loan.service';
import {CombinedLoan} from '../../../loan/model/combined-loan';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {CustomerType} from '../../model/customerType';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {CustomerInfoService} from '../../service/customer-info.service';
import {LoanTag} from '../../../loan/model/loanTag';
import {ApprovalRoleHierarchyComponent} from '../../../loan/approval/approval-role-hierarchy.component';
import {ProductUtils} from '../../../admin/service/product-mode.service';
import {LocalStorageUtil} from '../../../../@core/utils/local-storage-util';
import {NbDialogRef, NbDialogService} from '@nebular/theme';

@Component({
  selector: 'app-customer-loan-apply',
  templateUrl: './customer-loan-apply.component.html',
  styleUrls: ['./customer-loan-apply.component.scss']
})
export class CustomerLoanApplyComponent implements OnInit {
  @Input() customerType: CustomerType;
  @Input() paramProp;
  @Input() associateId;
  @Input() customerInfo: CustomerInfoData;
  @Input() singleOrCombine;
  spinner = false;
  applyForm = {
    loanId: undefined,
    customerProfileId: undefined
  };
  loanList = [];
  customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
  loanType = LoanType;
  combinedLoansIds: number[] = [];
  existingCombinedLoan = {
    id: undefined,
    version: undefined
  };
  removeFromCombinedLoan = false;
  loanTypeList = LoanType.value();
  selectedLoanType;
  multipleSelectedLoanType = [];
  loanTag = LoanTag;
  microLoanList = [];
  nonMicroLoanList = [];
  isMicroCustomer: boolean;
  productUtils: ProductUtils = LocalStorageUtil.getStorage().productUtil;
  canSetRoleHierarchy = false;
  private dialogRef: NbDialogRef<any>;

  constructor(
      public activeModal: NgbActiveModal,
      private router: Router,
      private loanConfigService: LoanConfigService,
      private customerLoanService: LoanFormService,
      private combinedLoanService: CombinedLoanService,
      private toastService: ToastService,
      private customerInfoService: CustomerInfoService,
      private modalService: NgbModal,
      private nbDialogService: NbDialogService
  ) {
  }

  ngOnInit() {
    this.spinner = true;
    this.isMicroCustomer = this.customerInfo.isMicroCustomer;
    this.sliceLoan();
    this.selectedLoanType = this.multipleSelectedLoanType[0]['key'];
    this.loanConfigService.getAllByLoanCategory(this.customerType).subscribe((response: any) => {
      this.spinner = false;
      this.loanList = response.detail;
      this.microLoanList = this.loanList.filter((f) => {
        return f.loanTag === 'MICRO_LOAN';
      });
      this.nonMicroLoanList = this.loanList.filter((f) => {
        return f.loanTag !== 'MICRO_LOAN';
      });
    }, error => this.spinner = false);
    this.spinner = true;
    this.customerLoanService.getInitialLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
      if (this.productUtils.LOAN_APPROVAL_HIERARCHY_LEVEL.toString() === 'LOAN') {
        let roleFlag = true;
        for (const cgl of this.customerGroupLoanList) {
          if (!ObjectUtil.isEmpty(cgl.combinedLoan)) {
            if (cgl.documentStatus.toString() !== 'DISCUSSION' &&
                cgl.documentStatus.toString() !== 'UNDER_REVIEW' &&
                cgl.documentStatus.toString() !== 'INITIAL' &&
                cgl.documentStatus.toString() !== 'PENDING') {
              roleFlag = false;
              break;
            }
          }
        }
        this.canSetRoleHierarchy = roleFlag;
      }
      this.customerGroupLoanList
      .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))
      .forEach((l) => this.combinedLoansIds.push(l.id));
      this.removeFromCombinedLoan = this.combinedLoansIds.length > 0;
      if (this.combinedLoansIds.length > 0) {
        const loan = this.customerGroupLoanList
        .filter((l) => !ObjectUtil.isEmpty(l.combinedLoan))[0];
        this.existingCombinedLoan.id = loan.combinedLoan.id;
        this.existingCombinedLoan.version = loan.combinedLoan.version;
      } else {
        this.canSetRoleHierarchy = false;
      }
      this.spinner = false;
    }, error => this.spinner = false);
  }

  openLoanForm(isCombined: boolean, removeFromCombined = false) {
    this.spinner = true;
    if (isCombined) {
      if (!removeFromCombined && this.combinedLoansIds.length < 1) {
        this.toastService.show(new Alert(AlertType.INFO, 'No loans selected'));
        this.spinner = false;
        return;
      } else if (!removeFromCombined && this.combinedLoansIds.length === 1) {
        this.toastService.show(new Alert(AlertType.INFO, 'Single loan selected'));
        this.spinner = false;
        return;
      }
      const combinedLoans: LoanDataHolder[] = this.combinedLoansIds.map((id) => {
        const loan = new LoanDataHolder();
        loan.id = id;
        return loan;
      });
      const combinedLoan: CombinedLoan = {
        id: this.existingCombinedLoan.id,
        loans: removeFromCombined ? [] : combinedLoans,
        version: this.existingCombinedLoan.version
      };
      this.spinner = true;
      this.combinedLoanService.save(combinedLoan).subscribe(() => {
        this.activeModal.close(true);
        this.spinner = false;
        const msg = `Successfully ${removeFromCombined ? 'removed' : 'saved'} combined loan`;
        this.toastService.show(new Alert(AlertType.SUCCESS, msg));
      }, error => {
        console.error(error);
        this.spinner = false;
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save combined loan'));
      });
    } else {
      this.activeModal.dismiss();
      this.loanConfigService.detail(this.applyForm.loanId).subscribe(res => {
        const loanConfig: LoanConfig = res.detail;
        if (ObjectUtil.isEmpty(loanConfig.loanTag)) {
          this.toastService.show(new Alert(AlertType.INFO, 'Configure Loan Tag From Loan Configuration'));
          return;
        } else if (!((loanConfig.loanTag === LoanTag.getKeyByValue(LoanTag.FIXED_DEPOSIT)) ||
            (loanConfig.loanTag === LoanTag.getKeyByValue(LoanTag.SHARE_SECURITY) ||
                (loanConfig.loanTag === LoanTag.getKeyByValue(LoanTag.VEHICLE))))) {
          this.routeToLoanForm();

        }
        this.customerInfoService.detail(this.paramProp.customerInfoId).subscribe(customerInfoResponse => {
              const customerInfo: CustomerInfoData = customerInfoResponse.detail;
              const securityData = customerInfo.security ? JSON.parse(customerInfo.security.data) : undefined;
              if (!ObjectUtil.isEmpty(securityData)) {
                switch (loanConfig.loanTag) {
                  case LoanTag.getKeyByValue(LoanTag.SHARE_SECURITY) :
                    if (!securityData.selectedArray.includes('ShareSecurity')) {
                      this.toastService.show(new Alert(AlertType.INFO, 'Fill Share Security for Share Loan'));
                    } else {
                      this.routeToLoanForm();
                    }
                    break;
                  case LoanTag.getKeyByValue(LoanTag.FIXED_DEPOSIT) :
                    if (!securityData.selectedArray.includes('FixedDeposit')) {
                      this.toastService.show(new Alert(AlertType.INFO, 'Fill Fixed Deposit Security for Fixed Deposit Loan'));
                    } else {
                      this.routeToLoanForm();

                    }
                    break;
                  case LoanTag.getKeyByValue(LoanTag.VEHICLE) :
                    if (!securityData.selectedArray.includes('VehicleSecurity')) {
                      this.toastService.show(new Alert(AlertType.INFO, 'Fill Vehicle Security for Vehicle Loan'));
                    } else {
                      this.routeToLoanForm();

                    }
                    break;
                }
              } else {
                this.toastService.show(new Alert(AlertType.INFO, 'Security is Empty'));
                return;
              }
            }
        );
      });
    }
  }

  routeToLoanForm() {
    this.router.navigate(['/home/loan/loanForm'], {
      queryParams: {
        loanId: this.applyForm.loanId,
        customerInfoId: this.paramProp.customerInfoId,
        customerType: this.paramProp.customerType,
        customerProfileId: this.associateId,
        loanCategory: this.customerType,
        loanType: this.selectedLoanType
      }
    });

  }

  updateCombinedList(id: number, checked: boolean) {
    if (this.combinedLoansIds.includes(id) && !checked) {
      const index = this.combinedLoansIds.findIndex((d) => d === id);
      this.combinedLoansIds.splice(index, 1);
    } else if (!this.combinedLoansIds.includes(id) && checked) {
      this.combinedLoansIds.push(id);
    }
  }

  sliceLoan() {
    this.loanTypeList.forEach((val) => {
      if (val.key === 'CLOSURE_LOAN' || val.key === 'PARTIAL_SETTLEMENT_LOAN' || val.key === 'FULL_SETTLEMENT_LOAN') {
        return true;
      }
      this.multipleSelectedLoanType.push(val);

    });
  }

  openUnCombineConfirmationModal(confirmUnCombine) {
    this.modalService.open(confirmUnCombine);
  }

  close() {
    this.modalService.dismissAll();
  }

  SetRoleHierarchy() {
    let context;
    context = {
      approvalType: 'COMBINED_LOAN',
      refId: this.existingCombinedLoan.id,
      isRoleModal: true,
    };
    this.dialogRef = this.nbDialogService.open(ApprovalRoleHierarchyComponent, {
      context,
    }); /* .onClose.subscribe((res: any) => {
      this.activatedRoute.queryParams.subscribe((r) => {
        this.loanConfigId = r.loanConfigId;
        this.customerId = r.customerId;
      });*/
      /*this.router.navigateByUrl(RouteConst.ROUTE_DASHBOARD).then(value => {
        if (value) {
          this.router.navigate(['/home/loan/summary'],
              {
                queryParams: {
                  loanConfigId: this.loanConfigId,
                  customerId: this.customerId,
                }
              });
        }
      });*/
    /*});*/
  }
}

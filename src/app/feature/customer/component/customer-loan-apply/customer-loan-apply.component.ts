import {Component, Input, OnInit} from '@angular/core';
import {LoanCategory} from '../../../loan/model/loan-category';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
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

@Component({
  selector: 'app-customer-loan-apply',
  templateUrl: './customer-loan-apply.component.html',
  styleUrls: ['./customer-loan-apply.component.scss']
})
export class CustomerLoanApplyComponent implements OnInit {
  @Input() loanCategory: LoanCategory;
  @Input() paramProp;
  @Input() associateId;
  @Input() customerInfo: CustomerInfoData;
  spinner = false;
  applyForm = {
    loanId: undefined,
    customerProfileId: undefined
  };
  loanList = [];
  customerGroupLoanList: Array<LoanDataHolder> = Array<LoanDataHolder>();
  loanType = LoanType;
  combinedLoansIds: number[] = [];

  constructor(
      public activeModal: NgbActiveModal,
      private router: Router,
      private loanConfigService: LoanConfigService,
      private customerLoanService: LoanFormService,
      private combinedLoanService: CombinedLoanService,
      private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.loanConfigService.getAllByLoanCategory(this.loanCategory).subscribe((response: any) => {
      this.loanList = response.detail;
    });
    this.customerLoanService.getInitialLoansByLoanHolderId(this.customerInfo.id).subscribe((res: any) => {
      this.customerGroupLoanList = res.detail;
    });
  }

  openLoanForm(isCombined: boolean) {
    this.spinner = true;
    if (isCombined) {
      if (this.combinedLoansIds.length < 1) {
        this.toastService.show(new Alert(AlertType.INFO, 'No loans selected'));
        this.spinner = false;
        return;
      }
      const combinedLoans: LoanDataHolder[] = this.combinedLoansIds.map((id) => {
        const loan = new LoanDataHolder();
        loan.id = id;
        return loan;
      });
      const combinedLoan: CombinedLoan = {
        loans: combinedLoans,
      };
      this.combinedLoanService.save(combinedLoan).subscribe(() => {
        this.activeModal.close();
        this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully saved combined loan'));
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to save combined loan'));
      });
    } else {
      this.activeModal.dismiss();
      this.router.navigate(['/home/loan/loanForm'], {
        queryParams: {
          loanId: this.applyForm.loanId,
          customerInfoId: this.paramProp.customerInfoId,
          customerType: this.paramProp.customerType,
          customerProfileId: this.associateId,
          loanCategory: this.loanCategory
        }
      });
    }
  }

  updateCombinedList(id: number, checked: boolean) {
    if (this.combinedLoansIds.includes(id) && !checked) {
      const index = this.combinedLoansIds.findIndex((d) => d === id);
      this.combinedLoansIds.splice(index, 1);
    } else if (!this.combinedLoansIds.includes(id) && checked) {
      this.combinedLoansIds.push(id);
    }
  }
}

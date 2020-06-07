import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CustomerLoanFlagService} from '../../service/customer-loan-flag.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFlag} from '../../../../@core/model/enum/loan-flag.enum';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';

@Component({
  selector: 'app-update-loan-dashboard',
  templateUrl: './update-loan-dashboard.component.html',
  styleUrls: ['./update-loan-dashboard.component.scss']
})
export class UpdateLoanDashboardComponent implements OnInit {
  public UPDATES = {
    INSURANCE: {
      name: 'Insurance Updates',
      path: '/home/update-loan/insurance'
    }
  };
  public updatesRequired: {
    title: string,
    componentPath: string,
    updateExisting: boolean,
    description: string,
    loan: LoanDataHolder
  }[] = [];
  private search = {
    customerLoanId: null
  };
  public customerLoanId: number;
  public updateAction: string = null;
  public customerLoan: LoanDataHolder;

  constructor(
      private activatedRoute: ActivatedRoute,
      private customerLoanFlagService: CustomerLoanFlagService,
      private toastService: ToastService,
      private loanFormService: LoanFormService,
      private router: Router
  ) {
  }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(v => {
      if (!v.get('id')) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Loan Information not provided!!!'));
      }

      this.customerLoanId = Number(v.get('id'));
      this.search.customerLoanId = this.customerLoanId.toString();
      this.fetchData();
    });
  }

  public addAction(): void {
    if (this.updatesRequired.map(v => v.title).includes(this.updateAction)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Already added'));
      return;
    }

    switch (this.updateAction) {
      case this.UPDATES.INSURANCE.name:
        this.updatesRequired.push({
          title: this.UPDATES.INSURANCE.name,
          componentPath: this.UPDATES.INSURANCE.path,
          updateExisting: true,
          description: 'You will override current information instead of creating new one in the record.',
          loan: this.customerLoan
        });
        break;
      default:
        this.toastService.show(new Alert(AlertType.INFO, 'Invalid Action'));
    }
  }

  private fetchData() {
    this.loanFormService.detail(this.customerLoanId).subscribe((response: any) => {
      this.customerLoan = response.detail;
      if (this.customerLoan.isCloseRenew) {
        this.toastService.show(new Alert(AlertType.INFO, 'You cannot update this loan!!!'));
        this.router.navigate(['/home/admin/catalogue']);
        return;
      }
      this.updatesRequired.length = 0;
      this.customerLoan.loanFlags.forEach(flag => {
        switch (LoanFlag[flag.flag].toString()) {
          case LoanFlag.INSURANCE_EXPIRY.toString():
            this.updatesRequired.push({
              title: this.UPDATES.INSURANCE.name,
              componentPath: this.UPDATES.INSURANCE.path,
              updateExisting: false,
              description: flag.description,
              loan: this.customerLoan
            });
        }
      });

    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load loan information'));
    });

  }
}

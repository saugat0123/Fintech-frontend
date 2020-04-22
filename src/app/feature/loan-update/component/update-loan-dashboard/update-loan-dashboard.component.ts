import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFlag} from '../../../../@core/model/enum/loan-flag.enum';

@Component({
  selector: 'app-update-loan-dashboard',
  templateUrl: './update-loan-dashboard.component.html',
  styleUrls: ['./update-loan-dashboard.component.scss']
})
export class UpdateLoanDashboardComponent implements OnInit {
  public UPDATES = {
    INSURANCE: {
      name: 'Insurance Updates',
      updatingExisting: false
    }
  };
  public updatesRequired: string[] = [];
  public updateAction: string = null;
  private customerLoan: LoanDataHolder;

  constructor(
      private activatedRoute: ActivatedRoute,
      private loanFormService: LoanFormService,
      private toastService: ToastService
  ) {
  }

  ngOnInit() {
    this.fetchData();
  }

  public addAction(): void {
    if (this.updatesRequired.includes(this.updateAction)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Already added'));
      return;
    }

    switch (this.updateAction) {
      case this.UPDATES.INSURANCE.name:
        this.UPDATES.INSURANCE.updatingExisting = true;
        this.updatesRequired.push(this.UPDATES.INSURANCE.name);
        break;
      default:
        this.toastService.show(new Alert(AlertType.INFO, 'Invalid Action'));
    }
  }

  public subscribeUpdateEmitter($event: boolean) {
    if ($event) {
      this.fetchData();
    }
  }

  private fetchData() {
    this.activatedRoute.queryParamMap.subscribe(v => {
      if (v.get('id')) {
        const customerLoanId = Number(v.get('id'));
        this.loanFormService.detail(customerLoanId).subscribe((response: any) => {
          this.customerLoan = response.detail;
          this.updatesRequired.length = 0;
          if (this.customerLoan.loanFlag.toString() === LoanFlag[LoanFlag.INSURANCE_EXPIRY]) {
            this.updatesRequired.push(this.UPDATES.INSURANCE.name);
            this.UPDATES.INSURANCE.updatingExisting = false;
          }
        });
      } else {
        this.toastService.show(new Alert(AlertType.ERROR, 'Loan Information not provided!!!'));
      }
    });
  }
}

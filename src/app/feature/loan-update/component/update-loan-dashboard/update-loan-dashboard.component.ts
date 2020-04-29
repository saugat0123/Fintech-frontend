import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {CustomerLoanFlagService} from '../../service/customer-loan-flag.service';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {LoanFlag} from '../../../../@core/model/enum/loan-flag.enum';
import {CustomerLoanFlag} from '../../../../@core/model/customer-loan-flag';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
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
      private loanFormService: LoanFormService
  ) {
  }

  ngOnInit() {
    this.fetchData();
  }

  public addAction(): void {
    if (this.updatesRequired.map(v => v.title).includes(this.updateAction)) {
      this.toastService.show(new Alert(AlertType.INFO, 'Already added'));
      return;
    }

    if (ObjectUtil.isEmpty(this.customerLoan)) {
      this.loanFormService.detail(this.customerLoanId).subscribe(async (response: any) => {
        this.customerLoan = response.detail;
        this.addDropdowns();
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load loan information'));
      });
    } else {
      this.addDropdowns();
    }
  }

  private addDropdowns(): void {
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
    this.activatedRoute.queryParamMap.subscribe(v => {
      if (!v.get('id')) {
        this.toastService.show(new Alert(AlertType.ERROR, 'Loan Information not provided!!!'));
      }

      this.customerLoanId = Number(v.get('id'));
      this.search.customerLoanId = this.customerLoanId.toString();
      this.customerLoanFlagService.getAllWithSearch(this.search)
      .subscribe((response: any) => {
        const loanFlags: CustomerLoanFlag[] = response.detail;
        this.updatesRequired.length = 0;
        loanFlags.forEach(flag => {
          switch (LoanFlag[flag.flag].toString()) {
            case LoanFlag.INSURANCE_EXPIRY.toString():
              this.updatesRequired.push({
                title: this.UPDATES.INSURANCE.name,
                componentPath: this.UPDATES.INSURANCE.path,
                updateExisting: false,
                description: flag.description,
                loan: flag.customerLoan
              });
          }
        });
      }, error => {
        console.error(error);
        this.toastService.show(new Alert(AlertType.ERROR, 'Failed to load flags'));
      });
    });
  }
}

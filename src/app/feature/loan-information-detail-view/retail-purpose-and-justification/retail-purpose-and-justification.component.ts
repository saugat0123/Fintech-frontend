import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Validators} from '@angular/forms';
import {MinimumAmountValidator} from '../../../@core/validator/minimum-amount-validator';
import {Alert, AlertType} from '../../../@theme/model/Alert';
import {LoanConfigService} from '../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../@core/utils';

@Component({
  selector: 'app-retail-purpose-and-justification',
  templateUrl: './retail-purpose-and-justification.component.html',
  styleUrls: ['./retail-purpose-and-justification.component.scss']
})
export class RetailPurposeAndJustificationComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Input() financialData: any;
  @Input() loanIds;
  isHomeLoan = false;
  constructor(private loanConfigService: LoanConfigService,
              private toastService: ToastService) { }

  ngOnInit() {
    /*this.loanConfigService.detail(this.loanId).subscribe((response: any) => {
      this.isHomeLoan = response.detail.loanTag === 'HOME_LOAN';
      // this.checkLoanConfig();
    } , error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
    });*/
  }

}

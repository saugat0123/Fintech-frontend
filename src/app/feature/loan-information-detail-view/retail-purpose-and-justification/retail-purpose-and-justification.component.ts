import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {Proposal} from '../../admin/modal/proposal';
import {ActivatedRoute, Params} from '@angular/router';
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
  @Input() proposalData: Proposal;
  @Input() loanIds;
  isHomeLoan = false;
  allId: Params;
  loanId: number;
  constructor(private loanConfigService: LoanConfigService,
              private activatedRoute: ActivatedRoute,
              private toastService: ToastService) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(
        (paramsValue: Params) => {
          this.allId = {
            loanId: null,
            customerId: null,
            loanCategory: null
          };
          this.allId = paramsValue;
          this.loanId = this.allId.loanId ? this.allId.loanId : this.loanIds;
          this.loanConfigService.detail(this.loanId).subscribe((response: any) => {
            this.isHomeLoan = response.detail.loanTag === 'HOME_LOAN';
            // this.checkLoanConfig();
          }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
          });
        });
  }
}

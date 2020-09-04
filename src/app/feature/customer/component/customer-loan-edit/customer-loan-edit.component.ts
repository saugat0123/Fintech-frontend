import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProposalComponent} from '../../../loan-information-template/proposal/proposal.component';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {CustomerLoanDocumentComponent} from '../../../loan-information-template/customer-loan-document/customer-loan-document.component';
import {ReportingInfoTaggingComponent} from '../../../reporting/component/reporting-info-tagging/reporting-info-tagging.component';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';

@Component({
  selector: 'app-customer-loan-edit',
  templateUrl: './customer-loan-edit.component.html',
  styleUrls: ['./customer-loan-edit.component.scss']
})
export class CustomerLoanEditComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Output() refreshData = new EventEmitter<boolean>();
  spinner;

  @ViewChild('proposal', {static: false})
  proposal: ProposalComponent;

  @ViewChild('customerLoanDoc', {static: false})
  customerLoanDoc: CustomerLoanDocumentComponent;

  @ViewChild('reportingInfoTagging', {static: false})
  reportingInfoTagging: ReportingInfoTaggingComponent;

  constructor(      private loanFormService: LoanFormService,
                    private toastService: ToastService
  ) {
  }

  ngOnInit() {
  }
  onSubmit() {
    this.proposal.submitted = true;
    if (this.proposal.proposalForm.invalid) {
      return true;
    }
    this.spinner = true;
    this.proposal.onSubmit();
    this.loanDataHolder.proposal = this.proposal.proposalData;
    this.loanDataHolder.customerDocument = this.customerLoanDoc.customerDocumentArray;
    this.reportingInfoTagging.onSubmit();
    this.loanDataHolder.reportingInfoLevels = this.reportingInfoTagging.finalReportingInfoLevels;
    this.loanFormService.save(this.loanDataHolder).subscribe((response: any) => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Successfully Updated Loan Info'));
      this.refreshData.emit(true);
    }, res => {
      this.spinner = false;
      this.toastService.show(new Alert(AlertType.ERROR, res.error.message));

    });

  }
}

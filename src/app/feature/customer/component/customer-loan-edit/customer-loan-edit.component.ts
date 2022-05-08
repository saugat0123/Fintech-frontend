import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ProposalComponent} from '../../../loan-information-template/proposal/proposal.component';
import {LoanFormService} from '../../../loan/component/loan-form/service/loan-form.service';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {CustomerLoanDocumentComponent} from '../../../loan-information-template/customer-loan-document/customer-loan-document.component';
import {ReportingInfoTaggingComponent} from '../../../reporting/component/reporting-info-tagging/reporting-info-tagging.component';
import {ToastService} from '../../../../@core/utils';
import {Alert, AlertType} from '../../../../@theme/model/Alert';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DocStatus} from '../../../loan/model/docStatus';
import {ScrollNavigationService} from '../../../../@core/service/baseservice/scroll-navigation.service';

@Component({
  selector: 'app-customer-loan-edit',
  templateUrl: './customer-loan-edit.component.html',
  styleUrls: ['./customer-loan-edit.component.scss']
})
export class CustomerLoanEditComponent implements OnInit {
  @Input() loanDataHolder: LoanDataHolder;
  @Output() refreshData = new EventEmitter<boolean>();
  spinner;
  docStatusForm: FormGroup;
  docStatusMakerList = [];
  showDocStatusDropDown = true;

  @ViewChild('proposal', {static: false})
  proposal: ProposalComponent;

  @ViewChild('customerLoanDoc', {static: false})
  customerLoanDoc: CustomerLoanDocumentComponent;

  @ViewChild('reportingInfoTagging', {static: false})
  reportingInfoTagging: ReportingInfoTaggingComponent;

  constructor(private loanFormService: LoanFormService,
              private toastService: ToastService,
              private formBuilder: FormBuilder,
              private scrollNavService: ScrollNavigationService,
  ) {
  }

  ngOnInit() {
    this.docStatusForMaker();
    this.buildDocStatusForm();
    if (this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.DISCUSSION) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.DOCUMENTATION) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.VALUATION) ||
        this.loanDataHolder.documentStatus.toString() === DocStatus.value(DocStatus.UNDER_REVIEW)) {
      this.showDocStatusDropDown = true;
    } else {
      this.showDocStatusDropDown = false;
    }
    this.docStatusForm.get('documentStatus').patchValue(this.loanDataHolder.documentStatus);

  }

  docStatusForMaker() {
    DocStatus.values().forEach((value) => {
      if (value === DocStatus.value(DocStatus.DISCUSSION) ||
          value === DocStatus.value(DocStatus.DOCUMENTATION) ||
          value === DocStatus.value(DocStatus.VALUATION) ||
          value === DocStatus.value(DocStatus.UNDER_REVIEW)) {
        this.docStatusMakerList.push(value);
      }
    });
  }

  buildDocStatusForm() {
    this.docStatusForm = this.formBuilder.group({
      documentStatus: [undefined, Validators.required]
    });
  }

  onSubmit() {
    this.loanDataHolder.documentStatus = this.docStatusForm.get('documentStatus').value;
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

import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Proposal} from '../../admin/modal/proposal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../@core/utils';
import {Alert, AlertType} from '../../../@theme/model/Alert';

@Component({
  selector: 'app-outstanding-update',
  templateUrl: './outstanding-update.component.html',
  styleUrls: ['./outstanding-update.component.scss']
})
export class OutstandingUpdateComponent implements OnInit {
  approvedLoans = [];
  @Input() customerAllLoanList: LoanDataHolder[];
  @Input() loanType;
  proposalForm: FormGroup;
  proposalData: Proposal = new Proposal();
  outstandingLimit;
  customerInfoId: number;
  companyInfoId: number;
  spinner=false;
  constructor(
      private activatedRoute: ActivatedRoute,
      private customerLoanService: LoanFormService,
      private toastService: ToastService,
      private loanFormService: LoanFormService,
      private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.spinner=true;
    this.buildForm();
    this.activatedRoute.queryParams.subscribe((res) => {
      this.spinner=false;
      this.customerInfoId = res.customerInfoId;
      this.getApprovedLoans(this.customerInfoId);
    });
  }

  getApprovedLoans(id) {
    this.spinner=true;
    this.customerLoanService.getFinalLoanListByLoanHolderId(id).subscribe((response: any) => {
      this.approvedLoans = response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
      this.spinner=false;
    }, err => {
      this.spinner=false;
    });
  }

  private buildForm(): FormGroup {
    return this.proposalForm = this.formBuilder.group({
      outstandingLimit: [undefined]
    });
  }

  public getTotal(key: string): number {
    const tempList = this.customerAllLoanList
        .filter(l => JSON.parse(l.proposal.data)[key]);
    const total = tempList
        .map(l => JSON.parse(l.proposal.data)[key])
        .reduce((a, b) => a + b, 0);
    return this.isNumber(total);
  }
  isNumber(value) {
    if (ObjectUtil.isEmpty(value)) {
      return 0;
    }
    if (Number.isNaN(value)) {
      return 0;
    } else {
      return value;
    }

  }
  updateOutstandingLimit(loan, value) {
    loan.proposal.outStandingLimit = value;
    loan.version = loan.version + 1;
    this.spinner=true;
    this.loanFormService.updateProposalById(loan).subscribe((response: any) => {
      this.spinner=false;
      const outStandingLimit = response.detail.outStandingLimit;
      this.getApprovedLoans(this.customerInfoId);
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Updated Successfully'));
    }, err => {
      this.spinner=false;
    });
  }


}

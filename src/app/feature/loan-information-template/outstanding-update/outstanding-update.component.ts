import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LoanFormService} from '../../loan/component/loan-form/service/loan-form.service';
import {DocStatus} from '../../loan/model/docStatus';
import {LoanDataHolder} from '../../loan/model/loanData';
import {ObjectUtil} from '../../../@core/utils/ObjectUtil';
import {Proposal} from '../../admin/modal/proposal';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ToastService} from '../../../@core/utils';

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
  constructor(
      private activatedRoute: ActivatedRoute,
      private customerLoanService: LoanFormService,
      private toastService: ToastService,
      private loanFormService: LoanFormService,
      private formBuilder: FormBuilder

  ) { }

  ngOnInit() {
    this.buildForm();
    this.activatedRoute.queryParams.subscribe((res) => {
      console.log(res);
      this.customerLoanService.getFinalLoanListByLoanHolderId(res.customerInfoId).subscribe((response: any) => {
        this.approvedLoans = response.detail.filter((l) => l.documentStatus === DocStatus[DocStatus.APPROVED]);
        console.log(this.approvedLoans);
      });
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
    console.log('fieldValuefieldValuefieldValue: ', value);
    console.log('loan', loan);
    loan.proposal.outStandingLimit = value;
    loan.version = loan.version + 1;
    this.loanFormService.updateProposalById(loan).subscribe((response: any) => {
      console.log('response: ', response);
      const outStandingLimit = response.detail.outStandingLimit;
      console.log('outStandingLimit: ', outStandingLimit);
      // this.proposalForm.get('outstandingLimit').setValue(outStandingLimit);
    }, err => {
      console.log('could not update loan: ', err);
    });


  }


}

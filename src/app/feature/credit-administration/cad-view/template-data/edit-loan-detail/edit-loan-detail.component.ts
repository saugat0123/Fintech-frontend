import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LoanConfig} from '../../../../admin/modal/loan-config';
import {ToastService} from '../../../../../@core/utils';
import {CadOneformService} from '../../../service/cad-oneform.service';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';
import {Alert, AlertType} from '../../../../../@theme/model/Alert';
import {ObjectUtil} from '../../../../../@core/utils/ObjectUtil';
import {Proposal} from '../../../../admin/modal/proposal';

@Component({
  selector: 'app-edit-loan-detail',
  templateUrl: './edit-loan-detail.component.html',
  styleUrls: ['./edit-loan-detail.component.scss']
})
export class EditLoanDetailComponent implements OnInit {
  form: FormGroup;
  @Input() data;
  spinner = false;
  loanTag: string;
  proposal: Proposal;
  loan: LoanConfig;
  proposedLimit: any;

  constructor(
      private formBuilder: FormBuilder,
      private toastService: ToastService,
      private cadOneFormService: CadOneformService,
      private engToNepaliNumberPipe: EngToNepaliNumberPipe,
      private currencyFormatterPipe: CurrencyFormatterPipe,
      private nbDialogRef: NbDialogRef<EditLoanDetailComponent>
  ) {
  }

  ngOnInit() {
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.data)) {
      const assignedLoan = this.data.assignedLoan[0];
      this.loan = assignedLoan.loan;
      this.proposal = assignedLoan.proposal;
      this.form.get('proposedLimit').patchValue(this.proposal.proposedLimit);
      this.showProposedLimitInNep();
    }
  }

  public close(): void {
    this.nbDialogRef.close();
  }

  private buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
      proposedLimit: [undefined],
    });
  }


  public updateLoanDetail(): void {
    this.spinner = true;
    this.proposal.proposedLimit = this.form.get('proposedLimit').value;
    this.cadOneFormService.updateProposalById(this.proposal.id, this.proposal).subscribe(res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan updated successfully'));
      this.nbDialogRef.close();
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to update loan loan!!'));
      this.spinner = false;
    });
  }

  public showProposedLimitInNep(): void {
    const proposedLimit  = this.form.get('proposedLimit').value;
    if (!ObjectUtil.isEmpty(proposedLimit)) {
      this.proposedLimit = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(proposedLimit.toString()));
    }
  }
}

import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
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
  updateFlag = false;

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
      this.data.assignedLoan.forEach((val, i) => {
      this.addProposalLimit();
      this.patchValue(val, i);
      });
    }
  }

  public close(): void {
    this.nbDialogRef.close();
  }

  private buildForm(): FormGroup {
    return this.form = this.formBuilder.group({
      assignedLoanDetails: this.formBuilder.array([]),
    });
  }
  addProposalLimit() {
    (this.form.get('assignedLoanDetails') as FormArray).push(this.proposedLimitField());
  }
  proposedLimitField() {
    return this.formBuilder.group({
      loanName: [undefined],
      proposedLimit: [undefined]
    });
  }

  public updateLoanDetail(): void {
    this.spinner = true;
    const assignedLoanDetails = [];
    this.data.assignedLoan.forEach((val: any, i: any) => {
      const tempProposalModel: Proposal = new Proposal();
      tempProposalModel.id = val.proposal.id;
      tempProposalModel.version = val.proposal.version;
      tempProposalModel.proposedLimit = this.form.get(['assignedLoanDetails', i, 'proposedLimit']).value;
      assignedLoanDetails.push(tempProposalModel);
    });
    this.cadOneFormService.updateAllLoanProposal(assignedLoanDetails).subscribe(res => {
      this.toastService.show(new Alert(AlertType.SUCCESS, 'Loan updated successfully'));
      this.nbDialogRef.close();
      this.spinner = false;
    }, error => {
      console.error(error);
      this.toastService.show(new Alert(AlertType.ERROR, 'Unable to update loan loan!!'));
      this.spinner = false;
    });
  }

  patchValue(val, i) {
    this.form.get(['assignedLoanDetails', i, 'loanName']).patchValue(val ? val.loan.name : '');
    this.form.get(['assignedLoanDetails', i, 'proposedLimit']).patchValue(val ? val.proposal.proposedLimit : '');
  }
  setProposedLimit(val) {
    const tempProposedLimit = this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(val.toString()));
    return tempProposedLimit ? tempProposedLimit : '';
  }
}

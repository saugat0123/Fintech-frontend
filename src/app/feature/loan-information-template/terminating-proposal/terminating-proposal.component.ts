import {Component, Input, OnInit} from '@angular/core';
import {LoanDataHolder} from '../../loan/model/loanData';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-terminating-proposal',
  templateUrl: './terminating-proposal.component.html',
  styleUrls: ['./terminating-proposal.component.scss']
})
export class TerminatingProposalComponent implements OnInit {

  @Input() loanDataHolder: LoanDataHolder;

  constructor(private formBuilder: FormBuilder) {
  }

  approvedProposalForm: FormGroup;

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    console.log('this is build approved proposal data', JSON.parse(this.loanDataHolder.approvedProposalData));
    this.approvedProposalForm = this.formBuilder.group(JSON.parse(this.loanDataHolder.approvedProposalData));
    console.log('this is build form', this.approvedProposalForm.value);
  }

}

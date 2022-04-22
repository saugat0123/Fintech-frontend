import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-share-loan-demand-template-data',
  templateUrl: './share-loan-demand-template-data.component.html',
  styleUrls: ['./share-loan-demand-template-data.component.scss']
})
export class ShareLoanDemandTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  shareLoanDemandCombinedForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.shareLoanDemandCombinedForm = this.formBuilder.group({
      shareLoanDemandCombinedFormArray: this.formBuilder.array([])
    });
  }

}

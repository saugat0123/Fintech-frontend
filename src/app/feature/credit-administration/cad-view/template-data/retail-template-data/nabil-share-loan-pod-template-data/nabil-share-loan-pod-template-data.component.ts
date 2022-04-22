import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
  selector: 'app-nabil-share-loan-pod-template-data',
  templateUrl: './nabil-share-loan-pod-template-data.component.html',
  styleUrls: ['./nabil-share-loan-pod-template-data.component.scss']
})
export class NabilShareLoanPodTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  @Input() globalBaseRate;
  nabilShareLoanPODForm: FormGroup;
  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.buildForm();
  }
  buildForm() {
    this.nabilShareLoanPODForm = this.formBuilder.group({
      nabilShareLoanPODFormArray: this.formBuilder.array([])
    });
  }

}

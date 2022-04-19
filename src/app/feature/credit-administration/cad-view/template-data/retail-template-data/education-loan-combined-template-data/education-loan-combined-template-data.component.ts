import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-education-loan-combined-template-data',
  templateUrl: './education-loan-combined-template-data.component.html',
  styleUrls: ['./education-loan-combined-template-data.component.scss']
})
export class EducationLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-personal-loan-combined-template-data',
  templateUrl: './personal-loan-combined-template-data.component.html',
  styleUrls: ['./personal-loan-combined-template-data.component.scss']
})
export class PersonalLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-mortgage-loan-combined-template-data',
  templateUrl: './mortgage-loan-combined-template-data.component.html',
  styleUrls: ['./mortgage-loan-combined-template-data.component.scss']
})
export class MortgageLoanCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  constructor() { }

  ngOnInit() {
  }

}

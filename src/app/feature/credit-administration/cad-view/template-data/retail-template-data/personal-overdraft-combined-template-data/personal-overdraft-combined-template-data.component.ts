import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-personal-overdraft-combined-template-data',
  templateUrl: './personal-overdraft-combined-template-data.component.html',
  styleUrls: ['./personal-overdraft-combined-template-data.component.scss']
})
export class PersonalOverdraftCombinedTemplateDataComponent implements OnInit {
  @Input() loanName;
  @Input() cadDocAssignedLoan;
  @Input() offerDocumentList;
  constructor() { }

  ngOnInit() {
  }

}

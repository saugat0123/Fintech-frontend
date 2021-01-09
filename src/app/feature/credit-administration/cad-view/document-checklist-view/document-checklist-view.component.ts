import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-document-checklist-view',
  templateUrl: './document-checklist-view.component.html',
  styleUrls: ['./document-checklist-view.component.scss']
})
export class DocumentChecklistViewComponent implements OnInit {
  @Input()
  cadOfferLetterApprovedDoc: CustomerApprovedLoanCadDocumentation;
  constructor() { }

  ngOnInit() {
  }

}

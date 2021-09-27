import { Component, OnInit, Input } from '@angular/core';
import {NabilDocumentChecklist} from "../../../../../admin/modal/nabil-document-checklist.enum";

@Component({
  selector: 'app-personal-guarantee-individual-print',
  templateUrl: './personal-guarantee-individual-print.component.html',
  styleUrls: ['./personal-guarantee-individual-print.component.scss']
})
export class PersonalGuaranteeIndividualPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;

  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-vehicle-individual-print',
  templateUrl: './letter-vehicle-individual-print.component.html',
  styleUrls: ['./letter-vehicle-individual-print.component.scss']
})
export class LetterVehicleIndividualPrintComponent implements OnInit {
  @Input() letterData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = NabilDocumentChecklist;
  constructor() { }

  ngOnInit() {
  }

}

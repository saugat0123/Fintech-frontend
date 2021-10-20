import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-letter-vehicle-thirdparty-company-print',
  templateUrl: './letter-vehicle-thirdparty-company-print.component.html',
  styleUrls: ['./letter-vehicle-thirdparty-company-print.component.scss']
})
export class LetterVehicleThirdpartyCompanyPrintComponent implements OnInit {
  @Input() letterData;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  offerLetterConst = NabilDocumentChecklist;
  constructor() { }

  ngOnInit() {
  }

}

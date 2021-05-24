import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
  selector: 'app-dp-note-guarantor-print',
  templateUrl: './dp-note-guarantor-print.component.html',
  styleUrls: ['./dp-note-guarantor-print.component.scss']
})
export class DpNoteGuarantorPrintComponent implements OnInit {
  @Input() printDocForm;

  offerLetterConst = ExcelOfferLetterConst;
  constructor() { }

  ngOnInit() {
  }

}

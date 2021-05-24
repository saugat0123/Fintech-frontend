import {Component, Input, OnInit} from '@angular/core';
import {ExcelOfferLetterConst} from '../../../../../cad-documents/cad-document-core/excel-offer-letter/excel-offer-letter-const';

@Component({
  selector: 'app-continuation-deed-print',
  templateUrl: './continuation-deed-print.component.html',
  styleUrls: ['./continuation-deed-print.component.scss']
})
export class ContinuationDeedPrintComponent implements OnInit {

  @Input() printDocForm;
  @Input() nepaliData;
  offerLetterConst = ExcelOfferLetterConst;

  constructor() {
  }

  ngOnInit() {
  }

}

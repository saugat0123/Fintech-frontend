import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-consent-for-collateral-print',
  templateUrl: './consent-for-collateral-print.component.html',
  styleUrls: ['./consent-for-collateral-print.component.scss']
})
export class ConsentForCollateralPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() {
  }

  ngOnInit() {
  }

}

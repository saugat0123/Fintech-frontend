import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-margin-call-deed-share-company-print',
  templateUrl: './margin-call-deed-share-company-print.component.html',
  styleUrls: ['./margin-call-deed-share-company-print.component.scss']
})
export class MarginCallDeedShareCompanyPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

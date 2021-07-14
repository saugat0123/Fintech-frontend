import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-agreement-icfc-print',
  templateUrl: './letter-of-agreement-icfc-print.component.html',
  styleUrls: ['./letter-of-agreement-icfc-print.component.scss']
})
export class LetterOfAgreementIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

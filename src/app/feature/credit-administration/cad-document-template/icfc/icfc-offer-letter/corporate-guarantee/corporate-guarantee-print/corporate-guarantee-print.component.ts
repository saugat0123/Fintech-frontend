import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-corporate-guarantee-print',
  templateUrl: './corporate-guarantee-print.component.html',
  styleUrls: ['./corporate-guarantee-print.component.scss']
})
export class CorporateGuaranteePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

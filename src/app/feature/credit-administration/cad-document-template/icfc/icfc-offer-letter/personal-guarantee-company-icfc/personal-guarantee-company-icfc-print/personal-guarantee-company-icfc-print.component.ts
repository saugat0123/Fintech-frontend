import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-personal-guarantee-company-icfc-print',
  templateUrl: './personal-guarantee-company-icfc-print.component.html',
  styleUrls: ['./personal-guarantee-company-icfc-print.component.scss']
})
export class PersonalGuaranteeCompanyIcfcPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

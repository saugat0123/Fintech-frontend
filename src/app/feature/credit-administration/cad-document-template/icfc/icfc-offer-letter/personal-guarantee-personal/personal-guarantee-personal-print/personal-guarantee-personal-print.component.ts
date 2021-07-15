import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-personal-guarantee-personal-print',
  templateUrl: './personal-guarantee-personal-print.component.html',
  styleUrls: ['./personal-guarantee-personal-print.component.scss']
})
export class PersonalGuaranteePersonalPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

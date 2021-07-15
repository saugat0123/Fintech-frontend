import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-personal-guarantee-personal-both-print',
  templateUrl: './personal-guarantee-personal-both-print.component.html',
  styleUrls: ['./personal-guarantee-personal-both-print.component.scss']
})
export class PersonalGuaranteePersonalBothPrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

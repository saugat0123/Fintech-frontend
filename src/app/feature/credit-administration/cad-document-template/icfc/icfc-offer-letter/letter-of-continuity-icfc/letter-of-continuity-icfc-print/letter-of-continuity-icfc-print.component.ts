import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-continuity-icfc-print',
  templateUrl: './letter-of-continuity-icfc-print.component.html',
  styleUrls: ['./letter-of-continuity-icfc-print.component.scss']
})
export class LetterOfContinuityIcfcPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

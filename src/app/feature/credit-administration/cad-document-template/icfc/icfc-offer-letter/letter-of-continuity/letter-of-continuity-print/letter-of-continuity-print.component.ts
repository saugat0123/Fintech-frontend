import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-continuity-print',
  templateUrl: './letter-of-continuity-print.component.html',
  styleUrls: ['./letter-of-continuity-print.component.scss']
})
export class LetterOfContinuityPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;
  constructor() { }

  ngOnInit() {
  }

}

import {Component, Input, OnInit} from '@angular/core';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-letter-of-set-off-print',
  templateUrl: './letter-of-set-off-print.component.html',
  styleUrls: ['./letter-of-set-off-print.component.scss']
})
export class LetterOfSetOffPrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = LegalDocumentCheckListEnum;
  constructor() { }

  ngOnInit() {
  }

}

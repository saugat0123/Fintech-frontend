import {Component, Input, OnInit} from '@angular/core';
import {NabilDocumentChecklist} from '../../../../../admin/modal/nabil-document-checklist.enum';
import {Editor} from '../../../../../../@core/utils/constants/editor';

@Component({
  selector: 'app-loan-deed-partnership-print',
  templateUrl: './loan-deed-partnership-print.component.html',
  styleUrls: ['./loan-deed-partnership-print.component.scss']
})
export class LoanDeedPartnershipPrintComponent implements OnInit {
  @Input() letterData;
  offerLetterConst = NabilDocumentChecklist;
  ckEditorConfig = Editor.CK_CONFIG;

  constructor() { }

  ngOnInit() {
  }

}

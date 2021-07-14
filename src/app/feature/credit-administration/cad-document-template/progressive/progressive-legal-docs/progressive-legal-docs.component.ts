import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {ProgressiveLegalDocConst} from './progressive-legal-doc-const';

@Component({
  selector: 'app-progressive-legal-docs',
  templateUrl: './progressive-legal-docs.component.html',
  styleUrls: ['./progressive-legal-docs.component.scss']
})
export class ProgressiveLegalDocsComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  offerLetterConst = ProgressiveLegalDocConst;

  constructor(
      private dialogRef: NbDialogRef<ProgressiveLegalDocsComponent>) {
  }

  ngOnInit() {

  }

  onClose() {
    this.dialogRef.close();
  }
}

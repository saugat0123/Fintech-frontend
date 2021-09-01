import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../progressive/progressive-offer-letter/progressive-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';
import {LaxmiOfferLetterConst} from './laxmi-offer-letter-const';

@Component({
  selector: 'app-laxmi-offer-letter',
  templateUrl: './laxmi-offer-letter.component.html',
  styleUrls: ['./laxmi-offer-letter.component.scss']
})
export class LaxmiOfferLetterComponent implements OnInit {

  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  offerLetterConst = LaxmiOfferLetterConst;

  constructor(
      private dialogRef: NbDialogRef<LaxmiOfferLetterComponent>) {
  }

  ngOnInit() {

  }

  onClose() {
    this.dialogRef.close();
  }

}

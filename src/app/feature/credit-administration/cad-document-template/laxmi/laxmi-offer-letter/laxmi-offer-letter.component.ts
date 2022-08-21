import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {LaxmiOfferLetterConst} from './laxmi-offer-letter-const';
import {LoanTag} from '../../../../loan/model/loanTag';

@Component({
  selector: 'app-laxmi-offer-letter',
  templateUrl: './laxmi-offer-letter.component.html',
  styleUrls: ['./laxmi-offer-letter.component.scss']
})
export class LaxmiOfferLetterComponent implements OnInit {

  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  @Input() isVariation = false;
  offerLetterConst = LaxmiOfferLetterConst;
  isRemitLoan = false;
  constructor(
      private dialogRef: NbDialogRef<LaxmiOfferLetterComponent>) {
  }

  ngOnInit() {
    if (this.cadOfferLetterApprovedDoc.assignedLoan[0].loan.loanTag === LoanTag.REMIT_LOAN) {
      this.isRemitLoan = true;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

}

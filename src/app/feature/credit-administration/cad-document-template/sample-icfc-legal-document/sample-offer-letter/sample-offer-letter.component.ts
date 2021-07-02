import {Component, Input, OnInit} from '@angular/core';
import {NbDialogRef} from '@nebular/theme';
import {SampleOfferLetterConst} from '../sample-offer-letter-const';

@Component({
  selector: 'app-sample-offer-letter',
  templateUrl: './sample-offer-letter.component.html',
  styleUrls: ['./sample-offer-letter.component.scss']
})
export class SampleOfferLetterComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  offerLetterConst = SampleOfferLetterConst;

  constructor(
      private dialogRef: NbDialogRef<SampleOfferLetterComponent>) { }

  ngOnInit() {
    console.log(this.offerLetterType, 'Offer Letter  type');
  }

  onClose() {
    this.dialogRef.close();
  }

}

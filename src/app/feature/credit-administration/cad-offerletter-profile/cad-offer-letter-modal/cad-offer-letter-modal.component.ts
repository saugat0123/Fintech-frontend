import {Component, Input, OnInit} from '@angular/core';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-cad-offer-letter-modal',
  templateUrl: './cad-offer-letter-modal.component.html',
  styleUrls: ['./cad-offer-letter-modal.component.scss']
})
export class CadOfferLetterModalComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  offerLetterTypeConst = MegaOfferLetterConst;

  constructor(protected dialogRef: NbDialogRef<CadOfferLetterModalComponent>,
  ) {
  }

  ngOnInit() {
    console.log(this.offerLetterTypeConst.HAYER_PURCHASE);
    console.log(this.offerLetterType === this.offerLetterTypeConst.HAYER_PURCHASE);
  }

  onClose() {
    this.dialogRef.close();
  }

}

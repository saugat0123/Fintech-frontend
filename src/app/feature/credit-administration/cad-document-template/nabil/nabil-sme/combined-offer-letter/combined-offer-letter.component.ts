import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../../../model/customerApprovedLoanCadDocumentation';
import {NabilOfferLetterConst} from '../../../../nabil-offer-letter-const';
import {NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'app-combined-offer-letter',
  templateUrl: './combined-offer-letter.component.html',
  styleUrls: ['./combined-offer-letter.component.scss']
})
export class CombinedOfferLetterComponent implements OnInit {
  @Input() customerApprovedDoc: CustomerApprovedLoanCadDocumentation;
  spinner = false;
  offerLetterConst = NabilOfferLetterConst;

  constructor(private dialogRef: NbDialogRef<CombinedOfferLetterComponent>) { }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

  submit() {}

}

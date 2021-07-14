import {Component, Input, OnInit} from '@angular/core';
import {ProgressiveOfferLetterConst} from '../../../../progressive/progressive-offer-letter/progressive-offer-letter-const';
import {IcfcOfferLetterConst} from '../../../icfc-offer-letter-const';
import {LegalDocumentCheckListEnum} from '../../../../../../admin/modal/legalDocumentCheckListEnum';

@Component({
  selector: 'app-consent-for-loan-interest-payment-print',
  templateUrl: './consent-for-loan-interest-payment-print.component.html',
  styleUrls: ['./consent-for-loan-interest-payment-print.component.scss']
})
export class ConsentForLoanInterestPaymentPrintComponent implements OnInit {
  @Input() printDocForm;
  offerLetterConst = LegalDocumentCheckListEnum;

  constructor() { }

  ngOnInit() {
  }

}

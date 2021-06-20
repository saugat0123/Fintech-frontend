import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {CadDocStatus} from '../../../../model/CadDocStatus';
import {OfferDocument} from '../../../../model/OfferDocument';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {IcfcOfferLetterConst} from '../../icfc-offer-letter-const';

@Component({
  selector: 'app-letter-of-continuity',
  templateUrl: './letter-of-continuity.component.html',
  styleUrls: ['./letter-of-continuity.component.scss']
})
export class LetterOfContinuityComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;
  letterOfContinuity: FormGroup;
  spinner: boolean;
  existingOfferLetter: false;
  offerLetterConst: IcfcOfferLetterConst;
  form: FormGroup;

  constructor() { }

  ngOnInit() {
  }
}

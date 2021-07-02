import {Component, Input, OnInit} from '@angular/core';
import {SampleOfferLetterConst} from '../../../sample-offer-letter-const';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-letter-of-continuity-sample-print',
  templateUrl: './letter-of-continuity-sample-print.component.html',
  styleUrls: ['./letter-of-continuity-sample-print.component.scss']
})
export class LetterOfContinuitySamplePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = CadCheckListTemplateEnum;

  constructor() { }

  ngOnInit() {
  }

}

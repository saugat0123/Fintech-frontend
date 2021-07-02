import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-letter-of-agreement-sample-print',
  templateUrl: './letter-of-agreement-sample-print.component.html',
  styleUrls: ['./letter-of-agreement-sample-print.component.scss']
})
export class LetterOfAgreementSamplePrintComponent implements OnInit {
  @Input() letter;
  @Input() nepaliData;
  offerLetterConst = CadCheckListTemplateEnum;

  constructor() { }

  ngOnInit() {
  }

}

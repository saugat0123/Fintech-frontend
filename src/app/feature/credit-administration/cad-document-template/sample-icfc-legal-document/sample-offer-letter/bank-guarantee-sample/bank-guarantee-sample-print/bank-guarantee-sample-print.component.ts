import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-bank-guarantee-sample-print',
  templateUrl: './bank-guarantee-sample-print.component.html',
  styleUrls: ['./bank-guarantee-sample-print.component.scss']
})
export class BankGuaranteeSamplePrintComponent implements OnInit {
  @Input() letter;
  offerLetterConst = CadCheckListTemplateEnum;

  constructor() { }

  ngOnInit() {
  }

}

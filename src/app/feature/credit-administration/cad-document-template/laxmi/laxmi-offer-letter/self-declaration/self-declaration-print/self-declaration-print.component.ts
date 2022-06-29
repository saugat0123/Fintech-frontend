import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CustomerApprovedLoanCadDocumentation} from '../../../../../model/customerApprovedLoanCadDocumentation';

@Component({
  selector: 'app-self-declaration-print',
  templateUrl: './self-declaration-print.component.html',
  styleUrls: ['./self-declaration-print.component.scss']
})
export class SelfDeclarationPrintComponent implements OnInit {

  constructor(
      public nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      public nepaliToEnglishPipe: NepaliToEngNumberPipe,
  ) { }
@Input() printDocForm;
  @Input() individual;
  cadCheckListEnum = CadCheckListTemplateEnum;
  @Input() cadData: CustomerApprovedLoanCadDocumentation;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
  }

}

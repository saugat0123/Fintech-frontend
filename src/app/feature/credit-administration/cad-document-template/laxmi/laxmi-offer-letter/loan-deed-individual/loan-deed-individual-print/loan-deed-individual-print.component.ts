import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
  selector: 'app-loan-deed-individual-print',
  templateUrl: './loan-deed-individual-print.component.html',
  styleUrls: ['./loan-deed-individual-print.component.scss']
})
export class LoanDeedIndividualPrintComponent implements OnInit {

  constructor(
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private  nepaliToEnglish: NepaliToEngNumberPipe
  ) { }
  @Input() printDocForm;
  @Input() nepaliData;
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
    this.printDocForm.amount = this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglish.transform(this.printDocForm.rupees));

  }

}

import {Component, Input, OnInit} from '@angular/core';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-loan-deed-institutional-print',
  templateUrl: './loan-deed-institutional-print.component.html',
  styleUrls: ['./loan-deed-institutional-print.component.scss']
})
export class LoanDeedInstitutionalPrintComponent implements OnInit {

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

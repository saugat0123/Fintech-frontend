import {Component, Input, OnInit} from '@angular/core';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';

@Component({
  selector: 'app-personal-guarantee-institutional-print',
  templateUrl: './personal-guarantee-institutional-print.component.html',
  styleUrls: ['./personal-guarantee-institutional-print.component.scss']
})
export class PersonalGuaranteeInstitutionalPrintComponent implements OnInit {

  @Input() printDocForm;
  constructor(
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private  nepaliToEnglish: NepaliToEngNumberPipe
  ) { }
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
    this.printDocForm.amountInWords = this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglish.transform(this.printDocForm.proposedAmount));
  }

}

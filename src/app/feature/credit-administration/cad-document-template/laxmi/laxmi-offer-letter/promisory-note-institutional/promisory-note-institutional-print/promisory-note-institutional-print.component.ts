import {Component, Input, OnInit} from '@angular/core';
import {CadCheckListTemplateEnum} from '../../../../../../admin/modal/cadCheckListTemplateEnum';
import {NepaliCurrencyWordPipe} from '../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../../@core/pipe/nepali-to-eng-number.pipe';

@Component({
  selector: 'app-promisory-note-institutional-print',
  templateUrl: './promisory-note-institutional-print.component.html',
  styleUrls: ['./promisory-note-institutional-print.component.scss']
})
export class PromisoryNoteInstitutionalPrintComponent implements OnInit {
  @Input() printDocForm;
  @Input() individual;
  @Input() cadData;
  branch;
  constructor(
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private  nepaliToEnglish: NepaliToEngNumberPipe
  ) { }
  cadCheckListEnum = CadCheckListTemplateEnum;
  ngOnInit() {
    this.printDocForm = JSON.parse(this.printDocForm);
    this.printDocForm.amountInWords = this.nepaliCurrencyWordPipe.transform(this.nepaliToEnglish.transform(this.printDocForm.proposedAmount));
    this.branch = this.cadData.assignedLoan[0].branch.nepaliName;
  }

}

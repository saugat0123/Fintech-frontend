import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {NepaliCurrencyWordPipe} from "../../../../../../../../../@core/pipe/nepali-currency-word.pipe";
import {EngToNepaliNumberPipe} from "../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe";
import {CurrencyFormatterPipe} from "../../../../../../../../../@core/pipe/currency-formatter.pipe";
import {DatePipe} from "@angular/common";
import {EngNepDatePipe} from "nepali-patro";

@Component({
  selector: 'app-customer-acceptance-for-time-letter-of-credit',
  templateUrl: './customer-acceptance-for-time-letter-of-credit.component.html',
  styleUrls: ['./customer-acceptance-for-time-letter-of-credit.component.scss']
})
export class CustomerAcceptanceForTimeLetterOfCreditComponent implements OnInit {
  timeLetterCredit: FormGroup;
  isComplimentryOtherLoan = false;
  dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
  ADExpiry = false;
  BSExpiry = false;
  isCommission1Selected = false;
  isCommission2Selected = false;

  constructor(private formBuilder: FormBuilder,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private engToNepNumberPipe: EngToNepaliNumberPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private datePipe: DatePipe,
              private engToNepDatePipe: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm(){
    this.timeLetterCredit = this.formBuilder.group({
      //form data
      complementryOther: [undefined],

      //translated data
      complementryOtherTrans: [undefined],

      //for corrected data
      complementryOtherCT: [undefined],

    })
  }

  checkComplimetryOtherLoan(data) {
    console.log('This is the data', this.isComplimentryOtherLoan);
    this.isComplimentryOtherLoan = data;
    this.timeLetterCredit.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
  }
}

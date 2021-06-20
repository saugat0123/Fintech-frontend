import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ToastService} from '../../../../../../@core/utils';

@Component({
  selector: 'app-promissory-note',
  templateUrl: './promissory-note.component.html',
  styleUrls: ['./promissory-note.component.scss']
})
export class PromissoryNoteComponent implements OnInit {
  @Input() offerLetterType;
  @Input() cadOfferLetterApprovedDoc;

  promissoryNote: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private nepToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private toastService: ToastService) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.promissoryNote = this.formBuilder.group({
      offerLetterDate: [undefined],
      amount: [undefined],
      borrowerName: [undefined],
      loanType: [undefined],
      loanAmount: [undefined],
      loanAmountWords: [undefined],
      loanReceivedDate: [undefined],
      interestRate: [undefined],
      name: [undefined],
      address: [undefined],
    });
  }

  submit() {
    console.log(this.promissoryNote.value);
  }

  convertAmountInWords(numLabel, wordLabel) {
    const wordLabelVar = this.nepToEngNumberPipe.transform(this.promissoryNote.get(numLabel).value);
    const convertedVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
    this.promissoryNote.get(wordLabel).patchValue(convertedVal);
  }

}

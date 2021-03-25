import {Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormControlDirective, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';

@Component({
  selector: 'app-custom-input',
  styleUrls: ['./custom-input.component.scss'],
  templateUrl: './custom-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CustomInputComponent),
      multi: true
    }
  ]
})
export class CustomInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild(FormControlDirective, {static: true})
  formControlDirective: FormControlDirective;
  @Input()
  formControl: FormControl;

  @Input()
  formControlName: string;
  @Input() name: string;
  @Output() Amount = new EventEmitter();

  form: FormGroup;

  constructor(
      private engToNepNumberPipe: EngToNepaliNumberPipe,
      private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
      private currencyFormatPipe: CurrencyFormatterPipe,
      private formBuilder: FormBuilder
  ) {
  }

  set value(val) {
    this.val = val;
    this.nepVal = this.nepaliCurrencyWordPipe.transform(this.val);
    this.onChange(val);
    this.onTouch(val);
  }
  val: '';
  engVal = this.val;
  nepVal = '';

  onChange: any = () => {};
  onTouch: any = () => {};

  writeValue(value: any) {
    this.value = value;
    console.log('this is writevalue');
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
    console.log('this is register on change');
  }

  registerOnTouched(fn: any) {
    this.onTouch = fn;
    console.log('this is touched');
  }

  valueChange(value: any) {
    // this.form.get(name).patchValue(this.external);
  }
  changeAmount(val) {
    this.nepVal = this.nepaliCurrencyWordPipe.transform(this.val);
    this.Amount.emit(this.nepVal);
  }

  ngOnInit(): void {
  }
}


import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';

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
    @Input() name: string;
    @Output() eventEmit = new EventEmitter();

    form: FormGroup;

    constructor(
        private engToNepNumberPipe: EngToNepaliNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private nepToEngNumberPipe: NepaliToEngNumberPipe
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
    nepVal;

    onChange: any = () => {};
    onTouch: any = () => {};

    writeValue(value: any) {
        this.value = value;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouch = fn;
    }

    changeAmount(val) {
        const val1 = this.nepToEngNumberPipe.transform(val);
        const nepVal = this.nepaliCurrencyWordPipe.transform(val1);
        const op = {
            val: val,
            nepVal: nepVal
        };
        this.eventEmit.emit(op);
    }

    ngOnInit(): void {
    }
}


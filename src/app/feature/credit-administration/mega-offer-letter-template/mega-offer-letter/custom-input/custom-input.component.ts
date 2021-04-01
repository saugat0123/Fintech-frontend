import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../@core/pipe/nepali-currency-word.pipe';
import {NepaliToEngNumberPipe} from '../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../@core/pipe/currency-formatter.pipe';

@Component({
    selector: 'app-custom-input',
    styleUrls: ['./custom-input.component.scss'],
    templateUrl: './custom-input.component.html',
})
export class CustomInputComponent implements OnInit {
    @Input() name: string;
    @Output() eventEmit = new EventEmitter();

    form: FormGroup;

    constructor(
        private engToNepNumberPipe: EngToNepaliNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private currencyFormatPipe: CurrencyFormatterPipe,
    ) {
    }

    val: string;
    engVal = this.val;
    nepVal;


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
        this.val = this.name;
    }
}


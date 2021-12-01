import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
    selector: 'app-import-bills-discounting',
    templateUrl: './import-bills-discounting.component.html',
    styleUrls: ['./import-bills-discounting.component.scss']
})
export class ImportBillsDiscountingComponent implements OnInit {
    @Input() loanName;
    importBillsDiscount: FormGroup;
    isComplimentryOtherLoan = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    displayField = false;

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engToNepDatePipe: EngNepDatePipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.ADExpiry = true;
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
        }
    }

    buildForm() {
        this.importBillsDiscount = this.formBuilder.group({
            loanOption: [undefined],
            complementryOther: [undefined],
            multiLoanImport: [undefined],
            loanPeriodInDays: [undefined],
            loanAmount: [undefined],
            loanAmountAmountWords: [undefined],
            marginInPercentage: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiryNepali: [undefined],
            dateOfExpiry: [undefined],

            /* FOR TRANSLATION FIELDS */
            loanOptionTrans: [undefined],
            complementryOtherTrans: [undefined],
            multiLoanImportTrans: [undefined],
            loanPeriodInDaysTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountAmountWordsTrans: [undefined],
            marginInPercentageTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            // dateOfExpiryNepaliTrans: [undefined],
            dateOfExpiryTrans: [undefined],

            /* FOR CT FIELDS */
            loanOptionCT: [undefined],
            complementryOtherCT: [undefined],
            multiLoanImportCT: [undefined],
            loanPeriodInDaysCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountAmountWordsCT: [undefined],
            marginInPercentageCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            // dateOfExpiryNepaliCT: [undefined],
            dateOfExpiryCT: [undefined],
        });
    }

    checkComplimetryOtherLoan(data) {
        this.isComplimentryOtherLoan = data;
        this.importBillsDiscount.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.importBillsDiscount.get(numLabel).value);
        this.importBillsDiscount.get(wordLabel).patchValue(transformValue);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    changeFieldValue(data) {
        this.displayField = !ObjectUtil.isEmpty(data);
    }

    translateAndSetVal() {
        // SET TRANSLATION VALUE FOR CONDITIONS:
        this.importBillsDiscount.get('loanOptionTrans').patchValue(
            this.importBillsDiscount.get('loanOption').value
        );
        const tempLoan = this.importBillsDiscount.get('loanAmount').value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoan) ?
            this.convertNumbersToNepali(tempLoan, true) : '';
        this.importBillsDiscount.get('loanAmountTrans').patchValue(convertNumber);

        this.importBillsDiscount.get('loanAmountAmountWordsTrans').patchValue(
            this.importBillsDiscount.get('loanAmountAmountWords').value
        );

        this.importBillsDiscount.get('complementryOtherTrans').patchValue(this.isComplimentryOtherLoan);
        this.importBillsDiscount.get('multiLoanImportTrans').patchValue(
            this.importBillsDiscount.get('multiLoanImport').value
        );
        const tempLoanPeriodDays = this.convertNumbersToNepali(this.importBillsDiscount.get('loanPeriodInDays').value, false);
        this.importBillsDiscount.get('loanPeriodInDaysTrans').patchValue(tempLoanPeriodDays);
        const tempMarginPercentage = this.convertNumbersToNepali(this.importBillsDiscount.get('marginInPercentage').value, false);
        this.importBillsDiscount.get('marginInPercentageTrans').patchValue(tempMarginPercentage);

        /* Converting value for date */
        this.importBillsDiscount.get('dateOfExpiryTypeTrans').patchValue(
            this.importBillsDiscount.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.importBillsDiscount.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.importBillsDiscount.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.importBillsDiscount.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.importBillsDiscount.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.importBillsDiscount.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        /* SET CT VALUE */
        this.setCTValue();
    }

    setCTValue() {
        this.importBillsDiscount.get('loanOptionCT').patchValue(
            this.importBillsDiscount.get('loanOptionTrans').value
        );
        this.importBillsDiscount.get('complementryOtherCT').patchValue(
            this.importBillsDiscount.get('complementryOtherTrans').value
        );
        this.importBillsDiscount.get('multiLoanImportCT').patchValue(
            this.importBillsDiscount.get('multiLoanImportTrans').value
        );
        this.importBillsDiscount.get('loanPeriodInDaysCT').patchValue(
            this.importBillsDiscount.get('loanPeriodInDaysTrans').value
        );
        this.importBillsDiscount.get('loanAmountCT').patchValue(
            this.importBillsDiscount.get('loanAmountTrans').value
        );
        this.importBillsDiscount.get('loanAmountAmountWordsCT').patchValue(
            this.importBillsDiscount.get('loanAmountAmountWordsTrans').value
        );
        this.importBillsDiscount.get('marginInPercentageCT').patchValue(
            this.importBillsDiscount.get('marginInPercentageTrans').value
        );
        this.importBillsDiscount.get('dateOfExpiryTypeCT').patchValue(
            this.importBillsDiscount.get('dateOfExpiryTypeTrans').value
        );
        // this.importBillsDiscount.get('dateOfExpiryNepaliCT').patchValue(
        //     this.importBillsDiscount.get('dateOfExpiryNepaliTrans').value
        // );
        this.importBillsDiscount.get('dateOfExpiryCT').patchValue(
            this.importBillsDiscount.get('dateOfExpiryTrans').value
        );
    }

    /* FOR CURRENCY FORMATTER IT TAKES PARAMETER TYPE TRUE*/
    convertNumbersToNepali(val, type: boolean) {
        let finalConvertedVal;
        if (!ObjectUtil.isEmpty(val)) {
            if (type) {
                finalConvertedVal = this.engToNepNumberPipe.transform(
                    this.currencyFormatterPipe.transform(val.toString())
                );
            } else {
                finalConvertedVal = this.engToNepNumberPipe.transform(val.toString());
            }
        }
        return finalConvertedVal;
    }
}

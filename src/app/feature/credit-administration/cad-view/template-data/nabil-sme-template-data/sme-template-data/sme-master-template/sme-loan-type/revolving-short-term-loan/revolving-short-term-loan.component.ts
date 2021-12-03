import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
    selector: 'app-revolving-short-term-loan',
    templateUrl: './revolving-short-term-loan.component.html',
    styleUrls: ['./revolving-short-term-loan.component.scss']
})
export class RevolvingShortTermLoanComponent implements OnInit {
    @Input() loanName;
    revolvingShortTermLoan: FormGroup;
    isARFinancing = false;
    isComplementaryOtherLoan = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engNepDatePipe: EngNepDatePipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.ADExpiry = true;
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
        }
    }

    buildForm() {
        this.revolvingShortTermLoan = this.formBuilder.group({
            loanOption: [undefined],
            loanRevolvingBasis: [undefined],
            complementaryOther: [undefined],
            arFinancing: [undefined],
            multiLoan: [undefined],
            loanRevolvingPeriod: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            arDays: [undefined],
            drawingPower: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiry: [undefined],
            dateOfExpiryNepali: [undefined],

            /* FOR TRANSLATION FIELDS */
            loanOptionTrans: [undefined],
            loanRevolvingBasisTrans: [undefined],
            complementaryOtherTrans: [undefined],
            multiLoanTrans: [undefined],
            arFinancingTrans: [undefined],
            loanRevolvingPeriodTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
            arDaysTrans: [undefined],
            drawingPowerTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            dateOfExpiryTrans: [undefined],

            /* FOR CT FIELDS */
            loanOptionCT: [undefined],
            loanRevolvingBasisCT: [undefined],
            complementaryOtherCT: [undefined],
            multiLoanCT: [undefined],
            arFinancingCT: [undefined],
            loanRevolvingPeriodCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
            arDaysCT: [undefined],
            drawingPowerCT: [undefined],
            baseRateCT: [undefined],
            premiumRateCT: [undefined],
            interestRateCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryCT: [undefined],
        });
    }

    checkComplimentaryOtherLoan(data) {
        this.isComplementaryOtherLoan = data;
        this.revolvingShortTermLoan.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
    }

    checkARFinancing(data) {
        this.isARFinancing = data;
        this.revolvingShortTermLoan.get('arFinancing').patchValue(this.isARFinancing);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.revolvingShortTermLoan.get(numLabel).value);
        this.revolvingShortTermLoan.get(wordLabel).patchValue(transformValue);
    }

    calInterestRate() {
        const baseRate = this.revolvingShortTermLoan.get('baseRate').value;
        const premiumRate = this.revolvingShortTermLoan.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.revolvingShortTermLoan.get('interestRate').patchValue(sum);
        // Converting value from existed pipe:
        // this.translateNumber('baseRate', 'baseRateTrans');
        // this.translateNumber('premiumRate', 'premiumRateTrans');
        // this.translateNumber('interestRate', 'interestRateTrans');
    }

    translateAndSetVal() {
        /* SET TRANSLATION VALUE FOR CONDITIONS */
        const tempLoanOption = this.revolvingShortTermLoan.get('loanOption').value;
        if (!ObjectUtil.isEmpty(tempLoanOption)) {
            this.revolvingShortTermLoan.get('loanOptionTrans').patchValue(tempLoanOption);
        }
        const tempLandRevolvingBasis = this.revolvingShortTermLoan.get('loanRevolvingBasis').value;
        if (!ObjectUtil.isEmpty(tempLandRevolvingBasis)) {
            this.revolvingShortTermLoan.get('loanRevolvingBasisTrans').patchValue(tempLandRevolvingBasis);
        }
        this.revolvingShortTermLoan.get('complementaryOther').patchValue(this.isComplementaryOtherLoan);
        const tempComplementary = this.revolvingShortTermLoan.get('complementaryOther').value;
        if (!ObjectUtil.isEmpty(tempComplementary)) {
            this.revolvingShortTermLoan.get('complementaryOtherTrans').patchValue(tempComplementary);
        }
        this.revolvingShortTermLoan.get('arFinancing').patchValue(this.isARFinancing);
        const tempArFinancing = this.revolvingShortTermLoan.get('arFinancing').value;
        if (!ObjectUtil.isEmpty(tempArFinancing)) {
            this.revolvingShortTermLoan.get('arFinancingTrans').patchValue(tempArFinancing);
        }

        /* FOR MULTI LOAN SELECTION DATA */
        this.revolvingShortTermLoan.get('multiLoanTrans').patchValue(
            this.revolvingShortTermLoan.get('multiLoan').value
        );

        /* SET REMAINING FIELDS */
        const tempLoanRevolvingPeriod = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('loanRevolvingPeriod').value, false);
        this.revolvingShortTermLoan.get('loanRevolvingPeriodTrans').patchValue(tempLoanRevolvingPeriod);

        const tempLoanAmountTrans = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('loanAmount').value, false);
        this.revolvingShortTermLoan.get('loanAmountTrans').patchValue(tempLoanAmountTrans);
        /* SET LOAN AMOUNT WORDS */
        this.revolvingShortTermLoan.get('loanAmountWordsTrans').patchValue(
            this.revolvingShortTermLoan.get('loanAmountWords').value
        );

        const convertArDays = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('arDays').value, false);
        this.revolvingShortTermLoan.get('arDaysTrans').patchValue(convertArDays);

        const convertDrawingPower = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('drawingPower').value, false);
        this.revolvingShortTermLoan.get('drawingPowerTrans').patchValue(convertDrawingPower);

        const convertBaseRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('baseRate').value, false);
        this.revolvingShortTermLoan.get('baseRateTrans').patchValue(convertBaseRate);

        const convertPremiumRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('premiumRate').value, false);
        this.revolvingShortTermLoan.get('premiumRateTrans').patchValue(convertPremiumRate);

        const convertInterestRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get('interestRate').value, false);
        this.revolvingShortTermLoan.get('interestRateTrans').patchValue(convertInterestRate);

        const dateOfExpiryType = this.revolvingShortTermLoan.get('dateOfExpiryType').value;
        let convertedDateOfExpiry;
        if (dateOfExpiryType === 'AD') {
            const tempDateOfExp = this.revolvingShortTermLoan.get('dateOfExpiry').value;
            convertedDateOfExpiry = !ObjectUtil.isEmpty(tempDateOfExp) ?
                this.engNepDatePipe.transform(tempDateOfExp, true) : '';
        } else {
            const tempDateOfExpNep = this.revolvingShortTermLoan.get('dateOfExpiryNepali').value;
            convertedDateOfExpiry = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
        }
        this.revolvingShortTermLoan.get('dateOfExpiryTypeTrans').patchValue(dateOfExpiryType);
        this.revolvingShortTermLoan.get('dateOfExpiryTrans').patchValue(convertedDateOfExpiry);
        /* FOR SETTING THE VALUE OF CT */
        this.setCTValueSave();
    }

    /* SET CT VALUE OF EACH FIELDS */
    setCTValueSave() {
        this.revolvingShortTermLoan.get('loanOptionCT').patchValue(
            this.revolvingShortTermLoan.get('loanOptionTrans').value
        );
        this.revolvingShortTermLoan.get('loanRevolvingBasisCT').patchValue(
            this.revolvingShortTermLoan.get('loanRevolvingBasisTrans').value
        );
        this.revolvingShortTermLoan.get('complementaryOtherCT').patchValue(
            this.revolvingShortTermLoan.get('complementaryOtherTrans').value
        );
        this.revolvingShortTermLoan.get('multiLoanCT').patchValue(
            this.revolvingShortTermLoan.get('multiLoanTrans').value
        );
        this.revolvingShortTermLoan.get('arFinancingCT').patchValue(
            this.revolvingShortTermLoan.get('arFinancingTrans').value
        );
        this.revolvingShortTermLoan.get('loanRevolvingPeriodCT').patchValue(
            this.revolvingShortTermLoan.get('loanRevolvingPeriodTrans').value
        );
        this.revolvingShortTermLoan.get('loanAmountCT').patchValue(
            this.revolvingShortTermLoan.get('loanAmountTrans').value
        );
        this.revolvingShortTermLoan.get('loanAmountWordsCT').patchValue(
            this.revolvingShortTermLoan.get('loanAmountWordsTrans').value
        );
        this.revolvingShortTermLoan.get('arDaysCT').patchValue(
            this.revolvingShortTermLoan.get('arDaysTrans').value
        );
        this.revolvingShortTermLoan.get('drawingPowerCT').patchValue(
            this.revolvingShortTermLoan.get('drawingPowerTrans').value
        );
        this.revolvingShortTermLoan.get('baseRateCT').patchValue(
            this.revolvingShortTermLoan.get('baseRateTrans').value
        );
        this.revolvingShortTermLoan.get('premiumRateCT').patchValue(
            this.revolvingShortTermLoan.get('premiumRateTrans').value
        );
        this.revolvingShortTermLoan.get('interestRateCT').patchValue(
            this.revolvingShortTermLoan.get('interestRateTrans').value
        );
        this.revolvingShortTermLoan.get('dateOfExpiryTypeCT').patchValue(
            this.revolvingShortTermLoan.get('dateOfExpiryTypeTrans').value
        );
        this.revolvingShortTermLoan.get('dateOfExpiryCT').patchValue(
            this.revolvingShortTermLoan.get('dateOfExpiryTrans').value
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

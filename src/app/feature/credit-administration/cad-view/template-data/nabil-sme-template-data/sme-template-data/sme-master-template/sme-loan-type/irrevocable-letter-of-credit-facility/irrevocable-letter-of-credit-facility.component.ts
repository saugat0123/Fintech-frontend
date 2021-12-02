import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
    selector: 'app-irrevocable-letter-of-credit-facility',
    templateUrl: './irrevocable-letter-of-credit-facility.component.html',
    styleUrls: ['./irrevocable-letter-of-credit-facility.component.scss']
})
export class IrrevocableLetterOfCreditFacilityComponent implements OnInit {
    @Input() loanName;
    letterOfCredit: FormGroup;
    isComplimentryOtherLoan = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    ADExpiry = false;
    BSExpiry = false;
    isCommission1Selected = false;
    isCommission2Selected = false;
    isRegularBasis = false;
    loanDetails: any = [];

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
        this.letterOfCredit = this.formBuilder.group({
            loanOption: [undefined],
            multiLoan: [undefined],
            complementryOther: [undefined],
            loanAmount: [undefined],
            loanAmountAmountWords: [undefined],
            marginInPercentage: [undefined],
            commissionType: [undefined],
            commissionRate: [undefined],
            commissionRateFirstQuarter: [undefined],
            commissionRateOtherQuarter: [undefined],
            minimumCommissionRate: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiryNepali: [undefined],
            dateOfExpiry: [undefined],
            /* FOR TRANSLATION FIELDS */
            loanOptionTrans: [undefined],
            multiLoanTrans: [undefined],
            complementryOtherTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountAmountWordsTrans: [undefined],
            marginInPercentageTrans: [undefined],
            commissionTypeTrans: [undefined],
            commissionRateTrans: [undefined],
            commissionRateFirstQuarterTrans: [undefined],
            commissionRateOtherQuarterTrans: [undefined],
            minimumCommissionRateTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            dateOfExpiryNepaliTrans: [undefined],
            dateOfExpiryTrans: [undefined],
            /*FOR CORRECTION FIELDS*/
            loanOptionCT: [undefined],
            multiLoanCT: [undefined],
            complementryOtherCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountAmountWordsCT: [undefined],
            marginInPercentageCT: [undefined],
            commissionTypeCT: [undefined],
            commissionRateCT: [undefined],
            commissionRateFirstQuarterCT: [undefined],
            commissionRateOtherQuarterCT: [undefined],
            minimumCommissionRateCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryNepaliCT: [undefined],
            dateOfExpiryCT: [undefined],
        });
    }

    checkComplimetryOtherLoan(data) {
        this.isComplimentryOtherLoan = data;
        this.letterOfCredit.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.letterOfCredit.get(numLabel).value);
        this.letterOfCredit.get(wordLabel).patchValue(transformValue);
    }

    setCommissionType(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isCommission1Selected = tempData === 'COMMISSION_TYPE_1';
        this.isCommission2Selected = tempData === 'COMMISSION_TYPE_2';
    }

    translateAndSetVal() {

        /* SET TRANS VALUE FOR CONDITIONS */
        const tempLoanOptions = this.letterOfCredit.get('loanOption').value;
        if (!ObjectUtil.isEmpty(tempLoanOptions)) {
            this.letterOfCredit.get('loanOptionTrans').patchValue('');
        }

        const tempMultiLoan = this.letterOfCredit.get('multiLoanTrans').value;
        if (!ObjectUtil.isEmpty(tempMultiLoan)) {
            this.letterOfCredit.get('multiLoanTrans').patchValue('');
        }

        const tempComplemetry = this.letterOfCredit.get('complementryOther').value;
        if (!ObjectUtil.isEmpty(tempComplemetry)) {
            this.letterOfCredit.get('complementryOtherTrans').patchValue(tempComplemetry);
        }

        const tempCommissionType = this.letterOfCredit.get('commissionType').value;
        if (!ObjectUtil.isEmpty(tempCommissionType)) {
            this.letterOfCredit.get('commissionTypeTrans').patchValue(tempCommissionType);
        }

        /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
        const tempLoanAmount = this.letterOfCredit.get('loanAmount').value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
            this.convertNumbersToNepali(tempLoanAmount, true) : '';
        this.letterOfCredit.get('loanAmountTrans').patchValue(convertNumber);

        this.letterOfCredit.get('loanAmountAmountWordsTrans').patchValue(
            this.letterOfCredit.get('loanAmountAmountWords').value
        );
        const convertMargin = this.convertNumbersToNepali(this.letterOfCredit.get('marginInPercentage').value, false);
        this.letterOfCredit.get('marginInPercentageTrans').patchValue(convertMargin);
        const convertCommissionRate = this.convertNumbersToNepali(this.letterOfCredit.get('commissionRate').value, false);
        this.letterOfCredit.get('commissionRateTrans').patchValue(convertCommissionRate);
        const convertCommissionFirst = this.convertNumbersToNepali(this.letterOfCredit.get('commissionRateFirstQuarter').value, false);
        this.letterOfCredit.get('commissionRateFirstQuarterTrans').patchValue(convertCommissionFirst);
        const convertCommissionOther = this.convertNumbersToNepali(this.letterOfCredit.get('commissionRateOtherQuarter').value, false);
        this.letterOfCredit.get('commissionRateOtherQuarterTrans').patchValue(convertCommissionOther);
        const convertMinimumCommission = this.convertNumbersToNepali(this.letterOfCredit.get('minimumCommissionRate').value, false);
        this.letterOfCredit.get('minimumCommissionRateTrans').patchValue(convertMinimumCommission);

        /* Converting value for date */
        this.letterOfCredit.get('dateOfExpiryTypeTrans').patchValue(
            this.letterOfCredit.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.letterOfCredit.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.letterOfCredit.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.letterOfCredit.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.letterOfCredit.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.letterOfCredit.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        this.setCTValue();
    }

    setCTValue() {
        this.letterOfCredit.get('loanOptionCT').patchValue(
            this.letterOfCredit.get('loanOptionTrans').value
        );
        this.letterOfCredit.get('multiLoanCT').patchValue(
            this.letterOfCredit.get('multiLoanTrans').value
        );
        this.letterOfCredit.get('complementryOtherCT').patchValue(
            this.letterOfCredit.get('complementryOtherTrans').value
        );
        this.letterOfCredit.get('loanAmountCT').patchValue(
            this.letterOfCredit.get('loanAmountTrans').value
        );
        this.letterOfCredit.get('loanAmountAmountWordsCT').patchValue(
            this.letterOfCredit.get('loanAmountAmountWordsTrans').value
        );
        this.letterOfCredit.get('marginInPercentageCT').patchValue(
            this.letterOfCredit.get('marginInPercentageTrans').value
        );
        this.letterOfCredit.get('commissionTypeCT').patchValue(
            this.letterOfCredit.get('commissionTypeTrans').value
        );
        this.letterOfCredit.get('commissionRateCT').patchValue(
            this.letterOfCredit.get('commissionRateTrans').value
        );
        this.letterOfCredit.get('commissionRateFirstQuarterCT').patchValue(
            this.letterOfCredit.get('commissionRateFirstQuarterTrans').value
        );
        this.letterOfCredit.get('commissionRateOtherQuarterCT').patchValue(
            this.letterOfCredit.get('commissionRateOtherQuarterTrans').value
        );
        this.letterOfCredit.get('minimumCommissionRateCT').patchValue(
            this.letterOfCredit.get('minimumCommissionRateTrans').value
        );
        this.letterOfCredit.get('dateOfExpiryTypeCT').patchValue(
            this.letterOfCredit.get('dateOfExpiryTypeTrans').value
        );
        this.letterOfCredit.get('dateOfExpiryNepaliCT').patchValue(
            this.letterOfCredit.get('dateOfExpiryNepaliTrans').value
        );
        this.letterOfCredit.get('dateOfExpiryCT').patchValue(
            this.letterOfCredit.get('dateOfExpiryTrans').value
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

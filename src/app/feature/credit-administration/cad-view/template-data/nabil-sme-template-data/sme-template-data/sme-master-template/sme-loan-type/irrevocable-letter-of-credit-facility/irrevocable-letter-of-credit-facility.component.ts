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
    letterOfCreditForm: FormGroup;
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
        this.letterOfCreditForm = this.formBuilder.group({
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
        this.letterOfCreditForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.letterOfCreditForm.get(numLabel).value);
        this.letterOfCreditForm.get(wordLabel).patchValue(transformValue);
    }

    setCommissionType(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isCommission1Selected = tempData === 'COMMISSION_TYPE_1';
        this.isCommission2Selected = tempData === 'COMMISSION_TYPE_2';
    }

    translateAndSetVal() {

        /* SET TRANS VALUE FOR CONDITIONS */
        const tempLoanOptions = this.letterOfCreditForm.get('loanOption').value;
        if (!ObjectUtil.isEmpty(tempLoanOptions)) {
            this.letterOfCreditForm.get('loanOptionTrans').patchValue('');
        }

        const tempMultiLoan = this.letterOfCreditForm.get('multiLoanTrans').value;
        if (!ObjectUtil.isEmpty(tempMultiLoan)) {
            this.letterOfCreditForm.get('multiLoanTrans').patchValue('');
        }

        const tempComplemetry = this.letterOfCreditForm.get('complementryOther').value;
        if (!ObjectUtil.isEmpty(tempComplemetry)) {
            this.letterOfCreditForm.get('complementryOtherTrans').patchValue(tempComplemetry);
        }

        const tempCommissionType = this.letterOfCreditForm.get('commissionType').value;
        if (!ObjectUtil.isEmpty(tempCommissionType)) {
            this.letterOfCreditForm.get('commissionTypeTrans').patchValue(tempCommissionType);
        }

        /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
        const tempLoanAmount = this.letterOfCreditForm.get('loanAmount').value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
            this.convertNumbersToNepali(tempLoanAmount, true) : '';
        this.letterOfCreditForm.get('loanAmountTrans').patchValue(convertNumber);

        this.letterOfCreditForm.get('loanAmountAmountWordsTrans').patchValue(
            this.letterOfCreditForm.get('loanAmountAmountWords').value
        );
        const convertMargin = this.convertNumbersToNepali(this.letterOfCreditForm.get('marginInPercentage').value, false);
        this.letterOfCreditForm.get('marginInPercentageTrans').patchValue(convertMargin);
        const convertCommissionRate = this.convertNumbersToNepali(this.letterOfCreditForm.get('commissionRate').value, false);
        this.letterOfCreditForm.get('commissionRateTrans').patchValue(convertCommissionRate);
        const convertCommissionFirst = this.convertNumbersToNepali(this.letterOfCreditForm.get('commissionRateFirstQuarter').value, false);
        this.letterOfCreditForm.get('commissionRateFirstQuarterTrans').patchValue(convertCommissionFirst);
        const convertCommissionOther = this.convertNumbersToNepali(this.letterOfCreditForm.get('commissionRateOtherQuarter').value, false);
        this.letterOfCreditForm.get('commissionRateOtherQuarterTrans').patchValue(convertCommissionOther);
        const convertMinimumCommission = this.convertNumbersToNepali(this.letterOfCreditForm.get('minimumCommissionRate').value, false);
        this.letterOfCreditForm.get('minimumCommissionRateTrans').patchValue(convertMinimumCommission);

        /* Converting value for date */
        this.letterOfCreditForm.get('dateOfExpiryTypeTrans').patchValue(
            this.letterOfCreditForm.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.letterOfCreditForm.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.letterOfCreditForm.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.letterOfCreditForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.letterOfCreditForm.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.letterOfCreditForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        this.setCTValue();
    }

    setCTValue() {
        this.letterOfCreditForm.get('loanOptionCT').patchValue(
            this.letterOfCreditForm.get('loanOptionTrans').value
        );
        this.letterOfCreditForm.get('multiLoanCT').patchValue(
            this.letterOfCreditForm.get('multiLoanTrans').value
        );
        this.letterOfCreditForm.get('complementryOtherCT').patchValue(
            this.letterOfCreditForm.get('complementryOtherTrans').value
        );
        this.letterOfCreditForm.get('loanAmountCT').patchValue(
            this.letterOfCreditForm.get('loanAmountTrans').value
        );
        this.letterOfCreditForm.get('loanAmountAmountWordsCT').patchValue(
            this.letterOfCreditForm.get('loanAmountAmountWordsTrans').value
        );
        this.letterOfCreditForm.get('marginInPercentageCT').patchValue(
            this.letterOfCreditForm.get('marginInPercentageTrans').value
        );
        this.letterOfCreditForm.get('commissionTypeCT').patchValue(
            this.letterOfCreditForm.get('commissionTypeTrans').value
        );
        this.letterOfCreditForm.get('commissionRateCT').patchValue(
            this.letterOfCreditForm.get('commissionRateTrans').value
        );
        this.letterOfCreditForm.get('commissionRateFirstQuarterCT').patchValue(
            this.letterOfCreditForm.get('commissionRateFirstQuarterTrans').value
        );
        this.letterOfCreditForm.get('commissionRateOtherQuarterCT').patchValue(
            this.letterOfCreditForm.get('commissionRateOtherQuarterTrans').value
        );
        this.letterOfCreditForm.get('minimumCommissionRateCT').patchValue(
            this.letterOfCreditForm.get('minimumCommissionRateTrans').value
        );
        this.letterOfCreditForm.get('dateOfExpiryTypeCT').patchValue(
            this.letterOfCreditForm.get('dateOfExpiryTypeTrans').value
        );
        this.letterOfCreditForm.get('dateOfExpiryNepaliCT').patchValue(
            this.letterOfCreditForm.get('dateOfExpiryNepaliTrans').value
        );
        this.letterOfCreditForm.get('dateOfExpiryCT').patchValue(
            this.letterOfCreditForm.get('dateOfExpiryTrans').value
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

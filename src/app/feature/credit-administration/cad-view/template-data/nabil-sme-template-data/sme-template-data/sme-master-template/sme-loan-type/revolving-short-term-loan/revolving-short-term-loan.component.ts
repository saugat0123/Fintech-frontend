import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {DatePipe} from '@angular/common';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
    selector: 'app-revolving-short-term-loan',
    templateUrl: './revolving-short-term-loan.component.html',
    styleUrls: ['./revolving-short-term-loan.component.scss']
})
export class RevolvingShortTermLoanComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() cadDocAssignedLoan;
    initialInformation: any;
    revolvingShortTermLoan: FormGroup;
    isComplementaryOtherLoan = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    yesNoOptions = [
        {value: 'Yes'},
        {value: 'No'}
    ];
    filteredList: any = [];
    loanNameConstant = LoanNameConstant;
    filteredLoanIdList: any = [];
    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engNepDatePipe: EngNepDatePipe,
                private datePipe: DatePipe,
                private engToNepWord: NepaliCurrencyWordPipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.ADExpiry = true;
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
            this.filteredListDetails(this.loanDetails);
        }
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.revolvingShortTermLoan.patchValue(this.initialInformation.revolvingShortTermLoan);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
                this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', val, 'loanAmount']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }
    patchDate() {
        for (let val = 0; val < this.initialInformation.revolvingShortTermLoan.revolvingShortTermLoanFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.revolvingShortTermLoan.revolvingShortTermLoanFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }

    buildForm() {
        this.revolvingShortTermLoan = this.formBuilder.group({
            revolvingShortTermLoanFormArray: this.formBuilder.array([]),
        });
    }
    checkComplimetryOtherLoan(data, index) {
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', index, 'complementaryOther']).patchValue(data);
    }
    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.revolvingShortTermLoan.get([arrayName, index, numLabel]).value);
        this.revolvingShortTermLoan.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }

    calInterestRate(i) {
        const baseRate = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRate']).value;
        const premiumRate = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'interestRate']).patchValue(sum.toFixed(2));
        // Converting value from existed pipe:
        // this.translateNumber('baseRate', 'baseRateTrans');
        // this.translateNumber('premiumRate', 'premiumRateTrans');
        // this.translateNumber('interestRate', 'interestRateTrans');
    }

    translateAndSetVal(i) {
        /* SET TRANSLATION VALUE FOR CONDITIONS */
        const tempLoanOption = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanOption']).value;
        if (!ObjectUtil.isEmpty(tempLoanOption)) {
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanOptionTrans']).patchValue(tempLoanOption);
        }
        const tempLandRevolvingBasis = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingBasis']).value;
        if (!ObjectUtil.isEmpty(tempLandRevolvingBasis)) {
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingBasisTrans']).patchValue(tempLandRevolvingBasis);
        }
        const tempComplementary = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complementaryOther']).value;
        if (!ObjectUtil.isEmpty(tempComplementary)) {
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplementary);
        }
        // this.revolvingShortTermLoan.get('arFinancing').patchValue(this.isARFinancing);
        // const tempArFinancing = this.revolvingShortTermLoan.get('arFinancing').value;
        // if (!ObjectUtil.isEmpty(tempArFinancing)) {
        //     this.revolvingShortTermLoan.get('arFinancingTrans').patchValue(tempArFinancing);
        // }

        /* FOR MULTI LOAN SELECTION DATA */
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complimentaryLoanSelected']).value
        );

        /* SET REMAINING FIELDS */
        const tempLoanRevolvingPeriod = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingPeriod']).value, false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingPeriodTrans']).patchValue(tempLoanRevolvingPeriod);

        const tempLoanAmountTrans = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmount']).value, false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountTrans']).patchValue(tempLoanAmountTrans);
        /* SET LOAN AMOUNT WORDS */
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountWordsTrans']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountWords']).value
        );

        const convertArDays = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'arDays']).value, false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'arDaysTrans']).patchValue(convertArDays);

        const convertDrawingPower = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'drawingPower']).value, false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'drawingPowerTrans']).patchValue(convertDrawingPower);

        const convertBaseRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRate']).value ? this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRate']).value.toFixed(2) : '', false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRateTrans']).patchValue(convertBaseRate);

        const convertPremiumRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRate']).value ? this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);

        const convertInterestRate = this.convertNumbersToNepali(this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'interestRate']).value, false);
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'interestRateTrans']).patchValue(convertInterestRate);

        const dateOfExpiryType = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryType']).value;
        let convertedDateOfExpiry;
        if (dateOfExpiryType === 'AD') {
            const tempDateOfExp = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiry']).value;
            convertedDateOfExpiry = !ObjectUtil.isEmpty(tempDateOfExp) ? this.datePipe.transform(tempDateOfExp) : '';
            if (!ObjectUtil.isEmpty(convertedDateOfExpiry)) {
                const finalExpDate = this.transformEnglishDate(convertedDateOfExpiry);
                this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
            }
        } else {
            const tempDateOfExpNep = this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryNepali']).value;
            convertedDateOfExpiry = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTrans']).patchValue(convertedDateOfExpiry);
        }
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(dateOfExpiryType);
        /* FOR SETTING THE VALUE OF CT */
        this.setCTValueSave(i);
    }

    transformEnglishDate(date) {
        let transformedDate;
        let monthName;
        const dateArray = [];
        const splittedDate = date.split(' ');
        if (splittedDate[0] === 'Jan') {
            monthName = 'जनवरी';
        } else if (splittedDate[0] === 'Feb') {
            monthName = 'फेब्रुअरी';
        } else if (splittedDate[0] === 'Mar') {
            monthName = 'मार्च';
        } else if (splittedDate[0] === 'Apr') {
            monthName = 'अप्रिल';
        } else if (splittedDate[0] === 'May') {
            monthName = 'मे';
        } else if (splittedDate[0] === 'Jun') {
            monthName = 'जुन';
        } else if (splittedDate[0] === 'Jul') {
            monthName = 'जुलाई';
        } else if (splittedDate[0] === 'Aug') {
            monthName = 'अगष्ट';
        } else if (splittedDate[0] === 'Sep') {
            monthName = 'सेप्टेम्बर';
        } else if (splittedDate[0] === 'Oct') {
            monthName = 'अक्टुबर';
        } else if (splittedDate[0] === 'Nov') {
            monthName = 'नोभेम्बर';
        } else {
            monthName = 'डिसेम्बर';
        }
        dateArray.push(this.engToNepNumberPipe.transform(splittedDate[1].slice(0, -1)));
        dateArray.push(monthName + ',');
        dateArray.push(this.engToNepNumberPipe.transform(splittedDate[2]));
        transformedDate = dateArray.join(' ');
        return transformedDate;
    }

    /* SET CT VALUE OF EACH FIELDS */
    setCTValueSave(i) {
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanOptionCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanOptionTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingBasisCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingBasisTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complementaryOtherCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complementaryOtherTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'complimentaryLoanSelectedTrans']).value
        );
        // this.revolvingShortTermLoan.get('arFinancingCT').patchValue(
        //     this.revolvingShortTermLoan.get('arFinancingTrans').value
        // );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingPeriodCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanRevolvingPeriodTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountWordsCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanAmountWordsTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'arDaysCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'arDaysTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'drawingPowerCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'drawingPowerTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRateCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'baseRateTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRateCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'premiumRateTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'interestRateCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'interestRateTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTypeTrans']).value
        );
        this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryCT']).patchValue(
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'dateOfExpiryTrans']).value
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

    filteredListDetails(loanDetails) {
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.SHORT_TERM_LOAN);
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
    }

    addLoanFormArr() {
        (this.revolvingShortTermLoan.get('revolvingShortTermLoanFormArray') as FormArray).push(this.buildLoanForm());
    }

    buildLoanForm() {
        return this.formBuilder.group({
            loanOption: [undefined],
            loanRevolvingBasis: [undefined],
            subsidyOrAgricultureLoan: [undefined],
            complementaryOther: [undefined],
            // arFinancing: [undefined],
            complimentaryLoanSelected: [undefined],
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
            complimentaryLoanSelectedTrans: [undefined],
            // arFinancingTrans: [undefined],
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
            complimentaryLoanSelectedCT: [undefined],
            // arFinancingCT: [undefined],
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

            loanId: [undefined],
        });
    }

    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.SHORT_TERM_LOAN);
        this.filteredList.forEach((val, i) => {
            this.revolvingShortTermLoan.get(['revolvingShortTermLoanFormArray', i, 'loanId']).patchValue(
                this.filteredLoanIdList[i].proposal.id);
        });
    }
}

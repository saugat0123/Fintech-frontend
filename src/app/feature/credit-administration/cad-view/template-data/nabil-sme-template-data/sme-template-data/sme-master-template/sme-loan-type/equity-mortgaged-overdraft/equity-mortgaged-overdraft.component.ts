import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
    selector: 'app-equity-mortgaged-overdraft',
    templateUrl: './equity-mortgaged-overdraft.component.html',
    styleUrls: ['./equity-mortgaged-overdraft.component.scss']
})
export class EquityMortgagedOverdraftComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() cadDocAssignedLoan;
    initialInformation: any;
    equityMortgaged: FormGroup;
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    yesNoOptions = [
        {value: 'Yes'},
        {value: 'No'}
    ];
    mortgageType = [
        {value: 'New'},
        {value: 'Existing'},
        {value: 'Enhancement'}
    ];
    filteredList: any = [];
    filteredListMortgage: any = [];
    loanNameConstant = LoanNameConstant;
    loanDetails: any = [];
    filteredLoanIdList: any = [];
    filteredLoanMortgageIdList: any = [];
    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
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
                this.equityMortgaged.patchValue(this.initialInformation.equityMortgaged);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
                this.equityMortgaged.get(['equityMortgagedFormArray', val, 'loanAmount']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.equityMortgaged.get(['equityMortgagedFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        if (!ObjectUtil.isEmpty(this.filteredListMortgage)) {
            for (let val = 0; val < this.filteredListMortgage.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredListMortgage[val].loanAmount);
                this.equityMortgaged.get(['mortgageOverdraftFormArray', val, 'loanAmount']).patchValue(
                    this.filteredListMortgage[val] ? this.filteredListMortgage[val].loanAmount : '');
                this.equityMortgaged.get(['mortgageOverdraftFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }
    patchDate() {
        for (let val = 0; val < this.initialInformation.equityMortgaged.equityMortgagedFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get(['equityMortgagedFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.equityMortgagedFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get(['equityMortgagedFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }

        for (let val = 0; val < this.initialInformation.equityMortgaged.mortgageOverdraftFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get(['mortgageOverdraftFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.mortgageOverdraftFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get(['mortgageOverdraftFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }
    buildForm() {
        this.equityMortgaged = this.formBuilder.group({
            equityMortgagedFormArray: this.formBuilder.array([]),
            mortgageOverdraftFormArray: this.formBuilder.array([]),
        });
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.equityMortgaged.get([arrayName, index, numLabel]).value);
        this.equityMortgaged.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }

    calInterestRate(i) {
        const baseRate = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'baseRate']).value;
        const premiumRate = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'interestRate']).patchValue(sum.toFixed(2));
    }
    calInterestRate1(i) {
        const baseRate = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'baseRate']).value;
        const premiumRate = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'interestRate']).patchValue(sum.toFixed(2));
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    async setTranslatedVal(i) {
        /* SET TRANS CONDITIONS */
        const tempLoanSubType = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanSubType']).value;
        if (!ObjectUtil.isEmpty(tempLoanSubType)) {
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanSubTypeTrans']).patchValue(tempLoanSubType);
        }

        const tempDrawingBasis = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingBasis']).value;
        if (!ObjectUtil.isEmpty(tempDrawingBasis)) {
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingBasisTrans']).patchValue(tempDrawingBasis);
        }
        /* SET TRANS VALUE FOR OTHER FIELDS */
        const convertedVal = this.convertNumbersToNepali(this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmount']).value, true);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountTrans']).patchValue(convertedVal);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountWordsTrans']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountWords']).value
        );
        const convertedDrawingPower = this.convertNumbersToNepali(this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingPower']).value, false);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingPowerTrans']).patchValue(convertedDrawingPower);
        const convertedBaseRate = this.convertNumbersToNepali(this.equityMortgaged.get(['equityMortgagedFormArray', i, 'baseRate']).value.toFixed(2), false);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'baseRateTrans']).patchValue(convertedBaseRate);
        const convertedPremiumRate = this.convertNumbersToNepali(this.equityMortgaged.get(['equityMortgagedFormArray', i, 'premiumRate']).value.toFixed(2), false);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'premiumRateTrans']).patchValue(convertedPremiumRate);
        const convertedInterestRate = this.convertNumbersToNepali(this.equityMortgaged.get(['equityMortgagedFormArray', i, 'interestRate']).value, false);
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'interestRateTrans']).patchValue(convertedInterestRate);
        // this.equityMortgaged.get('dateOfExpiryTypeTrans').patchValue('');
        // this.equityMortgaged.get('dateOfExpiryTrans').patchValue('');
        // this.equityMortgaged.get('dateOfExpiryNepaliTrans').patchValue('');

        /* Converting value for date */
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }
        this.setCTValue(i);
        // if (this.ADExpiry) {
        //     this.clearForm('dateOfExpiryNepali');
        // }
        // if (this.BSExpiry) {
        //     this.clearForm('dateOfExpiry');
        // }
    }
    async setTranslatedVal1(i) {
        /* SET TRANS CONDITIONS */
        const tempLoanSubType = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanSubType']).value;
        if (!ObjectUtil.isEmpty(tempLoanSubType)) {
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanSubTypeTrans']).patchValue(tempLoanSubType);
        }

        const tempDrawingBasis = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingBasis']).value;
        if (!ObjectUtil.isEmpty(tempDrawingBasis)) {
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingBasisTrans']).patchValue(tempDrawingBasis);
        }
        /* SET TRANS VALUE FOR OTHER FIELDS */
        const convertedVal = this.convertNumbersToNepali(this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmount']).value, true);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountTrans']).patchValue(convertedVal);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountWordsTrans']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountWords']).value
        );
        const convertedDrawingPower = this.convertNumbersToNepali(this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingPower']).value, false);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingPowerTrans']).patchValue(convertedDrawingPower);
        const convertedBaseRate = this.convertNumbersToNepali(this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'baseRate']).value.toFixed(2), false);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'baseRateTrans']).patchValue(convertedBaseRate);
        const convertedPremiumRate = this.convertNumbersToNepali(this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'premiumRate']).value.toFixed(2), false);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'premiumRateTrans']).patchValue(convertedPremiumRate);
        const convertedInterestRate = this.convertNumbersToNepali(this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'interestRate']).value, false);
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'interestRateTrans']).patchValue(convertedInterestRate);

        /* Converting value for date */
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }
        this.setCTValue1(i);
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
    setCTValue(i) {
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanSubTypeCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanSubTypeTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingBasisCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingBasisTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountWordsCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanAmountWordsTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingPowerCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'drawingPowerTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'baseRateCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'baseRateTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'premiumRateCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'premiumRateTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'interestRateCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'interestRateTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTypeTrans']).value
        );
        this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryCT']).patchValue(
            this.equityMortgaged.get(['equityMortgagedFormArray', i, 'dateOfExpiryTrans']).value
        );
    }
    setCTValue1(i) {
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanSubTypeCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanSubTypeTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingBasisCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingBasisTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountWordsCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanAmountWordsTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingPowerCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'drawingPowerTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'baseRateCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'baseRateTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'premiumRateCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'premiumRateTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'interestRateCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'interestRateTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTypeTrans']).value
        );
        this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryCT']).patchValue(
            this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'dateOfExpiryTrans']).value
        );
    }

    clearForm(formControlName) {
        this.equityMortgaged.get(formControlName).setValue(null);
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
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.EQUITY_MORTGAGED_OVERDRAFT);
        this.filteredListMortgage = loanDetails.filter(data => data.name === this.loanNameConstant.MORTGAGE_OVERDRAFT);
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
        this.filteredListMortgage.forEach(val => {
            this.addMortgageLoanFormArr();
        });
}

    addMortgageLoanFormArr() {
        (this.equityMortgaged.get('mortgageOverdraftFormArray') as FormArray).push(this.buildLoanForm());
    }
    addLoanFormArr() {
        (this.equityMortgaged.get('equityMortgagedFormArray') as FormArray).push(this.buildLoanForm());
    }

    buildLoanForm() {
        return this.formBuilder.group({
            subsidyOrAgricultureLoan: [undefined],
            mortgageType: [undefined],
            loanSubType: [undefined],
            drawingBasis: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            drawingPower: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiry: [undefined],
            dateOfExpiryNepali: [undefined],

            /* FOR TRANSLATED FIELDS */
            loanSubTypeTrans: [undefined],
            drawingBasisTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
            drawingPowerTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            dateOfExpiryTrans: [undefined],

            /* FOR CT FIELDS */
            loanSubTypeCT: [undefined],
            drawingBasisCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
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
            data.loan.name === this.loanNameConstant.EQUITY_MORTGAGED_OVERDRAFT);
        this.filteredLoanMortgageIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.MORTGAGE_OVERDRAFT);
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            this.filteredList.forEach((val, i) => {
                this.equityMortgaged.get(['equityMortgagedFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanIdList[i].proposal.id);
            });
        }
        if (!ObjectUtil.isEmpty(this.filteredListMortgage)) {
            this.filteredListMortgage.forEach((val, i) => {
                this.equityMortgaged.get(['mortgageOverdraftFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanMortgageIdList[i].proposal.id);
            });
        }
    }
}



import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
    selector: 'app-irrevocable-letter-of-credit-facility',
    templateUrl: './irrevocable-letter-of-credit-facility.component.html',
    styleUrls: ['./irrevocable-letter-of-credit-facility.component.scss']
})
export class IrrevocableLetterOfCreditFacilityComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() cadDocAssignedLoan;
    initialInformation: any;
    letterOfCreditForm: FormGroup;
    isComplimentryOtherLoan = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    ADExpiry = false;
    BSExpiry = false;
    isCommission1Selected = false;
    isCommission2Selected = false;
    isRegularBasis = false;
    loanDetails: any = [];
    filteredList: any = [];
    loanNameConstant = LoanNameConstant;
    displayField = false;
    filteredLoanIdList: any = [];
    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engToNepDatePipe: EngNepDatePipe,
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
                this.letterOfCreditForm.patchValue(this.initialInformation.letterOfCreditForm);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
                this.letterOfCreditForm.get(['letterOfCreditFormArray', val, 'loanAmount']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.letterOfCreditForm.get(['letterOfCreditFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }
    patchDate() {
        for (let val = 0; val < this.initialInformation.letterOfCreditForm.letterOfCreditFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.letterOfCreditForm.get(['letterOfCreditFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.letterOfCreditForm.letterOfCreditFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.letterOfCreditForm.get(['letterOfCreditFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }
    buildForm() {
        this.letterOfCreditForm = this.formBuilder.group({
            letterOfCreditFormArray: this.formBuilder.array([]),
        });
    }

    checkComplimetryOtherLoan(data, i) {
        if (!data) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complementaryOther']).patchValue(data);
        }
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.letterOfCreditForm.get([arrayName, index, numLabel]).value);
        this.letterOfCreditForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }

    setCommissionType(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isCommission1Selected = tempData === 'COMMISSION_TYPE_1';
        this.isCommission2Selected = tempData === 'COMMISSION_TYPE_2';
        // this.displayField = !ObjectUtil.isEmpty(data);
    }

    async translateAndSetVal(i) {

        /* SET TRANS VALUE FOR CONDITIONS */
        const tempLoanOptions = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanOption']).value;
        if (!ObjectUtil.isEmpty(tempLoanOptions)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanOptionTrans']).patchValue('');
        }

        const tempComplimentaryLoan = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complimentaryLoanSelected']).value;
        if (!ObjectUtil.isEmpty(tempComplimentaryLoan)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoan);
        }

        const tempComplemetry = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complementaryOther']).value;
        if (!ObjectUtil.isEmpty(tempComplemetry)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complementaryOtherTrans']).patchValue(tempComplemetry);
        }

        const tempCommissionType = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionType']).value;
        if (!ObjectUtil.isEmpty(tempCommissionType)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionTypeTrans']).patchValue(tempCommissionType);
        }

        /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
        const tempLoanAmount = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmount']).value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
            this.convertNumbersToNepali(tempLoanAmount, true) : '';
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountWordsTrans']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountWords']).value
        );
        const convertMargin = this.convertNumbersToNepali(this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'marginInPercentage']).value, false);
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'marginInPercentageTrans']).patchValue(convertMargin);
        const convertCommissionRate = this.convertNumbersToNepali(this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRate']).value, false);
        if (!ObjectUtil.isEmpty(convertCommissionRate)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateTrans']).patchValue(convertCommissionRate);
        }
        const convertCommissionFirst = this.convertNumbersToNepali(this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateFirstQuarter']).value, false);
        if (!ObjectUtil.isEmpty(convertCommissionFirst)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateFirstQuarterTrans']).patchValue(convertCommissionFirst);
        }
        const convertCommissionOther = this.convertNumbersToNepali(this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateOtherQuarter']).value, false);
        if (!ObjectUtil.isEmpty(convertCommissionOther)) {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateOtherQuarterTrans']).patchValue(convertCommissionOther);
        }
        const convertMinimumCommission = this.convertNumbersToNepali(this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'minimumCommissionRate']).value, false);
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'minimumCommissionRateTrans']).patchValue(convertMinimumCommission);

        /* Converting value for date */
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            if (!ObjectUtil.isEmpty(tempExpDate)) {
                const finalExpDate = this.transformEnglishDate(tempExpDate);
                this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
            }
        } else {
            const tempDateOfExpNep = this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }
        this.setCTValue(i);
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

    setCTValue(i) {
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanOptionCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanOptionTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complimentaryLoanSelectedTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complementaryOtherCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'complementaryOtherTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountWordsCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanAmountWordsTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'marginInPercentageCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'marginInPercentageTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionTypeCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionTypeTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateFirstQuarterCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateFirstQuarterTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateOtherQuarterCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'commissionRateOtherQuarterTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'minimumCommissionRateCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'minimumCommissionRateTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTypeTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryNepaliCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryNepaliTrans']).value
        );
        this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryCT']).patchValue(
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'dateOfExpiryTrans']).value
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
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY);
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
    }

    addLoanFormArr() {
        (this.letterOfCreditForm.get('letterOfCreditFormArray') as FormArray).push(this.buildLoanForm());
    }

    buildLoanForm() {
        return this.formBuilder.group({
            loanOption: [undefined],
            complimentaryLoanSelected: [undefined],
            complementaryOther: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
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
            complimentaryLoanSelectedTrans: [undefined],
            complementaryOtherTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
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
            complimentaryLoanSelectedCT: [undefined],
            complementaryOtherCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
            marginInPercentageCT: [undefined],
            commissionTypeCT: [undefined],
            commissionRateCT: [undefined],
            commissionRateFirstQuarterCT: [undefined],
            commissionRateOtherQuarterCT: [undefined],
            minimumCommissionRateCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryNepaliCT: [undefined],
            dateOfExpiryCT: [undefined],

            loanId: [undefined],
        });
    }

    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.IRREVOCABLE_LETTER_OF_CREDIT_FACILITY);
        this.filteredList.forEach((val, i) => {
            this.letterOfCreditForm.get(['letterOfCreditFormArray', i, 'loanId']).patchValue(
                this.filteredLoanIdList[i].proposal.id);
        });
    }
}

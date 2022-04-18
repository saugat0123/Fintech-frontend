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
    selector: 'app-import-bills-discounting',
    templateUrl: './import-bills-discounting.component.html',
    styleUrls: ['./import-bills-discounting.component.scss']
})
export class ImportBillsDiscountingComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() cadDocAssignedLoan;
    initialInformation: any;
    importBillsDiscountForm: FormGroup;
    isComplimentryOtherLoan = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    displayField = false;
    filteredList: any = [];
    loanNameConstant = LoanNameConstant;
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
                this.importBillsDiscountForm.patchValue(this.initialInformation.importBillsDiscountForm);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
                this.importBillsDiscountForm.get(['importBillsDiscountFormArray', val, 'loanAmount']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.importBillsDiscountForm.get(['importBillsDiscountFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }
    patchDate() {
        for (let val = 0; val < this.initialInformation.importBillsDiscountForm.importBillsDiscountFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.importBillsDiscountForm.get(['importBillsDiscountFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.importBillsDiscountForm.importBillsDiscountFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.importBillsDiscountForm.get(['importBillsDiscountFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }
    buildForm() {
        this.importBillsDiscountForm = this.formBuilder.group({
            importBillsDiscountFormArray: this.formBuilder.array([]),
        });
    }

    checkComplimetryOtherLoan(data, i) {
        if (!data) {
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complementaryOther']).patchValue(data);
        }
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.importBillsDiscountForm.get([arrayName, index, numLabel]).value);
        this.importBillsDiscountForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    changeFieldValue(data) {
        this.displayField = !ObjectUtil.isEmpty(data);
    }

    async translateAndSetVal(i) {
        // SET TRANSLATION VALUE FOR CONDITIONS:
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanOptionTrans']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanOption']).value
        );
        const tempLoan = this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmount']).value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoan) ?
            this.convertNumbersToNepali(tempLoan, true) : '';
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountTrans']).patchValue(convertNumber);

        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountWordsTrans']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountWords']).value
        );

        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complementaryOtherTrans']).patchValue(this.isComplimentryOtherLoan);
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complimentaryLoanSelectedTrans']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complimentaryLoanSelected']).value
        );
        const tempLoanPeriodDays = this.convertNumbersToNepali(this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanPeriodInDays']).value, false);
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanPeriodInDaysTrans']).patchValue(tempLoanPeriodDays);
        const tempMarginPercentage = this.convertNumbersToNepali(this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'marginInPercentage']).value, false);
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'marginInPercentageTrans']).patchValue(tempMarginPercentage);

        /* Converting value for date */
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTypeTrans']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            if (!ObjectUtil.isEmpty(tempExpDate)) {
                const finalExpDate = this.transformEnglishDate(tempExpDate);
                this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
            }
        } else {
            const tempDateOfExpNep = this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }
        /* SET CT VALUE */
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
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanOptionCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanOptionTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complementaryOtherCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complementaryOtherTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complimentaryLoanSelectedCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'complimentaryLoanSelectedTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanPeriodInDaysCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanPeriodInDaysTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountWordsCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanAmountWordsTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'marginInPercentageCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'marginInPercentageTrans']).value
        );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTypeCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTypeTrans']).value
        );
        // this.importBillsDiscountForm.get('dateOfExpiryNepaliCT').patchValue(
        //     this.importBillsDiscountForm.get('dateOfExpiryNepaliTrans').value
        // );
        this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryCT']).patchValue(
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'dateOfExpiryTrans']).value
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
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.IMPORT_BILLS_DISCOUNTING);
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
    }

    addLoanFormArr() {
        (this.importBillsDiscountForm.get('importBillsDiscountFormArray') as FormArray).push(this.buildLoanForm());
    }

    buildLoanForm() {
        return this.formBuilder.group({
            loanOption: [undefined],
            complementaryOther: [undefined],
            complimentaryLoanSelected: [undefined],
            loanPeriodInDays: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            marginInPercentage: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiryNepali: [undefined],
            dateOfExpiry: [undefined],

            /* FOR TRANSLATION FIELDS */
            loanOptionTrans: [undefined],
            complementaryOtherTrans: [undefined],
            complimentaryLoanSelectedTrans: [undefined],
            loanPeriodInDaysTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
            marginInPercentageTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            // dateOfExpiryNepaliTrans: [undefined],
            dateOfExpiryTrans: [undefined],

            /* FOR CT FIELDS */
            loanOptionCT: [undefined],
            complementaryOtherCT: [undefined],
            complimentaryLoanSelectedCT: [undefined],
            loanPeriodInDaysCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
            marginInPercentageCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            // dateOfExpiryNepaliCT: [undefined],
            dateOfExpiryCT: [undefined],

            loanId: [undefined],
        });
    }

    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.IMPORT_BILLS_DISCOUNTING);
        this.filteredList.forEach((val, i) => {
            this.importBillsDiscountForm.get(['importBillsDiscountFormArray', i, 'loanId']).patchValue(
                this.filteredLoanIdList[i].proposal.id);
        });
    }
}

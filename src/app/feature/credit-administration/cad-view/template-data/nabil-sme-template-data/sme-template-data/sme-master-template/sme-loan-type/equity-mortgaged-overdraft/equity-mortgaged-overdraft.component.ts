import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
    selector: 'app-equity-mortgaged-overdraft',
    templateUrl: './equity-mortgaged-overdraft.component.html',
    styleUrls: ['./equity-mortgaged-overdraft.component.scss']
})
export class EquityMortgagedOverdraftComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
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

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
                private datePipe: DatePipe) {
    }

    ngOnInit() {
        this.buildForm();
        this.ADExpiry = true;
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.equityMortgaged.patchValue(this.initialInformation.equityMortgaged);
            }
            const dateOfExpiryType = this.initialInformation.equityMortgaged.dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.equityMortgaged.dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.equityMortgaged.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
                }
            }
        }
    }

    buildForm() {
        this.equityMortgaged = this.formBuilder.group({
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
        });
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.equityMortgaged.get(numLabel).value);
        this.equityMortgaged.get(wordLabel).patchValue(transformValue);
    }

    calInterestRate() {
        const baseRate = this.equityMortgaged.get('baseRate').value;
        const premiumRate = this.equityMortgaged.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.equityMortgaged.get('interestRate').patchValue(sum);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    setTranslatedVal() {
        /* SET TRANS CONDITIONS */
        const tempLoanSubType = this.equityMortgaged.get('loanSubType').value;
        if (!ObjectUtil.isEmpty(tempLoanSubType)) {
            this.equityMortgaged.get('loanSubTypeTrans').patchValue(tempLoanSubType);
        }

        const tempDrawingBasis = this.equityMortgaged.get('drawingBasis').value;
        if (!ObjectUtil.isEmpty(tempDrawingBasis)) {
            this.equityMortgaged.get('drawingBasisTrans').patchValue(tempDrawingBasis);
        }
        /* SET TRANS VALUE FOR OTHER FIELDS */
        const convertedVal = this.convertNumbersToNepali(this.equityMortgaged.get('loanAmount').value, true);
        this.equityMortgaged.get('loanAmountTrans').patchValue(convertedVal);
        this.equityMortgaged.get('loanAmountWordsTrans').patchValue(
            this.equityMortgaged.get('loanAmountWords').value
        );
        const convertedDrawingPower = this.convertNumbersToNepali(this.equityMortgaged.get('drawingPower').value, false);
        this.equityMortgaged.get('drawingPowerTrans').patchValue(convertedDrawingPower);
        const convertedBaseRate = this.convertNumbersToNepali(this.equityMortgaged.get('baseRate').value, false);
        this.equityMortgaged.get('baseRateTrans').patchValue(convertedBaseRate);
        const convertedPremiumRate = this.convertNumbersToNepali(this.equityMortgaged.get('premiumRate').value, false);
        this.equityMortgaged.get('premiumRateTrans').patchValue(convertedPremiumRate);
        const convertedInterestRate = this.convertNumbersToNepali(this.equityMortgaged.get('interestRate').value, false);
        this.equityMortgaged.get('interestRateTrans').patchValue(convertedInterestRate);
        // this.equityMortgaged.get('dateOfExpiryTypeTrans').patchValue('');
        // this.equityMortgaged.get('dateOfExpiryTrans').patchValue('');
        // this.equityMortgaged.get('dateOfExpiryNepaliTrans').patchValue('');

        /* Converting value for date */
        this.equityMortgaged.get('dateOfExpiryTypeTrans').patchValue(
            this.equityMortgaged.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.equityMortgaged.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.equityMortgaged.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.equityMortgaged.get('dateOfExpiryTrans').patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.equityMortgaged.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.equityMortgaged.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        this.setCTValue();
        if (this.ADExpiry) {
            this.clearForm('dateOfExpiryNepali');
        }
        if (this.BSExpiry) {
            this.clearForm('dateOfExpiry');
        }
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
    setCTValue() {
        this.equityMortgaged.get('loanSubTypeCT').patchValue(
            this.equityMortgaged.get('loanSubTypeTrans').value
        );
        this.equityMortgaged.get('drawingBasisCT').patchValue(
            this.equityMortgaged.get('drawingBasisTrans').value
        );
        this.equityMortgaged.get('loanAmountCT').patchValue(
            this.equityMortgaged.get('loanAmountTrans').value
        );
        this.equityMortgaged.get('loanAmountWordsCT').patchValue(
            this.equityMortgaged.get('loanAmountWordsTrans').value
        );
        this.equityMortgaged.get('drawingPowerCT').patchValue(
            this.equityMortgaged.get('drawingPowerTrans').value
        );
        this.equityMortgaged.get('baseRateCT').patchValue(
            this.equityMortgaged.get('baseRateTrans').value
        );
        this.equityMortgaged.get('premiumRateCT').patchValue(
            this.equityMortgaged.get('premiumRateTrans').value
        );
        this.equityMortgaged.get('interestRateCT').patchValue(
            this.equityMortgaged.get('interestRateTrans').value
        );
        this.equityMortgaged.get('dateOfExpiryTypeCT').patchValue(
            this.equityMortgaged.get('dateOfExpiryTypeTrans').value
        );
        this.equityMortgaged.get('dateOfExpiryCT').patchValue(
            this.equityMortgaged.get('dateOfExpiryTrans').value
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
}

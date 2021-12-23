import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
    selector: 'app-import-bills-discounting',
    templateUrl: './import-bills-discounting.component.html',
    styleUrls: ['./import-bills-discounting.component.scss']
})
export class ImportBillsDiscountingComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    initialInformation: any;
    importBillsDiscountForm: FormGroup;
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
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.importBillsDiscountForm.patchValue(this.initialInformation.importBillsDiscountForm);
            }
            const dateOfExpiryType = this.initialInformation.importBillsDiscountForm.dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.importBillsDiscountForm.dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.importBillsDiscountForm.get('dateOfExpiry').patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.importBillsDiscountForm.dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.importBillsDiscountForm.get('dateOfExpiryNepali').patchValue(dateOfExpiry);
                }
            }
        }
    }

    buildForm() {
        this.importBillsDiscountForm = this.formBuilder.group({
            loanOption: [undefined],
            complementryOther: [undefined],
            complimentaryLoanSelected: [undefined],
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
            complimentaryLoanSelectedTrans: [undefined],
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
            complimentaryLoanSelectedCT: [undefined],
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
        this.importBillsDiscountForm.get('complementryOther').patchValue(this.isComplimentryOtherLoan);
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.importBillsDiscountForm.get(numLabel).value);
        this.importBillsDiscountForm.get(wordLabel).patchValue(transformValue);
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
        this.importBillsDiscountForm.get('loanOptionTrans').patchValue(
            this.importBillsDiscountForm.get('loanOption').value
        );
        const tempLoan = this.importBillsDiscountForm.get('loanAmount').value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoan) ?
            this.convertNumbersToNepali(tempLoan, true) : '';
        this.importBillsDiscountForm.get('loanAmountTrans').patchValue(convertNumber);

        this.importBillsDiscountForm.get('loanAmountAmountWordsTrans').patchValue(
            this.importBillsDiscountForm.get('loanAmountAmountWords').value
        );

        this.importBillsDiscountForm.get('complementryOtherTrans').patchValue(this.isComplimentryOtherLoan);
        this.importBillsDiscountForm.get('complimentaryLoanSelectedTrans').patchValue(
            this.importBillsDiscountForm.get('complimentaryLoanSelected').value
        );
        const tempLoanPeriodDays = this.convertNumbersToNepali(this.importBillsDiscountForm.get('loanPeriodInDays').value, false);
        this.importBillsDiscountForm.get('loanPeriodInDaysTrans').patchValue(tempLoanPeriodDays);
        const tempMarginPercentage = this.convertNumbersToNepali(this.importBillsDiscountForm.get('marginInPercentage').value, false);
        this.importBillsDiscountForm.get('marginInPercentageTrans').patchValue(tempMarginPercentage);

        /* Converting value for date */
        this.importBillsDiscountForm.get('dateOfExpiryTypeTrans').patchValue(
            this.importBillsDiscountForm.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.importBillsDiscountForm.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.importBillsDiscountForm.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.importBillsDiscountForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.importBillsDiscountForm.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.importBillsDiscountForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        /* SET CT VALUE */
        this.setCTValue();
    }

    setCTValue() {
        this.importBillsDiscountForm.get('loanOptionCT').patchValue(
            this.importBillsDiscountForm.get('loanOptionTrans').value
        );
        this.importBillsDiscountForm.get('complementryOtherCT').patchValue(
            this.importBillsDiscountForm.get('complementryOtherTrans').value
        );
        this.importBillsDiscountForm.get('complimentaryLoanSelectedCT').patchValue(
            this.importBillsDiscountForm.get('complimentaryLoanSelectedTrans').value
        );
        this.importBillsDiscountForm.get('loanPeriodInDaysCT').patchValue(
            this.importBillsDiscountForm.get('loanPeriodInDaysTrans').value
        );
        this.importBillsDiscountForm.get('loanAmountCT').patchValue(
            this.importBillsDiscountForm.get('loanAmountTrans').value
        );
        this.importBillsDiscountForm.get('loanAmountAmountWordsCT').patchValue(
            this.importBillsDiscountForm.get('loanAmountAmountWordsTrans').value
        );
        this.importBillsDiscountForm.get('marginInPercentageCT').patchValue(
            this.importBillsDiscountForm.get('marginInPercentageTrans').value
        );
        this.importBillsDiscountForm.get('dateOfExpiryTypeCT').patchValue(
            this.importBillsDiscountForm.get('dateOfExpiryTypeTrans').value
        );
        // this.importBillsDiscountForm.get('dateOfExpiryNepaliCT').patchValue(
        //     this.importBillsDiscountForm.get('dateOfExpiryNepaliTrans').value
        // );
        this.importBillsDiscountForm.get('dateOfExpiryCT').patchValue(
            this.importBillsDiscountForm.get('dateOfExpiryTrans').value
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

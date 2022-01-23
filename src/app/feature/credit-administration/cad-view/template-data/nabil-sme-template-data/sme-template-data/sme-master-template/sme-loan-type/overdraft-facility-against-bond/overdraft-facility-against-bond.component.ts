import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {OfferDocument} from '../../../../../../../model/OfferDocument';

@Component({
    selector: 'app-overdraft-facility-against-bond',
    templateUrl: './overdraft-facility-against-bond.component.html',
    styleUrls: ['./overdraft-facility-against-bond.component.scss']
})
export class OverdraftFacilityAgainstBondComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() customerApprovedDoc;
    @Input() isEdit;
    initialInformation: any;
    overDraftFacilityForm: FormGroup;
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    translateForm: FormGroup;
    tdValue: any = {};
    arrayForm: any = {};
    yesNoOptions = [
        {value: 'Yes'},
        {value: 'No'}
    ];
    overdraftFacilityNumber: Array<any> = new Array<any>();
    forBondDetails;

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
                private datePipe: DatePipe,
                private spinnerService: NgxSpinnerService,
                private translatedService: SbTranslateService) {
    }

    ngOnInit() {
        this.overdraftFacilityNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
            val.loan.name === 'OVERDRAFT FACILITY AGAINST BOND');
        this.buildForm();
        this.ADExpiry = true;
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.overDraftFacilityForm.get('overdraftFacilityDetails').patchValue(this.initialInformation.overDraftFacilityForm.overdraftFacilityDetails);
            }
            this.patchDate();
        }
    }

    patchDate() {
        for (let val = 0; val < this.initialInformation.overDraftFacilityForm.overdraftFacilityDetails.length; val++) {
            const dateOfExpiryType = this.initialInformation.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.overDraftFacilityForm.get(['overdraftFacilityDetails', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.overDraftFacilityForm.overdraftFacilityDetails[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.overDraftFacilityForm.get(['overdraftFacilityDetails', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }

    buildForm() {
        this.overDraftFacilityForm = this.formBuilder.group({
            overdraftFacilityDetails: this.formBuilder.array([]),
        });
        this.setOverdraftBondForm();
        this.addBondDetails();
    }


    setOverdraftBondForm() {
        for (let a = 0; a < this.overdraftFacilityNumber.length; a++) {
            (this.overDraftFacilityForm.get('overdraftFacilityDetails') as FormArray).push(this.setFormArray());
        }
    }

    setFormArray() {
        return this.formBuilder.group({
            bondType: [undefined],
            subsidyOrAgricultureLoan: [undefined],
            letterOfSetOffUsed: [undefined],
            interestRateType: [undefined],
            nameOfFacility: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            // bondOwnerName: [undefined],
            bondAmount: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiry: [undefined],
            dateOfExpiryNepali: [undefined],

            /* FOR TRANSLATED FORM */
            bondTypeTrans: [undefined],
            letterOfSetOffUsedTrans: [undefined],
            interestRateTypeTrans: [undefined],
            nameOfFacilityTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
            // bondOwnerNameTrans: [undefined],
            bondAmountTrans: [undefined],
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            dateOfExpiryTrans: [undefined],

            /* FOR CT FIELDS */
            bondTypeCT: [undefined],
            letterOfSetOffUsedCT: [undefined],
            interestRateTypeCT: [undefined],
            nameOfFacilityCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
            // bondOwnerNameCT: [undefined],
            bondAmountCT: [undefined],
            baseRateCT: [undefined],
            premiumRateCT: [undefined],
            interestRateCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryCT: [undefined],
            bondDetails: this.formBuilder.array([]),
        });
    }

    public getNumAmountWord(numLabel, wordLabel, i): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, numLabel]).value);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, wordLabel]).patchValue(transformValue);
    }

    calInterestRate(i) {
        const baseRate = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'baseRate']).value;
        const premiumRate = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRate']).patchValue(sum.toFixed(3));
    }

    public checkDateOfExpiry(value, i): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    async setTranslatedVal(i) {
        // SET TRANS VALUE FOR CONDITIONS :
        const bondTypeTrans = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondType']).value;
        if (!ObjectUtil.isEmpty(bondTypeTrans)) {
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondTypeTrans']).patchValue(bondTypeTrans);
        }

        const letterOfSetOffTrans = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'letterOfSetOffUsed']).value;
        if (!ObjectUtil.isEmpty(letterOfSetOffTrans)) {
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'letterOfSetOffUsedTrans']).patchValue(letterOfSetOffTrans);
        }

        const interestType = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateType']).value;
        if (!ObjectUtil.isEmpty(interestType)) {
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateTypeTrans']).patchValue(interestType);
        }
        /* SET TRANSLATED VALUE FOR OTHER FIELDS BY USING EXISTED PIPE */
        const convertLoanAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmount']).value, true);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountTrans']).patchValue(convertLoanAmount);
        /* FOR LOAN AMOUNT WORDS */
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountWordsTrans']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountWords']).value
        );
        const convertBondAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondAmount']).value, false);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondAmountTrans']).patchValue(convertBondAmount);
        const convertBaseRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'baseRate']).value, false);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'baseRateTrans']).patchValue(convertBaseRate);
        const convertPremiumRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'premiumRate']).value, false);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
        const convertInterestRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRate']).value, false);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateTrans']).patchValue(convertInterestRate);

        // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, dateOfExpiryType']).patchValue('');
        // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, dateOfExpiry']).patchValue('');
        // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, dateOfExpiryNepali']).patchValue('');

        /* Converting value for date */
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTypeTrans']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }

        this.translateForm = this.formBuilder.group({
            nameOfFacility: [this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'nameOfFacility']).value],
            // bondOwnerName: [this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, bondOwnerName']).value]
        });

        /* Translating Values */
        this.tdValue = await this.translate(this.translateForm);

        /* SET GOOGLE TRANSLATED VALUE BY TRANSLATION */
        if (!ObjectUtil.isEmpty(this.tdValue)) {
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'nameOfFacilityTrans']).patchValue(this.tdValue.nameOfFacility);
            // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, bondOwnerNameTrans']).patchValue(this.tdValue.bondOwnerName);
        }

        this.setCTData(i);
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

    addBondDetails() {
        for (let a = 0; a < this.overdraftFacilityNumber.length; a++) {
            if (this.isEdit) {
                let temp;
                if (this.offerDocumentList.length > 0) {
                    this.offerDocumentList.forEach(offerLetter => {
                        this.forBondDetails = JSON.parse(offerLetter.initialInformation);
                    });
                    if (!ObjectUtil.isEmpty(this.forBondDetails)) {
                        temp = this.forBondDetails.overDraftFacilityForm.overdraftFacilityDetails;
                    }
                    temp[a].bondDetails.forEach((val) => {
                        (this.overDraftFacilityForm.get(['overdraftFacilityDetails', a, 'bondDetails']) as FormArray).push(
                            this.formBuilder.group({
                                bondOwnerName: [undefined],
                                bondOwnerNameTrans: [undefined],
                                bondOwnerNameCT: [undefined],
                            })
                        );
                    });
                }
            } else {
                (this.overDraftFacilityForm.get(['overdraftFacilityDetails', a, 'bondDetails']) as FormArray).push(
                    this.formBuilder.group({
                        bondOwnerName: [undefined],
                        bondOwnerNameTrans: [undefined],
                        bondOwnerNameCT: [undefined],
                    })
                );
            }
        }
    }

    addBondDetails1(i) {
        (this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondDetails']) as FormArray).push(
            this.formBuilder.group({
                bondOwnerName: [undefined],
                bondOwnerNameTrans: [undefined],
                bondOwnerNameCT: [undefined],
            })
        );

    }

    removeBondDetails(i, index) {
        (this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondDetails']) as FormArray).removeAt(index);
    }

    async translate(form) {
        const translatedData = await this.translatedService.translateForm(form);
        return translatedData;
    }

    async onChangeTranslateSecurity(arrName, source, index, target, i, mainArray) {
        this.arrayForm = this.formBuilder.group({
            formValue: this.overDraftFacilityForm.get([String(mainArray), i, String(arrName), index, String(source)]).value
        });
        const sourceResponse = await this.translatedService.translateForm(this.arrayForm);
        this.overDraftFacilityForm.get([String(mainArray), i, String(arrName), index, String(target)]).patchValue(sourceResponse.formValue);
        this.overDraftFacilityForm.get([String(mainArray), i, String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.formValue);
    }

    /* SET CT VALUES OF TRANSLATED DATA */
    setCTData(i) {
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondTypeCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondTypeTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'letterOfSetOffUsedCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'letterOfSetOffUsedTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateTypeCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateTypeTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'nameOfFacilityCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'nameOfFacilityTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountWordsCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanAmountWordsTrans']).value
        );
        // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, bondOwnerNameCT']).patchValue(
        //     this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, bondOwnerNameTrans']).value
        // );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondAmountCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'bondAmountTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'baseRateCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'baseRateTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'premiumRateCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'premiumRateTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'interestRateTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTypeCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTypeTrans']).value
        );
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryCT']).patchValue(
            this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'dateOfExpiryTrans']).value
        );
    }
}

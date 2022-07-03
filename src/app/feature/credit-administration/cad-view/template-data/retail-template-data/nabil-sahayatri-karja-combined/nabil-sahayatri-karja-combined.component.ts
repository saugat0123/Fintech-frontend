import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {DatePipe} from '@angular/common';
import {EngNepDatePipe} from 'nepali-patro';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {EnglishDateTransformPipe} from '../../../../../../@core/pipe/english-date-transform.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
    selector: 'app-nabil-sahayatri-karja-combined',
    templateUrl: './nabil-sahayatri-karja-combined.component.html',
    styleUrls: ['./nabil-sahayatri-karja-combined.component.scss']
})
export class NabilSahayatriKarjaCombinedComponent implements OnInit {
    @Input() loanName;
    @Input() cadDocAssignedLoan;
    @Input() offerDocumentList;
    @Input() globalBaseRate;
    nabilSahayatriCombinedForm: FormGroup;
    loanDetails: any = [];
    filteredList: any = [];
    filteredLoanIdList: any = [];
    initialInformation: any;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    translatedFormGroup: FormGroup;

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private datePipe: DatePipe,
                private engToNepDatePipe: EngNepDatePipe,
                private engToNepWord: NepaliCurrencyWordPipe,
                private translateService: SbTranslateService,
                private englishCalenderPipe: EnglishDateTransformPipe) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
            this.filteredListDetails(this.loanDetails);
        }
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.nabilSahayatriCombinedForm.patchValue(this.initialInformation.nabilSahayatriCombinedForm);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount);
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', val, 'loanAmountInFigure']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', val, 'loanAmountInWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }

    patchDate() {
        for (let val = 0; val < this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray.length; val++) {
          // tslint:disable-next-line:max-line-length
            const loanExpiryDateType = this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray[val].loanExpiryDateType;
            if (loanExpiryDateType === 'AD') {
              // tslint:disable-next-line:max-line-length
                const loanExpiryDate = this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray[val].loanExpiryDate;
                if (!ObjectUtil.isEmpty(loanExpiryDate)) {
                    this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', val, 'loanExpiryDate']).patchValue(
                        new Date(loanExpiryDate));
                }
            } else if (loanExpiryDateType === 'BS') {
              // tslint:disable-next-line:max-line-length
                const loanExpiryDate = this.initialInformation.nabilSahayatriCombinedForm.nabilSahayatriCombinedFormArray[val].loanExpiryDateNepali;
                if (!ObjectUtil.isEmpty(loanExpiryDate)) {
                    this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', val, 'loanExpiryDateNepali']).patchValue(
                        loanExpiryDate);
                }
            }
        }
    }

    filteredListDetails(loanDetails) {
        this.filteredList = loanDetails.filter(data => data.name === 'NABIL SAHAYATRI KARJA');
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
    }

    buildForm() {
        this.nabilSahayatriCombinedForm = this.formBuilder.group({
            nabilSahayatriCombinedFormArray: this.formBuilder.array([])
        });
    }

    addLoanFormArr() {
        (this.nabilSahayatriCombinedForm.get('nabilSahayatriCombinedFormArray') as FormArray).push(this.buildLoanForm());
    }

    buildLoanForm() {
        return this.formBuilder.group({
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
            purposeOfLoan: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            marginInPercentage: [undefined],
            loanAdminFeeInFigure: [undefined],
            loanAdminFeeInWords: [undefined],
            loanExpiryDateType: [undefined],
            loanExpiryDate: [undefined],
            loanExpiryDateNepali: [undefined],

            loanAmountInFigureTrans: [undefined],
            loanAmountInWordsTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            marginInPercentageTrans: [undefined],
            loanAdminFeeInFigureTrans: [undefined],
            loanAdminFeeInWordsTrans: [undefined],
            loanExpiryDateTypeTrans: [undefined],
            loanExpiryDateTrans: [undefined],
            loanExpiryDateNepaliTrans: [undefined],

            loanAmountInFigureCT: [undefined],
            loanAmountInWordsCT: [undefined],
            purposeOfLoanCT: [undefined],
            premiumRateCT: [undefined],
            interestRateCT: [undefined],
            marginInPercentageCT: [undefined],
            loanAdminFeeInFigureCT: [undefined],
            loanAdminFeeInWordsCT: [undefined],
            loanExpiryDateTypeCT: [undefined],
            loanExpiryDateCT: [undefined],
            loanExpiryDateNepaliCT: [undefined],

            interestRateType: [undefined],
            isRenewal: [undefined],
            loanId: [undefined],
            loanName: [undefined],
            loanNameNepali: [undefined]
        });
    }

    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === 'NABIL SAHAYATRI KARJA');
        this.filteredList.forEach((val, i) => {
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanId']).patchValue(
                this.filteredLoanIdList[i].proposal.id);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanName']).patchValue(
                this.filteredLoanIdList[i].loan.name);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanNameNepali']).patchValue(
                this.filteredLoanIdList[i].loan.nepaliName);
        });
    }

    renewalCheckFunc(boolVal, i) {
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'isRenewal']).patchValue(boolVal);
    }

    setInterestRateType(data) {
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.nabilSahayatriCombinedForm.get(
            [arrayName, index, numLabel]).value);
        this.nabilSahayatriCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }

    async translateAndSetVal(i) {

        /* SET TRANS VALUE FOR OTHER NUMBER FIELDS */
        const tempLoanAmount = this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInFigure']).value ?
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInFigure']).value.toFixed(2) : '';
        const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
            this.convertNumbersToNepali(tempLoanAmount, true) : '';
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInFigureTrans']).patchValue(convertNumber);
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInFigureCT']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInFigureTrans']).value);

        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInWordsTrans']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInWords']).value);
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInWordsCT']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAmountInWordsTrans']).value);

        const tempWord = this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'purposeOfLoan']).value;
        if (!ObjectUtil.isEmpty(tempWord)) {
            this.translatedFormGroup = this.formBuilder.group({
                purposeOfLoan: tempWord,
            });
            const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
            if (!ObjectUtil.isEmpty(translatedValue)) {
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'purposeOfLoanTrans']).patchValue(
                    translatedValue.purposeOfLoan);
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'purposeOfLoanCT']).patchValue(
                    translatedValue.purposeOfLoan);
            }
        }

        const convertMargin = this.convertNumbersToNepali(this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'marginInPercentage']).value ?
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'marginInPercentage']).value.toFixed(2) : '', false);
        if (!ObjectUtil.isEmpty(convertMargin)) {
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'marginInPercentageTrans']).patchValue(
                convertMargin);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'marginInPercentageCT']).patchValue(
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'marginInPercentageTrans']).value);
        }

        const convertPremiumRate = this.convertNumbersToNepali(this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRate']).value ?
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRate']).value.toFixed(2) : '', false);
        if (!ObjectUtil.isEmpty(convertPremiumRate)) {
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRateTrans']).patchValue(convertPremiumRate);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRateCT']).patchValue(
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRateTrans']).value);
        }

        const convertInterestRate = this.convertNumbersToNepali(this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRate']).value ?
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRate']).value.toFixed(2) : '', false);
        if (!ObjectUtil.isEmpty(convertInterestRate)) {
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRateTrans']).patchValue(
                convertInterestRate);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRateCT']).patchValue(
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRateTrans']).value);
        }

        const tempLoanAdminFee = this.nabilSahayatriCombinedForm.get(
            ['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInFigure']).value ?
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInFigure']).value.toFixed(2) : '';
        const convertLoanAdminFee = !ObjectUtil.isEmpty(tempLoanAdminFee) ?
            this.convertNumbersToNepali(tempLoanAdminFee, true) : '';
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).patchValue(
            convertLoanAdminFee);
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInFigureCT']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInFigureTrans']).value);

        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInWords']).value);
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInWordsCT']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanAdminFeeInWordsTrans']).value);
        /* Converting value for date */
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateTypeTrans']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateType']).value
        );
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateTypeCT']).patchValue(
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateTypeTrans']).value
        );
        const tempDateOfExpType = this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDate']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            if (!ObjectUtil.isEmpty(tempExpDate)) {
                const finalExpDate = this.englishCalenderPipe.transform(tempExpDate);
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateTrans']).patchValue(finalExpDate);
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateCT']).patchValue(
                    this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateTrans']).value
                );
            }
        } else {
            const tempDateOfExpNep = this.nabilSahayatriCombinedForm.get(
                ['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).patchValue(
                tempExpDate);
            this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateNepaliCT']).patchValue(
                this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'loanExpiryDateNepaliTrans']).value
            );
        }
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

    calInterestRate(i) {
        let baseRate;
        if (!ObjectUtil.isEmpty(this.globalBaseRate)) {
            baseRate = this.globalBaseRate;
        } else {
            baseRate = (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm) &&
                !ObjectUtil.isEmpty(this.initialInformation.retailGlobalForm.baseRate)) ?
                this.initialInformation.retailGlobalForm.baseRate : 0;
        }
        const premiumRate = this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.nabilSahayatriCombinedForm.get(['nabilSahayatriCombinedFormArray', i, 'interestRate']).patchValue(sum);
    }
}

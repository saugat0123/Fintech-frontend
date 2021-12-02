import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NgxSpinnerService} from 'ngx-spinner';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';

@Component({
    selector: 'app-overdraft-facility-against-bond',
    templateUrl: './overdraft-facility-against-bond.component.html',
    styleUrls: ['./overdraft-facility-against-bond.component.scss']
})
export class OverdraftFacilityAgainstBondComponent implements OnInit {
    @Input() loanName;
    overDraftFacilityForm: FormGroup;
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    translateForm: FormGroup;
    tdValue: any = {};

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
        this.buildForm();
        this.ADExpiry = true;
    }

    buildForm() {
        this.overDraftFacilityForm = this.formBuilder.group({
            bondType: [undefined],
            letterOfSetOffUsed: [undefined],
            interestRateType: [undefined],
            nameOfFacility: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
            bondOwnerName: [undefined],
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
            bondOwnerNameTrans: [undefined],
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
            bondOwnerNameCT: [undefined],
            bondAmountCT: [undefined],
            baseRateCT: [undefined],
            premiumRateCT: [undefined],
            interestRateCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryCT: [undefined],
        });
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.overDraftFacilityForm.get(numLabel).value);
        this.overDraftFacilityForm.get(wordLabel).patchValue(transformValue);
    }

    calInterestRate() {
        const baseRate = this.overDraftFacilityForm.get('baseRate').value;
        const premiumRate = this.overDraftFacilityForm.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.overDraftFacilityForm.get('interestRate').patchValue(sum);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    async setTranslatedVal() {
        // SET TRANS VALUE FOR CONDITIONS :
        const bondTypeTrans = this.overDraftFacilityForm.get('bondType').value;
        if (!ObjectUtil.isEmpty(bondTypeTrans)) {
            this.overDraftFacilityForm.get('bondTypeTrans').patchValue(bondTypeTrans);
        }

        const letterOfSetOffTrans = this.overDraftFacilityForm.get('letterOfSetOffUsed').value;
        if (!ObjectUtil.isEmpty(letterOfSetOffTrans)) {
            this.overDraftFacilityForm.get('letterOfSetOffUsedTrans').patchValue(letterOfSetOffTrans);
        }

        const interestType = this.overDraftFacilityForm.get('interestRateType').value;
        if (!ObjectUtil.isEmpty(interestType)) {
            this.overDraftFacilityForm.get('interestRateTypeTrans').patchValue(interestType);
        }
        /* SET TRANSLATED VALUE FOR OTHER FIELDS BY USING EXISTED PIPE */
        const convertLoanAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get('loanAmount').value, true);
        this.overDraftFacilityForm.get('loanAmountTrans').patchValue(convertLoanAmount);
        /* FOR LOAN AMOUNT WORDS */
        this.overDraftFacilityForm.get('loanAmountWordsTrans').patchValue(
            this.overDraftFacilityForm.get('loanAmountWords').value
        );
        const convertBondAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get('bondAmount').value, false);
        this.overDraftFacilityForm.get('bondAmountTrans').patchValue(convertBondAmount);
        const convertBaseRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get('baseRate').value, false);
        this.overDraftFacilityForm.get('baseRateTrans').patchValue(convertBaseRate);
        const convertPremiumRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get('premiumRate').value, false);
        this.overDraftFacilityForm.get('premiumRateTrans').patchValue(convertPremiumRate);
        const convertInterestRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get('interestRate').value, false);
        this.overDraftFacilityForm.get('interestRateTrans').patchValue(convertInterestRate);

        // this.overDraftFacilityForm.get('dateOfExpiryType').patchValue('');
        // this.overDraftFacilityForm.get('dateOfExpiry').patchValue('');
        // this.overDraftFacilityForm.get('dateOfExpiryNepali').patchValue('');

        /* Converting value for date */
        this.overDraftFacilityForm.get('dateOfExpiryTypeTrans').patchValue(
            this.overDraftFacilityForm.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.overDraftFacilityForm.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.overDraftFacilityForm.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.overDraftFacilityForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.overDraftFacilityForm.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.overDraftFacilityForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }

        this.translateForm = this.formBuilder.group({
            nameOfFacility: [this.overDraftFacilityForm.get('nameOfFacility').value],
            bondOwnerName: [this.overDraftFacilityForm.get('bondOwnerName').value]
        });

        /* Translating Values */
        this.tdValue = await this.translate(this.translateForm);

        /* SET GOOGLE TRANSLATED VALUE BY TRANSLATION */
        if (!ObjectUtil.isEmpty(this.tdValue)) {
            this.overDraftFacilityForm.get('nameOfFacilityTrans').patchValue(this.tdValue.nameOfFacility);
            this.overDraftFacilityForm.get('bondOwnerNameTrans').patchValue(this.tdValue.bondOwnerName);
        }

        this.setCTData();
        console.log('This is final Data', this.overDraftFacilityForm.value);
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

    async translate(form) {
        const translatedData = await this.translatedService.translateForm(form);
        return translatedData;
    }

    /* SET CT VALUES OF TRANSLATED DATA */
    setCTData() {
        this.overDraftFacilityForm.get('bondTypeCT').patchValue(
            this.overDraftFacilityForm.get('bondTypeTrans').value
        );
        this.overDraftFacilityForm.get('letterOfSetOffUsedCT').patchValue(
            this.overDraftFacilityForm.get('letterOfSetOffUsedTrans').value
        );
        this.overDraftFacilityForm.get('interestRateTypeCT').patchValue(
            this.overDraftFacilityForm.get('interestRateTypeTrans').value
        );
        this.overDraftFacilityForm.get('nameOfFacilityCT').patchValue(
            this.overDraftFacilityForm.get('nameOfFacilityTrans').value
        );
        this.overDraftFacilityForm.get('loanAmountCT').patchValue(
            this.overDraftFacilityForm.get('loanAmountTrans').value
        );
        this.overDraftFacilityForm.get('loanAmountWordsCT').patchValue(
            this.overDraftFacilityForm.get('loanAmountWordsTrans').value
        );
        this.overDraftFacilityForm.get('bondOwnerNameCT').patchValue(
            this.overDraftFacilityForm.get('bondOwnerNameTrans').value
        );
        this.overDraftFacilityForm.get('bondAmountCT').patchValue(
            this.overDraftFacilityForm.get('bondAmountTrans').value
        );
        this.overDraftFacilityForm.get('baseRateCT').patchValue(
            this.overDraftFacilityForm.get('baseRateTrans').value
        );
        this.overDraftFacilityForm.get('premiumRateCT').patchValue(
            this.overDraftFacilityForm.get('premiumRateTrans').value
        );
        this.overDraftFacilityForm.get('interestRateCT').patchValue(
            this.overDraftFacilityForm.get('interestRateTrans').value
        );
        this.overDraftFacilityForm.get('dateOfExpiryTypeCT').patchValue(
            this.overDraftFacilityForm.get('dateOfExpiryTypeTrans').value
        );
        this.overDraftFacilityForm.get('dateOfExpiryCT').patchValue(
            this.overDraftFacilityForm.get('dateOfExpiryTrans').value
        );
    }
}

import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';

@Component({
    selector: 'app-mortgage-or-equity-mortgage-term-loan',
    templateUrl: './mortgage-or-equity-mortgage-term-loan.component.html',
    styleUrls: ['./mortgage-or-equity-mortgage-term-loan.component.scss']
})
export class MortgageOrEquityMortgageTermLoanComponent implements OnInit {
    @Input() loanName;
    mortgageEquityTermForm: FormGroup;
    isComplementaryOther = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    selectedMortgageVal: any;
    isSelectedTermLoanType = false;
    translatedForm: FormGroup;
    tdValues: any = {};
    spinner = false;

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
                private datePipe: DatePipe,
                private translatedService: SbTranslateService) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
        }
        this.ADExpiry = true;
    }

    buildForm() {
        this.mortgageEquityTermForm = this.formBuilder.group({
            termLoanFor: [undefined],
            termLoanType: [undefined],
            complimentaryOther: [undefined],
            multiLoan: [undefined],
            purposeOfLoan: [undefined],
            loanAmount: [undefined],
            loanAmountAmountWords: [undefined],
            drawingPowerBasis: [undefined],
            drawingPowerInPercentage: [undefined],
            /* FOR GLOBAL INTEREST RATE CONDITIONS */
            baseRate: [undefined],
            premiumRate: [undefined],
            interestRate: [undefined],
            emiInFigure: [undefined],
            emiInWords: [undefined],
            totalNumberOfInstallment: [undefined],
            serviceCharge: [undefined],
            tenureOfLoan: [undefined],
            dateOfExpiryType: ['AD'],
            dateOfExpiry: [undefined],
            dateOfExpiryNepali: [undefined],
            paymentTerms: [undefined],
            paymentAmountInFigure: [undefined],
            paymentAmountInWords: [undefined],
            totalNumberOfPayments: [undefined],
            emiPaymentType: [undefined],

            /* FOR TRANSLATION FIELDS  */
            termLoanForTrans: [undefined],
            termLoanTypeTrans: [undefined],
            complimentaryOtherTrans: [undefined],
            multiLoanTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountAmountWordsTrans: [undefined],
            drawingPowerBasisTrans: [undefined],
            drawingPowerInPercentageTrans: [undefined],
            /* FOR GLOBAL INTEREST RATE CONDITIONS */
            baseRateTrans: [undefined],
            premiumRateTrans: [undefined],
            interestRateTrans: [undefined],
            emiInFigureTrans: [undefined],
            emiInWordsTrans: [undefined],
            totalNumberOfInstallmentTrans: [undefined],
            serviceChargeTrans: [undefined],
            tenureOfLoanTrans: [undefined],
            dateOfExpiryTypeTrans: [undefined],
            dateOfExpiryTrans: [undefined],
            paymentTermsTrans: [undefined],
            paymentAmountInFigureTrans: [undefined],
            paymentAmountInWordsTrans: [undefined],
            totalNumberOfPaymentsTrans: [undefined],
            emiPaymentTypeTrans: [undefined],

            /* FOR CT VALUES */
            termLoanForCT: [undefined],
            termLoanTypeCT: [undefined],
            complimentaryOtherCT: [undefined],
            multiLoanCT: [undefined],
            purposeOfLoanCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountAmountWordsCT: [undefined],
            drawingPowerBasisCT: [undefined],
            drawingPowerInPercentageCT: [undefined],
            /* FOR GLOBAL INTEREST RATE CONDITIONS */
            baseRateCT: [undefined],
            premiumRateCT: [undefined],
            interestRateCT: [undefined],
            emiInFigureCT: [undefined],
            emiInWordsCT: [undefined],
            totalNumberOfInstallmentCT: [undefined],
            serviceChargeCT: [undefined],
            tenureOfLoanCT: [undefined],
            dateOfExpiryTypeCT: [undefined],
            dateOfExpiryCT: [undefined],
            paymentTermsCT: [undefined],
            paymentAmountInFigureCT: [undefined],
            paymentAmountInWordsCT: [undefined],
            totalNumberOfPaymentsCT: [undefined],
            emiPaymentTypeCT: [undefined]
        });
    }

    checkComplimentary(data) {
        this.isComplementaryOther = data;
        this.mortgageEquityTermForm.get('complimentaryOther').patchValue(this.isComplementaryOther);
    }

    public getNumAmountWord(numLabel, wordLabel): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.mortgageEquityTermForm.get(numLabel).value);
        this.mortgageEquityTermForm.get(wordLabel).patchValue(transformValue);
    }

    calInterestRate() {
        const baseRate = this.mortgageEquityTermForm.get('baseRate').value;
        const premiumRate = this.mortgageEquityTermForm.get('premiumRate').value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.mortgageEquityTermForm.get('interestRate').patchValue(sum);
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    setEquityMortgageLoan(data) {
        this.selectedMortgageVal = data;
        this.isSelectedTermLoanType = !ObjectUtil.isEmpty(data);
    }

    async setTranslatedVal() {
        this.spinner = true;
        /*SET TRANSLATED VALUES OR THE CONDITIONS */
        this.mortgageEquityTermForm.get('complimentaryOther').patchValue(this.isComplementaryOther);
        const tempTermLoanFor = this.mortgageEquityTermForm.get('termLoanFor').value;
        if (!ObjectUtil.isEmpty(tempTermLoanFor)) {
            this.mortgageEquityTermForm.get('termLoanForTrans').patchValue(tempTermLoanFor);
        }

        const tempTermLoanType = this.mortgageEquityTermForm.get('termLoanType').value;
        if (!ObjectUtil.isEmpty(tempTermLoanType)) {
            this.mortgageEquityTermForm.get('termLoanTypeTrans').patchValue(tempTermLoanType);
        }

        this.mortgageEquityTermForm.get('complimentaryOtherTrans').patchValue(this.isComplementaryOther);

        const tempMultiLoan = this.mortgageEquityTermForm.get('multiLoan').value;
        if (!ObjectUtil.isEmpty(tempMultiLoan)) {
            this.mortgageEquityTermForm.get('multiLoanTrans').patchValue(tempMultiLoan);
        }

        const tempDrawingPowerBasis = this.mortgageEquityTermForm.get('drawingPowerBasis').value;
        if (!ObjectUtil.isEmpty(tempDrawingPowerBasis)) {
            this.mortgageEquityTermForm.get('drawingPowerBasisTrans').patchValue(tempDrawingPowerBasis);
        }

        const tempPaymentTerms = this.mortgageEquityTermForm.get('paymentTerms').value;
        if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
            this.mortgageEquityTermForm.get('paymentTermsTrans').patchValue(tempPaymentTerms);
        }

        const tempEmiPaymentType = this.mortgageEquityTermForm.get('emiPaymentType').value;
        if (!ObjectUtil.isEmpty(tempEmiPaymentType)) {
            this.mortgageEquityTermForm.get('emiPaymentTypeTrans').patchValue(tempEmiPaymentType);
        }

        /* SET REMAINING TRANSLATED DATA FOR FIELDS WITH EXISTED LIBRARIES*/
        const convertedLoanAmount = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('loanAmount').value, true);
        this.mortgageEquityTermForm.get('loanAmountTrans').patchValue(convertedLoanAmount);

        this.mortgageEquityTermForm.get('loanAmountAmountWordsTrans').patchValue(
            this.mortgageEquityTermForm.get('loanAmountAmountWords').value
        );

        const convertedDrawingPower = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('drawingPowerInPercentage').value, false);
        this.mortgageEquityTermForm.get('drawingPowerInPercentageTrans').patchValue(convertedDrawingPower);

        const convertedBaseRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('baseRate').value, false);
        this.mortgageEquityTermForm.get('baseRateTrans').patchValue(convertedBaseRate);

        const convertedPremiumRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('premiumRate').value, false);
        this.mortgageEquityTermForm.get('premiumRateTrans').patchValue(convertedPremiumRate);

        const convertedInterestRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('interestRate').value, false);
        this.mortgageEquityTermForm.get('interestRateTrans').patchValue(convertedInterestRate);

        const convertedEmi = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('emiInFigure').value, false);
        this.mortgageEquityTermForm.get('emiInFigureTrans').patchValue(convertedEmi);

        this.mortgageEquityTermForm.get('emiInWordsTrans').patchValue(
            this.mortgageEquityTermForm.get('emiInWords').value
        );

        const convertedTotalNumber = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('totalNumberOfInstallment').value, false);
        this.mortgageEquityTermForm.get('totalNumberOfInstallmentTrans').patchValue(convertedTotalNumber);

        const convertedServiceCharge = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('serviceCharge').value, false);
        this.mortgageEquityTermForm.get('serviceChargeTrans').patchValue(convertedServiceCharge);

        const convertedTenureOfLoanTrans = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('tenureOfLoan').value, false);
        this.mortgageEquityTermForm.get('tenureOfLoanTrans').patchValue(convertedTenureOfLoanTrans);


        // this.mortgageEquityTermForm.get('dateOfExpiryTypeTrans').patchValue('');
        // this.mortgageEquityTermForm.get('dateOfExpiryTrans').patchValue('');
        /* Converting value for date */
        this.mortgageEquityTermForm.get('dateOfExpiryTypeTrans').patchValue(
            this.mortgageEquityTermForm.get('dateOfExpiryType').value
        );
        const tempDateOfExpType = this.mortgageEquityTermForm.get('dateOfExpiryType').value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.mortgageEquityTermForm.get('dateOfExpiry').value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ?
                this.engToNepDatePipe.transform(this.datePipe.transform(tempEngExpDate), true) : '';
            this.mortgageEquityTermForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        } else {
            const tempDateOfExpNep = this.mortgageEquityTermForm.get('dateOfExpiryNepali').value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.mortgageEquityTermForm.get('dateOfExpiryTrans').patchValue(tempExpDate);
        }
        const convertedPaymentAmount = this.convertNumbersToNepali(this.mortgageEquityTermForm.get('paymentAmountInFigure').value, false);
        this.mortgageEquityTermForm.get('paymentAmountInFigureTrans').patchValue(convertedPaymentAmount);

        this.mortgageEquityTermForm.get('paymentAmountInWordsTrans').patchValue(
            this.mortgageEquityTermForm.get('paymentAmountInWords').value
        );

        const convertPaymentAmount = this.mortgageEquityTermForm.get('totalNumberOfPayments').value;
        this.mortgageEquityTermForm.get('totalNumberOfPaymentsTrans').patchValue(convertPaymentAmount);

        /* Constructing Form for translation */
        this.translatedForm = this.formBuilder.group({
            purposeOfLoan: [this.mortgageEquityTermForm.get('purposeOfLoan').value],
        });

        /* Calling Translation Service */
        this.tdValues = await this.translate(this.translatedForm);
        /* required google translate*/
        if (!ObjectUtil.isEmpty(this.tdValues)) {
            this.mortgageEquityTermForm.get('purposeOfLoanTrans').patchValue(this.tdValues.purposeOfLoan);
        }
        /* SETTING FINAL CT VALUES */
        this.setCTValues();
        this.spinner = false;
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

    setCTValues() {
        this.mortgageEquityTermForm.get('termLoanForCT').patchValue(
            this.mortgageEquityTermForm.get('termLoanForTrans').value
        );
        this.mortgageEquityTermForm.get('termLoanTypeCT').patchValue(
            this.mortgageEquityTermForm.get('termLoanTypeTrans').value
        );
        this.mortgageEquityTermForm.get('complimentaryOtherCT').patchValue(
            this.mortgageEquityTermForm.get('complimentaryOtherTrans').value
        );
        this.mortgageEquityTermForm.get('multiLoanCT').patchValue(
            this.mortgageEquityTermForm.get('multiLoanTrans').value
        );
        this.mortgageEquityTermForm.get('purposeOfLoanCT').patchValue(
            this.mortgageEquityTermForm.get('purposeOfLoanTrans').value
        );
        this.mortgageEquityTermForm.get('loanAmountCT').patchValue(
            this.mortgageEquityTermForm.get('loanAmountTrans').value
        );
        this.mortgageEquityTermForm.get('loanAmountAmountWordsCT').patchValue(
            this.mortgageEquityTermForm.get('loanAmountAmountWordsTrans').value
        );
        this.mortgageEquityTermForm.get('drawingPowerBasisCT').patchValue(
            this.mortgageEquityTermForm.get('drawingPowerBasisTrans').value
        );
        this.mortgageEquityTermForm.get('drawingPowerInPercentageCT').patchValue(
            this.mortgageEquityTermForm.get('drawingPowerInPercentageTrans').value
        );

        this.mortgageEquityTermForm.get('baseRateCT').patchValue(
            this.mortgageEquityTermForm.get('baseRateTrans').value
        );
        this.mortgageEquityTermForm.get('premiumRateCT').patchValue(
            this.mortgageEquityTermForm.get('premiumRateTrans').value
        );
        this.mortgageEquityTermForm.get('interestRateCT').patchValue(
            this.mortgageEquityTermForm.get('interestRateTrans').value
        );
        this.mortgageEquityTermForm.get('emiInFigureCT').patchValue(
            this.mortgageEquityTermForm.get('emiInFigureTrans').value
        );
        this.mortgageEquityTermForm.get('emiInWordsCT').patchValue(
            this.mortgageEquityTermForm.get('emiInWordsTrans').value
        );
        this.mortgageEquityTermForm.get('totalNumberOfInstallmentCT').patchValue(
            this.mortgageEquityTermForm.get('totalNumberOfInstallmentTrans').value
        );
        this.mortgageEquityTermForm.get('serviceChargeCT').patchValue(
            this.mortgageEquityTermForm.get('serviceChargeTrans').value
        );
        this.mortgageEquityTermForm.get('tenureOfLoanCT').patchValue(
            this.mortgageEquityTermForm.get('tenureOfLoanTrans').value
        );
        this.mortgageEquityTermForm.get('dateOfExpiryTypeCT').patchValue(
            this.mortgageEquityTermForm.get('dateOfExpiryTypeTrans').value
        );
        this.mortgageEquityTermForm.get('dateOfExpiryCT').patchValue(
            this.mortgageEquityTermForm.get('dateOfExpiryTrans').value
        );
        this.mortgageEquityTermForm.get('paymentTermsCT').patchValue(
            this.mortgageEquityTermForm.get('paymentTermsTrans').value
        );
        this.mortgageEquityTermForm.get('paymentAmountInFigureCT').patchValue(
            this.mortgageEquityTermForm.get('paymentAmountInFigureTrans').value
        );
        this.mortgageEquityTermForm.get('paymentAmountInWordsCT').patchValue(
            this.mortgageEquityTermForm.get('paymentAmountInWordsTrans').value
        );
        this.mortgageEquityTermForm.get('totalNumberOfPaymentsCT').patchValue(
            this.mortgageEquityTermForm.get('totalNumberOfPaymentsTrans').value
        );
        this.mortgageEquityTermForm.get('emiPaymentTypeCT').patchValue(
            this.mortgageEquityTermForm.get('emiPaymentTypeTrans').value
        );
    }
}

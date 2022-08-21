import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {CurrencyFormatterPipe} from '../../../../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {DatePipe} from '@angular/common';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {OfferDocument} from '../../../../../../../model/OfferDocument';
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

@Component({
    selector: 'app-mortgage-or-equity-mortgage-term-loan',
    templateUrl: './mortgage-or-equity-mortgage-term-loan.component.html',
    styleUrls: ['./mortgage-or-equity-mortgage-term-loan.component.scss']
})
export class MortgageOrEquityMortgageTermLoanComponent implements OnInit {
    @Input() loanName;
    @Input() offerDocumentList: Array<OfferDocument>;
    @Input() cadDocAssignedLoan;
    initialInformation: any;
    mortgageEquityTermForm: FormGroup;
    isComplementaryOther = false;
    loanDetails: any = [];
    ADExpiry = false;
    BSExpiry = false;
    isYearly = false;
    isSemiYearly = false;
    isMonthly = false;
    isQuarterly = false;
    isSubsequent = false;
    isEvery = false;
    isNewTermLoan = false;
    isOtherCreditLimit = false;
    isNewInstallmentBasis = false;
    isReviewCreditLimit = false;
    translatedFormGroup: FormGroup;
    dateType = [{key: 'AD', value: 'AD', checked: true}, {key: 'BS', value: 'BS'}];
    isSelectedTermLoanType = false;
    translatedValue: any;
    loanNameConstant = LoanNameConstant;
    filteredList: any = [];
    filteredListMortgage: any = [];
    tdValues: any = {};
    spinner = false;
    yesNoOptions = [
        {value: 'Yes'},
        {value: 'No'}
    ];
    mortgageType = [
        {value: 'New'},
        {value: 'Existing'},
        {value: 'Enhancement'}
    ];
    filteredLoanIdList: any = [];
    filteredLoanMortgageIdList: any = [];

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
                private translateService: SbTranslateService,
                private datePipe: DatePipe,
                private translatedService: SbTranslateService,
                private engToNepWord: NepaliCurrencyWordPipe) {
    }

    ngOnInit() {
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
            this.filterLoanDetails(this.loanDetails);
        }
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.mortgageEquityTermForm.patchValue(this.initialInformation.mortgageEquityTermForm);
            }
            this.patchDate();
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            for (let val = 0; val < this.filteredList.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredList[val].loanAmount.toFixed(2));
                this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', val, 'loanAmount']).patchValue(
                    this.filteredList[val] ? this.filteredList[val].loanAmount : '');
                this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        if (!ObjectUtil.isEmpty(this.filteredListMortgage)) {
            for (let val = 0; val < this.filteredListMortgage.length; val++) {
                const loanamountWords = this.engToNepWord.transform(this.filteredListMortgage[val].loanAmount);
                this.mortgageEquityTermForm.get(['mortgageTermFormArray', val, 'loanAmount']).patchValue(
                    this.filteredListMortgage[val] ? this.filteredListMortgage[val].loanAmount : '');
                this.mortgageEquityTermForm.get(['mortgageTermFormArray', val, 'loanAmountWords']).patchValue(
                    loanamountWords ? loanamountWords : '');
            }
        }
        this.setLoanId();
    }
    patchDate() {
        for (let val = 0; val < this.initialInformation.mortgageEquityTermForm.mortgageEquityTermFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.mortgageEquityTermForm.mortgageEquityTermFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }

        for (let val = 0; val < this.initialInformation.mortgageEquityTermForm.mortgageTermFormArray.length; val++) {
            const dateOfExpiryType = this.initialInformation.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = this.initialInformation.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.mortgageEquityTermForm.get(['mortgageTermFormArray', val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = this.initialInformation.mortgageEquityTermForm.mortgageTermFormArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.mortgageEquityTermForm.get(['mortgageTermFormArray', val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }
    buildForm() {
        this.mortgageEquityTermForm = this.formBuilder.group({
            mortgageEquityTermFormArray: this.formBuilder.array([]),
            mortgageTermFormArray: this.formBuilder.array([]),
        });
    }

    checkComplimentary(data, index) {
        if (!data) {
            this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', index, 'complementaryOther']).patchValue(data);
        }
    }
    checkComplimentary1(data, index) {
        if (!data) {
            this.mortgageEquityTermForm.get(['mortgageTermFormArray', index, 'complementaryOther']).patchValue(data);
        }
    }
    setEquityMortgageLoan(data, i) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isNewTermLoan = tempData === 'NEW_EMI_TERM_LOAN';
        this.isOtherCreditLimit = tempData === 'OTHER_CREDIT_LIMITS';
        this.isNewInstallmentBasis = tempData === 'NEW_INSTALLMENT_BASIS';
        this.isReviewCreditLimit = tempData === 'REVIEW_OF_OTHER_CREDIT_LIMIT';
    }
    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.mortgageEquityTermForm.get([arrayName, index, numLabel]).value);
        this.mortgageEquityTermForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
    }
    setEMIPaymentType(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isSubsequent = tempData === 'SUBSEQUENT_MONTH';
        this.isEvery = tempData === 'EVERY_20TH';
    }

    filterLoanDetails(loanDetails) {
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.EQUITY_MORTGAGE_TERM_LOAN);
        this.filteredListMortgage = loanDetails.filter(data => data.name === this.loanNameConstant.MORTGAGE_TERM_LOAN);
        this.filteredList.forEach(value => {
            this.addLoanFormArr();
        });
        this.filteredListMortgage.forEach(value => {
            this.addMortgageLoanFormArr();
        });
    }

    calInterestRate(index, arrName) {
        const baseRate = this.mortgageEquityTermForm.get([arrName, index, 'baseRate']).value;
        const premiumRate = this.mortgageEquityTermForm.get([arrName, index, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.mortgageEquityTermForm.get([arrName, index, 'interestRate']).patchValue(sum.toFixed(2));
    }

    public checkDateOfExpiry(value): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    setPaymentTerms(data) {
        const tempData = !ObjectUtil.isEmpty(data) ? data : '';
        this.isYearly = tempData === 'YEARLY';
        this.isSemiYearly = tempData === 'SEMI_YEARLY';
        this.isQuarterly = tempData === 'QUARTERLY';
        this.isMonthly = tempData === 'MONTHLY';
    }

    async setTranslatedVal(index, mainArray) {
        this.spinner = true;
        /*SET TRANSLATED VALUES OR THE CONDITIONS */
        const tempTermLoanFor = this.mortgageEquityTermForm.get([mainArray, index, 'termLoanFor']).value;
        if (!ObjectUtil.isEmpty(tempTermLoanFor)) {
            this.mortgageEquityTermForm.get([mainArray, index, 'termLoanForTrans']).patchValue(tempTermLoanFor);
        }

        const tempTermLoanType = this.mortgageEquityTermForm.get([mainArray, index, 'termLoanType']).value;
        if (!ObjectUtil.isEmpty(tempTermLoanType)) {
            this.mortgageEquityTermForm.get([mainArray, index, 'termLoanTypeTrans']).patchValue(tempTermLoanType);
        }

        this.mortgageEquityTermForm.get([mainArray, index, 'complementaryOtherTrans']).patchValue(this.isComplementaryOther);

        // tslint:disable-next-line:max-line-length
        const tempComplimentaryLoanSelected = this.mortgageEquityTermForm.get([mainArray, index, 'complimentaryLoanSelected']).value;
        if (!ObjectUtil.isEmpty(tempComplimentaryLoanSelected)) {
            // tslint:disable-next-line:max-line-length
            this.mortgageEquityTermForm.get([mainArray, index, 'complimentaryLoanSelectedTrans']).patchValue(tempComplimentaryLoanSelected);
        }

        const tempDrawingPowerBasis = this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerBasis']).value;
        if (!ObjectUtil.isEmpty(tempDrawingPowerBasis)) {
            this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerBasisTrans']).patchValue(tempDrawingPowerBasis);
        }

        const tempPaymentTerms = this.mortgageEquityTermForm.get([mainArray, index, 'paymentTerms']).value;
        if (!ObjectUtil.isEmpty(tempPaymentTerms)) {
            this.mortgageEquityTermForm.get([mainArray, index, 'paymentTermsTrans']).patchValue(tempPaymentTerms);
        }

        const tempEmiPaymentType = this.mortgageEquityTermForm.get([mainArray, index, 'emiPaymentType']).value;
        if (!ObjectUtil.isEmpty(tempEmiPaymentType)) {
            this.mortgageEquityTermForm.get([mainArray, index, 'emiPaymentTypeTrans']).patchValue(tempEmiPaymentType);
        }

        /* SET REMAINING TRANSLATED DATA FOR FIELDS WITH EXISTED LIBRARIES*/
        const tempLoanAmount = this.mortgageEquityTermForm.get([mainArray, index, 'loanAmount']).value;
        const convertNumber = !ObjectUtil.isEmpty(tempLoanAmount) ?
            this.convertNumbersToNepali(tempLoanAmount, true) : '';
        this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountTrans']).patchValue(convertNumber);

        this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountWordsTrans']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountWords']).value
        );

        const convertedDrawingPower = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerInPercentage']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerInPercentageTrans']).patchValue(convertedDrawingPower);

        // tslint:disable-next-line:max-line-length
        const convertedBaseRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'baseRate']).value.toFixed(2), false);
        this.mortgageEquityTermForm.get([mainArray, index, 'baseRateTrans']).patchValue(convertedBaseRate);

        // tslint:disable-next-line:max-line-length
        const convertedPremiumRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'premiumRate']).value.toFixed(2), false);
        this.mortgageEquityTermForm.get([mainArray, index, 'premiumRateTrans']).patchValue(convertedPremiumRate);

        const convertedInterestRate = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'interestRate']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'interestRateTrans']).patchValue(convertedInterestRate);

        const tempEMIAmount = this.mortgageEquityTermForm.get([mainArray, index, 'emiInFigure']).value;
        const convertNumber1 = !ObjectUtil.isEmpty(tempEMIAmount) ?
            this.convertNumbersToNepali(tempEMIAmount, true) : '';
        this.mortgageEquityTermForm.get([mainArray, index, 'emiInFigureTrans']).patchValue(convertNumber1);
        this.mortgageEquityTermForm.get([mainArray, index, 'emiInWordsTrans']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'emiInWords']).value
        );
        const convertedTotalNumber = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfInstallment']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfInstallmentTrans']).patchValue(convertedTotalNumber);

        const convertedServiceCharge = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'serviceCharge']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'serviceChargeTrans']).patchValue(convertedServiceCharge);

        const convertedTenureOfLoanTrans = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'tenureOfLoan']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'tenureOfLoanTrans']).patchValue(convertedTenureOfLoanTrans);
        /* Converting value for date */
        this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTypeTrans']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTrans']).patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }
        const convertedPaymentAmount = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInFigure']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInFigureTrans']).patchValue(convertedPaymentAmount);

        this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInWordsTrans']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInWords']).value
        );

        const convertPaymentAmount = this.convertNumbersToNepali(this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfPayments']).value, false);
        this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfPaymentsTrans']).patchValue(convertPaymentAmount);

        /* Constructing Form for translation */
        this.translatedFormGroup = this.formBuilder.group({
            purposeOfLoan: [this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoan']).value],
        });

        // translated by google api
        this.translatedFormGroup = this.formBuilder.group({
        purposeOfLoan: !ObjectUtil.isEmpty(this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoan']).value) ?
                this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoan']).value : '',
        });
        this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
        // tslint:disable-next-line:max-line-length
        this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoanTrans']).patchValue(this.translatedValue.purposeOfLoan);
        this.setCTValues(index, mainArray);
        this.spinner = false;
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
    buildLoanForm() {
        return this.formBuilder.group({
            termLoanFor: [undefined],
            subsidyOrAgricultureLoan: [undefined],
            mortgageType: [undefined],
            termLoanType: [undefined],
            complementaryOther: [undefined],
            complimentaryLoanSelected: [undefined],
            purposeOfLoan: [undefined],
            loanAmount: [undefined],
            loanAmountWords: [undefined],
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
            dateOfExpiryType: [undefined],
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
            complementaryOtherTrans: [undefined],
            complimentaryLoanSelectedTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            loanAmountTrans: [undefined],
            loanAmountWordsTrans: [undefined],
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
            dateOfExpiryNepaliTrans: [undefined],
            paymentTermsTrans: [undefined],
            paymentAmountInFigureTrans: [undefined],
            paymentAmountInWordsTrans: [undefined],
            totalNumberOfPaymentsTrans: [undefined],
            emiPaymentTypeTrans: [undefined],

            /* FOR CT VALUES */
            termLoanForCT: [undefined],
            termLoanTypeCT: [undefined],
            complementaryOtherCT: [undefined],
            complimentaryLoanSelectedCT: [undefined],
            purposeOfLoanCT: [undefined],
            loanAmountCT: [undefined],
            loanAmountWordsCT: [undefined],
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
            dateOfExpiryNepaliCT: [undefined],
            paymentTermsCT: [undefined],
            paymentAmountInFigureCT: [undefined],
            paymentAmountInWordsCT: [undefined],
            totalNumberOfPaymentsCT: [undefined],
            emiPaymentTypeCT: [undefined],
            loanId: [undefined],
        });
    }
    async translate(form) {
        const translatedData = await this.translatedService.translateForm(form);
        return translatedData;
    }

    setCTValues(index, mainArray) {
        this.mortgageEquityTermForm.get([mainArray, index, 'termLoanForCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'termLoanForTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'termLoanTypeCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'termLoanTypeTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'complementaryOtherCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'complementaryOtherTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'complimentaryLoanSelectedCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'complimentaryLoanSelectedTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoanCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'purposeOfLoanTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountWordsCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'loanAmountWordsTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerBasisCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerBasisTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerInPercentageCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'drawingPowerInPercentageTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'baseRateCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'baseRateTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'premiumRateCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'premiumRateTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'interestRateCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'interestRateTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'emiInFigureCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'emiInFigureTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'emiInWordsCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'emiInWordsTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfInstallmentCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfInstallmentTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'serviceChargeCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'serviceChargeTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'tenureOfLoanCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'tenureOfLoanTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTypeCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTypeTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryNepaliCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryNepaliTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'dateOfExpiryTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'paymentTermsCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'paymentTermsTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInFigureCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInFigureTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInWordsCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'paymentAmountInWordsTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfPaymentsCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'totalNumberOfPaymentsTrans']).value
        );
        this.mortgageEquityTermForm.get([mainArray, index, 'emiPaymentTypeCT']).patchValue(
            this.mortgageEquityTermForm.get([mainArray, index, 'emiPaymentTypeTrans']).value
        );
    }
    addLoanFormArr() {
        (this.mortgageEquityTermForm.get('mortgageEquityTermFormArray') as FormArray).push(this.buildLoanForm());
    }
    addMortgageLoanFormArr() {
        (this.mortgageEquityTermForm.get('mortgageTermFormArray') as FormArray).push(this.buildLoanForm());
    }
    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.EQUITY_MORTGAGE_TERM_LOAN);
        this.filteredLoanMortgageIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.MORTGAGE_TERM_LOAN);
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            this.filteredList.forEach((val, i) => {
                this.mortgageEquityTermForm.get(['mortgageEquityTermFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanIdList[i].proposal.id);
            });
        }
        if (!ObjectUtil.isEmpty(this.filteredListMortgage)) {
            this.filteredListMortgage.forEach((val, i) => {
                this.mortgageEquityTermForm.get(['mortgageTermFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanMortgageIdList[i].proposal.id);
            });
        }
    }
}

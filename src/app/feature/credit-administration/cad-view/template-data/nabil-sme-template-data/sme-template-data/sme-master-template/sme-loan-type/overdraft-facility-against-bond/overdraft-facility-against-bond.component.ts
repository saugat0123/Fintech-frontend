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
import {LoanNameConstant} from '../../../../sme-costant/loan-name-constant';

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
    @Input() cadDocAssignedLoan;
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
    initialData;
    loanDetails: any = [];
    loanNameConstant = LoanNameConstant;
    filteredList: any = [];
    filteredListDl: any = [];
    filteredListStl: any = [];
    filteredLoanIdList: any = [];
    filteredLoanStlIdList: any = [];
    filteredLoanDLIdList: any = [];

    constructor(private formBuilder: FormBuilder,
                private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
                private engToNepNumberPipe: EngToNepaliNumberPipe,
                private currencyFormatterPipe: CurrencyFormatterPipe,
                private engToNepDatePipe: EngNepDatePipe,
                private datePipe: DatePipe,
                private spinnerService: NgxSpinnerService,
                private translatedService: SbTranslateService,
                private engToNepWord: NepaliCurrencyWordPipe) {
    }

    ngOnInit() {
        if (!ObjectUtil.isEmpty(this.customerApprovedDoc) && this.offerDocumentList.length > 0) {
            this.initialData = JSON.parse(this.customerApprovedDoc.offerDocumentList[0].initialInformation);
        }
        this.overdraftFacilityNumber = this.customerApprovedDoc.assignedLoan.filter(val =>
            val.loan.name === 'OVERDRAFT FACILITY AGAINST BOND');
        this.buildForm();
        if (!ObjectUtil.isEmpty(this.loanName)) {
            this.loanDetails = this.loanName;
            this.filterLoanDetails(this.loanDetails);
        }
        this.ADExpiry = true;
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation)) {
                this.overDraftFacilityForm.patchValue(
                    this.initialInformation.overDraftFacilityForm);
            }
            Object.keys(this.initialInformation.overDraftFacilityForm).forEach((val) => {
                this.patchDate(val);
            });
        }
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            this.loanAmountPatch(this.filteredList, 'overdraftFacilityDetails');
        }
        if (!ObjectUtil.isEmpty(this.filteredListDl)) {
            this.loanAmountPatch(this.filteredListDl, 'dlAgainstBondFormArray');
        }
        if (!ObjectUtil.isEmpty(this.filteredListStl)) {
            this.loanAmountPatch(this.filteredListStl, 'stlAgainstBondFormArray');
        }
        this.setLoanId();
    }
    loanAmountPatch(array, formArray) {
        for (let val = 0; val < array.length; val++) {
            const loanamountWords = this.engToNepWord.transform(array[val].loanAmount);
            this.overDraftFacilityForm.get([formArray, val, 'loanAmount']).patchValue(
                array[val] ? array[val].loanAmount : '');
            this.overDraftFacilityForm.get([formArray, val, 'loanAmountWords']).patchValue(
                loanamountWords ? loanamountWords : '');
        }
    }

    filterLoanDetails(loanDetails) {
        this.filteredList = loanDetails.filter(data => data.name === this.loanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND);
        this.filteredListDl = loanDetails.filter(data => data.name === this.loanNameConstant.DL_FACILITY_AGAINST_BOND);
        this.filteredListStl = loanDetails.filter(data => data.name === this.loanNameConstant.STL_FACILITY_AGAINST_BOND);
        this.filteredList.forEach((value, i) => {
            this.setOverdraftBondForm();
            if (this.isEdit) {
                this.setBondDetails(
                    'overdraftFacilityDetails', i, this.initialData.overDraftFacilityForm.overdraftFacilityDetails[i].bondDetails);
            }
        });
        this.filteredListDl.forEach((value, i) => {
            this.setDlBondForm();
            if (this.isEdit) {
                this.setBondDetails(
                    'dlAgainstBondFormArray', i, this.initialData.overDraftFacilityForm.dlAgainstBondFormArray[i].bondDetails);
            }
        });
        this.filteredListStl.forEach((value, i) => {
            this.setStlBondForm();
            if (this.isEdit) {
                this.setBondDetails(
                    'stlAgainstBondFormArray', i, this.initialData.overDraftFacilityForm.stlAgainstBondFormArray[i].bondDetails);
            }
        });
    }
    setBondDetails(patchingArray, ind, nestArray) {
        if (nestArray.length > 0) {
            for (let a = 0; a < nestArray.length; a++) {
                (this.overDraftFacilityForm.get([patchingArray, ind, 'bondDetails']) as FormArray).push(
                    this.formBuilder.group({
                        bondOwnerName: [undefined],
                        bondOwnerNameTrans: [undefined],
                        bondOwnerNameCT: [undefined],
                    })
                );
            }
        }
    }
    patchDate(mainArray) {
        for (let val = 0; val < mainArray.length; val++) {
            const dateOfExpiryType = mainArray[val].dateOfExpiryType;
            if (dateOfExpiryType === 'AD') {
                const dateOfExpiry = mainArray[val].dateOfExpiry;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.overDraftFacilityForm.get([mainArray, val, 'dateOfExpiry']).patchValue(new Date(dateOfExpiry));
                }
            } else if (dateOfExpiryType === 'BS') {
                const dateOfExpiry = mainArray[val].dateOfExpiryNepali;
                if (!ObjectUtil.isEmpty(dateOfExpiry)) {
                    this.overDraftFacilityForm.get([mainArray, val, 'dateOfExpiryNepali']).patchValue(dateOfExpiry);
                }
            }
        }
    }

    buildForm() {
        this.overDraftFacilityForm = this.formBuilder.group({
            overdraftFacilityDetails: this.formBuilder.array([]),
            dlAgainstBondFormArray: this.formBuilder.array([]),
            stlAgainstBondFormArray: this.formBuilder.array([]),
        });
    }
    setOverdraftBondForm() {
        (this.overDraftFacilityForm.get('overdraftFacilityDetails') as FormArray).push(this.setFormArray());
    }
    setDlBondForm() {
        (this.overDraftFacilityForm.get('dlAgainstBondFormArray') as FormArray).push(this.setFormArray());
    }
    setStlBondForm() {
        (this.overDraftFacilityForm.get('stlAgainstBondFormArray') as FormArray).push(this.setFormArray());
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
            loanId: [undefined],
        });
    }

    public getNumAmountWord(numLabel, wordLabel, i): void {
        const transformValue = this.nepaliCurrencyWordPipe.transform(this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, numLabel]).value);
        this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, wordLabel]).patchValue(transformValue);
    }

    calInterestRate(i, mainArray) {
        const baseRate = this.overDraftFacilityForm.get([mainArray, i, 'baseRate']).value;
        const premiumRate = this.overDraftFacilityForm.get([mainArray, i, 'premiumRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.overDraftFacilityForm.get([mainArray, i, 'interestRate']).patchValue(sum.toFixed(2));
    }

    public checkDateOfExpiry(value, i): void {
        this.ADExpiry = value === 'AD';
        this.BSExpiry = value === 'BS';
    }

    async setTranslatedVal(i, mainArray) {
        // SET TRANS VALUE FOR CONDITIONS :
        const bondTypeTrans = this.overDraftFacilityForm.get([mainArray, i, 'bondType']).value;
        if (!ObjectUtil.isEmpty(bondTypeTrans)) {
            this.overDraftFacilityForm.get([mainArray, i, 'bondTypeTrans']).patchValue(bondTypeTrans);
        }

        const letterOfSetOffTrans = this.overDraftFacilityForm.get([mainArray, i, 'letterOfSetOffUsed']).value;
        if (!ObjectUtil.isEmpty(letterOfSetOffTrans)) {
            this.overDraftFacilityForm.get([mainArray, i, 'letterOfSetOffUsedTrans']).patchValue(letterOfSetOffTrans);
        }

        const interestType = this.overDraftFacilityForm.get([mainArray, i, 'interestRateType']).value;
        if (!ObjectUtil.isEmpty(interestType)) {
            this.overDraftFacilityForm.get([mainArray, i, 'interestRateTypeTrans']).patchValue(interestType);
        }
        /* SET TRANSLATED VALUE FOR OTHER FIELDS BY USING EXISTED PIPE */
        const convertLoanAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get([mainArray, i, 'loanAmount']).value, true);
        this.overDraftFacilityForm.get([mainArray, i, 'loanAmountTrans']).patchValue(convertLoanAmount);
        /* FOR LOAN AMOUNT WORDS */
        this.overDraftFacilityForm.get([mainArray, i, 'loanAmountWordsTrans']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'loanAmountWords']).value
        );
        const convertBondAmount = this.convertNumbersToNepali(this.overDraftFacilityForm.get([mainArray, i, 'bondAmount']).value, false);
        this.overDraftFacilityForm.get([mainArray, i, 'bondAmountTrans']).patchValue(convertBondAmount);
        if (this.overDraftFacilityForm.get([mainArray, i, 'interestRateType']).value === 'BASE_RATE_FINANCING') {
            const convertBaseRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get([mainArray, i, 'baseRate']).value ? this.overDraftFacilityForm.get([mainArray, i, 'baseRate']).value.toFixed(2) : 0, false);
            this.overDraftFacilityForm.get([mainArray, i, 'baseRateTrans']).patchValue(convertBaseRate);
            const convertPremiumRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get([mainArray, i, 'premiumRate']).value ? this.overDraftFacilityForm.get([mainArray, i, 'premiumRate']).value.toFixed(2) : 0, false);
            this.overDraftFacilityForm.get([mainArray, i, 'premiumRateTrans']).patchValue(convertPremiumRate);
            const convertInterestRate = this.convertNumbersToNepali(this.overDraftFacilityForm.get([mainArray, i, 'interestRate']).value, false);
            this.overDraftFacilityForm.get([mainArray, i, 'interestRateTrans']).patchValue(convertInterestRate);
        }
        // this.overDraftFacilityForm.get([mainArray, i, dateOfExpiryType']).patchValue('');
        // this.overDraftFacilityForm.get([mainArray, i, dateOfExpiry']).patchValue('');
        // this.overDraftFacilityForm.get([mainArray, i, dateOfExpiryNepali']).patchValue('');

        /* Converting value for date */
        this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTypeTrans']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryType']).value
        );
        const tempDateOfExpType = this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryType']).value;
        let tempExpDate;
        if (tempDateOfExpType === 'AD') {
            const tempEngExpDate = this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiry']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempEngExpDate) ? this.datePipe.transform(tempEngExpDate) : '';
            const finalExpDate = this.transformEnglishDate(tempExpDate);
            this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTrans']).patchValue(finalExpDate);
        } else {
            const tempDateOfExpNep = this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryNepali']).value;
            tempExpDate = !ObjectUtil.isEmpty(tempDateOfExpNep) ?
                tempDateOfExpNep.nDate : '';
            this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTrans']).patchValue(tempExpDate);
        }

        this.translateForm = this.formBuilder.group({
            nameOfFacility: [this.overDraftFacilityForm.get([mainArray, i, 'nameOfFacility']).value],
            // bondOwnerName: [this.overDraftFacilityForm.get([mainArray, i, bondOwnerName']).value]
        });

        /* Translating Values */
        this.tdValue = await this.translate(this.translateForm);

        /* SET GOOGLE TRANSLATED VALUE BY TRANSLATION */
        if (!ObjectUtil.isEmpty(this.tdValue)) {
            this.overDraftFacilityForm.get([mainArray, i, 'nameOfFacilityTrans']).patchValue(this.tdValue.nameOfFacility);
            // this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, bondOwnerNameTrans']).patchValue(this.tdValue.bondOwnerName);
        }

        this.setCTData(i, mainArray);
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

    /*addBondDetails() {
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
    }*/

    addBondDetails1(i, mainArray) {
        (this.overDraftFacilityForm.get([mainArray, i, 'bondDetails']) as FormArray).push(
            this.formBuilder.group({
                bondOwnerName: [undefined],
                bondOwnerNameTrans: [undefined],
                bondOwnerNameCT: [undefined],
            })
        );

    }

    removeBondDetails(i, index, mainArray) {
        (this.overDraftFacilityForm.get([mainArray, i, 'bondDetails']) as FormArray).removeAt(index);
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
    setCTData(i, mainArray) {
        this.overDraftFacilityForm.get([mainArray, i, 'bondTypeCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'bondTypeTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'letterOfSetOffUsedCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'letterOfSetOffUsedTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'interestRateTypeCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'interestRateTypeTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'nameOfFacilityCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'nameOfFacilityTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'loanAmountCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'loanAmountTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'loanAmountWordsCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'loanAmountWordsTrans']).value
        );
        // this.overDraftFacilityForm.get([mainArray, i, bondOwnerNameCT']).patchValue(
        //     this.overDraftFacilityForm.get([mainArray, i, bondOwnerNameTrans']).value
        // );
        this.overDraftFacilityForm.get([mainArray, i, 'bondAmountCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'bondAmountTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'baseRateCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'baseRateTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'premiumRateCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'premiumRateTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'interestRateCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'interestRateTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTypeCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTypeTrans']).value
        );
        this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryCT']).patchValue(
            this.overDraftFacilityForm.get([mainArray, i, 'dateOfExpiryTrans']).value
        );
    }
    setLoanId() {
        this.filteredLoanIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.OVERDRAFT_FACILITY_AGAINST_BOND);
        this.filteredLoanStlIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.STL_FACILITY_AGAINST_BOND);
        this.filteredLoanDLIdList = this.cadDocAssignedLoan.filter(data =>
            data.loan.name === this.loanNameConstant.DL_FACILITY_AGAINST_BOND);
        if (!ObjectUtil.isEmpty(this.filteredList)) {
            this.filteredList.forEach((val, i) => {
                this.overDraftFacilityForm.get(['overdraftFacilityDetails', i, 'loanId']).patchValue(
                    this.filteredLoanIdList[i].proposal.id);
            });
        }
        if (!ObjectUtil.isEmpty(this.filteredListStl)) {
            this.filteredListStl.forEach((val, i) => {
                this.overDraftFacilityForm.get(['stlAgainstBondFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanStlIdList[i].proposal.id);
            });
        }
        if (!ObjectUtil.isEmpty(this.filteredListDl)) {
            this.filteredListDl.forEach((val, i) => {
                this.overDraftFacilityForm.get(['dlAgainstBondFormArray', i, 'loanId']).patchValue(
                    this.filteredLoanDLIdList[i].proposal.id);
            });
        }
    }
}

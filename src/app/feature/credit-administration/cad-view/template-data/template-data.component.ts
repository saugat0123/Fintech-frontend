import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';
import {NabilOfferLetterConst} from '../../nabil-offer-letter-const';
import {LoanConfig} from '../../../admin/modal/loan-config';
import {LoanDataHolder} from '../../../loan/model/loanData';
import {ObjectUtil} from '../../../../@core/utils/ObjectUtil';
import {NabilConstants} from './nabil-constants';

@Component({
    selector: 'app-template-data',
    templateUrl: './template-data.component.html',
    styleUrls: ['./template-data.component.scss']
})
export class TemplateDataComponent implements OnInit, OnChanges {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    offerLetterTypes = NabilOfferLetterConst.enumObject();
    offerLetterConst = NabilOfferLetterConst;
    offerLetterSelect;
    form: FormGroup;
    translatedValues: any = {};
    spinner = false;
    @Input() isTabActive = false;
    offerLetterNames = [];
    customerCategory = [];
    isCombinedOfferLetter = false;
    isAutoLoan = false;
    isEducationLoan = false;
    isPersonalLoan = false;
    isPersonalOverdraft = false;
    isPersonalWithoutCollateral = false;
    isPersonalAndPersonalOverdraft = false;
    isHomeLoan = false;
    isMortgageLoan = false;
    isShareLoan = false;
    isSahayatriKarja = false;
    isKisanKarja = false;
    isUdyamsilKarja = false;
    isInterestSubsidy = false;
    isDdslWithoutSubsidy = false;
    isClassA = false;
    retailCombined = false;

    constructor(
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private translateService: SbTranslateService,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.offerLetterTypes = NabilOfferLetterConst.enumObject();
        this.offerLetterConst = NabilOfferLetterConst;
    }

    buildForm() {
        this.form = this.formBuilder.group({
            dateOfGeneration: [undefined],
            applicationDateInAD: [undefined],
            drawingPowerRate: [undefined],
            baseRate: [undefined],
            premiumRate: [undefined],
            yearlyFloatingInterestRate: [undefined],
            serviceCharge: [undefined],
            serviceChargeWords: [undefined],

            emiAmount: [undefined],
            emiAmountInWords: [undefined],
            numberOfEmi: [undefined],
            loanCommitmentFee: [undefined],

            ownersName: [undefined],
            ownersAddress: [undefined],
            propertyPlotNumber: [undefined],
            propertyArea: [undefined],
            sheetNumber: [undefined],

            branchName: [undefined],
            lateFee: [undefined],
            changeFeeBelow1Cr: [undefined],
            changeFeeAbove1Cr: [undefined],
            collateralReleaseFee: [undefined],
            documentAccessFee: [undefined],
            promissoryNoteAmount: [undefined],
            loanDeedAmount: [undefined],
            pledgeAmount: [undefined],
            guarantorName1: [undefined],
            guarantorAmount1: [undefined],
            guarantorAmountWords1: [undefined],
            signatureDate: [undefined],

            sakshiDistrict: [undefined],
            sakshiMunicipality: [undefined],
            sakshiWardNum: [undefined],

            sakshiName: [undefined],
            employeeName: [undefined]
        });
    }

    async translate() {
        this.spinner = true;
        this.translatedValues = await this.translateService.translateForm(this.form);
        this.spinner = false;
    }

    getNumAmountWord(numLabel, wordLabel) {
        const wordLabelVar = this.nepToEngNumberPipe.transform(this.form.get(numLabel).value);
        const returnVal = this.nepaliCurrencyWordPipe.transform(wordLabelVar);
        this.form.get(wordLabel).patchValue(returnVal);
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isTabActive) {
            this.getLoanOfferLetterName();
            this.getCustomerCategory();
        }
        if (this.isTabActive && this.offerLetterNames.length > 0) {
            console.log('Cad Data:', this.cadData);
            this.showTemplate(this.offerLetterNames);
        }
    }

    private getCustomerCategory() {
        this.cadData.assignedLoan.forEach((loanDataHolder: LoanDataHolder) => {
            this.customerCategory.push(loanDataHolder.loan.loanCategory);
        });
    }

   private getLoanOfferLetterName(): void {
        this.cadData.assignedLoan.forEach((loanDataHolder: LoanDataHolder) => {
            this.offerLetterNames.push(loanDataHolder.loan.offerLetterConst);
        });
   }

   private showTemplate(offerLetterNames): void {
        offerLetterNames.forEach((name, index) => {
            console.log('name', name);
            if (name === NabilConstants.AUTO_LOAN) {
                this.isAutoLoan = true;
            }
            if (name === NabilConstants.EDUCATIONAL) {
                this.isEducationLoan = true;
            }
            if (name === NabilConstants.PERSONAL_LOAN) {
                this.isPersonalLoan = true;
            }
            if (name === NabilConstants.PERSONAL_OVERDRAFT) {
                this.isPersonalOverdraft = true;
            }
            if (name === NabilConstants.PERSONAL_OVERDRAFT_WITHOUT_COLLATERAL) {
                this.isPersonalWithoutCollateral = true;
            }
            if (name === NabilConstants.PERSONAL_LOAN_AND_PERSONAL_OVERDRAFT) {
                this.isPersonalAndPersonalOverdraft = true;
            }
            if (name === NabilConstants.HOME_LOAN) {
                this.isHomeLoan = true;
            }
            if (name === NabilConstants.MORTAGE_LOAN) {
                this.isMortgageLoan = true;
            }
            if (name === NabilConstants.SHARE_LOAN) {
                this.isShareLoan = true;
            }
            if (name === NabilConstants.NABIL_SAHAYATRI_KARJA) {
                this.isSahayatriKarja = true;
            }
            if (name === NabilConstants.KISAN_KARJA_SUBSIDY) {
                this.isKisanKarja = true;
            }
            if (name === NabilConstants.UDYAMSIL_KARJA_SUBSIDY) {
                this.isUdyamsilKarja = true;
            }
            if (name === NabilConstants.INTEREST_SUBSIDY_SANCTION_LETTER) {
                this.isInterestSubsidy = true;
            }
            if (name === NabilConstants.DDSL_WITHOUT_SUBSIDY) {
                this.isDdslWithoutSubsidy = true;
            }
            if (name === NabilConstants.CLASS_A) {
                this.isClassA = true;
            }
            if (name === NabilConstants.COMBINED_LETTER && this.customerCategory[index] === 'INSTITUTION') {
                this.isCombinedOfferLetter = true;
            }
            if (name === NabilConstants.COMBINED_LETTER && this.customerCategory[index] === 'INDIVIDUAL') {
                this.retailCombined = true;
            }
        });
   }
}

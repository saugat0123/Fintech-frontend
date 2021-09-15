import {Component, Input, OnInit} from '@angular/core';
import {CustomerApprovedLoanCadDocumentation} from '../../model/customerApprovedLoanCadDocumentation';
import {MegaOfferLetterConst} from '../../mega-offer-letter-const';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../@core/service/sbtranslate.service';
import {NepaliToEngNumberPipe} from '../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
    selector: 'app-template-data',
    templateUrl: './template-data.component.html',
    styleUrls: ['./template-data.component.scss']
})
export class TemplateDataComponent implements OnInit {

    @Input() cadData: CustomerApprovedLoanCadDocumentation;
    offerLetterTypes = MegaOfferLetterConst.enumObject();
    offerLetterConst = MegaOfferLetterConst;
    offerLetterSelect;
    form: FormGroup;
    translatedValues: any = {};
    spinner = false;


    constructor(
        private formBuilder: FormBuilder,
        private nepToEngNumberPipe: NepaliToEngNumberPipe,
        private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
        private translateService: SbTranslateService,
    ) {
    }

    ngOnInit() {
        this.buildForm();
        this.offerLetterTypes = MegaOfferLetterConst.enumObject();
        this.offerLetterConst = MegaOfferLetterConst;
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

    submit() {

    }
}

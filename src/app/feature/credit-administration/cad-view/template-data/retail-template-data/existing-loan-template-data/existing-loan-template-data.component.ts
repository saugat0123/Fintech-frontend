import {Component, Input, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {LoanConfig} from '../../../../../admin/modal/loan-config';
import {Alert, AlertType} from '../../../../../../@theme/model/Alert';
import {LoanConfigService} from '../../../../../admin/component/loan-config/loan-config.service';
import {ToastService} from '../../../../../../@core/utils';

@Component({
    selector: 'app-existing-loan-template-data',
    templateUrl: './existing-loan-template-data.component.html',
    styleUrls: ['./existing-loan-template-data.component.scss']
})
export class ExistingLoanTemplateDataComponent implements OnInit {
    @Input() isEdit = false;
    @Input() cadDocAssignedLoan;
    @Input() offerDocumentList;
    @Input() globalBaseRate;
    existingLoanCombinedForm: FormGroup;
    loanDetails: any = [];
    filteredLoanIdList: any = [];
    initialInformation: any;
    translatedFormGroup: FormGroup;
    loanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();
    filteredLoanFacilityList: Array<LoanConfig> = new Array<LoanConfig>();

    constructor(private formBuilder: FormBuilder,
                private loanConfigService: LoanConfigService,
                private toastService: ToastService,
                public engToNepaliNumberPipe: EngToNepaliNumberPipe,
                public currencyWordPipe: NepaliCurrencyWordPipe,
                private currencyFormatter: CurrencyFormatterPipe,
                private translateService: SbTranslateService) {
    }

    ngOnInit() {
        this.buildForm();
        if (this.offerDocumentList.length > 0) {
            this.offerDocumentList.forEach(offerLetter => {
                this.initialInformation = JSON.parse(offerLetter.initialInformation);
            });
            if (!ObjectUtil.isEmpty(this.initialInformation) && !ObjectUtil.isEmpty(this.initialInformation.existingLoanForm)
                && !ObjectUtil.isEmpty(this.initialInformation.existingLoanForm.existingLoanFormArray)) {
                for (let i = 0; i < this.initialInformation.existingLoanForm.existingLoanFormArray.length; i++) {
                    this.addLoanFormArr();
                }
                this.existingLoanCombinedForm.patchValue(this.initialInformation.existingLoanForm);
            }
        }
        this.loadData();
    }

    loadData() {
        this.loanConfigService.getAllByLoanCategory('INDIVIDUAL').subscribe((response: any) => {
            console.log(response);
            this.loanFacilityList = response.detail;
            this.setFilteredLoanList();
            console.log(response.detail);
        }, error => {
            console.error(error);
            this.toastService.show(new Alert(AlertType.ERROR, 'Unable to Load Loan Type!'));
        });
    }

    setFilteredLoanList() {
        if (!ObjectUtil.isEmpty(this.loanFacilityList)) {
            this.filteredLoanFacilityList = this.loanFacilityList.filter((val) =>
                val.offerLetterConst === 'COMBINED_LETTER');
        }
    }

    private buildForm(): FormGroup {
        return this.existingLoanCombinedForm = this.formBuilder.group({
            existingLoanFormArray: this.formBuilder.array([]),

            isExistingLoan: [undefined],
        });
    }

    public getNumAmountWord(numLabel, wordLabel, index, arrayName): void {
        const transformValue = this.currencyWordPipe.transform(this.existingLoanCombinedForm.get(
            [arrayName, index, numLabel]).value);
        this.existingLoanCombinedForm.get([arrayName, index, wordLabel]).patchValue(transformValue);
        this.existingLoanCombinedForm.get([arrayName, index, wordLabel + 'Trans']).patchValue(transformValue);
        this.existingLoanCombinedForm.get([arrayName, index, wordLabel + 'CT']).patchValue(transformValue);
    }

    addLoanFormArr() {
        (this.existingLoanCombinedForm.get('existingLoanFormArray') as FormArray).push(this.buildLoanForm());
    }

    removeLandDetails(index: number) {
        (<FormArray>this.existingLoanCombinedForm.get('existingLoanFormArray')).removeAt(index);
    }

    buildLoanForm() {
        return this.formBuilder.group({
            facilityName: [undefined],
            loanAmountInFigure: [undefined],
            loanAmountInWords: [undefined],
            purposeOfLoan: [undefined],
            premiumRate: [undefined],
            baseRate: [undefined],
            interestRate: [undefined],

            loanAmountInFigureTrans: [undefined],
            loanAmountInWordsTrans: [undefined],
            purposeOfLoanTrans: [undefined],
            premiumRateTrans: [undefined],
            baseRateTrans: [undefined],
            interestRateTrans: [undefined],

            loanAmountInFigureCT: [undefined],
            loanAmountInWordsCT: [undefined],
            purposeOfLoanCT: [undefined],
            premiumRateCT: [undefined],
            baseRateCT: [undefined],
            interestRateCT: [undefined],

            interestRateType: [undefined],
            facilityNameEnglish: [undefined],
            securityType: [undefined],
        });
    }

    numberTranslate(arrayName, index, origin) {
        const tempData = this.existingLoanCombinedForm.get([arrayName, index, origin]).value;
        if (!ObjectUtil.isEmpty(tempData)) {
            const afterFix = tempData.toFixed(2);
            this.existingLoanCombinedForm.get([arrayName, index, origin + 'Trans']).patchValue(this.engToNepaliNumberPipe.transform(
                this.currencyFormatter.transform(afterFix.toString())));
            this.existingLoanCombinedForm.get([arrayName, index, origin + 'CT']).patchValue(this.engToNepaliNumberPipe.transform(
                this.currencyFormatter.transform(afterFix.toString())));
        }
    }

    async wordsTranslate(arrayName, i, word) {
        const tempWord = this.existingLoanCombinedForm.get([arrayName, i, word]).value;
        if (!ObjectUtil.isEmpty(tempWord)) {
            this.translatedFormGroup = this.formBuilder.group({
                formWord: tempWord,
            });
            const translatedValue = await this.translateService.translateForm(this.translatedFormGroup);
            if (!ObjectUtil.isEmpty(translatedValue)) {
                this.existingLoanCombinedForm.get([arrayName, i, word + 'Trans']).patchValue(translatedValue.formWord);
                this.existingLoanCombinedForm.get([arrayName, i, word + 'CT']).patchValue(translatedValue.formWord);
            }
        }
    }

    calInterestRate(i) {
        const premiumRate = this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'premiumRate']).value;
        const baseRate = this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'baseRate']).value;
        const sum = parseFloat(baseRate) + parseFloat(premiumRate);
        this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'interestRate']).patchValue(sum.toFixed(2));
        // tslint:disable-next-line:max-line-length
        const tempSum = this.engToNepaliNumberPipe.transform(this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'interestRate']).value ?
            this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'interestRate']).value : '');
        this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'interestRateTrans']).patchValue(tempSum);
        this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'interestRateCT']).patchValue(tempSum);
    }

    setInterestRateType(data) {
    }

    setFacilityName(eve: any, i: number) {
        if (!ObjectUtil.isEmpty(eve)) {
            this.loanFacilityList.forEach((val: any) => {
                if (eve === val.name) {
                    this.existingLoanCombinedForm.get(['existingLoanFormArray', i, 'facilityName']).patchValue(val.nepaliName);
                }
            });
        }
    }
}

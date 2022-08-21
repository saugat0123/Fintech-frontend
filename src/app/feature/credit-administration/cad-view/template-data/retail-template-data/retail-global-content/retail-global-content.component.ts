import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../../model/OfferDocument';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {EnglishDateTransformPipe} from '../../../../../../@core/pipe/english-date-transform.pipe';

@Component({
  selector: 'app-retail-global-content',
  templateUrl: './retail-global-content.component.html',
  styleUrls: ['./retail-global-content.component.scss']
})
export class RetailGlobalContentComponent implements OnInit {
  @Input() isEdit = false;
  globalForm: FormGroup;
  translatedFormGroup: FormGroup;
  @Input() offerDocumentList: Array<OfferDocument>;
  @Output() globalBaseRateRetail: EventEmitter<any> = new EventEmitter();
  loanTypes = [
    {value: 'New'},
    {value: 'Plain Renewal'},
    {value: 'Renewal with Enhancement or Additional Loan'},
    {value: 'Additional Loan'},
    {value: 'Other'}
  ];
  dateType = ['AD', 'BS'];
  loanOptionsSelected = false;
  initialInformation: any;
  globalBaseRate: any;
  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              public engToNepaliNumberPipe: EngToNepaliNumberPipe,
              public currencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatter: CurrencyFormatterPipe,
              private englishCalenderPipe: EnglishDateTransformPipe
  ) { }

  ngOnInit() {
    this.buildForm();
    if (this.isEdit) {
      if (this.offerDocumentList.length > 0) {
        this.offerDocumentList.forEach(offerLetter => {
          this.initialInformation = JSON.parse(offerLetter.initialInformation);
        });
      }
      if (!ObjectUtil.isEmpty(this.initialInformation)) {
        this.globalForm.patchValue(this.initialInformation.retailGlobalForm);

        // Date patch
        // Sanction Letter Date
        const sanctionLetterDateType = this.initialInformation.retailGlobalForm.sanctionLetterDateType;
        if (sanctionLetterDateType === 'AD') {
          const sanctionLetter = this.initialInformation.retailGlobalForm.sanctionLetterDate;
          if (!ObjectUtil.isEmpty(sanctionLetter)) {
            this.globalForm.get('sanctionLetterDate').patchValue(new Date(sanctionLetter));
          }
        } else if (sanctionLetterDateType === 'BS') {
          const sanctionLetter = this.initialInformation.retailGlobalForm.sanctionLetterDateNepali;
          if (!ObjectUtil.isEmpty(sanctionLetter)) {
            this.globalForm.get('sanctionLetterDateNepali').patchValue(sanctionLetter);
          }
        }

        // Request Letter Date
        const requestLetterDateType = this.initialInformation.retailGlobalForm.requestLetterDateType;
        if (requestLetterDateType === 'AD') {
          const requestLetter = this.initialInformation.retailGlobalForm.requestLetterDate;
          if (!ObjectUtil.isEmpty(requestLetter)) {
            this.globalForm.get('requestLetterDate').patchValue(new Date(requestLetter));
          }
        } else if (requestLetterDateType === 'BS') {
          const requestLetter = this.initialInformation.retailGlobalForm.requestLetterDateNepali;
          if (!ObjectUtil.isEmpty(requestLetter)) {
            this.globalForm.get('requestLetterDateNepali').patchValue(requestLetter);
          }
        }

        // Previous Sanction Letter Date
        const previousSanctionLetterDateType = this.initialInformation.retailGlobalForm.previousSanctionLetterDateType;
        if (previousSanctionLetterDateType === 'AD') {
          const previousSanctionLetter = this.initialInformation.retailGlobalForm.previousSanctionLetterDate;
          if (!ObjectUtil.isEmpty(previousSanctionLetter)) {
            this.globalForm.get('previousSanctionLetterDate').patchValue(new Date(previousSanctionLetter));
          }
        } else if (previousSanctionLetterDateType === 'BS') {
          const previousSanctionLetter = this.initialInformation.retailGlobalForm.previousSanctionLetterDateNepali;
          if (!ObjectUtil.isEmpty(previousSanctionLetter)) {
            this.globalForm.get('previousSanctionLetterDateNepali').patchValue(previousSanctionLetter);
          }
        }
      }
    }
  }

  private buildForm(): FormGroup {
    return this.globalForm = this.formBuilder.group({
      loanType: [undefined],
      loanCommitmentCheck: [undefined],
      loanAboveCrore: [undefined],
      loanCommitmentFeeInPercent: [undefined],
      sanctionLetterDate: [undefined],
      sanctionLetterDateNepali: [undefined],
      requestLetterDate: [undefined],
      requestLetterDateNepali: [undefined],
      previousSanctionLetterDate: [undefined],
      previousSanctionLetterDateNepali: [undefined],
      baseRate: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInWords: [undefined],
      nameOfBranchManager: [undefined],
      nameOfRelationshipManager: [undefined],

      loanTypeTrans: [undefined],
      loanCommitmentCheckTrans: [undefined],
      loanAboveCroreTrans: [undefined],
      loanCommitmentFeeInPercentTrans: [undefined],
      sanctionLetterDateTrans: [undefined],
      sanctionLetterDateNepaliTrans: [undefined],
      requestLetterDateTrans: [undefined],
      requestLetterDateNepaliTrans: [undefined],
      previousSanctionLetterDateTrans: [undefined],
      previousSanctionLetterDateNepaliTrans: [undefined],
      baseRateTrans: [undefined],
      totalLimitInFigureTrans: [undefined],
      totalLimitInWordsTrans: [undefined],
      nameOfBranchManagerTrans: [undefined],
      nameOfRelationshipManagerTrans: [undefined],

      loanTypeCT: [undefined],
      loanCommitmentCheckCT: [undefined],
      loanAboveCroreCT: [undefined],
      loanCommitmentFeeInPercentCT: [undefined],
      sanctionLetterDateCT: [undefined],
      sanctionLetterDateNepaliCT: [undefined],
      requestLetterDateCT: [undefined],
      requestLetterDateNepaliCT: [undefined],
      previousSanctionLetterDateCT: [undefined],
      previousSanctionLetterDateNepaliCT: [undefined],
      baseRateCT: [undefined],
      totalLimitInFigureCT: [undefined],
      totalLimitInWordsCT: [undefined],
      nameOfBranchManagerCT: [undefined],
      nameOfRelationshipManagerCT: [undefined],

      sanctionLetterDateType: [undefined],
      requestLetterDateType: [undefined],
      previousSanctionLetterDateType: [undefined],
    });
  }
  checkSelectedOptions(data) {
    this.loanOptionsSelected = data === 'New';
  }
  loanCommitmentCheck(data) {
    console.log('Loan Commitment Check?', data);
  }
  loanAboveCroreChecked(data) {
    console.log('Loan Above Crore Check?', data);
  }
  numberTranslate(origin) {
    const tempData = this.globalForm.get(origin).value;
    if (!ObjectUtil.isEmpty(tempData)) {
      const afterFix = tempData.toFixed(2);
      this.globalForm.get(origin + 'Trans').patchValue(this.engToNepaliNumberPipe.transform(
          this.currencyFormatter.transform(afterFix.toString())));
      this.globalForm.get(origin + 'CT').patchValue(this.engToNepaliNumberPipe.transform(
          this.currencyFormatter.transform(afterFix.toString())));
      if (origin === 'baseRate') {
        this.globalBaseRateRetail.emit(afterFix);
      }
    }
  }
  convertWords(origin, dest) {
    const tempFigure = this.globalForm.get(origin).value;
    if (!ObjectUtil.isEmpty(tempFigure)) {
      const afterFix = tempFigure.toFixed(2);
      if (!ObjectUtil.isEmpty(afterFix)) {
        this.globalForm.get(dest).patchValue(this.currencyWordPipe.transform(afterFix));
        this.globalForm.get(dest + 'Trans').patchValue(this.currencyWordPipe.transform(afterFix));
        this.globalForm.get(dest + 'CT').patchValue(this.currencyWordPipe.transform(afterFix));
      }
    }
  }
  async wordsTranslate(word) {
    const tempWord = this.globalForm.get(word).value;
    if (!ObjectUtil.isEmpty(tempWord)) {
      this.translatedFormGroup = this.formBuilder.group({
        formWord: tempWord,
      });
      const translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);
      if (!ObjectUtil.isEmpty(translatedValue)) {
        this.globalForm.get(word + 'Trans').patchValue(translatedValue.formWord);
        this.globalForm.get(word + 'CT').patchValue(translatedValue.formWord);
      }
    }
  }
  dateConvert(origin, type) {
    const dateType = type;
    if (!ObjectUtil.isEmpty(dateType)) {
      if (dateType === 'AD') {
        if (!ObjectUtil.isEmpty(this.globalForm.get(origin).value)) {
          const ADDate = this.datePipe.transform(this.globalForm.get(origin).value);
          const tempAdDate = !ObjectUtil.isEmpty(ADDate) ? this.datePipe.transform(ADDate) : '';
          const finalADDate = this.englishCalenderPipe.transform(tempAdDate);
          if (!ObjectUtil.isEmpty(tempAdDate)) {
            this.globalForm.get(origin + 'Trans').patchValue(finalADDate);
            this.globalForm.get(origin + 'CT').patchValue(finalADDate);
          }
        }
      } else if (dateType === 'BS') {
        if (!ObjectUtil.isEmpty(this.globalForm.get(origin).value)) {
            const BSDate = this.globalForm.get(origin).value.nDate;
            if (!ObjectUtil.isEmpty(BSDate)) {
              this.globalForm.get(origin + 'Trans').patchValue(BSDate);
              this.globalForm.get(origin + 'CT').patchValue(BSDate);
            }
          }
      }
    }
  }
}

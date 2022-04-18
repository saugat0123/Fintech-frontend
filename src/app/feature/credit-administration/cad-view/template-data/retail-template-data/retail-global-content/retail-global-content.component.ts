import {Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {OfferDocument} from '../../../../model/OfferDocument';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {EngNepDatePipe} from 'nepali-patro';

@Component({
  selector: 'app-retail-global-content',
  templateUrl: './retail-global-content.component.html',
  styleUrls: ['./retail-global-content.component.scss']
})
export class RetailGlobalContentComponent implements OnInit {
  @Input() isEdit = false;
  globalForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  @Input() offerDocumentList: Array<OfferDocument>;
  loanTypes = [
    {value: 'New'},
    {value: 'Plain Renewal'},
    {value: 'Renewal with Enhancement or Additional Loan'},
    {value: 'Additional Loan'},
  ];
  dateType = ['AD', 'BS'];
  loanOptionsSelected = false;
  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              public engToNepaliNumberPipe: EngToNepaliNumberPipe,
              public currencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatter: CurrencyFormatterPipe,
              private engToNepaliDate: EngNepDatePipe) { }

  ngOnInit() {
    this.buildForm();
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
}

import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-sme-global-content',
  templateUrl: './sme-global-content.component.html',
  styleUrls: ['./sme-global-content.component.scss']
})
export class SmeGlobalContentComponent implements OnInit {
  globalForm: FormGroup;
  translatedFormGroup: FormGroup;
  translatedValue: any;
  loanOptions = [
      {value: 'New Plain Renewal'},
      {value: 'Plain Renewal'},
      {value: 'Renewal with Enhancement or Additional Loan'},
      {value: 'Additional Loan'}
  ];
  yesNoOptions = [
    {value: 'Yes'},
    {value: 'No'}
  ];
  mortgageType = [
    {value: 'New'},
    {value: 'Existing'},
    {value: 'Enhancement'}
  ];
  hypothecationType = [
    {value: 'New'},
    {value: 'Existing'}
  ];
  chargeType = [
    {value: 'For All Loan'},
    {value: 'For Specific Loan Only'},
  ];
  dateType = ['AD', 'BS'];

  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private currencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.globalForm = this.formBuilder.group({
      dateOfApprovalType: [undefined],
      loanApplicationDataType: [undefined],
      loanOption: [undefined],
      previousSanctionType: [undefined],
      subsidyOrAgricultureLoan: [undefined],
      mortgageType: [undefined],
      hypothecation: [undefined],
      borrowerNaturalPerson: [undefined],
      loanAmountAbove50Crore: [undefined],
      workingCapitalAbove25Crore: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalTrans: [undefined],
      dateOfApprovalCT: [undefined],
      loanApplicationDate: [undefined],
      loanApplicationDateTrans: [undefined],
      loanApplicationDateCT: [undefined],
      sanctionLetterDate: [undefined],
      sanctionLetterDateTrans: [undefined],
      sanctionLetterDateCT: [undefined],
      serviceChargeType: [undefined],
      serviceChargeInFigure: [undefined],
      serviceChargeInFigureTrans: [undefined],
      serviceChargeInFigureCT: [undefined],
      serviceChargeInWords: [undefined],
      serviceChargeInWordsTrans: [undefined],
      serviceChargeInWordsCT: [undefined],
      detailOfFacility: [undefined],
      detailOfFacilityTrans: [undefined],
      detailOfFacilityCT: [undefined],
      serviceChargeInPercent: [undefined],
      serviceChargeInPercentTrans: [undefined],
      serviceChargeInPercentCT: [undefined],
      totalFundedLimitInFigure: [undefined],
      totalFundedLimitInFigureTrans: [undefined],
      totalFundedLimitInFigureCT: [undefined],
      totalFundedLimitInWords: [undefined],
      totalFundedLimitInWordsTrans: [undefined],
      totalFundedLimitInWordsCT: [undefined],
      totalNonFundedLimitInFigure: [undefined],
      totalNonFundedLimitInFigureTrans: [undefined],
      totalNonFundedLimitInFigureCT: [undefined],
      totalNonFundedLimitInWords: [undefined],
      totalNonFundedLimitInWordsTrans: [undefined],
      totalNonFundedLimitInWordsCT: [undefined],
      totalLimitInFigure: [undefined],
      totalLimitInFigureTrans: [undefined],
      totalLimitInFigureCT: [undefined],
      totalLimitInWords: [undefined],
      totalLimitInWordsTrans: [undefined],
      totalLimitInWordsCT: [undefined],
      nameOfRelationshipManager: [undefined],
      nameOfRelationshipManagerTrans: [undefined],
      nameOfRelationshipManagerCT: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerTrans: [undefined],
      nameOfBranchManagerCT: [undefined],
    });
  }

  public async translateFormData() {

    // translating number field by number pipe
    const serviceChargeInFigure = this.globalForm.get('serviceChargeInFigure').value;
    if (!ObjectUtil.isEmpty(serviceChargeInFigure)) {
      this.globalForm.get('serviceChargeInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInFigure.toString()));
      this.globalForm.get('serviceChargeInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInFigure.toString()));
    }

    const serviceChargeInPercent = this.globalForm.get('serviceChargeInPercent').value;
    if (!ObjectUtil.isEmpty(serviceChargeInPercent)) {
      this.globalForm.get('serviceChargeInPercentTrans').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
      this.globalForm.get('serviceChargeInPercentCT').patchValue(this.engToNepaliNumberPipe.transform(serviceChargeInPercent.toString()));
    }

    const totalFundedLimitInFigure = this.globalForm.get('totalFundedLimitInFigure').value;
    if (!ObjectUtil.isEmpty(totalFundedLimitInFigure)) {
      this.globalForm.get('totalFundedLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(totalFundedLimitInFigure.toString()));
      this.globalForm.get('totalFundedLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(totalFundedLimitInFigure.toString()));
    }

    const totalNonFundedLimitInFigure = this.globalForm.get('totalNonFundedLimitInFigure').value;
    if (!ObjectUtil.isEmpty(totalNonFundedLimitInFigure)) {
      this.globalForm.get('totalNonFundedLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(totalNonFundedLimitInFigure.toString()));
      this.globalForm.get('totalNonFundedLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(totalNonFundedLimitInFigure.toString()));
    }

    const totalLimitInFigure = totalFundedLimitInFigure + totalNonFundedLimitInFigure;
    if (!ObjectUtil.isEmpty(totalLimitInFigure)) {
      this.globalForm.get('totalLimitInFigure').patchValue(totalLimitInFigure);
      this.globalForm.get('totalLimitInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(totalLimitInFigure.toString()));
      this.globalForm.get('totalLimitInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(totalLimitInFigure.toString()));
    }

    // set date field value
    const dateOfApprovalType = this.globalForm.get('dateOfApprovalType').value;
    if (dateOfApprovalType === 'AD') {
      const dateOfApproval = this.datePipe.transform(this.globalForm.get('dateOfApproval').value);
      if (!ObjectUtil.isEmpty(dateOfApproval)) {
        this.globalForm.get('dateOfApprovalTrans').patchValue(dateOfApproval);
        this.globalForm.get('dateOfApprovalCT').patchValue(dateOfApproval);
      }
    } else if (dateOfApprovalType === 'BS') {
      const dateOfApproval = this.globalForm.get('dateOfApproval').value.nDate;
      if (!ObjectUtil.isEmpty(dateOfApproval)) {
        this.globalForm.get('dateOfApprovalTrans').patchValue(dateOfApproval);
        this.globalForm.get('dateOfApprovalCT').patchValue(dateOfApproval);
      }
    }

    if (!ObjectUtil.isEmpty(serviceChargeInFigure)) {
      this.globalForm.get('serviceChargeInWords').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure));
      this.globalForm.get('serviceChargeInWordsTrans').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure));
      this.globalForm.get('serviceChargeInWordsCT').patchValue(this.currencyWordPipe.transform(serviceChargeInFigure));
    }
    if (!ObjectUtil.isEmpty(totalFundedLimitInFigure)) {
      this.globalForm.get('totalFundedLimitInWords').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure));
      this.globalForm.get('totalFundedLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure));
      this.globalForm.get('totalFundedLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalFundedLimitInFigure));
    }

    if (!ObjectUtil.isEmpty(totalNonFundedLimitInFigure)) {
      this.globalForm.get('totalNonFundedLimitInWords').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure));
      this.globalForm.get('totalNonFundedLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure));
      this.globalForm.get('totalNonFundedLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalNonFundedLimitInFigure));
    }

    if (!ObjectUtil.isEmpty(totalLimitInFigure)) {
      this.globalForm.get('totalLimitInWords').patchValue(this.currencyWordPipe.transform(totalLimitInFigure));
      this.globalForm.get('totalLimitInWordsTrans').patchValue(this.currencyWordPipe.transform(totalLimitInFigure));
      this.globalForm.get('totalLimitInWordsCT').patchValue(this.currencyWordPipe.transform(totalLimitInFigure));
    }

    const loanApplicationDataType = this.globalForm.get('loanApplicationDataType').value;
    if (loanApplicationDataType === 'AD') {
      const loanApplicationDate = this.datePipe.transform(this.globalForm.get('loanApplicationDate').value);
      if (!ObjectUtil.isEmpty(loanApplicationDate)) {
        this.globalForm.get('loanApplicationDateTrans').patchValue(loanApplicationDate);
        this.globalForm.get('loanApplicationDateCT').patchValue(loanApplicationDate);
      }
    } else if (loanApplicationDataType === 'BS') {
      const loanApplicationDate = this.globalForm.get('loanApplicationDate').value.nDate;
      if (!ObjectUtil.isEmpty(loanApplicationDate)) {
        this.globalForm.get('loanApplicationDateTrans').patchValue(loanApplicationDate);
        this.globalForm.get('loanApplicationDateCT').patchValue(loanApplicationDate);
      }
    }

    const previousSanctionType = this.globalForm.get('previousSanctionType').value;
    if (previousSanctionType === 'AD') {
      const previousSanctionDate = this.datePipe.transform(this.globalForm.get('sanctionLetterDate').value);
      if (!ObjectUtil.isEmpty(previousSanctionDate)) {
        this.globalForm.get('sanctionLetterDateTrans').patchValue(previousSanctionDate);
        this.globalForm.get('sanctionLetterDateCT').patchValue(previousSanctionDate);
      }
    } else if (previousSanctionType === 'BS') {
      const previousSanctionDate = this.globalForm.get('sanctionLetterDate').value.nDate;
      if (!ObjectUtil.isEmpty(previousSanctionType)) {
        this.globalForm.get('sanctionLetterDateTrans').patchValue(previousSanctionDate);
        this.globalForm.get('sanctionLetterDateCT').patchValue(previousSanctionDate);
      }
    }

    // translated by google api
    this.translatedFormGroup = this.formBuilder.group({
      detailOfFacility: this.globalForm.get('detailOfFacility').value,
      nameOfRelationshipManager: this.globalForm.get('nameOfRelationshipManager').value,
      nameOfBranchManager: this.globalForm.get('nameOfBranchManager').value,
    });

    this.translatedValue =  await this.translateService.translateForm(this.translatedFormGroup);

    this.globalForm.get('detailOfFacilityTrans').patchValue(this.translatedValue.detailOfFacility);
    this.globalForm.get('detailOfFacilityCT').patchValue(this.translatedValue.detailOfFacility);

    this.globalForm.get('nameOfRelationshipManagerTrans').patchValue(this.translatedValue.nameOfRelationshipManager);
    this.globalForm.get('nameOfRelationshipManagerCT').patchValue(this.translatedValue.nameOfRelationshipManager);

    this.globalForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.globalForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
  }

}

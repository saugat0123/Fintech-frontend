import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';

@Component({
  selector: 'app-construction-loan',
  templateUrl: './construction-loan.component.html',
  styleUrls: ['./construction-loan.component.scss']
})
export class ConstructionLoanComponent implements OnInit {

  constructionLoanForm: FormGroup;
  translateFormGroup: FormGroup;
  dateType = [{key: 'AD', value: 'AD'}, {key: 'BS', value: 'BS'}];
  ADApproval = false;
  ADApplication = false;
  BSApproval = false;
  BSApplication = false;
  spinner = false;
  translatedValue: any;

  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  ngOnInit() {
    this.buildForm();
  }

  private buildForm(): FormGroup {
    return this.constructionLoanForm = this.formBuilder.group({
      referenceNumber: [undefined],
      referenceNumberCT: [undefined],
      referenceNumberTrans: [undefined],
      dateType: [undefined],
      dateTypeCT: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalCT: [undefined],
      dateOfApprovalTrans: [undefined],
      nepaliDateOfApproval: [undefined],
      nepaliDateOfApprovalCT: [undefined],
      applicationDateType: [undefined],
      applicationDateTypeCT: [undefined],
      applicationDateTypeTrans: [undefined],
      nepaliDateOfApplication: [undefined],
      nepaliDateOfApplicationCT: [undefined],
      dateOfApplication: [undefined],
      dateOfApplicationCT: [undefined],
      dateOfApplicationTrans: [undefined],
      purposeOfLoan: [undefined],
      purposeOfLoanCT: [undefined],
      purposeOfLoanTrans: [undefined],
      drawingPower: [undefined],
      drawingPowerCT: [undefined],
      drawingPowerTrans: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInFigureCT: [undefined],
      loanAmountInFigureTrans: [undefined],
      loanAmountInWord: [undefined],
      loanAmountInWordCT: [undefined],
      loanAmountInWordTrans: [undefined],
      baseRate: [undefined],
      baseRateCT: [undefined],
      baseRateTrans: [undefined],
      premiumRate: [undefined],
      premiumRateCT: [undefined],
      premiumRateTrans: [undefined],
      interestRate: [undefined],
      interestRateCT: [undefined],
      interestRateTrans: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInFigureCT: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWord: [undefined],
      loanAdminFeeInWordCT: [undefined],
      loanAdminFeeInWordTrans: [undefined],
      emiInFigure: [undefined],
      emiInFigureCT: [undefined],
      emiInFigureTrans: [undefined],
      emiInWord: [undefined],
      emiInWordCT: [undefined],
      emiInWordTrans: [undefined],
      loanPeriodInMonths: [undefined],
      loanPeriodInMonthsCT: [undefined],
      loanPeriodInMonthsTrans: [undefined],
      moratoriumPeriodInMonth: [undefined],
      moratoriumPeriodInMonthCT: [undefined],
      moratoriumPeriodInMonthTrans: [undefined],
      loanCommitmentFee: [undefined],
      loanCommitmentFeeCT: [undefined],
      loanCommitmentFeeTrans: [undefined],
      costOfConstruction: [undefined],
      costOfConstructionCT: [undefined],
      costOfConstructionTrans: [undefined],
      firstInstallmentAmount: [undefined],
      firstInstallmentAmountCT: [undefined],
      firstInstallmentAmountTrans: [undefined],
      costOfConstructionInSecondPhase: [undefined],
      costOfConstructionInSecondPhaseCT: [undefined],
      costOfConstructionInSecondPhaseTrans: [undefined],
      secondInstallmentAmount: [undefined],
      secondInstallmentAmountCT: [undefined],
      secondInstallmentAmountTrans: [undefined],
      costOfFinalProjectCompletion: [undefined],
      costOfFinalProjectCompletionCT: [undefined],
      costOfFinalProjectCompletionTrans: [undefined],
      thirdInstallmentAmount: [undefined],
      thirdInstallmentAmountCT: [undefined],
      thirdInstallmentAmountTrans: [undefined],
      nameOfLandOwner: [undefined],
      nameOfLandOwnerCT: [undefined],
      nameOfLandOwnerTrans: [undefined],
      landLocation: [undefined],
      landLocationCT: [undefined],
      landLocationTrans: [undefined],
      kittaNumber: [undefined],
      kittaNumberCT: [undefined],
      kittaNumberTrans: [undefined],
      area: [undefined],
      areaCT: [undefined],
      areaTrans: [undefined],
      seatNumber: [undefined],
      seatNumberCT: [undefined],
      seatNumberTrans: [undefined],
      insuranceAmountInFigure: [undefined],
      insuranceAmountInFigureCT: [undefined],
      insuranceAmountInFigureTrans: [undefined],
      insuranceAmountInWord: [undefined],
      insuranceAmountInWordCT: [undefined],
      insuranceAmountInWordTrans: [undefined],
      freeTextRequired: [undefined],
      freeTextRequiredCT: [undefined],
      freeTextRequiredTrans: [undefined],
      nameOfRelationshipOfficer: [undefined],
      nameOfRelationshipOfficerCT: [undefined],
      nameOfRelationshipOfficerTrans: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerCT: [undefined],
      nameOfBranchManagerTrans: [undefined],
      approvalStaffName: [undefined],
      approvalStaffNameCT: [undefined],
      approvalStaffNameTrans: [undefined],
    });
  }

  public dateOfApproval(value): void {
    this.ADApproval = value === 'AD';
    this.BSApproval = value === 'BS';
  }

  public dateOfApplication(value) {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }

  public async setTranslatedValue() {
    const dateType = this.constructionLoanForm.get('dateType').value;
    let approvalDate;
    if (dateType === 'AD') {
      approvalDate = this.datePipe.transform(this.constructionLoanForm.get('dateOfApproval').value);
    }
    if (dateType === 'BS') {
      approvalDate = this.constructionLoanForm.get('nepaliDateOfApproval').value.nDate;
    }
    this.constructionLoanForm.get('dateOfApprovalTrans').patchValue(approvalDate);
    this.constructionLoanForm.get('dateOfApprovalCT').patchValue(approvalDate);
    let dateOfApplication;
    const applicationDateType = this.constructionLoanForm.get('applicationDateType').value;
    if (applicationDateType === 'AD') {
      dateOfApplication = this.datePipe.transform(this.constructionLoanForm.get('dateOfApplication').value);
    }
    if (applicationDateType === 'BS') {
      dateOfApplication = this.constructionLoanForm.get('nepaliDateOfApplication').value.nDate;
    }
    this.constructionLoanForm.get('dateOfApplicationTrans').patchValue(dateOfApplication);
    this.constructionLoanForm.get('dateOfApplicationCT').patchValue(dateOfApplication);
    const drawingPower = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('drawingPower').value.toString());
    this.constructionLoanForm.get('drawingPowerTrans').patchValue(drawingPower);
    this.constructionLoanForm.get('drawingPowerCT').patchValue(drawingPower);
    const loanAmount = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('loanAmountInFigure').value.toString());
    this.constructionLoanForm.get('loanAmountInFigureTrans').patchValue(loanAmount);
    this.constructionLoanForm.get('loanAmountInFigureCT').patchValue(loanAmount);
    const loanAmountInWord = this.constructionLoanForm.get('loanAmountInWord').value;
    this.constructionLoanForm.get('loanAmountInWordTrans').patchValue(loanAmountInWord);
    this.constructionLoanForm.get('loanAmountInWordCT').patchValue(loanAmountInWord);
    const baseRate = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('baseRate').value.toString());
    this.constructionLoanForm.get('baseRateTrans').patchValue(baseRate);
    this.constructionLoanForm.get('baseRateCT').patchValue(baseRate);
    const premiumRate = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('premiumRate').value.toString());
    this.constructionLoanForm.get('premiumRateTrans').patchValue(premiumRate);
    this.constructionLoanForm.get('premiumRateCT').patchValue(premiumRate);
    const interestRate = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('interestRate').value.toString());
    this.constructionLoanForm.get('interestRateTrans').patchValue(interestRate);
    this.constructionLoanForm.get('interestRateCT').patchValue(interestRate);
    const loanAmountFeeInFigure = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('loanAdminFeeInFigure').value.toString());
    this.constructionLoanForm.get('loanAdminFeeInFigureTrans').patchValue(loanAmountFeeInFigure);
    this.constructionLoanForm.get('loanAdminFeeInFigureCT').patchValue(loanAmountFeeInFigure);
    const loanAdminFeeInWord = this.constructionLoanForm.get('loanAdminFeeInWord').value;
    this.constructionLoanForm.get('loanAdminFeeInWordTrans').patchValue(loanAdminFeeInWord);
    this.constructionLoanForm.get('loanAdminFeeInWordCT').patchValue(loanAdminFeeInWord);
    const emiInFigure = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('emiInFigure').value.toString());
    this.constructionLoanForm.get('emiInFigureTrans').patchValue(emiInFigure);
    this.constructionLoanForm.get('emiInFigureCT').patchValue(emiInFigure);
    const emiInWord = this.constructionLoanForm.get('emiInWord').value;
    this.constructionLoanForm.get('emiInWordTrans').patchValue(emiInWord);
    this.constructionLoanForm.get('emiInWordCT').patchValue(emiInWord);
    const loanPeriodInMonths = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('loanPeriodInMonths').value.toString());
    this.constructionLoanForm.get('loanPeriodInMonthsTrans').patchValue(loanPeriodInMonths);
    this.constructionLoanForm.get('loanPeriodInMonthsCT').patchValue(loanPeriodInMonths);
    const moratoriumPeriodInMonth = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('moratoriumPeriodInMonth').value.toString());
    this.constructionLoanForm.get('moratoriumPeriodInMonthTrans').patchValue(moratoriumPeriodInMonth);
    this.constructionLoanForm.get('moratoriumPeriodInMonthCT').patchValue(moratoriumPeriodInMonth);
    const loanCommitmentFee = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('loanCommitmentFee').value.toString());
    this.constructionLoanForm.get('loanCommitmentFeeTrans').patchValue(loanCommitmentFee);
    this.constructionLoanForm.get('loanCommitmentFeeCT').patchValue(loanCommitmentFee);
    const costOfConstruction = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('costOfConstruction').value.toString());
    this.constructionLoanForm.get('costOfConstructionTrans').patchValue(costOfConstruction);
    this.constructionLoanForm.get('costOfConstructionCT').patchValue(costOfConstruction);
    const firstInstallmentAmount = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('firstInstallmentAmount').value.toString());
    this.constructionLoanForm.get('firstInstallmentAmountTrans').patchValue(firstInstallmentAmount);
    this.constructionLoanForm.get('firstInstallmentAmountCT').patchValue(firstInstallmentAmount);
    const costOfConstructionInSecondPhase = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('costOfConstructionInSecondPhase').value.toString());
    this.constructionLoanForm.get('costOfConstructionInSecondPhaseTrans').patchValue(costOfConstructionInSecondPhase);
    this.constructionLoanForm.get('costOfConstructionInSecondPhaseCT').patchValue(costOfConstructionInSecondPhase);
    const secondInstallmentAmount = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('secondInstallmentAmount').value.toString());
    this.constructionLoanForm.get('secondInstallmentAmountTrans').patchValue(secondInstallmentAmount);
    this.constructionLoanForm.get('secondInstallmentAmountCT').patchValue(secondInstallmentAmount);
    const costOfFinalProjectCompletion = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('costOfFinalProjectCompletion').value.toString());
    this.constructionLoanForm.get('costOfFinalProjectCompletionTrans').patchValue(costOfFinalProjectCompletion);
    this.constructionLoanForm.get('costOfFinalProjectCompletionCT').patchValue(costOfFinalProjectCompletion);
    const thirdInstallmentAmount = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('thirdInstallmentAmount').value.toString());
    this.constructionLoanForm.get('thirdInstallmentAmountTrans').patchValue(thirdInstallmentAmount);
    this.constructionLoanForm.get('thirdInstallmentAmountCT').patchValue(thirdInstallmentAmount);
    const kittaNumber = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('kittaNumber').value.toString());
    this.constructionLoanForm.get('kittaNumberTrans').patchValue(kittaNumber);
    this.constructionLoanForm.get('kittaNumberCT').patchValue(kittaNumber);
    const area = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('area').value.toString());
    this.constructionLoanForm.get('areaTrans').patchValue(area);
    this.constructionLoanForm.get('areaCT').patchValue(area);
    const seatNumber = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('seatNumber').value.toString());
    this.constructionLoanForm.get('seatNumberTrans').patchValue(seatNumber);
    this.constructionLoanForm.get('seatNumberCT').patchValue(seatNumber);
    const insuranceAmountInFigure = this.engToNepaliNumberPipe.transform(this.constructionLoanForm.get('insuranceAmountInFigure').value.toString());
    this.constructionLoanForm.get('insuranceAmountInFigureTrans').patchValue(insuranceAmountInFigure);
    this.constructionLoanForm.get('insuranceAmountInFigureCT').patchValue(insuranceAmountInFigure);
    const insuranceAmount = this.constructionLoanForm.get('insuranceAmountInWord').value;


    // translated by google api
    this.translateFormGroup = this.formBuilder.group({
      referenceNumber: this.constructionLoanForm.get('referenceNumber').value,
      purposeOfLoan: this.constructionLoanForm.get('purposeOfLoan').value,
      nameOfLandOwner: this.constructionLoanForm.get('nameOfLandOwner').value,
      landLocation: this.constructionLoanForm.get('landLocation').value,
      freeTextRequired: this.constructionLoanForm.get('freeTextRequired').value,
      nameOfRelationshipOfficer: this.constructionLoanForm.get('nameOfRelationshipOfficer').value,
      nameOfBranchManager: this.constructionLoanForm.get('nameOfBranchManager').value,
      approvalStaffName: this.constructionLoanForm.get('approvalStaffName').value,
    });
    // this.spinner = true;
    this.translatedValue = await this.translateService.translateForm(this.translateFormGroup);
    // this.spinner = false;
    this.constructionLoanForm.get('referenceNumberTrans').patchValue(this.translatedValue.referenceNumber);
    this.constructionLoanForm.get('referenceNumberCT').patchValue(this.translatedValue.referenceNumber);
    this.constructionLoanForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);
    this.constructionLoanForm.get('purposeOfLoanCT').patchValue(this.translatedValue.purposeOfLoan);
    this.constructionLoanForm.get('nameOfLandOwnerTrans').patchValue(this.translatedValue.nameOfLandOwner);
    this.constructionLoanForm.get('nameOfLandOwnerCT').patchValue(this.translatedValue.nameOfLandOwner);
    this.constructionLoanForm.get('landLocationTrans').patchValue(this.translatedValue.landLocation);
    this.constructionLoanForm.get('landLocationCT').patchValue(this.translatedValue.landLocation);
    this.constructionLoanForm.get('freeTextRequiredTrans').patchValue(this.translatedValue.freeTextRequired);
    this.constructionLoanForm.get('freeTextRequiredCT').patchValue(this.translatedValue.freeTextRequired);
    this.constructionLoanForm.get('nameOfRelationshipOfficerTrans').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.constructionLoanForm.get('nameOfRelationshipOfficerCT').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.constructionLoanForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.constructionLoanForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
    this.constructionLoanForm.get('approvalStaffNameTrans').patchValue(this.translatedValue.approvalStaffName);
    this.constructionLoanForm.get('approvalStaffNameCT').patchValue(this.translatedValue.approvalStaffName);
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const returnVal = this.nepaliCurrencyWordPipe.transform(this.constructionLoanForm.get(numLabel).value);
    this.constructionLoanForm.get(wordLabel).patchValue(returnVal);
  }

}

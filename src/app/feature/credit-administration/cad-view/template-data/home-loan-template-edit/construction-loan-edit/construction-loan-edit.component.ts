import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';

@Component({
  selector: 'app-construction-loan-edit',
  templateUrl: './construction-loan-edit.component.html',
  styleUrls: ['./construction-loan-edit.component.scss']
})
export class ConstructionLoanEditComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() submitted;
  @Input() spinner;
  @Input() formValue: any;
  constructionLoanForm: FormGroup;
  translateFormGroup: FormGroup;
  dateType = [{key: 'AD', value: 'AD'}, {key: 'BS', value: 'BS'}];
  ADApproval = false;
  ADApplication = false;
  BSApproval = false;
  BSApplication = false;
  translatedValue: any;

  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe) { }

  get form() {
    return this.constructionLoanForm.controls;
  }

  ngOnInit() {
    console.log('formValue', this.formValue);
    this.buildForm();
    if (!ObjectUtil.isEmpty(this.formValue)) {
      this.setConstructionFormValue();
      this.setDateOfApplication();
      this.setDateOfApproval();
    }
  }

  private buildForm(): FormGroup {
    return this.constructionLoanForm = this.formBuilder.group({
      referenceNumber: [undefined],
      referenceNumberCT: [undefined, Validators.required],
      referenceNumberTrans: [undefined],
      dateType: [undefined],
      dateTypeCT: [undefined],
      dateOfApproval: [undefined],
      dateOfApprovalCT: [undefined, Validators.required],
      dateOfApprovalTrans: [undefined],
      nepaliDateOfApproval: [undefined],
      nepaliDateOfApprovalCT: [undefined],
      applicationDateType: [undefined],
      applicationDateTypeCT: [undefined],
      applicationDateTypeTrans: [undefined],
      nepaliDateOfApplication: [undefined],
      nepaliDateOfApplicationCT: [undefined],
      dateOfApplication: [undefined],
      dateOfApplicationCT: [undefined, Validators.required],
      dateOfApplicationTrans: [undefined],
      purposeOfLoan: [undefined],
      purposeOfLoanCT: [undefined, Validators.required],
      purposeOfLoanTrans: [undefined],
      drawingPower: [undefined],
      drawingPowerCT: [undefined, Validators.required],
      drawingPowerTrans: [undefined],
      loanAmountInFigure: [undefined],
      loanAmountInFigureCT: [undefined, Validators.required],
      loanAmountInFigureTrans: [undefined],
      loanAmountInWord: [undefined],
      loanAmountInWordCT: [undefined, Validators.required],
      loanAmountInWordTrans: [undefined],
      baseRate: [undefined],
      baseRateCT: [undefined, Validators.required],
      baseRateTrans: [undefined],
      premiumRate: [undefined],
      premiumRateCT: [undefined, Validators.required],
      premiumRateTrans: [undefined],
      interestRate: [undefined],
      interestRateCT: [undefined, Validators.required],
      interestRateTrans: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInFigureCT: [undefined, Validators.required],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWord: [undefined],
      loanAdminFeeInWordCT: [undefined, Validators.required],
      loanAdminFeeInWordTrans: [undefined],
      emiInFigure: [undefined],
      emiInFigureCT: [undefined, Validators.required],
      emiInFigureTrans: [undefined],
      emiInWord: [undefined],
      emiInWordCT: [undefined, Validators.required],
      emiInWordTrans: [undefined],
      loanPeriodInMonths: [undefined],
      loanPeriodInMonthsCT: [undefined, Validators.required],
      loanPeriodInMonthsTrans: [undefined],
      moratoriumPeriodInMonth: [undefined],
      moratoriumPeriodInMonthCT: [undefined, Validators.required],
      moratoriumPeriodInMonthTrans: [undefined],
      loanCommitmentFee: [undefined],
      loanCommitmentFeeCT: [undefined, Validators.required],
      loanCommitmentFeeTrans: [undefined],
      costOfConstruction: [undefined],
      costOfConstructionCT: [undefined, Validators.required],
      costOfConstructionTrans: [undefined],
      firstInstallmentAmount: [undefined],
      firstInstallmentAmountCT: [undefined, Validators.required],
      firstInstallmentAmountTrans: [undefined],
      costOfConstructionInSecondPhase: [undefined],
      costOfConstructionInSecondPhaseCT: [undefined, Validators.required],
      costOfConstructionInSecondPhaseTrans: [undefined],
      secondInstallmentAmount: [undefined],
      secondInstallmentAmountCT: [undefined, Validators.required],
      secondInstallmentAmountTrans: [undefined],
      costOfFinalProjectCompletion: [undefined],
      costOfFinalProjectCompletionCT: [undefined, Validators.required],
      costOfFinalProjectCompletionTrans: [undefined],
      thirdInstallmentAmount: [undefined],
      thirdInstallmentAmountCT: [undefined, Validators.required],
      thirdInstallmentAmountTrans: [undefined],
      nameOfLandOwner: [undefined],
      nameOfLandOwnerCT: [undefined, Validators.required],
      nameOfLandOwnerTrans: [undefined],
      landLocation: [undefined],
      landLocationCT: [undefined, Validators.required],
      landLocationTrans: [undefined],
      kittaNumber: [undefined],
      kittaNumberCT: [undefined, Validators.required],
      kittaNumberTrans: [undefined],
      area: [undefined],
      areaCT: [undefined, Validators.required],
      areaTrans: [undefined],
      seatNumber: [undefined],
      seatNumberCT: [undefined, Validators.required],
      seatNumberTrans: [undefined],
      insuranceAmountInFigure: [undefined],
      insuranceAmountInFigureCT: [undefined, Validators.required],
      insuranceAmountInFigureTrans: [undefined],
      insuranceAmountInWord: [undefined],
      insuranceAmountInWordCT: [undefined, Validators.required],
      insuranceAmountInWordTrans: [undefined],
      freeTextRequired: [undefined],
      freeTextRequiredCT: [undefined, Validators.required],
      freeTextRequiredTrans: [undefined],
      nameOfRelationshipOfficer: [undefined],
      nameOfRelationshipOfficerCT: [undefined, Validators.required],
      nameOfRelationshipOfficerTrans: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerCT: [undefined, Validators.required],
      nameOfBranchManagerTrans: [undefined],
      approvalStaffName: [undefined],
      approvalStaffNameCT: [undefined, Validators.required],
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

  private setDateOfApproval() {
    this.ADApproval = this.formValue.dateType === 'AD';
    this.BSApproval = this.formValue.dateType === 'BS';
  }

  private setDateOfApplication() {
    this.ADApplication = this.formValue.applicationDateType === 'AD';
    this.BSApplication = this.formValue.applicationDateType === 'BS';
  }

  public async setTranslatedValue() {
    this.spinner = true;
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
    const drawingPower = this.constructionLoanForm.get('drawingPower').value;
    if (!ObjectUtil.isEmpty(drawingPower)) {
      this.constructionLoanForm.get('drawingPowerTrans').patchValue(this.engToNepaliNumberPipe.transform(drawingPower.toString()));
      this.constructionLoanForm.get('drawingPowerCT').patchValue(this.engToNepaliNumberPipe.transform(drawingPower.toString()));
    }
    const loanAmount = this.constructionLoanForm.get('loanAmountInFigure').value;
    if (!ObjectUtil.isEmpty(loanAmount)) {
      this.constructionLoanForm.get('loanAmountInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(loanAmount.toString()));
      this.constructionLoanForm.get('loanAmountInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(loanAmount.toString()));
    }
    const loanAmountInWord = this.constructionLoanForm.get('loanAmountInWord').value;
    if (!ObjectUtil.isEmpty(loanAmountInWord)) {
      this.constructionLoanForm.get('loanAmountInWordTrans').patchValue(loanAmountInWord);
      this.constructionLoanForm.get('loanAmountInWordCT').patchValue(loanAmountInWord);
    }
    const baseRate = this.constructionLoanForm.get('baseRate').value;
    if (!ObjectUtil.isEmpty(baseRate)) {
      this.constructionLoanForm.get('baseRateTrans').patchValue(this.engToNepaliNumberPipe.transform(baseRate.toString()));
      this.constructionLoanForm.get('baseRateCT').patchValue(this.engToNepaliNumberPipe.transform(baseRate.toString()));
    }
    const premiumRate = this.constructionLoanForm.get('premiumRate').value;
    if (!ObjectUtil.isEmpty(premiumRate)) {
      this.constructionLoanForm.get('premiumRateTrans').patchValue(this.engToNepaliNumberPipe.transform(premiumRate.toString()));
      this.constructionLoanForm.get('premiumRateCT').patchValue(this.engToNepaliNumberPipe.transform(premiumRate.toString()));
    }
    const interestRate = this.constructionLoanForm.get('interestRate').value;
    if (!ObjectUtil.isEmpty(interestRate)) {
      this.constructionLoanForm.get('interestRateTrans').patchValue(this.engToNepaliNumberPipe.transform(interestRate.toString()));
      this.constructionLoanForm.get('interestRateCT').patchValue(this.engToNepaliNumberPipe.transform(interestRate.toString()));
    }
    const loanAmountFeeInFigure = this.constructionLoanForm.get('loanAdminFeeInFigure').value;
    if (!ObjectUtil.isEmpty(loanAmountFeeInFigure)) {
      this.constructionLoanForm.get('loanAdminFeeInFigureTrans').patchValue(this.engToNepaliNumberPipe
          .transform(loanAmountFeeInFigure.toString()));
      this.constructionLoanForm.get('loanAdminFeeInFigureCT').patchValue(this.engToNepaliNumberPipe
          .transform(loanAmountFeeInFigure.toString()));
    }
    const loanAdminFeeInWord = this.constructionLoanForm.get('loanAdminFeeInWord').value;
    if (!ObjectUtil.isEmpty(loanAdminFeeInWord)) {
      this.constructionLoanForm.get('loanAdminFeeInWordTrans').patchValue(loanAdminFeeInWord);
      this.constructionLoanForm.get('loanAdminFeeInWordCT').patchValue(loanAdminFeeInWord);
    }
    const emiInFigure = this.constructionLoanForm.get('emiInFigure').value;
    if (!ObjectUtil.isEmpty(emiInFigure)) {
      this.constructionLoanForm.get('emiInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(emiInFigure.toString()));
      this.constructionLoanForm.get('emiInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(emiInFigure.toString()));
    }
    const emiInWord = this.constructionLoanForm.get('emiInWord').value;
    if (!ObjectUtil.isEmpty(emiInWord)) {
      this.constructionLoanForm.get('emiInWordTrans').patchValue(emiInWord);
      this.constructionLoanForm.get('emiInWordCT').patchValue(emiInWord);
    }
    const loanPeriodInMonths = this.constructionLoanForm.get('loanPeriodInMonths').value;
    if (!ObjectUtil.isEmpty(loanPeriodInMonths)) {
      this.constructionLoanForm.get('loanPeriodInMonthsTrans').patchValue(this.engToNepaliNumberPipe
          .transform(loanPeriodInMonths.toString()));
      this.constructionLoanForm.get('loanPeriodInMonthsCT').patchValue(this.engToNepaliNumberPipe
          .transform(loanPeriodInMonths.toString()));
    }
    const moratoriumPeriodInMonth = this.constructionLoanForm.get('moratoriumPeriodInMonth').value;
    if (!ObjectUtil.isEmpty(moratoriumPeriodInMonth)) {
      this.constructionLoanForm.get('moratoriumPeriodInMonthTrans').patchValue(this.engToNepaliNumberPipe
          .transform(moratoriumPeriodInMonth.toString()));
      this.constructionLoanForm.get('moratoriumPeriodInMonthCT').patchValue(this.engToNepaliNumberPipe
          .transform(moratoriumPeriodInMonth.toString()));
    }
    const loanCommitmentFee = this.constructionLoanForm.get('loanCommitmentFee').value;
    if (!ObjectUtil.isEmpty(loanCommitmentFee)) {
      this.constructionLoanForm.get('loanCommitmentFeeTrans').patchValue(this.engToNepaliNumberPipe
          .transform(loanCommitmentFee.toString()));
      this.constructionLoanForm.get('loanCommitmentFeeCT').patchValue(this.engToNepaliNumberPipe.transform(loanCommitmentFee.toString()));
    }
    const costOfConstruction = this.constructionLoanForm.get('costOfConstruction').value;
    if (!ObjectUtil.isEmpty(costOfConstruction)) {
      this.constructionLoanForm.get('costOfConstructionTrans').patchValue(this.engToNepaliNumberPipe
          .transform(costOfConstruction.toString()));
      this.constructionLoanForm.get('costOfConstructionCT').patchValue(this.engToNepaliNumberPipe
          .transform(costOfConstruction.toString()));
    }
    const firstInstallmentAmount = this.constructionLoanForm.get('firstInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(firstInstallmentAmount)) {
      this.constructionLoanForm.get('firstInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe
          .transform(firstInstallmentAmount.toString()));
      this.constructionLoanForm.get('firstInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe
          .transform(firstInstallmentAmount.toString()));
    }
    const costOfConstructionInSecondPhase = this.constructionLoanForm.get('costOfConstructionInSecondPhase').value;
    if (!ObjectUtil.isEmpty(costOfConstructionInSecondPhase)) {
      this.constructionLoanForm.get('costOfConstructionInSecondPhaseTrans').patchValue(this.engToNepaliNumberPipe
          .transform(costOfConstructionInSecondPhase.toString()));
      this.constructionLoanForm.get('costOfConstructionInSecondPhaseCT').patchValue(this.engToNepaliNumberPipe
          .transform(costOfConstructionInSecondPhase.toString()));
    }
    const secondInstallmentAmount = this.constructionLoanForm.get('secondInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(secondInstallmentAmount)) {
      this.constructionLoanForm.get('secondInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe
          .transform(secondInstallmentAmount.toString()));
      this.constructionLoanForm.get('secondInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe
          .transform(secondInstallmentAmount.toString()));
    }
    const costOfFinalProjectCompletion = this.constructionLoanForm.get('costOfFinalProjectCompletion').value;
    if (!ObjectUtil.isEmpty(costOfFinalProjectCompletion)) {
      this.constructionLoanForm.get('costOfFinalProjectCompletionTrans').patchValue(this.engToNepaliNumberPipe
          .transform(costOfFinalProjectCompletion.toString()));
      this.constructionLoanForm.get('costOfFinalProjectCompletionCT').patchValue(this.engToNepaliNumberPipe
          .transform(costOfFinalProjectCompletion.toString()));
    }
    const thirdInstallmentAmount = this.constructionLoanForm.get('thirdInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(thirdInstallmentAmount)) {
      this.constructionLoanForm.get('thirdInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe
          .transform(thirdInstallmentAmount.toString()));
      this.constructionLoanForm.get('thirdInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe
          .transform(thirdInstallmentAmount.toString()));
    }
    const kittaNumber = this.constructionLoanForm.get('kittaNumber').value;
    if (!ObjectUtil.isEmpty(kittaNumber)) {
      this.constructionLoanForm.get('kittaNumberTrans').patchValue(this.engToNepaliNumberPipe.transform(kittaNumber.toString()));
      this.constructionLoanForm.get('kittaNumberCT').patchValue(this.engToNepaliNumberPipe.transform(kittaNumber.toString()));
    }
    const area = this.constructionLoanForm.get('area').value;
    if (!ObjectUtil.isEmpty(area)) {
      this.constructionLoanForm.get('areaTrans').patchValue(this.engToNepaliNumberPipe.transform(area.toString()));
      this.constructionLoanForm.get('areaCT').patchValue(this.engToNepaliNumberPipe.transform(area.toString()));
    }
    const seatNumber = this.constructionLoanForm.get('seatNumber').value;
    if (!ObjectUtil.isEmpty(seatNumber)) {
      this.constructionLoanForm.get('seatNumberTrans').patchValue(this.engToNepaliNumberPipe.transform(seatNumber.toString()));
      this.constructionLoanForm.get('seatNumberCT').patchValue(this.engToNepaliNumberPipe.transform(seatNumber.toString()));
    }
    const insuranceAmountInFigure = this.constructionLoanForm.get('insuranceAmountInFigure').value;
    if (!ObjectUtil.isEmpty(insuranceAmountInFigure)) {
      this.constructionLoanForm.get('insuranceAmountInFigureTrans').patchValue(this.engToNepaliNumberPipe
          .transform(insuranceAmountInFigure.toString()));
      this.constructionLoanForm.get('insuranceAmountInFigureCT').patchValue(this.engToNepaliNumberPipe
          .transform(insuranceAmountInFigure.toString()));
    }
    const insuranceAmount = this.constructionLoanForm.get('insuranceAmountInWord').value;
    if (!ObjectUtil.isEmpty(insuranceAmount)) {
      this.constructionLoanForm.get('insuranceAmountInWordTrans').patchValue(insuranceAmount);
      this.constructionLoanForm.get('insuranceAmountInWordCT').patchValue(insuranceAmount);
    }


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
    this.translatedValue = await this.translateService.translateForm(this.translateFormGroup);
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

    this.eventEmitter.emit(true);
    this.spinner = false;
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.constructionLoanForm.get(numLabel).value);
    this.constructionLoanForm.get(wordLabel).patchValue(transformValue);
  }

  private setConstructionFormValue(): void {
    this.constructionLoanForm.patchValue(this.formValue);
  }

}

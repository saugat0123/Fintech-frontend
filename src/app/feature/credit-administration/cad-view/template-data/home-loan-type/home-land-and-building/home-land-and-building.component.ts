import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";

@Component({
  selector: 'app-home-land-and-building',
  templateUrl: './home-land-and-building.component.html',
  styleUrls: ['./home-land-and-building.component.scss']
})
export class HomeLandAndBuildingComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() submitted;
  @Input() spinner;
  landBuildingForm: FormGroup;
  translateFormGroup: FormGroup;
  isLand = false;
  isBuilding = false;
  type = [{value: 'LAND'}, {value: 'LAND & BUILDING'}];
  dateType = [{key: 'AD', value: 'AD'}, {key: 'BS', value: 'BS'}];
  ADApproval = false;
  ADApplication = false;
  BSApproval = false;
  BSApplication = false;
  translatedValue: any;
  loanLimit = false;

  constructor(private formBuilder: FormBuilder,
              private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private currencyFormatterPipe: CurrencyFormatterPipe) { }

  get form() {
    return this.landBuildingForm.controls;
  }

  ngOnInit() {
    this.buildForm();
  }


  private buildForm(): FormGroup {
    return this.landBuildingForm = this.formBuilder.group({
      loanLimitChecked: [false],
      landBuildingType: [undefined],
      dateType: [undefined],
      applicationDateType: [undefined],
      dateOfApproval: [undefined],
      nepaliDateOfApproval: [undefined],
      nepaliDateOfApplication: [undefined],
      dateOfApplication: [undefined],
      purposeOfLoan: [undefined],
      beneficiaryName: [undefined],
      drawingPower: [undefined],
      baseRate: [undefined],
      premiumRate: [undefined],
      interestRate: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWord: [undefined],
      emiInFigure: [undefined],
      emiInWord: [undefined],
      loanPeriodInMonths: [undefined],
      loanCommitmentFee: [undefined],
      nameOfLandOwner: [undefined],
      landLocation: [undefined],
      kittaNumber: [undefined],
      areas: [undefined],
      seatNumber: [undefined],
      insuranceAmountInFigure: [undefined],
      insuranceAmountInWord: [undefined],
      nameOfRelationshipOfficer: [undefined],
      nameOfBranchManager: [undefined],
      // trans
      loanLimitCheckedTrans: [undefined],
      dateOfApprovalTrans: [undefined],
      dateOfApplicationTrans: [undefined],
      purposeOfLoanTrans: [undefined],
      drawingPowerTrans: [undefined],
      baseRateTrans: [undefined],
      premiumRateTrans: [undefined],
      interestRateTrans: [undefined],
      beneficiaryNameTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordTrans: [undefined],
      emiInFigureTrans: [undefined],
      emiInWordTrans: [undefined],
      loanPeriodInMonthsTrans: [undefined],
      loanCommitmentFeeTrans: [undefined],
      nameOfLandOwnerTrans: [undefined],
      landLocationTrans: [undefined],
      kittaNumberTrans: [undefined],
      areasTrans: [undefined],
      seatNumberTrans: [undefined],
      insuranceAmountInFigureTrans: [undefined],
      insuranceAmountInWordTrans: [undefined],
      nameOfRelationshipOfficerTrans: [undefined],
      nameOfBranchManagerTrans: [undefined],
      // CT
      loanLimitCheckedCT: [undefined],
      dateOfApprovalCT: [undefined, Validators.required],
      dateOfApplicationCT: [undefined, Validators.required],
      purposeOfLoanCT: [undefined, Validators.required],
      drawingPowerCT: [undefined, Validators.required],
      baseRateCT: [undefined, Validators.required],
      premiumRateCT: [undefined, Validators.required],
      interestRateCT: [undefined, Validators.required],
      beneficiaryNameCT: [undefined, Validators.required],
      loanAdminFeeInFigureCT: [undefined, Validators.required],
      loanAdminFeeInWordCT: [undefined, Validators.required],
      emiInFigureCT: [undefined, Validators.required],
      emiInWordCT: [undefined, Validators.required],
      loanPeriodInMonthsCT: [undefined, Validators.required],
      loanCommitmentFeeCT: [undefined, Validators.required],
      nameOfLandOwnerCT: [undefined, Validators.required],
      landLocationCT: [undefined, Validators.required],
      kittaNumberCT: [undefined, Validators.required],
      areasCT: [undefined, Validators.required],
      seatNumberCT: [undefined, Validators.required],
      insuranceAmountInFigureCT: [undefined, Validators.required],
      insuranceAmountInWordCT: [undefined, Validators.required],
      nameOfRelationshipOfficerCT: [undefined, Validators.required],
      nameOfBranchManagerCT: [undefined, Validators.required],
    });
  }

  public landBuildingType(value): void {
    this.isLand = value === 'LAND';
    this.isBuilding = value === 'LAND & BUILDING';
  }

  public dateOfApproval(value): void {
    this.ADApproval = value === 'AD';
    this.BSApproval = value === 'BS';
  }

  public dateOfApplication(value) {
    this.ADApplication = value === 'AD';
    this.BSApplication = value === 'BS';
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.landBuildingForm.get(numLabel).value);
    this.landBuildingForm.get(wordLabel).patchValue(transformValue);
  }

  public async setTranslatedValue() {
    this.spinner = true;
    const dateType = this.landBuildingForm.get('dateType').value;
    let approvalDate;
    if (dateType === 'AD') {
      approvalDate = this.datePipe.transform(this.landBuildingForm.get('dateOfApproval').value);
    }
    if (dateType === 'BS') {
      approvalDate = this.landBuildingForm.get('nepaliDateOfApproval').value.nDate;
    }
    this.landBuildingForm.get('dateOfApprovalTrans').patchValue(approvalDate);
    this.landBuildingForm.get('dateOfApprovalCT').patchValue(approvalDate);
    let dateOfApplication;
    const applicationDateType = this.landBuildingForm.get('applicationDateType').value;
    if (applicationDateType === 'AD') {
      dateOfApplication = this.datePipe.transform(this.landBuildingForm.get('dateOfApplication').value);
    }
    if (applicationDateType === 'BS') {
      dateOfApplication = this.landBuildingForm.get('nepaliDateOfApplication').value.nDate;
    }
    this.landBuildingForm.get('dateOfApplicationTrans').patchValue(dateOfApplication);
    this.landBuildingForm.get('dateOfApplicationCT').patchValue(dateOfApplication);
    const drawingPower = this.landBuildingForm.get('drawingPower').value;
    if (!ObjectUtil.isEmpty(drawingPower)) {
      this.landBuildingForm.get('drawingPowerTrans').patchValue(this.engToNepaliNumberPipe.transform(drawingPower.toString()));
      this.landBuildingForm.get('drawingPowerCT').patchValue(this.engToNepaliNumberPipe.transform(drawingPower.toString()));
    }
    const baseRate = this.landBuildingForm.get('baseRate').value;
    if (!ObjectUtil.isEmpty(baseRate)) {
      this.landBuildingForm.get('baseRateTrans').patchValue(this.engToNepaliNumberPipe.transform(baseRate.toString()));
      this.landBuildingForm.get('baseRateCT').patchValue(this.engToNepaliNumberPipe.transform(baseRate.toString()));
    }
    const premiumRate = this.landBuildingForm.get('premiumRate').value;
    if (!ObjectUtil.isEmpty(premiumRate)) {
      this.landBuildingForm.get('premiumRateTrans').patchValue(this.engToNepaliNumberPipe.transform(premiumRate.toString()));
      this.landBuildingForm.get('premiumRateCT').patchValue(this.engToNepaliNumberPipe.transform(premiumRate.toString()));
    }
    const interestRate = this.landBuildingForm.get('interestRate').value;
    if (!ObjectUtil.isEmpty(interestRate)) {
      this.landBuildingForm.get('interestRateTrans').patchValue(this.engToNepaliNumberPipe.transform(interestRate.toString()));
      this.landBuildingForm.get('interestRateCT').patchValue(this.engToNepaliNumberPipe.transform(interestRate.toString()));
    }
    const loanAdminFeeInFigure = this.landBuildingForm.get('loanAdminFeeInFigure').value;
    if (!ObjectUtil.isEmpty(loanAdminFeeInFigure)) {
      this.landBuildingForm.get('loanAdminFeeInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanAdminFeeInFigure.toString())));
      this.landBuildingForm.get('loanAdminFeeInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanAdminFeeInFigure.toString())));
    }
    const loanAdminFeeInWord = this.landBuildingForm.get('loanAdminFeeInWord').value;
    if (!ObjectUtil.isEmpty(loanAdminFeeInWord)) {
      this.landBuildingForm.get('loanAdminFeeInWordTrans').patchValue(loanAdminFeeInWord);
      this.landBuildingForm.get('loanAdminFeeInWordCT').patchValue(loanAdminFeeInWord);
    }
    const emiInFigure = this.landBuildingForm.get('emiInFigure').value;
    if (!ObjectUtil.isEmpty(emiInFigure)) {
      this.landBuildingForm.get('emiInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(emiInFigure.toString())));
      this.landBuildingForm.get('emiInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(emiInFigure.toString())));
    }
    const emiInWord = this.landBuildingForm.get('emiInWord').value;
    if (!ObjectUtil.isEmpty(emiInWord)) {
      this.landBuildingForm.get('emiInWordTrans').patchValue(emiInWord);
      this.landBuildingForm.get('emiInWordCT').patchValue(emiInWord);
    }
    const loanPeriodInMonths = this.landBuildingForm.get('loanPeriodInMonths').value;
    if (!ObjectUtil.isEmpty(loanPeriodInMonths)) {
      this.landBuildingForm.get('loanPeriodInMonthsTrans').patchValue(this.engToNepaliNumberPipe
          .transform(loanPeriodInMonths.toString()));
      this.landBuildingForm.get('loanPeriodInMonthsCT').patchValue(this.engToNepaliNumberPipe
          .transform(loanPeriodInMonths.toString()));
    }
    const loanCommitmentFee = this.landBuildingForm.get('loanCommitmentFee').value;
    if (!ObjectUtil.isEmpty(loanCommitmentFee)) {
      this.landBuildingForm.get('loanCommitmentFeeTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanCommitmentFee.toString())));
      this.landBuildingForm.get('loanCommitmentFeeCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanCommitmentFee.toString())));
    }
    const landLocation = this.landBuildingForm.get('landLocation').value;
    if (!ObjectUtil.isEmpty(landLocation)) {
      this.landBuildingForm.get('landLocationTrans').patchValue(landLocation);
      this.landBuildingForm.get('landLocationCT').patchValue(landLocation);
    }
    const kittaNumber = this.landBuildingForm.get('kittaNumber').value;
    if (!ObjectUtil.isEmpty(kittaNumber)) {
      this.landBuildingForm.get('kittaNumberTrans').patchValue(this.engToNepaliNumberPipe.transform(kittaNumber.toString()));
      this.landBuildingForm.get('kittaNumberCT').patchValue(this.engToNepaliNumberPipe.transform(kittaNumber.toString()));
    }
    const areas = this.landBuildingForm.get('areas').value;
    if (!ObjectUtil.isEmpty(areas)) {
      this.landBuildingForm.get('areasTrans').patchValue(this.engToNepaliNumberPipe.transform(areas.toString()));
      this.landBuildingForm.get('areasCT').patchValue(this.engToNepaliNumberPipe.transform(areas.toString()));
    }
    const seatNumber = this.landBuildingForm.get('seatNumber').value;
    if (!ObjectUtil.isEmpty(seatNumber)) {
      this.landBuildingForm.get('seatNumberTrans').patchValue(this.engToNepaliNumberPipe.transform(seatNumber.toString()));
      this.landBuildingForm.get('seatNumberCT').patchValue(this.engToNepaliNumberPipe.transform(seatNumber.toString()));
    }
    const insuranceAmountInFigure = this.landBuildingForm.get('insuranceAmountInFigure').value;
    if (!ObjectUtil.isEmpty(insuranceAmountInFigure)) {
      this.landBuildingForm.get('insuranceAmountInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform
      (this.currencyFormatterPipe.transform(insuranceAmountInFigure.toString())));
      this.landBuildingForm.get('insuranceAmountInFigureCT').patchValue(this.engToNepaliNumberPipe.transform
      (this.currencyFormatterPipe.transform(insuranceAmountInFigure.toString())));
    }
    const insuranceAmountInWord = this.landBuildingForm.get('insuranceAmountInWord').value;
    if (!ObjectUtil.isEmpty(insuranceAmountInWord)) {
      this.landBuildingForm.get('insuranceAmountInWordTrans').patchValue(insuranceAmountInWord);
      this.landBuildingForm.get('insuranceAmountInWordCT').patchValue(insuranceAmountInWord);
    }


    // translated by google api
    this.translateFormGroup = this.formBuilder.group({
      purposeOfLoan: this.landBuildingForm.get('purposeOfLoan').value,
      nameOfLandOwner: this.landBuildingForm.get('nameOfLandOwner').value,
      landLocation: this.landBuildingForm.get('landLocation').value,
      nameOfRelationshipOfficer: this.landBuildingForm.get('nameOfRelationshipOfficer').value,
      nameOfBranchManager: this.landBuildingForm.get('nameOfBranchManager').value,
      beneficiaryName: this.landBuildingForm.get('beneficiaryName').value,
    });
    this.translatedValue = await this.translateService.translateForm(this.translateFormGroup);
    this.landBuildingForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);
    this.landBuildingForm.get('purposeOfLoanCT').patchValue(this.translatedValue.purposeOfLoan);
    this.landBuildingForm.get('nameOfLandOwnerTrans').patchValue(this.translatedValue.nameOfLandOwner);
    this.landBuildingForm.get('nameOfLandOwnerCT').patchValue(this.translatedValue.nameOfLandOwner);
    this.landBuildingForm.get('landLocationTrans').patchValue(this.translatedValue.landLocation);
    this.landBuildingForm.get('landLocationCT').patchValue(this.translatedValue.landLocation);
    this.landBuildingForm.get('nameOfRelationshipOfficerTrans').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.landBuildingForm.get('nameOfRelationshipOfficerCT').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.landBuildingForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.landBuildingForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
    this.landBuildingForm.get('beneficiaryNameCT').patchValue(this.translatedValue.beneficiaryName);
    this.landBuildingForm.get('beneficiaryNameTrans').patchValue(this.translatedValue.beneficiaryName);
    this.landBuildingForm.get('loanLimitCheckedCT').patchValue(this.translatedValue.loanLimitChecked);
    this.landBuildingForm.get('loanLimitCheckedTrans').patchValue(this.translatedValue.loanLimitChecked);
    this.spinner = false;
  }

  getInvalidControls(referenceNumberIsRequired: string) {
    console.log(referenceNumberIsRequired);
  }
  loanChecked(data) {
    this.loanLimit = data;
    this.landBuildingForm.get('loanLimitChecked').patchValue(this.loanLimit);
  }
  calInterestRate() {
    const baseRate = this.landBuildingForm.get('baseRate').value;
    const premiumRate = this.landBuildingForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.landBuildingForm.get('interestRate').patchValue(sum);
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {DatePipe} from '@angular/common';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {OutputEmitter} from '@angular/compiler/src/output/abstract_emitter';
import {CurrencyFormatterPipe} from "../../../../../../@core/pipe/currency-formatter.pipe";
import {District} from "../../../../../admin/modal/district";
import {AddressService} from "../../../../../../@core/service/baseservice/address.service";

@Component({
  selector: 'app-construction-loan',
  templateUrl: './construction-loan.component.html',
  styleUrls: ['./construction-loan.component.scss']
})
export class ConstructionLoanComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() submitted;
  @Input() spinner;
  constructionLoanForm: FormGroup;
  translateFormGroup: FormGroup;
  dateType = [{key: 'AD', value: 'AD'}, {key: 'BS', value: 'BS'}];
  ADApproval = false;
  ADApplication = false;
  BSApproval = false;
  BSApplication = false;
  translatedValue: any;
  loanLimit = false;
  oneForm: FormGroup;
  municipalityListForSecurities = [];
  allDistrictList: Array<District> = new Array<District>();
  constructor(private formBuilder: FormBuilder,
              private translateService: SbTranslateService,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private addressService: AddressService) { }

  get form() {
    return this.constructionLoanForm.controls;
  }

  ngOnInit() {
    this.buildForm();
    this.addDefaultSecurity();
    this.getAllDistrict();
  }

  public getAllDistrict(): void {
    this.addressService.getAllDistrict().subscribe((response: any) => {
      this.allDistrictList = response.detail;
    });
  }

  private buildForm(): FormGroup {
    return this.constructionLoanForm = this.formBuilder.group({
      loanLimitChecked: [false],
      loanLimitCheckedTrans: [undefined],
      loanLimitCheckedCT: [undefined],
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
      insuranceAmountInFigure: [undefined],
      insuranceAmountInFigureCT: [undefined, Validators.required],
      insuranceAmountInFigureTrans: [undefined],
      insuranceAmountInWord: [undefined],
      insuranceAmountInWordCT: [undefined, Validators.required],
      insuranceAmountInWordTrans: [undefined],
      nameOfRelationshipOfficer: [undefined],
      nameOfRelationshipOfficerCT: [undefined, Validators.required],
      nameOfRelationshipOfficerTrans: [undefined],
      nameOfBranchManager: [undefined],
      nameOfBranchManagerCT: [undefined, Validators.required],
      nameOfBranchManagerTrans: [undefined],
      securities: this.formBuilder.array([]),
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
    const loanAdminFeeInFigure = this.constructionLoanForm.get('loanAdminFeeInFigure').value;
    if (!ObjectUtil.isEmpty(loanAdminFeeInFigure)) {
      this.constructionLoanForm.get('loanAdminFeeInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanAdminFeeInFigure.toString())));
      this.constructionLoanForm.get('loanAdminFeeInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanAdminFeeInFigure.toString())));
    }
    const loanAdminFeeInWord = this.constructionLoanForm.get('loanAdminFeeInWord').value;
    if (!ObjectUtil.isEmpty(loanAdminFeeInWord)) {
      this.constructionLoanForm.get('loanAdminFeeInWordTrans').patchValue(loanAdminFeeInWord);
      this.constructionLoanForm.get('loanAdminFeeInWordCT').patchValue(loanAdminFeeInWord);
    }
    const emiInFigure = this.constructionLoanForm.get('emiInFigure').value;
    if (!ObjectUtil.isEmpty(emiInFigure)) {
      this.constructionLoanForm.get('emiInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(emiInFigure.toString())));
      this.constructionLoanForm.get('emiInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(emiInFigure.toString())));
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
      this.constructionLoanForm.get('loanCommitmentFeeTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(loanCommitmentFee.toString())));
      this.constructionLoanForm.get('loanCommitmentFeeCT').patchValue(this.engToNepaliNumberPipe.transform(this.currencyFormatterPipe.transform(loanCommitmentFee.toString())));
    }
    const costOfConstruction = this.constructionLoanForm.get('costOfConstruction').value;
    if (!ObjectUtil.isEmpty(costOfConstruction)) {
      this.constructionLoanForm.get('costOfConstructionTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfConstruction.toString())));
      this.constructionLoanForm.get('costOfConstructionCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfConstruction.toString())));
    }
    const firstInstallmentAmount = this.constructionLoanForm.get('firstInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(firstInstallmentAmount)) {
      this.constructionLoanForm.get('firstInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(firstInstallmentAmount.toString())));
      this.constructionLoanForm.get('firstInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(firstInstallmentAmount.toString())));
    }
    const costOfConstructionInSecondPhase = this.constructionLoanForm.get('costOfConstructionInSecondPhase').value;
    if (!ObjectUtil.isEmpty(costOfConstructionInSecondPhase)) {
      this.constructionLoanForm.get('costOfConstructionInSecondPhaseTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfConstructionInSecondPhase.toString())));
      this.constructionLoanForm.get('costOfConstructionInSecondPhaseCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfConstructionInSecondPhase.toString())));
    }
    const secondInstallmentAmount = this.constructionLoanForm.get('secondInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(secondInstallmentAmount)) {
      this.constructionLoanForm.get('secondInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(secondInstallmentAmount.toString())));
      this.constructionLoanForm.get('secondInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(secondInstallmentAmount.toString())));
    }
    const costOfFinalProjectCompletion = this.constructionLoanForm.get('costOfFinalProjectCompletion').value;
    if (!ObjectUtil.isEmpty(costOfFinalProjectCompletion)) {
      this.constructionLoanForm.get('costOfFinalProjectCompletionTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfFinalProjectCompletion.toString())));
      this.constructionLoanForm.get('costOfFinalProjectCompletionCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(costOfFinalProjectCompletion.toString())));
    }
    const thirdInstallmentAmount = this.constructionLoanForm.get('thirdInstallmentAmount').value;
    if (!ObjectUtil.isEmpty(thirdInstallmentAmount)) {
      this.constructionLoanForm.get('thirdInstallmentAmountTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(thirdInstallmentAmount.toString())));
      this.constructionLoanForm.get('thirdInstallmentAmountCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(thirdInstallmentAmount.toString())));
    }
    const insuranceAmountInFigure = this.constructionLoanForm.get('insuranceAmountInFigure').value;
    if (!ObjectUtil.isEmpty(insuranceAmountInFigure)) {
      this.constructionLoanForm.get('insuranceAmountInFigureTrans').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(insuranceAmountInFigure.toString())));
      this.constructionLoanForm.get('insuranceAmountInFigureCT').patchValue(this.engToNepaliNumberPipe.transform(
         this.currencyFormatterPipe.transform(insuranceAmountInFigure.toString())));
    }
    const insuranceAmount = this.constructionLoanForm.get('insuranceAmountInWord').value;
    if (!ObjectUtil.isEmpty(insuranceAmount)) {
      this.constructionLoanForm.get('insuranceAmountInWordTrans').patchValue(insuranceAmount);
      this.constructionLoanForm.get('insuranceAmountInWordCT').patchValue(insuranceAmount);
    }


    // translated by google api
    this.translateFormGroup = this.formBuilder.group({
      purposeOfLoan: this.constructionLoanForm.get('purposeOfLoan').value,
      nameOfRelationshipOfficer: this.constructionLoanForm.get('nameOfRelationshipOfficer').value,
      nameOfBranchManager: this.constructionLoanForm.get('nameOfBranchManager').value,
      });
    this.translatedValue = await this.translateService.translateForm(this.translateFormGroup);
    this.constructionLoanForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);
    this.constructionLoanForm.get('purposeOfLoanCT').patchValue(this.translatedValue.purposeOfLoan);
    this.constructionLoanForm.get('nameOfRelationshipOfficerTrans').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.constructionLoanForm.get('nameOfRelationshipOfficerCT').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.constructionLoanForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.constructionLoanForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
    this.constructionLoanForm.get('loanLimitCheckedTrans').patchValue(this.translatedValue.loanLimitChecked);
    this.constructionLoanForm.get('loanLimitCheckedCT').patchValue(this.translatedValue.loanLimitChecked);
    this.spinner = false;
  }

  public getNumAmountWord(numLabel, wordLabel): void {
    const transformValue = this.nepaliCurrencyWordPipe.transform(this.constructionLoanForm.get(numLabel).value);
    this.constructionLoanForm.get(wordLabel).patchValue(transformValue);
  }

  loanChecked(data) {
    this.loanLimit = data;
    this.constructionLoanForm.get('loanLimitChecked').patchValue(this.loanLimit);
  }
  calInterestRate() {
    const baseRate = this.constructionLoanForm.get('baseRate').value;
    const premiumRate = this.constructionLoanForm.get('premiumRate').value;
    const sum = parseFloat(baseRate) + parseFloat(premiumRate);
    this.constructionLoanForm.get('interestRate').patchValue(sum.toFixed(2));
  }

  private initSecuritiesForm(): FormGroup {
    return this.formBuilder.group({
      securityOwnersName: [undefined],
      securityOwnersNameTransVal: [{value: undefined, disabled: true}],
      securityOwnersNameCT: [undefined],

      securityOwnersDistrict: [undefined],
      securityOwnersDistrictTransVal: [{value: undefined, disabled: true}],
      securityOwnersDistrictCT: [undefined],

      securityOwnersMunicipalityOrVdc: [undefined],

      securityOwnersMunicipality: [undefined],
      securityOwnersMunicipalityTransVal: [{value: undefined, disabled: true}],
      securityOwnersMunicipalityCT: [undefined],

      securityOwnersWardNo: [undefined],
      securityOwnersWardNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersWardNoCT: [undefined],

      securityOwnersSeatNo: [undefined],
      securityOwnersSeatNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersSeatNoCT: [undefined],

      securityOwnersKittaNo: [undefined],
      securityOwnersKittaNoTransVal: [{value: undefined, disabled: true}],
      securityOwnersKittaNoCT: [undefined],

      securityOwnersLandArea: [undefined],
      securityOwnersLandAreaTransVal: [{value: undefined, disabled: true}],
      securityOwnersLandAreaCT: [undefined],
    });
  }

  public addDefaultSecurity(): void {
    (this.constructionLoanForm.get('securities') as FormArray).push(
        this.initSecuritiesForm()
    );
  }

  public removeIndividualSecurities(i): void {
    (this.constructionLoanForm.get('securities') as FormArray).removeAt(i);
  }

  public translateSecuritiDetailsNumberFields(arrName, source, index, target): void {
    const translatedNepaliNum = this.engToNepaliNumberPipe
        .transform(String(this.constructionLoanForm.get([String(arrName), index, String(source)]).value));
    this.constructionLoanForm.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.constructionLoanForm.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.constructionLoanForm.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.constructionLoanForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.constructionLoanForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  public setDefaultNepaliResponse(arrName, source, index, target): void {
    this.constructionLoanForm.get([String(arrName), index, String(target)])
        .patchValue(this.constructionLoanForm.get([String(arrName), index, String(source)]).value.nepaliName);
    this.constructionLoanForm.get([String(arrName), index, String(source + 'CT')])
        .patchValue(this.constructionLoanForm.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  public getMunicipalityByDistrict(data, event, index): void {
    const district = new District();
    district.id = data;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.constructionLoanForm.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
          }
        }
    );
  }

  async onChangeSecurityOwnersName(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.constructionLoanForm.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.constructionLoanForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.constructionLoanForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }
}

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NepaliToEngNumberPipe} from '../../../../../../@core/pipe/nepali-to-eng-number.pipe';
import {NepaliCurrencyWordPipe} from '../../../../../../@core/pipe/nepali-currency-word.pipe';
import {ObjectUtil} from '../../../../../../@core/utils/ObjectUtil';
import {DatePipe} from '@angular/common';
import {EngToNepaliNumberPipe} from '../../../../../../@core/pipe/eng-to-nepali-number.pipe';
import {SbTranslateService} from '../../../../../../@core/service/sbtranslate.service';
import {CurrencyFormatterPipe} from '../../../../../../@core/pipe/currency-formatter.pipe';
import {District} from '../../../../../admin/modal/district';
import {AddressService} from '../../../../../../@core/service/baseservice/address.service';

@Component({
  selector: 'app-home-land-and-building',
  templateUrl: './home-land-and-building.component.html',
  styleUrls: ['./home-land-and-building.component.scss']
})
export class HomeLandAndBuildingComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();
  @Input() submitted;
  @Input() spinner;
  @Input() isTakeOver: boolean;
  @Input() isPurchase: boolean;
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
  oneForm: FormGroup;
  municipalityListForSecurities = [];
  allDistrictList: Array<District> = new Array<District>();

  constructor(private formBuilder: FormBuilder,
              private nepaliToEngNumberPipe: NepaliToEngNumberPipe,
              private nepaliCurrencyWordPipe: NepaliCurrencyWordPipe,
              private datePipe: DatePipe,
              private engToNepaliNumberPipe: EngToNepaliNumberPipe,
              private translateService: SbTranslateService,
              private currencyFormatterPipe: CurrencyFormatterPipe,
              private addressService: AddressService) { }

  get form() {
    return this.landBuildingForm.controls;
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
      nameOfBank: [undefined],
      loanAdminFeeInFigure: [undefined],
      loanAdminFeeInWord: [undefined],
      emiInFigure: [undefined],
      emiInWord: [undefined],
      loanPeriodInMonths: [undefined],
      loanCommitmentFee: [undefined],
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
      nameOfBankTrans: [undefined],
      beneficiaryNameTrans: [undefined],
      loanAdminFeeInFigureTrans: [undefined],
      loanAdminFeeInWordTrans: [undefined],
      emiInFigureTrans: [undefined],
      emiInWordTrans: [undefined],
      loanPeriodInMonthsTrans: [undefined],
      loanCommitmentFeeTrans: [undefined],
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
      nameOfBankCT: [undefined, Validators.required],
      beneficiaryNameCT: [undefined, Validators.required],
      loanAdminFeeInFigureCT: [undefined, Validators.required],
      loanAdminFeeInWordCT: [undefined, Validators.required],
      emiInFigureCT: [undefined, Validators.required],
      emiInWordCT: [undefined, Validators.required],
      loanPeriodInMonthsCT: [undefined, Validators.required],
      loanCommitmentFeeCT: [undefined, Validators.required],
      insuranceAmountInFigureCT: [undefined, Validators.required],
      insuranceAmountInWordCT: [undefined, Validators.required],
      nameOfRelationshipOfficerCT: [undefined, Validators.required],
      nameOfBranchManagerCT: [undefined, Validators.required],
      securities: this.formBuilder.array([]),
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
      nameOfRelationshipOfficer: this.landBuildingForm.get('nameOfRelationshipOfficer').value,
      nameOfBranchManager: this.landBuildingForm.get('nameOfBranchManager').value,
      beneficiaryName: this.landBuildingForm.get('beneficiaryName').value,
      nameOfBank: this.landBuildingForm.get('nameOfBank').value,
    });
    this.translatedValue = await this.translateService.translateForm(this.translateFormGroup);
    this.landBuildingForm.get('purposeOfLoanTrans').patchValue(this.translatedValue.purposeOfLoan);
    this.landBuildingForm.get('purposeOfLoanCT').patchValue(this.translatedValue.purposeOfLoan);
    this.landBuildingForm.get('nameOfRelationshipOfficerTrans').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.landBuildingForm.get('nameOfRelationshipOfficerCT').patchValue(this.translatedValue.nameOfRelationshipOfficer);
    this.landBuildingForm.get('nameOfBranchManagerTrans').patchValue(this.translatedValue.nameOfBranchManager);
    this.landBuildingForm.get('nameOfBranchManagerCT').patchValue(this.translatedValue.nameOfBranchManager);
    this.landBuildingForm.get('beneficiaryNameCT').patchValue(this.translatedValue.beneficiaryName);
    this.landBuildingForm.get('beneficiaryNameTrans').patchValue(this.translatedValue.beneficiaryName);
    this.landBuildingForm.get('loanLimitCheckedCT').patchValue(this.translatedValue.loanLimitChecked);
    this.landBuildingForm.get('loanLimitCheckedTrans').patchValue(this.translatedValue.loanLimitChecked);
    this.landBuildingForm.get('nameOfBankTrans').patchValue(this.translatedValue.nameOfBank);
    this.landBuildingForm.get('nameOfBankCT').patchValue(this.translatedValue.nameOfBank);
    if (!this.isTakeOver) {
      this.landBuildingForm.get('nameOfBankCT').clearValidators();
      this.landBuildingForm.get('nameOfBankCT').updateValueAndValidity();
    }
    if (this.isLand) {
      this.landBuildingForm.get('insuranceAmountInFigureCT').clearValidators();
      this.landBuildingForm.get('insuranceAmountInFigureCT').updateValueAndValidity();
      this.landBuildingForm.get('insuranceAmountInWordCT').clearValidators();
      this.landBuildingForm.get('insuranceAmountInWordCT').updateValueAndValidity();
    }
    if (this.isPurchase) {
      this.changeValidation('purposeOfLoanCT', true);
      this.changeValidation('beneficiaryNameCT', true);
    } else {
      this.changeValidation('purposeOfLoanCT', false);
      this.changeValidation('beneficiaryNameCT', false);
    }
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
    this.landBuildingForm.get('interestRate').patchValue(sum.toFixed(2));
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

  changeValidation(control, validate: boolean) {
    if (validate) {
      this.landBuildingForm.get(control).setValidators(Validators.required);
    } else {
      this.landBuildingForm.get(control).clearValidators();
    }
    this.landBuildingForm.get(control).updateValueAndValidity();
  }

  public addDefaultSecurity(): void {
    (this.landBuildingForm.get('securities') as FormArray).push(
        this.initSecuritiesForm()
    );
  }

  public removeIndividualSecurities(i): void {
    (this.landBuildingForm.get('securities') as FormArray).removeAt(i);
  }

  public translateSecuritiDetailsNumberFields(arrName, source, index, target): void {
    const translatedNepaliNum = this.engToNepaliNumberPipe
        .transform(String(this.landBuildingForm.get([String(arrName), index, String(source)]).value));
    this.landBuildingForm.get([String(arrName), index, String(target)]).patchValue(translatedNepaliNum);
    this.landBuildingForm.get([String(arrName), index, String(source + 'CT')]).patchValue(translatedNepaliNum);
  }

  async onChangeTranslateSecurity(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.landBuildingForm.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.landBuildingForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.landBuildingForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }

  public setDefaultNepaliResponse(arrName, source, index, target): void {
    this.landBuildingForm.get([String(arrName), index, String(target)])
        .patchValue(this.landBuildingForm.get([String(arrName), index, String(source)]).value.nepaliName);
    this.landBuildingForm.get([String(arrName), index, String(source + 'CT')])
        .patchValue(this.landBuildingForm.get([String(arrName), index, String(source)]).value.nepaliName);
  }

  public getMunicipalityByDistrict(data, event, index): void {
    const district = new District();
    district.id = data;
    this.addressService.getMunicipalityVDCByDistrict(district).subscribe(
        (response: any) => {
          this.municipalityListForSecurities[index] = response.detail;
          this.municipalityListForSecurities[index].sort((a, b) => a.name.localeCompare(b.name));
          if (event !== null) {
            this.landBuildingForm.get(['securities', index, 'securityOwnersMunicipalityOrVdc']).patchValue(null);
          }
        }
    );
  }

  async onChangeSecurityOwnersName(arrName, source, index, target) {
    this.oneForm = this.formBuilder.group({
      securityOwnersName: this.landBuildingForm.get([String(arrName), index, String(source)]).value
    });
    const sourceResponse = await this.translateService.translateForm(this.oneForm);
    this.landBuildingForm.get([String(arrName), index, String(target)]).patchValue(sourceResponse.securityOwnersName);
    this.landBuildingForm.get([String(arrName), index, String(source + 'CT')]).patchValue(sourceResponse.securityOwnersName);
  }
}
